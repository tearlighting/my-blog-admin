import { ResolvableValue } from "./ResolvableValue"

export class StaticValue extends ResolvableValue {
  constructor(private _value: string) {
    super()
  }
  resolve() {
    return this._value
  }
}
export const createStaticResolvor = (v: string) => new StaticValue(v)
