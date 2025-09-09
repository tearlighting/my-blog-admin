<script setup lang="ts">
import { useAppStore } from "@/store"
import ControllerContainer from "../NavBar/ControllerContainer.vue"
import { EIcons } from "@/constants/icons"
import SvgIcon from "../SvgIcon/index.vue"
import { ElDrawer } from "element-plus"
import { ref } from "vue"

interface ISettingsProp {
  class?: string
  svgClass?: string
}

defineProps<ISettingsProp>()
const { settings } = useAppStore()
const showDrawer = ref(false)
</script>

<template>
  <div role="settings" :class="class" class="">
    <ControllerContainer v-if="settings.showSettings" class="bg-primary/90! rounded-l-xl! active:text-btn-text! group/settings">
      <SvgIcon :name="EIcons.Setting" class="group-hover/settings:text-btn-text! text-btn-text/80" :class="svgClass" @click="showDrawer = true"></SvgIcon>
    </ControllerContainer>
  </div>
  <el-drawer v-model="showDrawer" :with-header="false" direction="rtl" size="300" :append-to-body="false">
    <div class="w-full"></div>
  </el-drawer>
</template>

<style lang="less" scoped></style>
