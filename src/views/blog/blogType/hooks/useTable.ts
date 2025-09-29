import { stringEnumTransform } from "@/utils"
import { EBlogType } from "../constants"
import { createTableTemplateResolverI18n } from "@/utils/table"
import type { IBlogTypeItem } from "blog"
import { getBlogTypes } from "@/api"
import { createUseTableData } from "@/hooks/useTemplifyTableData"

const { props } = stringEnumTransform<Pick<typeof EBlogType, "name" | "articleCount">>(EBlogType, (x) => ["name", "articleCount"].includes(x))

export const homeTableTemplate = createTableTemplateResolverI18n({
  props,
  labels: {
    name: ({ t }) => t("views.blog.blogType.table.name"),
    articleCount: ({ t }) => t("views.blog.blogType.table.articleCount"),
    // order: ({ t }) => t("views.blog.blogType.table.order"),
  },
})

const useTableRaw = createUseTableData<IBlogTypeItem>({
  request: () =>
    getBlogTypes().then((res) => {
      if (res.msg) throw new Error(res.msg)
      return res.data
    }),
})
export const useTable = () => {
  const template = homeTableTemplate
  const { tableData, requestRemoteData, getTableRow: getRow } = useTableRaw()
  const getTableRow = (id: string) => getRow((x) => x.id === id)
  return {
    tableData,
    template,
    requestRemoteData,
    getTableRow,
  }
}
