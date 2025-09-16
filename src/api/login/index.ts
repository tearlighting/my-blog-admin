import request from "@/utils/request"

export const getCaptcha = () => {
  return request<Buffer>({
    url: "captcha",
    //想要共享sessionid，需要api统一带cookie
    withCredentials: true,
  })
}
