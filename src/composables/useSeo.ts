import { useHead } from '@unhead/vue'

interface SeoOptions {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
}

export function useSeo(options: SeoOptions = {}) {
  const {
    title = 'To+Do',
    description = 'A simple and efficient todo application that allows users manage tasks efficiently',
    keywords = 'todo, tasks, productivity, organization',
    author = 'Chris Ebube Roland - Software Developer'
  } = options

  useHead({
    title,
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: author },
      
      // Open Graph
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      
      // Twitter Card
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
    ]
  })
}