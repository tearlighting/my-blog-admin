interface ITemplifyTableOption<T extends string> {
  props: T[] | readonly T[]
  labels: string[]
}

interface ITemplifyTableItem<T extends string> {
  prop: T
  label: string
}
