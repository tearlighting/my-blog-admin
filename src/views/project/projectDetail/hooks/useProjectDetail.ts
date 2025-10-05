import { getProjectDetailById } from "@/api"
import { useLanguageStore } from "@/store"
import { addSiteBase } from "@/utils/resource"

import type { TLocale } from "language"
import type { IProjectTranslation } from "project"
import { reactive } from "vue"

const { languages } = useLanguageStore()

export const useBlogDetail = () => {
  const projectDetail = reactive<IProjectTranslation[]>(
    languages.map((item) => {
      return {
        lang: item.value,
        title: "",
        description: "",
        htmlContent: "",
        toc: "",
        projectId: "",
        id: "",
      }
    })
  )

  const requestProjectDetail = async (blogId: string) => {
    return await getProjectDetailById(blogId)
      .then((res) => {
        if (res.msg) throw new Error(res.msg)
        projectDetail.forEach((item, index, arr) => {
          const lang = item.lang
          const blog = res.data.translations.find((item) => item.lang === lang)
          if (blog) {
            blog.htmlContent = addSiteBase(blog.htmlContent)
            arr[index] = blog
          }
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const getProjectTranslation = (lang: TLocale) => {
    return projectDetail.find((item) => item.lang === lang)
  }

  return {
    projectDetail,
    requestProjectDetail,
    getProjectTranslation,
  }
}
