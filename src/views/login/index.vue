<script setup lang="ts">
import { useLanguage } from "@/hooks/useLanguage"
import { useForm } from "./useForm"
import TemplifyForm from "@/components/TemplifyForm/index.vue"
const { formData, formTemplate, enableAutoValidate } = useForm()
enableAutoValidate()
const { t } = useLanguage()
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-bg text-text">
    <div class="w-full max-w-md p-8 rounded-2xl shadow-md bg-card-bg border border-border">
      <!-- 标题 -->
      <h1 class="text-2xl font-bold text-center mb-6 text-primary">{{ t("siteName") }}</h1>
      <TemplifyForm :template="formTemplate" :form-data="formData"></TemplifyForm>
      <!-- 登录按钮 -->
      <button class="w-full py-2 px-4 rounded-lg bg-primary text-invert font-medium shadow hover:bg-primary/90 transition-colors">Login</button>
      <!-- 额外操作 -->
      <div class="flex justify-between mt-4 text-sm text-muted">
        <a href="#" class="hover:text-primary transition-colors">Forgot password?</a>
        <a href="#" class="hover:text-primary transition-colors">Register</a>
      </div>
    </div>
  </div>
</template>
