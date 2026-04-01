export function extract(pages: any[]) {
  function camelCase(str: string) {
    return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  }

  function stripHtml(html: string) {
    return html.replace(/<[^>]+>/g, '').trim()
  }

  const result: any = {}

  pages.forEach(page => {
    const key = camelCase(page.slug)

    result[key] = {
      title: stripHtml(page.title?.rendered || ''),
    }

    const content = stripHtml(page.content?.rendered || '')
    if (content) {
      result[key].description = content
    }
  })

  return result
}