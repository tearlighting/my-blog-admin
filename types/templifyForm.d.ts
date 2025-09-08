import type { ETemplateType } from "@/utils/templifyForm/constants/templateType"
import type { ZodObject, ZodType } from "zod"
import type { createFormTemplate } from "@/utils"

export type IOptionItem = {
  label: string
  value: string
}
export type IFormItem = ReturnType<typeof createFormTemplate>
export type IRender = (item: IFormItem, ...args: any[]) => Object

export type ICreateFormTemplateProps<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>> = {
  props: TProp[]
  labels: string[]
  types?: TTypes
  options?: Partial<{
    [key in TProp as TTypes[key] extends ETemplateType.select ? key : never]: IOptionItem[]
  }>
  readonlys?: Partial<Record<TProp, boolean>>
  /**
   * default error  for each prop
   */
  errors?: Partial<Record<TProp, string>>
  renders?: Partial<Record<TProp, IRender>>
}

export type IFormTemplateItem<TProp extends string> = {
  prop: TProp
  label: string
  type: ETemplateType
  options?: IOptionItem[]
  readonly?: boolean
  error?: string
  render?: IRender
}

export type ICreateFormDataProps<TProp extends string, TShape extends Record<TProp, ZodType>> = {
  props: TProp[]
  defaultValues?: Partial<Record<TProp, string>>
  shapes: TShape
  schemaRelations?: (payload: ZodObject) => ZodObject
}

export interface IUSeFormParam<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TShape extends Record<TProp, ZodType>> {
  formTemplatePayload: ICreateFormTemplateProps<TProp, TTypes>
  formDataPayload: Omit<ICreateFormDataProps<TProp, TShape>, "props">
}
