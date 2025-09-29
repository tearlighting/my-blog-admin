import type { LabelInput } from "templifyFormNew"
import type { ResolvableValue } from "@/utils/templifyFormNew/core"

interface ITemplifyTableOption<TProp extends string, TResolveCtx extends any = any> {
  props: TProp[] | readonly TProp[]
  labels: Record<TProp, LabelInput<TResolveCtx>>
}

interface INormalizedTemplifyTableOption<TProp extends string, TResolveCtx extends any = any> {
  props: TProp[]
  labels: Record<TProp, ResolvableValue<TResolveCtx>>
}

interface ITemplifyTableItem<TProp extends string, TResolveCtx extends any = any> {
  prop: TProp
  label: ResolvableValue<TResolveCtx>
}

type PaginationTable<T> = {
  rows: T[]
  total: number
  page: number
  limit: number
}
