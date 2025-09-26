import { createHookStore } from "@/utils/store/createHookStore"
import { useTable } from "../hooks/useTable"

export const useTableStore = createHookStore(useTable)
