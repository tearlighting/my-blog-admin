import { createHookStore } from "@/utils/store/createHookStore"
import { useOrder } from "../hooks"

export const useOrderStore = createHookStore(useOrder)
