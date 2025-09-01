import { useHead } from '@unhead/react'

export function SEO({ 
  title = 'To+Do', 
  description = 'A simple and efficient todo application that allows users manage tasks efficiently',
  keywords = 'todo, tasks, productivity, organization',
  author = 'Chris Ebube Roland - Software Developer'
}) {
  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: author },
      
      // Open Graph (for social sharing)
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ]
  })

  return null
}

export default SEO