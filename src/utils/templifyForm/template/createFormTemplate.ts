import type { ICreateFormTemplateProps, IFormTemplateItem, IOptionItem, IRender } from "templifyForm"
import { ETemplateType } from "../constants"

export function createFormTemplate<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>>(payload: ICreateFormTemplateProps<TProp, TTypes>): IFormTemplateItem<TProp>[] {
  const { props, labels, types, options, readonlys, errors, renders, formItemClassNames, formItemContentClassNames, formItemLabelClassNames } = normalizeParams(payload)
  return props.map((prop, index) => {
    const label = labels[index]
    const type: ETemplateType = types[prop] ?? ETemplateType.input
    const readonly: boolean = readonlys[prop] ?? false
    const option: IOptionItem[] = options[prop as keyof typeof options] ?? []
    const error: string = errors[prop] ?? ""
    const formItemClassName = formItemClassNames[prop] ?? ""
    const formItemContentClassName = formItemContentClassNames[prop] ?? ""
    const formItemLabelClassName = formItemLabelClassNames[prop] ?? ""
    const res = {
      prop,
      label,
      type,
      readonly,
      option,
      error,
      formItemClassName,
      formItemContentClassName,
      formItemLabelClassName,
      render: undefined as unknown as IRender,
    }
    if (renders[prop]) {
      res.render = function (...args: any[]) {
        return renders[prop]!(res as any, ...args)
      }
    }
    return res
  })
}
const normalizeParams = <TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>>(params: ICreateFormTemplateProps<TProp, TTypes>) => {
  const { props, labels, types = {}, options = {}, readonlys = {}, errors = {}, renders = {}, formItemClassNames = {}, formItemContentClassNames = {}, formItemLabelClassNames = {} } = params
  if (props.length !== labels.length) throw new Error("props and labels length must be equal")
  return { props, labels, types, options, readonlys, errors, renders, formItemClassNames, formItemContentClassNames, formItemLabelClassNames } as Required<ICreateFormTemplateProps<TProp, TTypes>>
}
