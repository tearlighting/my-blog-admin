import { createHookStore } from "@/utils/store/createHookStore"
import { useDialog } from "../hooks/useDialog"

export const useDialogStore = createHookStore(useDialog)
