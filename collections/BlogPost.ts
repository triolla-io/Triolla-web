import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const BlogPost: CollectionConfig = {
  slug: 'blog-posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'locale', 'status', 'publishedAt'] },
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
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'alt', type: 'text', localized: true },
      ],
    },
    { name: 'author', type: 'relationship', relationTo: 'authors', hasMany: false },
    { name: 'publishedAt', type: 'date' },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'tags', type: 'relationship', relationTo: 'tags', hasMany: true },
    { name: 'body', type: 'richText', editor: lexicalEditor({}) },
    { name: 'rawHtml', type: 'textarea' },
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
        try { revalidatePath(`/blog/${doc.slug}`) } catch {}
        try { revalidatePath('/blog/') } catch {}
      },
    ],
  },
}
