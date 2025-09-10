import { createUseTemplifyFormWithI18nResolvor } from "@/hooks/useTemplifyFormNew"
import { stringEnumTransform, createZodErrorMap } from "@/utils/templifyFormNew"
import { ELoginForm } from "../constants"
import { ElFormItem, ElInput } from "element-plus"
import z from "zod"
import type { TI18nKey } from "language"

export const useForm = (() => {
  const { props } = stringEnumTransform(ELoginForm)
  const errorMap = createZodErrorMap<ArrayKey<typeof props>, TI18nKey>()({
    password: {
      max: "views.login.password.errors.maxLength",
      min: "views.login.password.errors.required",
    },
    userName: {
      max: "views.login.userName.errors.maxLength",
      min: "views.login.userName.errors.required",
    },
  })
  return createUseTemplifyFormWithI18nResolvor({
    formDataPayload: {
      shapes: {
        userName: z.string().min(1, errorMap.userName.min).max(20, errorMap.userName.max),
        password: z.string().min(1, errorMap.password.min).max(20, errorMap.password.max),
      },
    },
    formTemplatePayload: {
      labels: {
        userName: ({ t }) => t("views.login.userName"),
        password: ({ t }) => t("views.login.password"),
      },
      props,
      formItemLabelClassNames: {
        userName: "w-20 h-full flex justify-center items-center text-muted",
        password: "w-20 h-full flex justify-center items-center text-muted",
      },
      renders: {
        password: (_, item, formData, t) => {
          return (
            <ElFormItem
              prop={item.prop}
              error={item.error.resolve({ t })}
              class={item.formItemClassName}
              v-slots={{
                label: () => <span class={item.formItemLabelClassName}>{item.label.resolve({ t })}</span>,
              }}
            >
              <ElInput showPassword size="large" v-model={formData[item.prop as keyof typeof formData]} class={item.formItemContentClassName}></ElInput>
            </ElFormItem>
          )
        },
      },
      errors: {
        password: ({ t }, value) => {
          return value && t(value as TI18nKey)
        },
        userName: ({ t }, value) => {
          return value && t(value as TI18nKey)
        },
      },
    },
  })
})()
