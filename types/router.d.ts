import { NavigationGuardWithThis, RouteRecordRaw, NavigationHookAfter } from "vue-router"
import { EPemission } from "@/store/pemission"
import type { EIcons } from "@/constants/icons"
import type { en } from "@/constants/locale"
import { NestedKeys } from "language"

type BaseMeta = {
  keepAlive?: boolean
  roles: EPemission[]
  icon?: EIcons
  externalLink?: string
}

type TI18nSetting = { title: string; titleKey?: never } | { title?: never; titleKey: NestedKeys<typeof en> }

type TRouteHidden = { hidden: true } & Partial<TI18nSetting>

export type TRouteShow = { hidden?: false } & TI18nSetting

export type StrictMeta = BaseMeta & (TRouteHidden | TRouteShow)

export type AppRoute = Omit<RouteRecordRaw, "meta" | "children"> & {
  /**
   * 路由元信息
   */
  meta: StrictMeta
  children?: AppRoute[]
}

export interface IRouteGuarder {
  (routerPayload: Parameters<NavigationGuardWithThis<any>>, next: () => Promise<void>): void | Promise<void>
}

export interface IRouteAfter {
  (routerPayload: Parameters<NavigationHookAfter>, next: () => Promise<void>): void | Promise<void>
}
