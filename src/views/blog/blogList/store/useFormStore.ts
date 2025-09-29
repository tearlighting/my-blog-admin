import { createHookStore } from "@/utils/store/createHookStore"
import { useForm } from "../hooks"

export const useFormStore = createHookStore(useForm)
