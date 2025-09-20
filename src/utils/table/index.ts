export function getTableTemplate<T extends string>({ props, labels }: ITemplifyTableOption<T>): ITemplifyTableItem<T>[] {
  return props.map((prop, i) => {
    const label = labels[i]
    return { label, prop }
  })
}
