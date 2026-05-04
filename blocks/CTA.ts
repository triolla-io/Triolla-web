import type { Block } from 'payload'

export const CTA: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: [
    { name: 'headline', type: 'text', required: true, localized: true },
    { name: 'sub', type: 'textarea', localized: true },
    { name: 'buttonLabel', type: 'text', required: true, localized: true },
    { name: 'buttonHref', type: 'text', required: true },
  ],
}
