import { createHookStore } from "@/utils/store/createHookStore"
import { usePaginationTable } from "../hooks"

export const useTableStore = createHookStore(usePaginationTable)
