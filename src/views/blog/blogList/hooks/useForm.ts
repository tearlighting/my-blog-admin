import { ETemplateType, stringEnumTransform } from "@/utils"
import { EBlogItem } from "../constants"
import { createUseTemplifyFormWithI18nResolvor } from "@/hooks/useTemplifyFormNew"
import z from "zod"
import type { IBlogItem } from "blog"
import { getBlogTypes } from "@/api"
import { toResolvable } from "@/utils/templifyFormNew"

const { props } = stringEnumTransform<Pick<typeof EBlogItem, "category" | "thumb">>(EBlogItem, (x) => ["thumb", "category"].includes(x))

const useFormRaw = createUseTemplifyFormWithI18nResolvor({
  formTemplatePayload: {
    props,
    labels: {
      category: ({ t }) => t("views.blog.blogList.table.category"),
      thumb: ({ t }) => t("views.blog.blogList.table.thumb"),
    },
    types: {
      category: ETemplateType.select,
    },
  },
  formDataPayload: {
    shapes: {
      category: z.string(),
      thumb: z.any(),
    },
  },
})
export const useForm = () => {
  const store = useFormRaw()
  const extraData = {
    current: null as Omit<IBlogItem, keyof typeof store.formData> | null,
  }
  function setCategoriesOptions() {
    return getBlogTypes()
      .then((res) => {
        if (res.msg) throw new Error(res.msg)
        const { data } = res
        const newOptions = data.map((x) => ({ label: toResolvable(x.name), value: x.id }))
        store.formTemplate.find((x) => x.prop === "category")!.option = newOptions
      })
      .catch(() => console.error("get category failed"))
  }
  function reset(row?: IBlogItem) {
    const { thumb, category, ...extras } = row || {}
    extraData.current = extras as any
    store.reset({
      thumb,
      category: category?.id,
    })
  }
  setCategoriesOptions()
  return {
    ...store,
    reset,
    extraData,
  }
}
