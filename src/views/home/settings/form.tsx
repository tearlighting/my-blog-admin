import { ETemplateType, stringEnumTransform } from "@/utils"
import { EHomeTableProps } from "../constants"
import { createUseTemplifyFormWithI18nResolvor } from "@/hooks/useTemplifyFormNew"
import z from "zod"
const { props } = stringEnumTransform(EHomeTableProps)

export const useForm = createUseTemplifyFormWithI18nResolvor({
  formTemplatePayload: {
    props,
    labels: {
      title: ({ t }) => t("views.home.table.title"),
      description: ({ t }) => t("views.home.table.description"),
      bigImg: ({ t }) => t("views.home.table.bigImg"),
    },
    types: {
      title: ETemplateType.textarea,
      description: ETemplateType.textarea,
    },
  },
  formDataPayload: {
    shapes: {
      title: z.string().min(1).max(200),
      description: z.string().min(1).max(200),
      bigImg: z.any(),
    },
  },
})
