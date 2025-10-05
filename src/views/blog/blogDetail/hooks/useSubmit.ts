import { createBlogTranslation, updateBlogTranslation } from "@/api"
import { createFlowMiddleware } from "@/utils"
import type { IBlogTranslation } from "blog"
import type { IFlowMiddlewareHandler } from "middleWare"
import { removeSiteBaseFromMd } from "@/utils/resource"

interface ISumbitCtx {
  payload: Pick<IBlogTranslation, "lang" | "title" | "description" | "blogId"> & { id?: string; markdownContent: string }
}
const handleResouce: IFlowMiddlewareHandler<ISumbitCtx> = async ({ payload }, next) => {
  payload.markdownContent = removeSiteBaseFromMd(payload.markdownContent)
  await next()
}

const updateTranslation: IFlowMiddlewareHandler<ISumbitCtx> = async ({ payload }, next) => {
  if (payload.id) {
    console.log("updateTranslation")

    await updateBlogTranslation(payload as any)
  }
  await next()
}
const createTranslation: IFlowMiddlewareHandler<ISumbitCtx> = async ({ payload }, next) => {
  if (!payload.id) {
    console.log("createTranslation")
    await createBlogTranslation(payload)
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
