import HeroBlock from './blocks/HeroBlock'
import CTABlock from './blocks/CTABlock'
import RawHtmlBlock from './blocks/RawHtmlBlock'
import RichTextBlock from './blocks/RichTextBlock'

type Block =
  | { blockType: 'hero'; headline: string; sub?: string | null; image?: unknown; ctaLabel?: string | null; ctaHref?: string | null; variant?: string | null }
  | { blockType: 'cta'; headline: string; sub?: string | null; buttonLabel: string; buttonHref: string }
  | { blockType: 'rawHtml'; html: string }
  | { blockType: 'richText'; content: unknown }

type Props = { blocks: Block[] | null | undefined }

export default function BlockRenderer({ blocks }: Props) {
  if (!blocks?.length) return null
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={i} {...block} image={block.image as never} />
          case 'cta':
            return <CTABlock key={i} {...block} />
          case 'rawHtml':
            return <RawHtmlBlock key={i} html={block.html} />
          case 'richText':
            return <RichTextBlock key={i} content={block.content} />
          default:
            return null
        }
      })}
    </>
  )
}
