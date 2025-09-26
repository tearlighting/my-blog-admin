import { stringEnumTransform } from "@/utils"
import { createTableTemplateResolverI18n } from "@/utils/table"
import { EHomeTableProps } from "../constants"
import type { IBannerItem } from "home"
import { ref } from "vue"
import { getBanners } from "@/api"

const { props } = stringEnumTransform(EHomeTableProps)

export const homeTableTemplate = createTableTemplateResolverI18n({
  props,
  labels: {
    bigImg: ({ t }) => t("views.home.table.bigImg"),
    description: ({ t }) => t("views.home.table.description"),
    title: ({ t }) => t("views.home.table.title"),
  },
})

export const useTable = () => {
  const tableTemplate = homeTableTemplate
  const tableData = ref<IBannerItem[]>([])

  const getRowById = (id: string) => tableData.value.find((item) => item.id === id)

  const deleteRow = (id: string) => {
    const index = tableData.value.findIndex((item) => item.id === id)
    if (index > -1) {
      tableData.value.splice(index, 1)
    }
  }
  const addRow = (row: IBannerItem) => {
    tableData.value.unshift(row)
  }
  const updateRow = (row: Partial<IBannerItem>) => {
    const index = tableData.value.findIndex((item) => item.id === row.id)
    if (index > -1) {
      tableData.value.splice(index, 1, { ...tableData.value[index], ...row })
    }
  }
  const resetTableData = (payload: IBannerItem[] = []) => {
    tableData.value = payload
  }
  const requestRemoteData = async () => {
    getBanners().then((res) => {
      if (res.msg) throw new Error(res.msg)
      resetTableData(res.data)
    })
  }
  return {
    tableTemplate,
    tableData,
    getRowById,
    deleteRow,
    addRow,
    updateRow,
    resetTableData,
    requestRemoteData,
  }
}
