import request from "@/utils/request"
import type { IUser, TLoginForm } from "login"

export const getCaptcha = () => {
  return request<{ data: Buffer }>({
    url: "/captcha",
    //想要共享sessionid，需要api统一带cookie
    withCredentials: true,
  })
}

export const login = <T extends TLoginForm>({ userName: loginId, password: loginPwd, code: captcha }: T) => {
  return request<IUser>({
    method: "post",
    url: "login",
    data: {
      loginId,
      loginPwd,
      captcha,
      remember: 1,
    },
    withCredentials: true,
  })
}
export const whoAmI = async () => {
  return request<IUser>({
    url: "whoAmI",
    method: "get",
    withCredentials: true,
  })
}
