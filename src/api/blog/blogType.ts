import request from "@/utils/request"
import type { IBlogTypeItem } from "blog"

export const getBlogTypes = () => {
  return request<IBlogTypeItem[]>({
    url: "/blog/blogType",
    method: "get",
  })
}

export const updateBlogTypeName = (data: IBlogTypeItem) => {
  return request({
    url: "/blog/blogType",
    method: "put",
    data,
  })
}

export const deleteBlogType = (data: Pick<IBlogTypeItem, "id">) => {
  return request({
    url: `/blog/blogType`,
    method: "delete",
    data,
  })
}

export const addBlogType = (data: Pick<IBlogTypeItem, "name" | "order">) => {
  return request({
    url: "/blog/blogType",
    method: "post",
    data,
  })
}

export const updateBlogTypeOrder = (data: IBlogTypeItem[]) => {
  return request({
    url: "/blog/blogType",
    method: "post",
    data,
  })
}
