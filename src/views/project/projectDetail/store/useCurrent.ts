import { ref } from "vue"

import type { IProjectTranslation } from "project"

import { useLanguageStore } from "@/store"
import { createHookStore } from "@/utils/store/createHookStore"

export const useCurrentStore = createHookStore(() => {
  const currrentLang = ref(useLanguageStore().currentLocale)
  const currentTranslation = ref<IProjectTranslation | null>(null)
  const projectId = ref<string | null>(null)
  return {
    currrentLang,
    currentTranslation,
    projectId,
  }
})
