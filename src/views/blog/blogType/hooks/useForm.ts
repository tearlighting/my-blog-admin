import { stringEnumTransform } from "@/utils"
import { EBlogType } from "../constants"
import { createUseTemplifyFormWithI18nResolvor } from "@/hooks/useTemplifyFormNew"
import z from "zod"
import type { IBlogTypeItem } from "blog"

const { props } = stringEnumTransform<Pick<typeof EBlogType, "name">>(EBlogType, (x) => x === "name")

export const useFormRaw = createUseTemplifyFormWithI18nResolvor({
  formTemplatePayload: {
    props,
    labels: {
      name: ({ t }) => t("views.blog.blogType.table.name"),
    },
  },
  formDataPayload: {
    shapes: {
      name: z.string().min(1).max(20),
    },
  },
})

export const useForm = () => {
  const store = useFormRaw()
  const extraData = {
    current: null as Omit<IBlogTypeItem, keyof typeof store.formData> | null,
  }
  function reset(row?: IBlogTypeItem) {
    const { name, ...extras } = row || {}
    extraData.current = extras as any
    store.reset({
      name,
    })
  }
  return {
    ...store,
    reset,
    extraData,
  }
}
