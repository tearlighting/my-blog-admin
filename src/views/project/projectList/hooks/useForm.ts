import { stringEnumTransform } from "@/utils"
import { EProjectItem } from "../constants"
import { createUseTemplifyFormWithI18nResolvor } from "@/hooks/useTemplifyFormNew"
import z from "zod"
import type { IProjectItem } from "project"

const { props } = stringEnumTransform<Pick<typeof EProjectItem, "thumb">>(EProjectItem, (x) => ["thumb", "category"].includes(x))

const useFormRaw = createUseTemplifyFormWithI18nResolvor({
  formTemplatePayload: {
    props,
    labels: {
      thumb: ({ t }) => t("views.blog.blogList.table.thumb"),
    },
  },
  formDataPayload: {
    shapes: {
      thumb: z.any(),
    },
  },
})
export const useForm = () => {
  const store = useFormRaw()
  const extraData = {
    current: null as Omit<IProjectItem, keyof typeof store.formData> | null,
  }

  function reset(row?: IProjectItem) {
    const { thumb, ...extras } = row || {}
    extraData.current = extras as any
    store.reset({
      thumb,
    })
  }

  return {
    ...store,
    reset,
    extraData,
  }
}
