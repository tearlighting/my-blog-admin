const copy = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false)
}
export function useCopy() {
  return {
    copy,
  }
}
