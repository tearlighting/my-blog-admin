import { getBlogDetailById } from "@/api"
import { useLanguageStore } from "@/store"
import type { IBlogTranslation } from "blog"
import type { TLocale } from "language"
import { reactive, ref } from "vue"

const { languages } = useLanguageStore()

export const useBlogDetail = () => {
  const blogDetail = reactive<IBlogTranslation[]>(
    languages.map((item) => {
      return {
        lang: item.value,
        title: "",
        description: "",
        htmlContent: "",
        toc: "",
        blogId: "",
        id: "",
      }
    })
  )

  const requestBlogDetail = async (blogId: string) => {
    return await getBlogDetailById(blogId)
      .then((res) => {
        if (res.msg) throw new Error(res.msg)
        blogDetail.forEach((item, index, arr) => {
          const lang = item.lang
          const blog = res.data.translations.find((item) => item.lang === lang)
          if (blog) {
            arr[index] = blog
          }
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const getBlogTranslation = (lang: TLocale) => {
    return blogDetail.find((item) => item.lang === lang)
  }

  return {
    blogDetail,
    requestBlogDetail,
    getBlogTranslation,
  }
}
