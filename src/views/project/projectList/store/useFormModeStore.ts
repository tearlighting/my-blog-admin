import { createHookStore } from "@/utils/store/createHookStore"
import { EFormSubmitMode } from "../constants"
import { ref } from "vue"

export const useFormModeStore = createHookStore(() => {
  const formMode = ref(EFormSubmitMode.update)
  const setFormMode = (mode: EFormSubmitMode) => {
    formMode.value = mode
  }
  return {
    formMode,
    setFormMode,
  }
})
