import { createHookStore } from "@/utils/store/createHookStore"
import { useDialog } from "@/views/home/hooks"

export const useDialogStore = createHookStore(useDialog)
