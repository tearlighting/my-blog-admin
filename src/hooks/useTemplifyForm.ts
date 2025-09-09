import { createFormData, createFormTemplate, createZodValidator, type ETemplateType } from "@/utils"
import type { IUseFormParam, I18nResolveCxt } from "templifyForm"
import { onUnmounted, reactive, ref, watch } from "vue"
import type { ZodType } from "zod"

export function useTemplifyForm<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>, TResolveCxt>({
  formDataPayload,
  formTemplatePayload,
}: IUseFormParam<TProp, TTypes, TShape, TResolveCxt>) {
  const formTemplate = reactive(createFormTemplate(formTemplatePayload))
  const { formData: formDataRaw, schema } = createFormData({ ...formDataPayload, props: formTemplatePayload.props })
  const formdataValidator = createZodValidator(schema, formDataRaw)
  type TInferKey = TProp & keyof typeof formDataRaw
  const lastFormValid = ref(false)
  const errors = ref<Partial<Record<TInferKey, string>>>({})
  const formData = reactive(formDataRaw)
  const unsubscribe = formdataValidator.subscribe(({ valid, error }, prop) => {
    if (prop) {
      const item = formTemplate.find((item) => item.prop === prop)!
      item.error = error![prop as TInferKey]
    } else {
      if (valid) {
        if (!lastFormValid.value) {
          for (let item of formTemplate) {
            item.error = undefined
          }
        }
      } else {
        for (let item of formTemplate) {
          item.error = error![item.prop as TInferKey]
        }
      }
    }
    lastFormValid.value = valid
    errors.value = error ?? {}
  })
  function validateField(prop: TInferKey) {
    formdataValidator.runValidation(prop)
  }
  function reset(data?: Partial<typeof formData>) {
    formdataValidator.reset(data || (formDataPayload.defaultValues as any) || {})
    for (let item of formTemplate) {
      item.error = undefined
    }
    lastFormValid.value = formdataValidator.validateAll().valid
  }

  function enableAutoValidate() {
    for (let prop in formData) {
      watch(
        () => formData[prop as keyof typeof formData],
        () => validateField(prop as TInferKey)
      )
    }
  }
  function validateAll() {
    formdataValidator.runValidation()
  }
  onUnmounted(() => {
    unsubscribe()
  })
  return {
    formTemplate,
    formData,
    reset,
    enableAutoValidate,
    validateField,
    isValid: lastFormValid,
    validateAll,
    errors,
  }
}

export const createUseTemplifyFormWithI18nResolvor = (
  () =>
  <TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>>({
    formDataPayload,
    formTemplatePayload,
  }: IUseFormParam<TProp, TTypes, TShape, I18nResolveCxt>) =>
  () =>
    useTemplifyForm({ formDataPayload, formTemplatePayload })
)()
