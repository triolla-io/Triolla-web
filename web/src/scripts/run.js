const data = require('./hebrewPages.json')

function camelCase(str) {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '').trim()
}

const result = {}

data.forEach(page => {
  const key = camelCase(page.slug)

  result[key] = {
    title: stripHtml(page.title?.rendered || ''),
  }

  const content = stripHtml(page.content?.rendered || '')
  if (content) {
    result[key].description = content
  }
})

console.log(JSON.stringify(result, null, 2))