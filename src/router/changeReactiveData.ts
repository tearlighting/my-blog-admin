import type { IAllStoreProps } from "@/init"
import { createFlowMiddleware, findMenuCurrent } from "@/utils"
import type { IRouteGuarder } from "router"
import type { NavigationGuardWithThis } from "vue-router"

export function createChangeRecactiveDataMiddleware<T extends IAllStoreProps>({ routeStore, tagViewStore }: T) {
  const changeCurrentRoute: IRouteGuarder = ([to], next) => {
    const menuName = findMenuCurrent(to, routeStore.displayRoutes)
    if (menuName) {
      routeStore.setCurrent(menuName)
    } else {
      console.error("don't find menu ", to, routeStore.displayRoutes)
    }
    next()
  }

  const changeCurrentTagView: IRouteGuarder = ([to], next) => {
    const name = to.name as string
    name && tagViewStore.setCurrent(name)
    next()
  }

  const changeRecactiveDataMiddleware = createFlowMiddleware<Parameters<NavigationGuardWithThis<any>>>().use(changeCurrentRoute).use(changeCurrentTagView)
  return changeRecactiveDataMiddleware
}
