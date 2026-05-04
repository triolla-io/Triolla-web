import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'headline', type: 'text', required: true, localized: true },
    { name: 'sub', type: 'textarea', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'ctaLabel', type: 'text', localized: true },
    { name: 'ctaHref', type: 'text' },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'default',
      options: ['default', 'services', 'portfolio', 'blog'],
    },
  ],
}
