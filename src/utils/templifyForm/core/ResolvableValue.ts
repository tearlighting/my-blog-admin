export abstract class ResolvableValue<T extends any = never> {
  abstract resolve(ctx: T): string
}
