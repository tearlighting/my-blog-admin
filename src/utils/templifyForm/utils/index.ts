export function stringEnum2Template<T extends Record<string, string>>(payload: T) {
  const props = Object.keys(payload) as EnumKey<T>[]
  const labels = Object.values(payload) as EnumValue<T>[]
  return {
    props,
    labels,
  }
}
