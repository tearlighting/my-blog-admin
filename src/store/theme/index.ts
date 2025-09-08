import { darkPalette, lightPalette, pastelPalette, neonPalette, forestPalette } from "@/constants"
import { createThemeManager } from "@/utils"
import { defineStore } from "pinia"
import { ref } from "vue"
import pinia from "../store"

export const themeManager = createThemeManager()
  .register({
    value: "light",
    palette: lightPalette,
    labelKey: "theme.light",
  })
  .register({
    value: "dark",
    palette: darkPalette,
    labelKey: "theme.dark",
  })

  .register({
    value: "pastel",
    palette: pastelPalette,
    labelKey: "theme.pastel",
  })

  .register({
    value: "neon",
    palette: neonPalette,
    labelKey: "theme.neon",
  })
  .register({
    value: "forest",
    palette: forestPalette,
    labelKey: "theme.forest",
  })

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref(themeManager.current)
  const themes = ref(themeManager.themes)
  const setTheme = (theme: Parameters<typeof themeManager.setTheme>[0]) => {
    themeManager.setTheme(theme)
    currentTheme.value = theme
  }
  return {
    currentTheme,
    themes,
    setTheme,
  }
})

export const useThemeStoreHook = () => useThemeStore(pinia)
