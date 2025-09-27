export interface IBlogTypeItem {
  id: string
  name: string
  articleCount: number
  order: number
}

export interface IBlogItem {
  id: string
  thumb: string
  title: string
  description: string
  category: {
    id: string
    name: string
  }

  createDate: string
  scanNumber: number
  commentNumber: number
}
