import { ELoginStatus, EPemission } from "@/constants"
import { useUserStoreHook } from "@/store/user"
import type { IRouteGuarder } from "router"
import type { RouteLocationRaw } from "vue-router"

export const createAuthGuard = <T extends ReturnType<typeof useUserStoreHook>, R extends RouteLocationRaw>(userStore: T, redirect: R) => {
  const authGuard: IRouteGuarder = async ([to, _, routerNext], next) => {
    const { roles } = to.meta
    // console.log(roles, userStore.userInfo)

    if (userStore.hasPemission(roles as EPemission[])) {
      next()
      return
    }

    // 未登录
    if (userStore.userInfo.loginStatus === ELoginStatus.unlogin) {
      console.log("未登录")

      routerNext({ name: "login" })
      return
    }

    // 登录中
    if (userStore.userInfo.loginStatus === ELoginStatus.logining) {
      routerNext({
        name: "waitingLogin",
        params: { name: to.name as string, params: JSON.stringify(to.params) },
      })
      return
    }

    // 已登录但无权限 → 跳首页
    if (userStore.userInfo.loginStatus === ELoginStatus.logined) {
      routerNext(redirect)
      return
    }
  }
  return authGuard
}
