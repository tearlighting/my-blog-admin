import request from "@/utils/request"
import type { IBannerItem } from "home"

export function getBanners() {
  return request<IBannerItem[]>({
    url: "home/banner",
  })
}
