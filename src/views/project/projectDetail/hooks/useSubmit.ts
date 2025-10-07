import type { IFlowMiddlewareHandler } from "middleWare"
import type { IProjectTranslation } from "project"

import { createProjectTranslation, updateProjectTranslation } from "@/api"
import { createFlowMiddleware } from "@/utils"
import { removeSiteBaseFromMd } from "@/utils/resource"
import { useCurrentStore } from "../store"
interface ISumbitCtx {
  payload: Pick<IProjectTranslation, "lang" | "title" | "description" | "projectId"> & { id?: string; markdownContent: string }
}
const handleResouce: IFlowMiddlewareHandler<ISumbitCtx> = async ({ payload }, next) => {
  payload.markdownContent = removeSiteBaseFromMd(payload.markdownContent)
  await next()
}

const updateTranslation: IFlowMiddlewareHandler<ISumbitCtx> = async ({ payload }, next) => {
  console.log(payload)

  if (payload.id) {
    console.log("updateTranslation")
    await updateProjectTranslation(payload as any)
  }
  await next()
}
const createTranslation: IFlowMiddlewareHandler<ISumbitCtx> = async ({ payload }, next) => {
  if (!payload.id) {
    console.log("createTranslation")
    const row = await createProjectTranslation(payload)
    if (row.msg) throw new Error(row.msg)
    useCurrentStore().currentTranslation.value!.id = row.data.id
  }
  await next()
}
const sumbitMiddleware = createFlowMiddleware<ISumbitCtx>().use(handleResouce).use(createTranslation).use(updateTranslation)

export const useSubmit = () => {
  const sumbit = (ctx: ISumbitCtx) => {
    return sumbitMiddleware.run(ctx)
  }
  return {
    sumbit,
  }
}
