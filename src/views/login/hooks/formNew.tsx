import { createUseTemplifyFormWithI18nResolvor } from "@/hooks/useTemplifyFormNew"
import { stringEnumTransform, createZodErrorMap } from "@/utils/templifyFormNew"
import { ELoginForm } from "../constants"
import { ElFormItem, ElInput } from "element-plus"
import z from "zod"
import type { TI18nKey } from "language"
import Code from "../component/Code.vue"
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
    code: {
      required: "views.login.code.errors.required",
    },
  })
  return createUseTemplifyFormWithI18nResolvor({
    formDataPayload: {
      shapes: {
        userName: z.string().min(1, errorMap.userName.min).max(20, errorMap.userName.max),
        password: z.string().min(1, errorMap.password.min).max(20, errorMap.password.max),
        code: z.string().length(4, errorMap.code.required),
      },
      defaultValues: {
        userName: "admin",
        password: "123456",
        code: "",
      },
    },
    formTemplatePayload: {
      labels: {
        userName: ({ t }) => t("views.login.userName"),
        password: ({ t }) => t("views.login.password"),
        code: ({ t }) => t("views.login.code"),
      },
      props,
      formItemLabelClassNames: {
        userName: "w-20 h-full flex justify-center items-center text-muted",
        password: "w-20 h-full flex justify-center items-center text-muted",
        code: "w-20 h-full flex justify-center items-center text-muted",
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
        code: (_, item, formData) => <Code item={item} formData={formData}></Code>,
      },
      errors: {
        password: ({ t }, value) => {
          return value && t(value as TI18nKey)
        },
        userName: ({ t }, value) => {
          return value && t(value as TI18nKey)
        },
        code: ({ t }, value) => {
          return value && t(value as TI18nKey)
        },
      },
    },
  })
})()
