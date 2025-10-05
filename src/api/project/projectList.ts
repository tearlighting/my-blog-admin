import request from "@/utils/request"
import type { IProjectItem } from "project"
import type { PaginationTable } from "table"

interface IGetBlogItemsProps {
  limit: number
  page: number
  id?: number
}
export const getProjectItems = ({ limit, page }: IGetBlogItemsProps) => {
  return request<PaginationTable<IProjectItem>>({
    url: "/project",
    method: "get",
    params: {
      limit,
      page,
    },
  })
}

export const uploadProjectItem = (data: Omit<IProjectItem, "translations">) => {
  return request<boolean>({
    url: "/project",
    method: "put",
    data,
  })
}

export const createProjectItem = ({ thumb }: Pick<IProjectItem, "thumb">) => {
  return request<IProjectItem>({
    url: "/project",
    method: "post",
    data: {
      thumb,
    },
  })
}

export const deleteProjectItem = (id: string) => {
  return request<boolean>({
    url: "/project",
    method: "delete",
    data: {
      id,
    },
  })
}
