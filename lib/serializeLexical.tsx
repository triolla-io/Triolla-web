import type { ReactNode, JSX } from 'react'

type LexicalNode = {
  type: string
  tag?: string
  text?: string
  format?: number
  children?: LexicalNode[]
  url?: string
  fields?: { url?: string; newTab?: boolean }
  listType?: string
  value?: number
}

type LexicalRoot = { root: { children: LexicalNode[] } }

export function serializeLexical(content: unknown): ReactNode {
  if (!content || typeof content !== 'object') return null
  const root = (content as LexicalRoot).root
  if (!root?.children) return null
  return <>{root.children.map((node, i) => serializeNode(node, i))}</>
}

function serializeNode(node: LexicalNode, key: number): ReactNode {
  switch (node.type) {
    case 'paragraph':
      return <p key={key}>{node.children?.map((c, i) => serializeNode(c, i))}</p>
    case 'heading':
      return createElement(node.tag ?? 'h2', key, node.children?.map((c, i) => serializeNode(c, i)))
    case 'list':
      return node.listType === 'number'
        ? <ol key={key}>{node.children?.map((c, i) => serializeNode(c, i))}</ol>
        : <ul key={key}>{node.children?.map((c, i) => serializeNode(c, i))}</ul>
    case 'listitem':
      return <li key={key} value={node.value}>{node.children?.map((c, i) => serializeNode(c, i))}</li>
    case 'link':
      return (
        <a
          key={key}
          href={node.fields?.url ?? node.url}
          target={node.fields?.newTab ? '_blank' : undefined}
          rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}
        >
          {node.children?.map((c, i) => serializeNode(c, i))}
        </a>
      )
    case 'text': {
      let el: ReactNode = node.text ?? ''
      const fmt = node.format ?? 0
      if (fmt & 1) el = <strong>{el}</strong>
      if (fmt & 2) el = <em>{el}</em>
      if (fmt & 8) el = <u>{el}</u>
      if (fmt & 4) el = <s>{el}</s>
      if (fmt & 16) el = <code>{el}</code>
      return <span key={key}>{el}</span>
    }
    case 'linebreak':
      return <br key={key} />
    case 'horizontalrule':
      return <hr key={key} />
    default:
      return node.children
        ? <>{node.children.map((c, i) => serializeNode(c, i))}</>
        : null
  }
}

function createElement(tag: string, key: number, children: ReactNode): ReactNode {
  const Tag = tag as keyof JSX.IntrinsicElements
  return <Tag key={key}>{children}</Tag>
}
