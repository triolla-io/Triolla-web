import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { Hero } from '../blocks/Hero'
import { RichText } from '../blocks/RichText'
import { RawHtml } from '../blocks/RawHtml'
import { CTA } from '../blocks/CTA'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updatedAt'] },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [Hero, RichText, RawHtml, CTA],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        const slug = doc.slug === 'home' ? '/' : `/${doc.slug}`
        try { revalidatePath(slug) } catch {}
      },
    ],
  },
}
