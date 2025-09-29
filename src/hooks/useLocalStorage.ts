export const useLocalStorage = <TKey extends string, TValue extends any>() => {
  const getValue = (key: TKey) => {
    const item = localStorage.getItem(key)
    if (item) {
      return JSON.parse(item) as TValue
    }
    return null
  }
  const setValue = (key: TKey, value: TValue) => {
    localStorage.setItem(key, JSON.stringify(value))
  }
  return {
    getValue,
    setValue,
  }
}
