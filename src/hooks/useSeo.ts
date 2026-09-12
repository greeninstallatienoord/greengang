import { useEffect } from 'react'
import { applySeo, type SeoInput } from '../lib/seo'

export function useSeo(input: SeoInput): void {
  const {
    title,
    description,
    path,
    image,
    imageAlt,
    type,
    noIndex,
    publishedTime,
    modifiedTime,
  } = input

  useEffect(() => {
    applySeo({
      title,
      description,
      path,
      image,
      imageAlt,
      type,
      noIndex,
      publishedTime,
      modifiedTime,
    })
  }, [
    title,
    description,
    path,
    image,
    imageAlt,
    type,
    noIndex,
    publishedTime,
    modifiedTime,
  ])
}
