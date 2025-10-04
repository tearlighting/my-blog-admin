import { createBlogTranslation, updateBlogTranslation } from "@/api"
import { createFlowMiddleware } from "@/utils"
import type { IBlogTranslation } from "blog"
import type { IFlowMiddlewareHandler } from "middleWare"

interface ISumbitCtx {
  payload: Pick<IBlogTranslation, "lang" | "toc" | "htmlContent" | "title" | "description" | "blogId"> & { id?: string }
}
const updateTranslation: IFlowMiddlewareHandler<ISumbitCtx> = async ({ payload }, next) => {
  if (payload.id) {
    await updateBlogTranslation(payload as any)
  }
  await next()
}
const createTranslation: IFlowMiddlewareHandler<ISumbitCtx> = async ({ payload }, next) => {
  if (!payload.id) {
    await createBlogTranslation(payload)
  }
  await next()
}
const sumbitMiddleware = createFlowMiddleware<ISumbitCtx>().use(createTranslation).use(updateTranslation)

export const useSubmit = () => {
  const sumbit = (ctx: ISumbitCtx) => {
    return sumbitMiddleware.run(ctx)
  }
  return {
    sumbit,
  }
}
