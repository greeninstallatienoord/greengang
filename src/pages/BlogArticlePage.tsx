import { useParams } from 'react-router-dom'
import { ArticleTemplate } from '../components/blog/ArticleTemplate'
import { getPost } from '../data/blog'
import { NotFoundPage } from './NotFoundPage'

export function BlogArticlePage() {
  const { slug } = useParams()
  const post = slug ? getPost(slug) : undefined

  if (!post) return <NotFoundPage />

  return <ArticleTemplate post={post} />
}
