<script setup lang="ts">
import { useLanguage } from "@/hooks/useLanguage"
import { useForm } from "./useForm"
import TemplifyForm from "@/components/TemplifyForm/index.vue"
import { watch } from "vue"
import { ElButton } from "element-plus"
const { formData, formTemplate, enableAutoValidate, isValid, reset } = useForm()

enableAutoValidate()
const { t } = useLanguage()

watch(
  () => isValid.value,
  () => {
    console.log(isValid.value)
  }
)
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-bg text-text">
    <div class="w-full max-w-md p-8 rounded-2xl shadow-md bg-card-bg border border-border">
      <!-- 标题 -->
      <h1 class="text-2xl font-bold text-center mb-6 text-primary">{{ t("siteName") }}</h1>
      <TemplifyForm :template="formTemplate" :form-data="formData"></TemplifyForm>
      <!-- 登录按钮 -->
      <el-button class="w-full" type="primary" :disabled="!isValid">Login</el-button>
      <el-button class="w-full mt-10" type="primary" @click="() => reset()">reset</el-button>

      <!-- 额外操作 -->
      <div class="flex justify-between mt-4 text-sm text-muted">
        <a href="#" class="hover:text-primary transition-colors">Forgot password?</a>
        <a href="#" class="hover:text-primary transition-colors">Register</a>
      </div>
    </div>
  </div>
</template>
