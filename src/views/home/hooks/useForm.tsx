import { ETemplateType, stringEnumTransform } from "@/utils"
import { EHomeTableProps } from "../constants"
import { createUseTemplifyFormWithI18nResolvor } from "@/hooks/useTemplifyFormNew"
import z from "zod"
import type { IBannerItem } from "home"
const { props } = stringEnumTransform(EHomeTableProps)

export const useFormRaw = createUseTemplifyFormWithI18nResolvor({
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

export const useForm = () => {
  const store = useFormRaw()
  const extraData = {
    current: null as Omit<IBannerItem, keyof typeof store.formData> | null,
  }
  function reset(row?: IBannerItem) {
    const { bigImg, title, description, ...extras } = row || {}
    extraData.current = extras as any
    store.reset({
      title,
      description,
      bigImg,
    })
  }
  return {
    ...store,
    reset,
    extraData,
  }
}
