import type { IBlogItem, TBlogForm } from "blog"
import { useFormModeStore } from "../store"
import { createFlowMiddleware } from "@/utils"
import type { UploadUserFile } from "element-plus"
import { uploadImg as uploadImgApi, uploadBlogItem, createBlogItem } from "@/api"
import type { IFlowMiddlewareHandler } from "middleWare"
import { EFormSubmitMode } from "../constants"

interface ISumbitCtx {
  formData: TBlogForm
  fileList: UploadUserFile[]
  extras: Omit<IBlogItem, Exclude<keyof TBlogForm, "">>
}

const uploadImg: IFlowMiddlewareHandler<ISumbitCtx> = async ({ fileList, formData }, next) => {
  const files = fileList.filter((x) => x.raw).map((item) => item.raw!)

  try {
    if (files.length) {
      const res = await uploadImgApi(files[0])
      if (res.msg) throw new Error(res.msg)
      formData.thumb = res.data.url
    }
    await next()
  } catch (err) {
    throw new Error("upload img fail")
  }
}

const updateForm: IFlowMiddlewareHandler<ISumbitCtx> = async ({ formData, extras }, next) => {
  const { formMode } = useFormModeStore()
  if (formMode.value === EFormSubmitMode.update) {
    try {
      const { commentNumber, scanNumber, id } = extras
      const res = await uploadBlogItem({ ...formData, scanNumber, commentNumber, id })
      if (res.msg) throw new Error(res.msg)
    } catch (err) {
      throw new Error("update form fail")
    }
  }
  await next()
}

const addForm: IFlowMiddlewareHandler<ISumbitCtx> = async ({ formData }, next) => {
  const { formMode } = useFormModeStore()
  if (formMode.value === EFormSubmitMode.create) {
    try {
      const res = await createBlogItem(formData)
      if (res.msg) throw new Error(res.msg)
    } catch (err) {
      throw new Error("add form fail")
    }
  }
  await next()
}

const sumbitMiddleware = createFlowMiddleware<ISumbitCtx>().use(uploadImg).use(updateForm).use(addForm)

export const useFormSubmit = () => {
  const sumbit = (ctx: ISumbitCtx) => {
    return sumbitMiddleware.run(ctx)
  }
  return {
    sumbit,
  }
}
