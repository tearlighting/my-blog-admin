import { ref, watchEffect } from "vue"

import type { TLocale } from "language"
import { defineStore } from "pinia"

import { en, jp, zh } from "@/constants/locale"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { createLanguageCore, createLanguageManager, createLanguageManagerGlue } from "@/utils"

import pinia from "../store"

const { getValue, setValue } = useLocalStorage<
  "languageCache",
  {
    locale: TLocale
  }
>()

const languageManagerCoreIns = createLanguageCore()
  .register({
    label: "中文",
    value: "zh",
    message: zh,
  })
  .register({
    label: "English",
    value: "en",
    message: en,
  })
  .register({
    label: "日本語",
    value: "jp",
    message: jp,
  })

export const languageManager = createLanguageManagerGlue(languageManagerCoreIns, createLanguageManager)

export const useLanguageStore = defineStore("language", () => {
  const currentLocale = ref(languageManager.currentLocale)
  const languages = ref(languageManager.languages)

  languageManagerCoreIns.setLocale(getValue("languageCache")?.locale || "zh")
  watchEffect(() => {
    setValue("languageCache", {
      locale: currentLocale.value,
    })
  })
  return {
    currentLocale,
    languages,
  }
})

export const useLanguageStoreHooks = () => useLanguageStore(pinia)
