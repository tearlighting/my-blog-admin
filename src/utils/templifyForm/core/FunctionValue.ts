import { ResolvableValue } from "./ResolvableValue"

export class FunctionValue<T extends any> extends ResolvableValue<T> {
  constructor(private readonly fn: (ctx: T) => string) {
    super()
  }
  resolve(ctx: T) {
    return this.fn(ctx)
  }
}

export const createFunctionResolvor = <T extends any>(fn: (ctx: T) => string) => new FunctionValue(fn)
