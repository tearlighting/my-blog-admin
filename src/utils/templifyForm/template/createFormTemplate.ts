import type { ICreateFormTemplateProps, IFormTemplateItem, IOptionItem } from "templifyForm"
import { ETemplateType } from "../constants"

export function createFormTemplate<TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>>(payload: ICreateFormTemplateProps<TProp, TTypes>): IFormTemplateItem<TProp>[] {
  const { props, labels, types, options, readonlys, errors, renders } = normalizeParams(payload)
  return props.map((prop, index) => {
    const label = labels[index]
    const type: ETemplateType = types[prop] ? types[prop] : ETemplateType.input
    const readonly: boolean = readonlys[prop] ? readonlys[prop] : false
    const option: IOptionItem[] = options[prop as keyof typeof options] ? options[prop as keyof typeof options]! : []
    const error: string = errors[prop] ? errors[prop] : ""
    const res = { prop, label, type, readonly, option, error, render: undefined as unknown as () => Object }
    if (renders[prop]) {
      res.render = function () {
        return renders[prop]!(res as any, ...arguments)
      }
    }
    return res
  })
}
const normalizeParams = <TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>>(params: ICreateFormTemplateProps<TProp, TTypes>) => {
  const { props, labels, types = {}, options = {}, readonlys = {}, errors = {}, renders = {} } = params
  if (props.length !== labels.length) throw new Error("props and labels length must be equal")
  return { props, labels, types, options, readonlys, errors, renders } as Required<ICreateFormTemplateProps<TProp, TTypes>>
}
