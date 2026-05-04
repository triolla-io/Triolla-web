import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Author } from './collections/Author'
import { Tag } from './collections/Tag'
import { BlogPost } from './collections/BlogPost'
import { Service } from './collections/Service'
import { PortfolioCase } from './collections/PortfolioCase'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const useS3 = !!process.env.S3_BUCKET

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
  },
  routes: { admin: '/cms' },
  collections: [Users, Media, Pages, Author, Tag, BlogPost, Service, PortfolioCase],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
  }),
  sharp,
  localization: {
    locales: ['en', 'he'],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: useS3
    ? [
        s3Storage({
          collections: { media: { prefix: 'media' } },
          bucket: process.env.S3_BUCKET!,
          config: {
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID!,
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
            region: process.env.S3_REGION,
            endpoint: process.env.S3_ENDPOINT,
            forcePathStyle: !!process.env.S3_ENDPOINT,
          },
        }),
      ]
    : [],
})
