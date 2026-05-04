/**
 * Migrate blog posts from snapshot registry → Payload CMS via REST API.
 *
 * Requires dev server running (npm run dev).
 *
 * Run:
 *   npm run migrate:blog:dry          # preview, no writes
 *   npm run migrate:blog              # seed all posts
 *   npm run migrate:blog -- --limit 5 # seed first 5
 *
 * Set CMS_URL / CMS_EMAIL / CMS_PASSWORD in .env.local (or pass as env vars).
 */

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import * as cheerio from 'cheerio'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const DRY_RUN = process.argv.includes('--dry-run')
const LIMIT_ARG = process.argv.indexOf('--limit')
const LIMIT = LIMIT_ARG !== -1 ? parseInt(process.argv[LIMIT_ARG + 1]) : Infinity

const BASE = process.env.CMS_URL || 'http://localhost:3001'
const EMAIL = process.env.CMS_EMAIL || process.env.ADMIN_EMAILS?.split(',')[0] || 'ariel@triolla.io'
const PASSWORD = process.env.CMS_PASSWORD || ''

if (!PASSWORD && !DRY_RUN) {
  console.error('Set CMS_PASSWORD in .env.local or as env var.')
  process.exit(1)
}

type RegistryEntry = {
  slug: string
  locale: string
  path: string
  fragment: string
  head: {
    title?: string
    ogImage?: string
    jsonLd?: string[]
    metaTags?: Array<Record<string, string>>
  }
}

async function login(): Promise<string> {
  const res = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })
  const data = await res.json() as { token?: string; errors?: unknown[] }
  if (!data.token) {
    console.error('Login failed:', JSON.stringify(data))
    process.exit(1)
  }
  return data.token
}

function blogSlugFromPath(p: string): string {
  return p.replace(/^\/blog\//, '').replace(/\/$/, '')
}

function extractAuthorFromJsonLd(jsonLd: string[]): string {
  for (const raw of jsonLd) {
    try {
      const data = JSON.parse(raw)
      const graph = data['@graph'] ?? [data]
      for (const node of graph) {
        if (node.author?.name) return node.author.name as string
      }
    } catch {}
  }
  return ''
}

function extractPublishedAt(jsonLd: string[]): string | null {
  for (const raw of jsonLd) {
    try {
      const data = JSON.parse(raw)
      const graph = data['@graph'] ?? [data]
      for (const node of graph) {
        if (node.datePublished) return node.datePublished as string
      }
    } catch {}
  }
  return null
}

function extractDescription(metaTags: Array<Record<string, string>>): string {
  // og:description may appear twice — skip empty values
  const og = metaTags.find((m) => m.property === 'og:description' && m.content?.trim())
  if (og) return og.content.trim()
  return metaTags.find((m) => m.name === 'description' && m.content?.trim())?.content?.trim() ?? ''
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
}

function cleanTitle(raw: string): string {
  return decodeHtmlEntities(raw.replace(/\s*[-|–]\s*Triolla\s*$/i, '').trim())
}

function extractBodyHtml(fragmentPath: string): string {
  const abs = path.resolve(ROOT, 'public', fragmentPath)
  if (!fs.existsSync(abs)) return ''
  const html = fs.readFileSync(abs, 'utf-8')
  const $ = cheerio.load(html)
  const article = $('article').first()
  if (article.length) return article.html() ?? ''
  const entry = $('.entry-content, .post-content, .blog_detail_content, .articlemid').first()
  if (entry.length) return entry.html() ?? ''
  return ''
}

async function upsertAuthor(token: string, name: string): Promise<string | null> {
  const slug = name.toLowerCase().replace(/\s+/g, '-')
  const search = await fetch(`${BASE}/api/authors?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`, {
    headers: { Authorization: `JWT ${token}` },
  })
  const existing = await search.json() as { docs?: { id: string }[] }
  if (existing.docs?.length) return existing.docs[0].id

  const create = await fetch(`${BASE}/api/authors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
    body: JSON.stringify({ name, slug }),
  })
  const created = await create.json() as { doc?: { id: string } }
  return created.doc?.id ?? null
}

async function run() {
  const registryPath = path.resolve(ROOT, 'lib', 'snapshotRegistry.json')
  const registry: RegistryEntry[] = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))

  const blogEntries = registry.filter(
    (e) => e.path.startsWith('/blog/') && !e.path.endsWith('/blog/') && e.locale === 'en'
  )

  console.log(`Blog posts: ${blogEntries.length}  DRY_RUN=${DRY_RUN}  LIMIT=${LIMIT}`)

  let token = ''
  if (!DRY_RUN) token = await login()

  let created = 0, skipped = 0, errors = 0

  for (const entry of blogEntries.slice(0, LIMIT)) {
    const slug = blogSlugFromPath(entry.path)
    const title = cleanTitle(entry.head.title ?? slug)
    const authorName = extractAuthorFromJsonLd(entry.head.jsonLd ?? [])
    const publishedAt = extractPublishedAt(entry.head.jsonLd ?? [])
    const excerpt = extractDescription(entry.head.metaTags ?? [])
    const rawHtml = extractBodyHtml(entry.fragment)

    console.log(`→ ${slug}`)

    if (DRY_RUN) {
      console.log(`   title: ${title}`)
      console.log(`   author: ${authorName || '(none)'}`)
      console.log(`   publishedAt: ${publishedAt}`)
      console.log(`   excerpt: ${excerpt.slice(0, 80)}`)
      console.log(`   body chars: ${rawHtml.length}`)
      skipped++
      continue
    }

    try {
      // Skip if exists
      const check = await fetch(`${BASE}/api/blog-posts?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`, {
        headers: { Authorization: `JWT ${token}` },
      })
      const existing = await check.json() as { docs?: unknown[] }
      if (existing.docs?.length) { console.log('   skipped (exists)'); skipped++; continue }

      let authorId: string | undefined
      if (authorName) {
        authorId = await upsertAuthor(token, authorName) ?? undefined
      }

      const body: Record<string, unknown> = {
        title, slug, locale: 'en', excerpt, rawHtml, status: 'published',
        seo: { title, description: excerpt },
      }
      if (publishedAt) body.publishedAt = publishedAt
      if (authorId) body.author = authorId

      const res = await fetch(`${BASE}/api/blog-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `JWT ${token}` },
        body: JSON.stringify(body),
      })
      const result = await res.json() as { doc?: unknown; errors?: unknown[] }
      if (result.errors?.length) { console.error('   error:', result.errors); errors++; continue }
      created++
      console.log('   ✓ created')
    } catch (err) {
      errors++
      console.error('   ✗', err)
    }
  }

  console.log(`\nDone. created=${created} skipped=${skipped} errors=${errors}`)
}

run().catch((err) => { console.error(err); process.exit(1) })
