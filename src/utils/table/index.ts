import type { ITemplifyTableItem, ITemplifyTableOption, INormalizedTemplifyTableOption } from "table"
import { createSyncTransformMiddleWare } from "../middleware"
import { toResolvable } from "../templifyFormNew"
import type { I18nResolveCxt } from "templifyFormNew"

const labelsTransform = (payload: ITemplifyTableOption<string>) => {
  const { labels, props } = payload
  for (let prop of props) {
    labels[prop] = toResolvable(labels[prop])
  }
  return payload as INormalizedTemplifyTableOption<string>
}
const transformer = createSyncTransformMiddleWare<ITemplifyTableOption<string>>().use(labelsTransform)
export function createTableTemplate<TProp extends string, TResolveCtx = any>(payload: ITemplifyTableOption<TProp, TResolveCtx>): ITemplifyTableItem<TProp, TResolveCtx>[] {
  const { props, labels } = transformer.run(payload) as INormalizedTemplifyTableOption<TProp, TResolveCtx>
  return props.map((prop) => {
    const label = labels[prop]
    return { label, prop }
  })
}

export const generateCreateTableTemplate = <TResolveCxt>() => {
  return function <TProp extends string>(payload: ITemplifyTableOption<TProp, TResolveCxt>) {
    return createTableTemplate<TProp, TResolveCxt>(payload)
  }
}

export const createTableTemplateResolverI18n = generateCreateTableTemplate<I18nResolveCxt>()
