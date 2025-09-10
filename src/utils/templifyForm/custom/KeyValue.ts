import type { I18nResolveCxt } from "templifyForm"
import { ResolvableValue } from "../core/ResolvableValue"
import type { ISetKey } from "./ISetKey"
import type { IResolvableValueRestable } from "../core"

export class KeyValue<T extends I18nResolveCxt> extends ResolvableValue<T> implements ISetKey {
  constructor(private _key: string) {
    super()
  }
  setKey(key: string): void {
    this._key = key
  }
  get key(): string {
    return this._key
  }
  resolve(ctx: T): string {
    return this._key && ctx.t(this._key as any)
  }
}

export class KeyValueRestable<T extends I18nResolveCxt> extends KeyValue<T> implements IResolvableValueRestable {
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

export const i18nKey = <T extends I18nResolveCxt>(key: string = ""): KeyValueRestable<T> => {
  return new KeyValueRestable(key)
}

export const isI18nKey = (value: any): value is KeyValue<I18nResolveCxt> => {
  return value instanceof KeyValue
}

export const hackI18nKey = <T extends ResolvableValue>(value: T, key?: string): void => {
  value && isI18nKey(value) && value.setKey(key ?? "")
}
/**
 * 生成新的ResolvableValue，主要是为了vue的更新，我暂时不行手动更新组件
 * @param item
 * @param itemKey
 * @param key
 * @returns
 */
export const hackI18nKeyWithNewObj = <T extends Record<string, any>, TKey extends keyof T>(item: T, itemKey: TKey, key: string = ""): void => {
  const value = item[itemKey] as unknown
  if (value && isI18nKey(value)) {
    if (value.key === key) return
    item[itemKey] = i18nKey(key) as any
  }
}
