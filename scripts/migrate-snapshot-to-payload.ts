/**
 * Migrate blog posts from snapshot registry + HTML fragments into Payload CMS.
 *
 * Run:  npx tsx scripts/migrate-snapshot-to-payload.ts [--dry-run] [--limit N]
 *
 * Requires DATABASE_URI + PAYLOAD_SECRET env vars (copy from .env.local).
 */

import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import * as cheerio from 'cheerio'
import { getPayload } from 'payload'
import config from '../payload.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const DRY_RUN = process.argv.includes('--dry-run')
const LIMIT_ARG = process.argv.indexOf('--limit')
const LIMIT = LIMIT_ARG !== -1 ? parseInt(process.argv[LIMIT_ARG + 1]) : Infinity

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

function blogSlugFromPath(p: string): string {
  // /blog/my-post/ → my-post
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
  return 'Triolla'
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
  const og = metaTags.find((m) => m.property === 'og:description')
  if (og) return og.content
  const plain = metaTags.find((m) => m.name === 'description')
  return plain?.content ?? ''
}

function cleanTitle(raw: string): string {
  return raw.replace(/\s*[-|–]\s*Triolla\s*$/i, '').trim()
}

function extractBodyHtml(fragmentPath: string): string {
  const abs = path.resolve(ROOT, 'public', fragmentPath)
  if (!fs.existsSync(abs)) return ''
  const html = fs.readFileSync(abs, 'utf-8')
  const $ = cheerio.load(html)
  // Return the main post content if identifiable, else full fragment
  const article = $('article').first()
  if (article.length) return article.html() ?? ''
  const entry = $('.entry-content, .post-content, .blog_detail_content').first()
  if (entry.length) return entry.html() ?? ''
  return html
}

async function run() {
  const payload = await getPayload({ config })

  const registryPath = path.resolve(ROOT, 'lib', 'snapshotRegistry.json')
  const registry: RegistryEntry[] = JSON.parse(fs.readFileSync(registryPath, 'utf-8'))

  const blogEntries = registry.filter(
    (e) =>
      e.path.startsWith('/blog/') &&
      !e.path.endsWith('/blog/') &&
      e.locale === 'en'
  )

  console.log(`Found ${blogEntries.length} blog posts. DRY_RUN=${DRY_RUN} LIMIT=${LIMIT}`)

  let created = 0
  let skipped = 0
  let errors = 0

  for (const entry of blogEntries.slice(0, LIMIT)) {
    const slug = blogSlugFromPath(entry.path)
    const title = cleanTitle(entry.head.title ?? slug)
    const authorName = extractAuthorFromJsonLd(entry.head.jsonLd ?? [])
    const publishedAt = extractPublishedAt(entry.head.jsonLd ?? [])
    const excerpt = extractDescription(entry.head.metaTags ?? [])
    const rawHtml = extractBodyHtml(entry.fragment)

    console.log(`  → ${slug}`)

    if (DRY_RUN) {
      console.log(`     title: ${title}`)
      console.log(`     author: ${authorName}`)
      console.log(`     publishedAt: ${publishedAt}`)
      console.log(`     excerpt: ${excerpt.slice(0, 80)}`)
      console.log(`     bodyLen: ${rawHtml.length}`)
      skipped++
      continue
    }

    try {
      // Skip if already exists
      const existing = await payload.find({
        collection: 'blog-posts',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        console.log(`     already exists, skipping`)
        skipped++
        continue
      }

      // Upsert author
      let authorId: string | null = null
      if (authorName) {
        const authorSlug = authorName.toLowerCase().replace(/\s+/g, '-')
        const existingAuthor = await payload.find({
          collection: 'authors',
          where: { slug: { equals: authorSlug } },
          limit: 1,
        })
        if (existingAuthor.docs.length > 0) {
          authorId = existingAuthor.docs[0].id as string
        } else {
          const newAuthor = await payload.create({
            collection: 'authors',
            data: { name: authorName, slug: authorSlug },
          })
          authorId = newAuthor.id as string
        }
      }

      await payload.create({
        collection: 'blog-posts',
        data: {
          title,
          slug,
          locale: 'en',
          excerpt,
          rawHtml,
          publishedAt: publishedAt ?? undefined,
          author: authorId ?? undefined,
          status: 'published',
          seo: {
            title,
            description: excerpt,
          },
        } as never,
      })

      created++
      console.log(`     ✓ created`)
    } catch (err) {
      errors++
      console.error(`     ✗ error:`, err)
    }
  }

  console.log(`\nDone. created=${created} skipped=${skipped} errors=${errors}`)
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
