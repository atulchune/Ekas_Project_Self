import { useEffect } from 'react'

function setMeta(name, content, attr = 'name') {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

/** Lightweight document-head manager -- avoids pulling in react-helmet for
 * an SPA where most SEO-critical crawling relies on the sitemap + SSR-free
 * metadata being present at least for the initial paint. */
export function Seo({ title, description, image, type = 'website' }) {
  useEffect(() => {
    if (title) document.title = title
    setMeta('description', description)
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', type, 'property')
    if (image) setMeta('og:image', image, 'property')
  }, [title, description, image, type])

  return null
}
