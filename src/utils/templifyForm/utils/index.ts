/**
 * function to transform string enum to array for element template
 * @param target string enum
 * @returns
 */
export function stringEnumTransform<T extends Record<string, string>>(target: T, filter?: (key: keyof T) => boolean) {
  const keys = Reflect.ownKeys(target).filter((x) => !filter || filter(x as keyof T)) as Array<keyof T & string>
  const values = Object.fromEntries(keys.map((key) => [key, target[key]])) as unknown as Record<keyof T & string, string>

  return {
    props: keys,
    labels: values,
  }
}

/**
 * unction to transform numberic enum to array for element template
 * @param target numberic enum
 * @returns
 */
export function numericEnumTransform<T extends Record<string, number>>(target: T) {
  const keys = Reflect.ownKeys(target).filter((x) => typeof x !== "number") as Array<keyof T>
  return {
    keys,
  }
}
/**
 * select's options for string enum
 * @param target
 * @param filter
 * @returns
 */
export function stringEnumOptions<T extends Record<string, string>>(target: T, filter?: (key: keyof T) => boolean) {
  const { labels, props } = stringEnumTransform(target, filter)
  return props.map((key, index) => {
    return {
      label: labels[index],
      value: key,
    }
  })
}
