import { turn2PageGuard, isLoginGuard, createAuthGuard, createFlowMiddleware } from "@/utils"
import type { NavigationGuardWithThis } from "vue-router"
import router from "."
import { createBeforeEachChangeRecactiveDataMiddleware, createAfterEachChangeRecactiveDataMiddleware } from "./changeReactiveData"

import type { IAllStoreProps } from "@/init"

/**
 * 设置路由守卫
 * @param param0
 */
export function setupRouteGuard<T extends IAllStoreProps>(stores: T) {
  const beforeEachChangeRecactiveDataMiddleware = createBeforeEachChangeRecactiveDataMiddleware(stores)
  const routerBeforeEachMiddleware = createFlowMiddleware<Parameters<NavigationGuardWithThis<any>>>()
    .use(isLoginGuard)
    .use(createAuthGuard(stores.userStore, { path: "/" }))
    .use((ctx, next) => {
      beforeEachChangeRecactiveDataMiddleware.run(ctx)
      next()
    })
    .use(turn2PageGuard)

  router.beforeEach(async (...args) => await routerBeforeEachMiddleware.run(args))

  const afterEachChangeRecactiveDataMiddleware = createAfterEachChangeRecactiveDataMiddleware(stores)
  router.afterEach((...args) => {
    afterEachChangeRecactiveDataMiddleware.run(args)
  })
}
