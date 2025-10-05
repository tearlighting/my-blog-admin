import request from "@/utils/request"
import type { IBlogItem, IBlogTranslation } from "blog"

export const getBlogDetailById = (id: string) => {
  return request<IBlogItem>({
    url: `/blog/detail/${id}`,
    method: "GET",
  })
}

export const updateBlogTranslation = (data: Pick<IBlogTranslation, "id" | "title" | "description"> & { markdownContent: string }) => {
  return request<IBlogItem>({
    url: "/blog/blogTranslation",
    method: "put",
    data,
  })
}

export const createBlogTranslation = (data: Pick<IBlogTranslation, "lang" | "blogId" | "title" | "description"> & { markdownContent: string }) => {
  return request<IBlogItem>({
    url: "/blog/blogTranslation",
    method: "POST",
    data,
  })
}
