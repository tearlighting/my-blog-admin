import type { IResolvableValueRestable } from "./IResolvableValueRestable"
import { ResolvableValue } from "./ResolvableValue"

export class FunctionValue<T extends any> extends ResolvableValue<T> {
  constructor(private readonly fn: (ctx: T) => string) {
    super()
  }
  resolve(ctx: T) {
    return this.fn(ctx)
  }
}

export class FunctionValueRestable<T> extends FunctionValue<T> implements IResolvableValueRestable {
  private _isResting = false
  rest() {
    this._isResting = true
  }
  show(): void {
    this._isResting = false
  }
  resolve(ctx: T): string {
    if (this._isResting) return ""
    return super.resolve(ctx)
  }
}

export const createFunctionResolvor = <T extends any>(fn: (ctx: T) => string) => new FunctionValue(fn)
export const createFunctionResolvorRestable = <T>(fn: (ctx: T) => string) => new FunctionValueRestable(fn)
