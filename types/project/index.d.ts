export interface IProjectItem {
  id: string
  thumb: string
  scanNumber: number
  commentNumber: number
  translations: IBlogTranslation[]
}
export type TProjectForm = {
  thumb: string
}

export interface IProjectTranslation {
  projectId: string
  id: string
  lang: string
  title: string
  description: string
  toc: string
  htmlContent: string
}
