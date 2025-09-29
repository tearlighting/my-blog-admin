import { stringEnumTransform } from "@/utils"
import { createTableTemplateResolverI18n } from "@/utils/table"
import { EHomeTableProps } from "../constants"
import type { IBannerItem } from "home"
import { ref } from "vue"
import { getBanners } from "@/api"
import { createUseTableData } from "@/hooks/useTemplifyTableData"

const { props } = stringEnumTransform(EHomeTableProps)

export const homeTableTemplate = createTableTemplateResolverI18n({
  props,
  labels: {
    bigImg: ({ t }) => t("views.home.table.bigImg"),
    description: ({ t }) => t("views.home.table.description"),
    title: ({ t }) => t("views.home.table.title"),
  },
})

const useTableRow = createUseTableData<IBannerItem>({
  request: () =>
    getBanners().then((res) => {
      if (res.msg) throw new Error(res.msg)
      return res.data
    }),
})
export const useTable = () => {
  const tableTemplate = homeTableTemplate
  const { tableData, requestRemoteData, resetTableData, getTableRow } = useTableRow()
  const getRowById = (id: string) => getTableRow((x) => x.id === id)!
  return {
    tableTemplate,
    tableData,
    getRowById,
    resetTableData,
    requestRemoteData,
  }
}
