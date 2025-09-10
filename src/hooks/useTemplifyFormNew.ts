import { createFormData, createFormTemplate, createZodValidator, type ETemplateType } from "@/utils/templifyFormNew"

import type { IUseFormParam, I18nResolveCxt, InferShape } from "templifyFormNew"
import { nextTick, onUnmounted, reactive, ref, watch } from "vue"
import type { ZodType } from "zod"

export function useTemplifyForm<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>, TResolveCxt>({
  formDataPayload,
  formTemplatePayload,
}: IUseFormParam<TProp, TTypes, TShape, TResolveCxt>) {
  //初始化表单
  const formTemplate = reactive(createFormTemplate<TProp, TTypes, TResolveCxt, InferShape<TShape>>(formTemplatePayload))
  const { formData: formDataRaw, schema } = createFormData({ ...formDataPayload, props: formTemplatePayload.props })
  type TInferKey = TProp & keyof typeof formDataRaw
  const formdataValidator = createZodValidator(schema, formDataRaw)

  //初始化表单valid
  const { valid: initialValid, error: initialError } = formdataValidator.validateAll()
  const lastFormValid = ref(initialValid)
  const errors = ref<NonNullable<typeof initialError>>(initialError ?? ({} as any))
  //创建响应式formData
  const formData = reactive(formDataRaw)

  let isProgrammaticChangeFormData = false
  /**
   * 自动监听formData变化，并自动校验当前行
   */
  function enableAutoValidate() {
    for (let prop in formData) {
      watch(
        () => formData[prop as keyof typeof formData],
        () => {
          !isProgrammaticChangeFormData && validateField(prop as TInferKey)
          console.log("auto validate")
        }
      )
    }
  }
  /**
   *
   * 校验指定字段(单行)
   */
  function validateField(prop: TInferKey) {
    formdataValidator.runValidation(prop)
  }
  /**
   * 校验所有字段
   */
  function validateAll() {
    formdataValidator.runValidation()
  }
  /**
   * 初始化表单数据，默认使用之前设置的defaultValues
   * 并清空之前的错误信息
   * @param data
   */
  function reset(data?: Partial<typeof formDataRaw>) {
    isProgrammaticChangeFormData = true
    const defaultValues = data || (formDataPayload.defaultValues as any) || {}
    //因为这个formDataRaw是注入进formdataValidator的，我就不再调一遍reset了
    for (let key in formData) {
      formData[key as keyof typeof formData] = defaultValues[key] ?? null
    }
    for (let item of formTemplate) {
      item.error.rest()
    }
    const { valid, error } = formdataValidator.validateAll()
    lastFormValid.value = valid
    errors.value = error ?? {}
    console.log("set")
    nextTick(() => {
      isProgrammaticChangeFormData = false
      console.log("over")
    })
  }
  /**
   * 监听验证表单的pulish,修改响应式数据同步到vue
   * 添加i18nkey的hack,其实我感觉很丑，但是这种只改key的，我确实没有好的方法
   */
  const unsubscribe = formdataValidator.subscribe(({ valid, error }, prop) => {
    console.log("publish")

    error = error ?? ({} as any)
    //如果是单行校验，就只更新单行的error
    if (prop) {
      const item = formTemplate.find((item) => item.prop === prop)!
      item.error.show()
      item?.error?.setValue(error![prop as TInferKey] ?? "")

      // hackI18nKeyWithNewObj(item, "error", error![item.prop as TInferKey])
    } else {
      //如果是全部校验，就更新全部的error
      if (valid) {
        for (let item of formTemplate) {
          item?.error?.show()
          item?.error?.setValue(error![prop as TInferKey] ?? "")
        }
      }
    }
    lastFormValid.value = valid
    errors.value = error ?? {}
  })
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

export const createUseTemplifyFormWithI18nResolvor =
  <TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>>({
    formDataPayload,
    formTemplatePayload,
  }: IUseFormParam<TProp, TTypes, TShape, I18nResolveCxt>) =>
  () =>
    useTemplifyForm({ formDataPayload, formTemplatePayload })
