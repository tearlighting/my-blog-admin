import { createHookStore } from "@/utils/store/createHookStore"
import { useForm } from "../hooks/useForm"

export const useFormStore = createHookStore(useForm)
