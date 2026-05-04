type Props = { html: string }

export default function RawHtmlBlock({ html }: Props) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
