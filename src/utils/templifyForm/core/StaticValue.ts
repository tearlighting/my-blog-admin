import type { IResolvableValueRestable } from "./IResolvableValueRestable"
import { ResolvableValue } from "./ResolvableValue"

export class StaticValue extends ResolvableValue {
  constructor(private _value: string) {
    super()
  }
  resolve() {
    return this._value
  }
}

export class StaticValueRestable extends StaticValue implements IResolvableValueRestable {
  private _isResting = false
  rest() {
    this._isResting = true
  }
  show(): void {
    this._isResting = false
  }
  resolve(): string {
    if (this._isResting) return ""
    return super.resolve()
  }
}
export const createStaticResolvor = (v: string) => new StaticValue(v)
export const createStaticResolvorRestable = (v: string) => new StaticValueRestable(v)
