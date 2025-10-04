import request from "@/utils/request"
import type { IBlogItem, IBlogTranslation } from "blog"

export const getBlogDetailById = (id: string) => {
  return request<IBlogItem>({
    url: `/blog/detail/${id}`,
    method: "GET",
  })
}

export const updateBlogTranslation = (data: Pick<IBlogTranslation, "id" | "toc" | "htmlContent" | "title" | "description">) => {
  return request<IBlogItem>({
    url: "/blog/blogTranslation",
    method: "POST",
    data,
  })
}

export const createBlogTranslation = (data: Pick<IBlogTranslation, "lang" | "blogId" | "toc" | "htmlContent" | "title" | "description">) => {
  return request<IBlogItem>({
    url: "/blog/blogTranslation",
    method: "POST",
    data,
  })
}
