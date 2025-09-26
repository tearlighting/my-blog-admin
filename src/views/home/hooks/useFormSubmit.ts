import type { IBannerItem, TFormData } from "home"
import { useFormModeStore } from "../store"
import { createFlowMiddleware } from "@/utils"
import type { UploadUserFile } from "element-plus"
import { uploadBannerImg, updateBanner, addBanner } from "@/api"
import type { IFlowMiddlewareHandler } from "middleWare"
import { EFormSubmitMode } from "../constants"

interface ISumbitCtx {
  formData: TFormData
  fileList: UploadUserFile[]
  extras: Omit<IBannerItem, keyof TFormData>
}

const uploadImg: IFlowMiddlewareHandler<ISumbitCtx> = async ({ fileList, formData }, next) => {
  const files = fileList.filter((x) => x.raw).map((item) => item.raw!)

  try {
    if (files.length) {
      const res = await uploadBannerImg(files[0])
      if (res.msg) throw new Error(res.msg)
      formData.bigImg = res.data.url
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
      const res = await updateBanner({ ...formData, ...extras })
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
      const res = await addBanner(formData)
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
