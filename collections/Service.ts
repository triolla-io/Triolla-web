import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { RawHtml } from '../blocks/RawHtml'

export const Service: CollectionConfig = {
  slug: 'services',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'locale', 'status'] },
  versions: { drafts: true },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      name: 'locale',
      type: 'select',
      required: true,
      options: [
        { label: 'English', value: 'en' },
        { label: 'Hebrew', value: 'he' },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'headline', type: 'text', localized: true },
        { name: 'sub', type: 'text', localized: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
    { name: 'sections', type: 'blocks', blocks: [RawHtml] },
    { name: 'relatedServices', type: 'relationship', relationTo: 'services', hasMany: true },
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
        try { revalidatePath(`/services/${doc.slug}`) } catch {}
      },
    ],
  },
}
