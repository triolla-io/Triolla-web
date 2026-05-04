import { cache } from 'react'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import type { Metadata } from 'next'
import SnapshotClient from '@/lib/SnapshotClient'
import { loadSnapshot } from '@/lib/loadSnapshot'
import { snapshotMetadata } from '@/lib/snapshotMetadata'
import snapshotRegistry from '@/lib/snapshotRegistry.json'

type RegistryEntry = { slug: string; locale: string; path: string }
const registry = snapshotRegistry as RegistryEntry[]

type Params = Promise<{ slug: string }>

function registrySlug(urlSlug: string): string {
  return `triolla-io-blog-${urlSlug}`
}

function allBlogSlugs(): string[] {
  return registry
    .filter((e) => e.path.startsWith('/blog/') && !e.path.endsWith('/blog/') && e.locale === 'en')
    .map((e) => e.path.replace('/blog/', '').replace(/\/$/, ''))
}

export async function generateStaticParams() {
  return allBlogSlugs().map((slug) => ({ slug }))
}

const _load = cache((slug: string) => loadSnapshot(registrySlug(slug), 'en'))

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  try {
    const { entry } = await _load(slug)
    return snapshotMetadata(entry.slug, entry.locale)
  } catch {
    return {}
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params

  let data: Awaited<ReturnType<typeof loadSnapshot>>
  try {
    data = await _load(slug)
  } catch {
    notFound()
  }

  const { entry, bodyHtml, widgetProps } = data!
  const jsonLdBlocks = [
    ...(entry.head?.jsonLd ?? []),
    ...(entry.head?.jsonLdSynthesized ?? []),
  ]
  const snSlug = registrySlug(slug)

  return (
    <>
      {jsonLdBlocks.map((block, i) => (
        <Script
          key={i}
          id={`json-ld-${i}-${snSlug}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: block }}
        />
      ))}
      {entry.fontPreloads?.map((href) => (
        <link key={href} rel="preload" href={href} as="font" crossOrigin="anonymous" />
      ))}
      {entry.imagePreloads?.map((preload) => (
        <link
          key={preload.href}
          rel="preload"
          href={preload.href}
          as="image"
          type={preload.type}
          imageSrcSet={preload.imagesrcset}
          fetchPriority="high"
        />
      ))}
      {entry.js
        .filter((src) => !/googletagmanager|facebook\.net|hotjar|clarity\.ms|hubspot|hs-scripts|\/\d{7,}\.js/i.test(src))
        .slice(0, 5)
        .map((href) => (
          <link key={href} rel="preload" as="script" href={href} />
        ))}
      {entry.css.map((href) => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
      <SnapshotClient entry={entry} bodyHtml={bodyHtml} widgetProps={widgetProps} />
    </>
  )
}

export const dynamic = 'force-static'
