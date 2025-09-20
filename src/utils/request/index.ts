import { getAuthorization, setAuthorization } from "@/hooks/useAuthorization"
import { useLoadings } from "@/hooks/useLoadings"
import axios, { type AxiosRequestConfig } from "axios"

const { hideLoading, showLoading } = useLoadings()
function createRequest({ baseURL, timeout = 5000 }: AxiosRequestConfig = {}) {
  const instance = axios.create({
    baseURL,
    timeout,
  })

  instance.interceptors.request.use((config) => {
    showLoading()
    const token = getAuthorization()
    if (token) {
      config.headers.authorization = token
    }
    //cors sessinID统一
    config.withCredentials = true
    return config
  })
  instance.interceptors.response.use((response) => {
    hideLoading()
    setAuthorization(response!.headers as any)
    return response.data
  })

  function request<T>(config: AxiosRequestConfig) {
    const defaultConfig: AxiosRequestConfig = {
      headers: {},
    }
    return instance({ ...defaultConfig, ...config }) as Promise<IResponse<T>>
  }

  return { request }
}

const { request } = createRequest({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

export default request
