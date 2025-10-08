import { reactive, ref, watch } from "vue"

import { defineStore } from "pinia"

import { useLocalStorage } from "@/hooks/useLocalStorage"

import pinia from "../store"
import { getDevice, getDeviceType, Settings } from "./tools"

const { getValue, setValue } = useLocalStorage<
  "appSettings",
  {
    settings: Settings
  }
>()

export const useAppStore = defineStore("app", () => {
  const device = ref(getDevice())
  const settings = reactive(getValue("appSettings")?.settings ?? new Settings())
  const deviceType = ref(getDeviceType(device.value))
  function updateDevice() {
    device.value = getDevice()
    deviceType.value = getDeviceType(device.value)
  }

  watch(
    () => settings,
    () => {
      setValue("appSettings", { settings })
    },
    { deep: true }
  )

  window.addEventListener("resize", updateDevice)

  return {
    device,
    updateDevice,
    settings,
    deviceType,
  }
})

export const useAppStoreHook = () => useAppStore(pinia)
