import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { RawHtml } from '../blocks/RawHtml'

export const PortfolioCase: CollectionConfig = {
  slug: 'portfolio-cases',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'client', 'status'] },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'client', type: 'text' },
    { name: 'industry', type: 'text' },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'alt', type: 'text' },
        { name: 'headline', type: 'text', localized: true },
      ],
    },
    { name: 'summary', type: 'textarea', localized: true },
    { name: 'body', type: 'blocks', blocks: [RawHtml] },
    {
      name: 'gallery',
      type: 'array',
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'alt', type: 'text' },
      ],
    },
    { name: 'relatedCases', type: 'relationship', relationTo: 'portfolio-cases', hasMany: true },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'ogImage', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        try { revalidatePath('/portfolio-page/') } catch {}
      },
    ],
  },
}
