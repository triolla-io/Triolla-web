import { serializeLexical } from '@/lib/serializeLexical'

type Props = { content: unknown }

export default function RichTextBlock({ content }: Props) {
  return (
    <div className="richtext-block">
      {serializeLexical(content)}
    </div>
  )
}
