import type { ETemplateType } from "@/utils/templifyForm/constants/templateType"
import type { ZodObject, ZodType, z } from "zod"
import type { createFormTemplate, ResolvableValue } from "@/utils"
import type { VNode } from "vue"
import { ILanguageManager } from "language"

/**
 * 通过函数获取label,可以动态注入一些数据，比如t,解耦
 */
export type LabelInput<T = any> = string | ((cxt: T) => string) | ResolvableValue<T>
/**
 * 下拉框配置
 */
export interface IOptionItem {
  label: LabelInput
  value: string
}

export interface INomalizedOptionItem<T> {
  label: ResolvableValue<T>
  value: string
}
/**
 * 当组件太复杂，通用组件满足不了时，可以手动配置render
 */
export type IRender<TProp extends string> = (item: IFormTemplateItem<TProp>, ...args: any[]) => VNode
/**
 * 初始化参数
 */
export type ICreateFormTemplateProps<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TResolveCxt> = {
  props: TProp[]
  labels: Record<TProp, LabelInput<TResolveCxt>>
  types?: TTypes
  options?: Partial<{
    [key in TProp as TTypes[key] extends ETemplateType.select ? key : never]: IOptionItem[]
  }>
  readonlys?: Partial<Record<TProp, boolean>>
  /**
   * default error  for each prop
   */
  errors?: Partial<Record<TProp, LabelInput<TResolveCxt>>>
  renders?: Partial<Record<TProp, IRender<TProp>>>
  formItemClassNames?: Partial<Record<TProp, string>>
  formItemLabelClassNames?: Partial<Record<TProp, string>>
  formItemContentClassNames?: Partial<Record<TProp, string>>
}

export type INormalizedCreateFormTemplateProps<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TResolveCxt> = Omit<
  Required<ICreateFormTemplateProps<TProp, TTypes, TResolveCxt>>,
  "labels" | "options" | "errors"
> & {
  labels: Record<TProp, ResolvableValue<TResolveCxt>>
  errors: Record<TProp, ResolvableValue<TResolveCxt>>
  options: Partial<{
    [key in TProp as TTypes[key] extends ETemplateType.select ? key : never]: INomalizedOptionItem<TResolveCxt>[]
  }>
}

/**
 * formTemplate item
 */
export type IFormTemplateItem<TProp extends string, TResolveCxt> = {
  prop: TProp
  label: ResolvableValue<TResolveCxt>
  type: ETemplateType
  option: INomalizedOptionItem<T>[]
  readonly?: boolean
  error: ResolvableValue<TResolveCxt>
  render?: IRender
  formItemClassName?: string
  formItemLabelClassName?: string
  formItemContentClassName?: string
}
/**
 * 推form data type
 */
export type InferShape<TShape extends Record<string, ZodTypeAny>> = {
  [K in keyof TShape]: z.infer<TShape[K]>
}
/**
 * 根据初始值创建Formdata
 */
export type ICreateFormDataProps<TProp extends string, TShape extends Record<TProp, ZodType>> = {
  props: TProp[]
  defaultValues?: Partial<InferShape<TShape>>
  shapes: TShape
  schemaRelations?: (payload: ZodObject) => ZodObject
}
/**
 *hooks参数
 */
export interface IUseFormParam<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>, TResolveCxt> {
  formTemplatePayload: ICreateFormTemplateProps<TProp, TTypes, TResolveCxt>
  formDataPayload: Omit<ICreateFormDataProps<TProp, TShape>, "props">
}

export interface I18nResolveCxt {
  t: ILanguageManager["t"]
}
