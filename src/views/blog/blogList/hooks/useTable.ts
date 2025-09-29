import { stringEnumTransform } from "@/utils/templifyFormNew"
import { EBlogItem } from "../constants"
import { createTableTemplateResolverI18n } from "@/utils/table"
import { createUseTableData } from "@/hooks/useTemplifyTableData"
import { getBlogItems } from "@/api"
import { reactive } from "vue"
import { useLanguageStore } from "@/store"
import { storeToRefs } from "pinia"

const { props } = stringEnumTransform<Omit<typeof EBlogItem, "id">>(EBlogItem, (x: any) => x !== "id")
const tableTemplate = createTableTemplateResolverI18n({
  props,
  labels: {
    title: ({ t }) => t("views.blog.blogList.table.title"),
    thumb: ({ t }) => t("views.blog.blogList.table.thumb"),
    description: ({ t }) => t("views.blog.blogList.table.description"),
    category: ({ t }) => t("views.blog.blogList.table.category"),
    scanNumber: ({ t }) => t("views.blog.blogList.table.scanNumber"),
    commentNumber: ({ t }) => t("views.blog.blogList.table.commentNumber"),
  },
})

export const usePaginationTable = () => {
  const paginationInfo = reactive({
    limit: 5,
    page: 1,
    total: 0,
  })
  const { currentLocale } = storeToRefs(useLanguageStore())
  const request = async (blogTypeId?: number) => {
    return getBlogItems({ ...paginationInfo, type: currentLocale.value, id: blogTypeId }).then((res) => {
      //   console.log(res)
      if (res.msg) throw new Error(res.msg)
      paginationInfo.total = res.data.total
      //   console.log(res.data.rows)
      return res.data.rows
    })
  }
  const {
    tableData,
    requestRemoteData,
    resetTableData,
    getTableRow: getRow,
  } = createUseTableData({
    request,
  })()
  const getTableRow = (id: string) => {
    return getRow((x) => x.id === id)
  }
  return {
    tableData,
    requestRemoteData,
    resetTableData,
    getTableRow,
    paginationInfo,
    tableTemplate,
  }
}
