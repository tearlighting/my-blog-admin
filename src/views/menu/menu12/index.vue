<script setup lang="ts">
import { ref } from "vue"
const value = ref("")
</script>

<template>
  <div class="flex size-full items-start justify-center">
    <div class="flex w-100 mt-3 items-center gap-2">
      <span>unKeepAlive</span>
      <el-input v-model="value" />
    </div>
  </div>
</template>

<style lang="less" scoped></style>
