import { createFormData, createFormTemplate, createZodValidator, type ETemplateType } from "@/utils"
import type { IUSeFormParam } from "templifyForm"
import { onUnmounted, reactive, ref, watch } from "vue"
import type { ZodObject, ZodType } from "zod"

export function useTemplifyForm<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>>({
  formDataPayload,
  formTemplatePayload,
}: IUSeFormParam<TProp, TTypes, TShape>) {
  const formTemplate = reactive(createFormTemplate(formTemplatePayload))
  const { formData: formDataRaw, schema } = createFormData({ ...formDataPayload, props: formTemplatePayload.props })
  const formdataValidator = createZodValidator<TProp, ZodObject<any>>(schema, formDataRaw)

  const lastFormValid = ref(false)
  const formData = reactive(formDataRaw)
  const unsubscribe = formdataValidator.subscribe(({ valid, error }, prop) => {
    if (prop) {
      const item = formTemplate.find((item) => item.prop === prop)!
      item.error = error![prop as TProp]
    } else {
      if (valid) {
        if (!lastFormValid.value) {
          for (let item of formTemplate) {
            item.error = undefined
          }
        }
      } else {
        for (let item of formTemplate) {
          item.error = error![item.prop as TProp]
        }
      }
    }
    lastFormValid.value = valid
  })
  function validateField(prop?: TProp) {
    formdataValidator.runValidation(prop)
  }
  function reset(data?: Partial<typeof formData>) {
    formdataValidator.reset(data || formDataPayload.defaultValues || {})
    for (let item of formTemplate) {
      item.error = undefined
    }
    lastFormValid.value = formdataValidator.validateAll().valid
  }

  onUnmounted(() => {
    unsubscribe()
  })

  function enableAutoValidate() {
    for (let prop in formData) {
      watch(
        () => formData[prop as keyof typeof formData],
        () => validateField(prop as TProp)
      )
    }
  }
  function validateAll() {
    formdataValidator.runValidation()
  }
  return {
    formTemplate,
    formData,
    reset,
    enableAutoValidate,
    validateField,
    isValid: lastFormValid,
    validateAll,
  }
}
