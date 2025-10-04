import { createHookStore } from "@/utils/store/createHookStore"
import { useBlogDetail } from "../hooks"

export const useBlogDetailStore = createHookStore(useBlogDetail)
