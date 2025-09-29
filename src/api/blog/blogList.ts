import request from "@/utils/request"
import type { IBlogItem } from "blog"
import type { TLocale } from "language"
import type { PaginationTable } from "table"

interface IGetBlogItemsProps {
  limit: number
  page: number
  id?: number
  type?: TLocale
}
export const getBlogItems = ({ limit, page, id = -1 }: IGetBlogItemsProps) => {
  return request<PaginationTable<IBlogItem>>({
    url: "/blog",
    method: "get",
    params: {
      limit,
      page,
      id,
    },
  })
}

export const uploadBlogItem = (
  data: Omit<IBlogItem, "category" | "translations"> & {
    category: string
  }
) => {
  return request<boolean>({
    url: "/blog",
    method: "put",
    data: {
      ...data,
      blogTypeId: data.category,
    },
  })
}

export const createBlogItem = ({
  thumb,
  category: blogTypeId,
}: Pick<IBlogItem, "thumb"> & {
  category: string
}) => {
  return request<IBlogItem>({
    url: "/blog",
    method: "post",
    data: {
      thumb,
      blogTypeId,
    },
  })
}

export const deleteBlogItem = (id: string) => {
  return request<boolean>({
    url: "/blog",
    method: "delete",
    data: {
      id,
    },
  })
}
