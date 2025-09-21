import { stringEnumTransform } from "@/utils"
import { createTableTemplateResolverI18n } from "@/utils/table"
import { EHomeTableProps } from "../constants"

const { props } = stringEnumTransform(EHomeTableProps)

export const homeTableTemplate = createTableTemplateResolverI18n({
  props,
  labels: {
    bigImg: ({ t }) => t("views.home.table.bigImg"),
    description: ({ t }) => t("views.home.table.description"),
    title: ({ t }) => t("views.home.table.title"),
  },
})
