import { stringEnumTransform } from "@/utils"
import { EBlogType } from "../constants"
import { createTableTemplateResolverI18n } from "@/utils/table"
import { ref } from "vue"
import type { IBlogTypeItem } from "blog"
import { getBlogTypes } from "@/api"

const { props } = stringEnumTransform<Pick<typeof EBlogType, "name">>(EBlogType, (x) => x === "name")

export const homeTableTemplate = createTableTemplateResolverI18n({
  props,
  labels: {
    name: ({ t }) => t("views.blog.blogType.table.name"),
    // articleCount: ({ t }) => t("views.blog.blogType.table.articleCount"),
    // order: ({ t }) => t("views.blog.blogType.table.order"),
  },
})

export const useTable = () => {
  const tableData = ref<IBlogTypeItem[]>([])
  const template = homeTableTemplate

  const requestRemoteData = async () => {
    try {
      const res = await getBlogTypes()
      if (res.msg) throw new Error(res.msg)
      tableData.value = res.data
    } catch (err) {
      throw err
    }
  }

  const getTableRow = (id: string) => tableData.value.find((item) => item.id === id)

  return {
    tableData,
    template,
    requestRemoteData,
    getTableRow,
  }
}
