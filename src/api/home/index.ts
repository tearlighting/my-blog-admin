import request from "@/utils/request"
import type { IBannerItem, TFormData } from "home"

export function getBanners() {
  return request<IBannerItem[]>({
    url: "home/banner",
  })
}

export function uploadBannerImg(file: File) {
  return request<{ url: string }>({
    url: "/upload/imgs",
    method: "post",
    data: {
      file,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
function formatBannerItem(item: IBannerItem) {
  const { bigImg, ...others } = item
  return {
    ...others,
    img: bigImg,
  }
}

export function addBanner(data: TFormData) {
  return request({
    url: "/home/banner",
    method: "post",
    data: formatBannerItem(data as any),
  })
}

export function deleteBanner(id: string) {
  return request({
    url: "/home/banner",
    method: "delete",
    data: {
      id,
    },
  })
}

export function updateBanner(data: IBannerItem) {
  return request({
    url: "/home/banner",
    method: "put",
    data: formatBannerItem(data),
  })
}
