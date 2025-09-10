export interface IResolvableValueRestable {
  rest(): void
  show(): void
}

export const isResolvableValueRestable = (obj: any): obj is IResolvableValueRestable => {
  return obj?.rest && typeof obj.rest === "function" && obj?.show && typeof obj.show === "function"
}
