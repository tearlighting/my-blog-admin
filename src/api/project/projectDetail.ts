import request from "@/utils/request"
import type { IProjectItem, IProjectTranslation } from "project"

export const getProjectDetailById = (id: string) => {
  return request<IProjectItem>({
    url: `/project/detail/${id}`,
    method: "GET",
  })
}

export const updateProjectTranslation = (data: Pick<IProjectTranslation, "id" | "title" | "description"> & { markdownContent: string }) => {
  return request<IProjectItem>({
    url: "/project/projectTranslation",
    method: "put",
    data,
  })
}

export const createProjectTranslation = (data: Pick<IProjectTranslation, "lang" | "projectId" | "title" | "description"> & { markdownContent: string }) => {
  return request<IProjectItem>({
    url: "/project/projectTranslation",
    method: "POST",
    data,
  })
}
