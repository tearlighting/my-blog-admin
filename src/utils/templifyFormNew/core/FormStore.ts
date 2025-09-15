import type { IPublisher, ISubscriber } from "subpubPattern"
import type { IFormTemplateItem } from "templifyFormNew"
import type { z, ZodObject } from "zod"
import { Blocker, Publisher, Subscriber } from "../../subPubpattern"
import type { ZodValidator } from "./ZodValidator"

enum EFormChange {
  formDataChange = "formDataChange",
}

export interface IFormStore<
  TScheme extends ZodObject,
  TResolveCxt extends any,
  TFormData extends z.infer<TScheme> = z.infer<TScheme>,
  TKey extends string & keyof z.infer<TScheme> = string & keyof z.infer<TScheme>,
  TFormTemplate extends IFormTemplateItem<TKey, TResolveCxt, TFormData> = IFormTemplateItem<TKey, TResolveCxt, TFormData>
> {
  /**
   * publish 单行错误
   * @param prop
   * @returns
   */
  validateField: (prop: TKey) => void
  /**
   *
   * publish 所有错误
   */
  validateAll: () => void
  /**
   * 手动设置错误并publish
   * @param key
   * @param error
   * @returns
   */
  setError: (key: TKey, error: string) => void
  /**
   * 重新设置formData,并清空所有错误,最后publish
   */
  reset(data?: Partial<TFormData>): void
  getSnapshot(): Readonly<{
    readonly isValid: boolean
    readonly errors: Partial<Record<TKey, string>>
    readonly formData: TFormData
    readonly forTemplate: TFormTemplate[]
  }>
}
export class FormStore<
  TScheme extends ZodObject,
  TResolveCxt extends any,
  TFormData extends z.infer<TScheme> = z.infer<TScheme>,
  TKey extends string & keyof z.infer<TScheme> = string & keyof z.infer<TScheme>,
  TFormTemplate extends IFormTemplateItem<TKey, TResolveCxt, TFormData> = IFormTemplateItem<TKey, TResolveCxt, TFormData>
> implements IFormStore<TScheme, TResolveCxt, TFormData, TKey, TFormTemplate>
{
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
    this._isValid = false
    this.publish()
  }
  private publish() {
    this._publisher.publish(EFormChange.formDataChange, this.getSnapshot())
  }

  subscribe(callback: (payload: ReturnType<FormStore<TScheme, TResolveCxt, TFormData, TKey, TFormTemplate>["getSnapshot"]>) => void) {
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
    for (let item of this._formTemplate) {
      item.error.rest()
    }
    this.publish()
  }
  getSnapshot() {
    return Object.freeze({
      isValid: this._isValid,
      errors: { ...this._errors },
      formData: { ...this._formData },
      forTemplate: this._formTemplate.map((item) => ({ ...item })),
    } as const)
  }
}

export const createFormStore = <
  TScheme extends ZodObject,
  TResolveCxt extends any,
  TFormData extends z.infer<TScheme>,
  TKey extends string & keyof z.infer<TScheme>,
  TFormTemplate extends IFormTemplateItem<TKey, TResolveCxt, TFormData>
>(
  formTemplate: TFormTemplate[],
  formData: TFormData,
  validator: ZodValidator<TScheme>
) => {
  return new FormStore<TScheme, TResolveCxt, TFormData, TKey, TFormTemplate>(formTemplate, formData, validator)
}
