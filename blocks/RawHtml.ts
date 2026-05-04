import type { Block } from 'payload'

export const RawHtml: Block = {
  slug: 'rawHtml',
  labels: { singular: 'Raw HTML', plural: 'Raw HTML' },
  fields: [
    {
      name: 'html',
      type: 'code',
      admin: { language: 'html' },
      localized: true,
      required: true,
    },
  ],
}
