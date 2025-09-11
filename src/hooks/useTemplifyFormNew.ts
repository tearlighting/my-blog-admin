import { Blocker, Publisher, Subscriber } from "@/utils"
import { createFormData, createFormTemplate, createZodValidator, ZodValidator, type ETemplateType } from "@/utils/templifyFormNew"
import type { IPublisher, ISubscriber } from "subpubPattern"

import type { IUseFormParam, I18nResolveCxt, InferShape, IFormTemplateItem } from "templifyFormNew"
import { nextTick, onUnmounted, reactive, ref, watch } from "vue"
import { readonly, type z, type ZodObject, type ZodType } from "zod"

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
        () => !isProgrammaticChangeFormData && validateField(prop as TInferKey)
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

    nextTick(() => {
      isProgrammaticChangeFormData = false
    })
  }
  /**
   * 监听验证表单的pulish,修改响应式数据同步到vue
   * 添加i18nkey的hack,其实我感觉很丑，但是这种只改key的，我确实没有好的方法
   */
  const unsubscribe = formdataValidator.subscribe(({ valid, error }, prop) => {
    error = error ?? ({} as any)
    //如果是单行校验，就只更新单行的error
    if (prop) {
      const item = formTemplate.find((item) => item.prop === prop)!
      item.error.show()
      item?.error?.setValue(error![prop as TInferKey] ?? "")
    } else {
      //如果是全部校验，就更新全部的error
      for (let item of formTemplate) {
        item?.error?.show()
        item?.error?.setValue(error![prop as TInferKey] ?? "")
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

enum EFormChange {
  formDataChange = "formDataChange",
}
class FormStore<
  TScheme extends ZodObject,
  TResolveCxt extends any,
  TFormData extends z.infer<TScheme> = z.infer<TScheme>,
  TKey extends string & keyof z.infer<TScheme> = string & keyof z.infer<TScheme>,
  TFormTemplate extends IFormTemplateItem<TKey, TResolveCxt, TFormData> = IFormTemplateItem<TKey, TResolveCxt, TFormData>
> {
  private _isValid = false
  private _errors: Partial<Record<TKey, string>> = {}
  private _subscriber: ISubscriber<EFormChange>
  private _publisher: IPublisher<EFormChange>
  private _unsubscribeValidator?: () => void

  constructor(private _formTemplate: TFormTemplate[], private _formData: TFormData, private _validator: ZodValidator<TScheme>) {
    const blocker = new Blocker<EFormChange>()
    this._publisher = new Publisher(blocker)
    this._subscriber = new Subscriber(blocker)
    this.init()
  }

  private setupValidation() {
    // 订阅 validator，更新 errors/valid
    return this._validator.subscribe(({ valid, error }, prop) => {
      const nonNullErrors: Partial<Record<TKey, string>> = error ?? {}
      if (prop) {
        // 单行更新
        const item = this._formTemplate.find((x) => x.prop === prop)
        if (!item) return
        item.error.show()
        item.error.setValue(nonNullErrors[prop] ?? "")
      } else {
        // 全量更新
        for (const item of this._formTemplate) {
          item.error.show()
          item.error.setValue(nonNullErrors[item.prop] ?? "")
        }
      }
      this._isValid = valid
      this._errors = nonNullErrors
      this.publish()
    })
  }
  private init() {
    this.initValidation()
    this._unsubscribeValidator = this.setupValidation()
  }
  private initValidation() {
    const { valid, error } = this._validator.validateAll()
    this._isValid = valid
    this._errors = error ?? {}
  }

  validateField(prop: TKey) {
    this._validator.runValidation(prop)
  }

  validateAll() {
    this._validator.runValidation()
  }
  setError(key: TKey, error: string) {
    const item = this._formTemplate.find((item) => item.prop === key)
    if (!item) return
    this._errors[key] = error
    item.error.show()
    item.error.setValue(error)
    this.publish()
  }
  private publish() {
    this._publisher.publish(EFormChange.formDataChange, this.getSnapshot())
  }

  subscribe(callback: ({}: { isValid: boolean; error: Partial<Record<TKey, string>>; formData: TFormData; formTemplate: TFormTemplate[] }) => void) {
    const unsubscribe = this._subscriber.subscribe(EFormChange.formDataChange, callback)
    return () => {
      unsubscribe()
      this._unsubscribeValidator?.()
    }
  }
  reset(data?: Partial<TFormData>) {
    const defaultValues = data ?? {}
    for (const key in this._formData) {
      this._formData[key as keyof TFormData] = defaultValues[key as keyof typeof defaultValues] ?? null
    }
    this.initValidation()
    this.publish()
  }
  getSnapshot() {
    return Object.freeze({
      isValid: this._isValid,
      errors: { ...this._errors },
      formData: { ...this._formData },
      formTemplate: this._formTemplate.map((item) => ({
        ...item,
      })),
    } as const)
  }
}

export const createUseTemplifyFormWithI18nResolvor =
  <TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>>({
    formDataPayload,
    formTemplatePayload,
  }: IUseFormParam<TProp, TTypes, TShape, I18nResolveCxt>) =>
  () =>
    useTemplifyForm({ formDataPayload, formTemplatePayload })
