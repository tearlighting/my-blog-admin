import type { IRouteGuarder } from "router"
/**
 * 登录直接放行
 * @param param0
 * @param next
 */
export const isLoginGuard: IRouteGuarder = async ([to, _, routerNext], next) => {
  if (to.name === "login" || to.name === "waitingLogin") {
    routerNext()
  } else {
    next()
  }
}
