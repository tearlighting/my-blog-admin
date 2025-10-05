import { stringEnumTransform } from "@/utils/templifyFormNew"
import { EProjectItem } from "../constants"
import { createTableTemplateResolverI18n } from "@/utils/table"
import { createUseTableData } from "@/hooks/useTemplifyTableData"
import { getProjectItems } from "@/api"
import { reactive } from "vue"
import { addSiteBaseToUrl } from "@/utils/resource"

const { props } = stringEnumTransform<Omit<typeof EProjectItem, "id">>(EProjectItem, (x: any) => x !== "id")
const tableTemplate = createTableTemplateResolverI18n({
  props,
  labels: {
    title: ({ t }) => t("views.project.projectList.table.title"),
    thumb: ({ t }) => t("views.project.projectList.table.thumb"),
    description: ({ t }) => t("views.project.projectList.table.description"),
    scanNumber: ({ t }) => t("views.project.projectList.table.scanNumber"),
    commentNumber: ({ t }) => t("views.project.projectList.table.commentNumber"),
  },
})

export const usePaginationTable = () => {
  const paginationInfo = reactive({
    limit: 5,
    page: 1,
    total: 0,
  })
  const request = async (blogTypeId?: number) => {
    return getProjectItems({ ...paginationInfo, id: blogTypeId }).then((res) => {
      if (res.msg) throw new Error(res.msg)
      paginationInfo.total = res.data.total
      for (let item of res.data.rows) {
        item.thumb = addSiteBaseToUrl(item.thumb)
      }
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
