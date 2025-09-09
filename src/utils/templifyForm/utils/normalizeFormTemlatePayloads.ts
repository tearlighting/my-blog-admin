import type { ICreateFormTemplateProps, INormalizedCreateFormTemplateProps, LabelInput } from "templifyForm"
import { createFunctionResolvor, createStaticResolvor, ResolvableValue } from "../core"
import { ETemplateType } from "../constants"
import { createSyncTransformMiddleWare } from "../../middleware"

export const wrapToResolvable = <T = any>(value: LabelInput): ResolvableValue<T> => {
  if (value instanceof ResolvableValue) return value
  if (typeof value === "function") return createFunctionResolvor(value)
  return createStaticResolvor(value)
}

const labelsTransform = (payload: ICreateFormTemplateProps<string, any, any>) => {
  const { labels } = payload
  for (let key in labels) {
    labels[key] = wrapToResolvable(labels[key])
  }
  return payload
}
const errorsTransform = (payload: ICreateFormTemplateProps<string, any, any>) => {
  const { errors, props } = payload
  for (let prop of props) {
    errors![prop] = wrapToResolvable(errors![prop] ?? "")
  }
  return payload
}

const optionsTransform = (payload: ICreateFormTemplateProps<string, any, any>) => {
  const { options, types, props } = payload
  for (let prop of props) {
    if (types[prop] === ETemplateType.select) {
      options![prop] = (options![prop] || []).map((item) => {
        return {
          label: wrapToResolvable(item.label),
          value: item.value,
        }
      })
    }
  }
  return payload
}
const transformer = createSyncTransformMiddleWare<ICreateFormTemplateProps<string, any, any>>().use(labelsTransform).use(errorsTransform).use(optionsTransform)

export const normalizeFormTemlatePayloads = <TProp extends string, TTypes extends Partial<Record<TProp, ETemplateType>>, TResolveCxt = any>(
  params: ICreateFormTemplateProps<TProp, TTypes, TResolveCxt>
) => {
  const { props, labels, types = {}, options = {}, readonlys = {}, errors = {}, renders = {}, formItemClassNames = {}, formItemContentClassNames = {}, formItemLabelClassNames = {} } = params
  if (props.length !== Object.keys(labels).length) throw new Error("props and labels length must be equal")

  const res = {
    props,
    labels,
    types,
    options,
    readonlys,
    errors,
    renders,
    formItemClassNames,
    formItemContentClassNames,
    formItemLabelClassNames,
  }
  return transformer.run(res) as INormalizedCreateFormTemplateProps<TProp, TTypes, TResolveCxt>
}
