import { useTemplifyForm } from "@/hooks/useTemplifyForm"
import { stringEnum2Template } from "@/utils"
import { ELoginForm } from "./constants"
import { ElFormItem, ElInput } from "element-plus"
import z from "zod"
const { props, labels } = stringEnum2Template(ELoginForm)

export const { formData, formTemplate, validateAll, validateField, reset, enableAutoValidate, isValid } = useTemplifyForm({
  formDataPayload: {
    shapes: {
      userName: z.string().min(1).max(20),
      password: z.string().min(1).max(20),
    },
    defaultValues: {
      userName: "admin",
      password: "123",
    },
  },
  formTemplatePayload: {
    labels,
    props,
    formItemLabelClassNames: {
      userName: "w-20 h-full flex justify-center items-center text-muted",
      password: "w-20 h-full flex justify-center items-center text-muted",
    },
    renders: {
      password: (item, formData: Record<(typeof props)[number], any>) => {
        console.log(formData, item)

        return (
          <ElFormItem
            prop={item.prop}
            error={item.error}
            class={item.formItemClassName}
            v-slots={{
              label: () => <span class={item.formItemLabelClassName}>{item.label}</span>,
            }}
          >
            <ElInput showPassword size="large" v-model={formData[item.prop as keyof typeof formData]} class={item.formItemContentClassName}></ElInput>
          </ElFormItem>
        )
      },
    },
  },
})
enableAutoValidate() // enableAutoValidate()
