export interface IBlogTypeItem {
  id: string
  name: string
  articleCount: number
  order: number
}

export interface IBlogItem {
  id: string
  thumb: string
  category: {
    id: string
    name: string
  }
  scanNumber: number
  commentNumber: number
  translations: IBlogTranslation[]
}

export type TBlogForm = {
  thumb: string
  category: string
}

export interface IBlogTranslation {
  blogId: string
  id: string
  lang: string
  title: string
  description: string
  toc: string
  htmlContent: string
}
