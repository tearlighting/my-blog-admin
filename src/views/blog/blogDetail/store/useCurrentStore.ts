import { useLanguageStore } from "@/store"
import { createHookStore } from "@/utils/store/createHookStore"
import type { IBlogTranslation } from "blog"
import { ref } from "vue"

export const useCurrentStore = createHookStore(() => {
  const currrentLang = ref(useLanguageStore().currentLocale)
  const currentTranslation = ref<IBlogTranslation | null>(null)
  const blogId = ref<string | null>(null)
  return {
    currrentLang,
    currentTranslation,
    blogId,
  }
})
