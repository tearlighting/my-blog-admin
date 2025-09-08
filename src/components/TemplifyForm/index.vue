<script setup lang="ts">
import { ElForm, ElInput } from "element-plus"
import type { IFormTemplateItem } from "templifyForm"

interface ITemplifyFormProps<TProps extends string = string> {
  template: IFormTemplateItem<TProps>[]
  formData: Record<TProps, any>
}
const props = defineProps<ITemplifyFormProps>()
</script>

<template>
  <div role="templify-form" class="size-full">
    <ElForm>
      <ElFormItem v-for="item of props.template" :key="item.prop" :prop="item.prop" :error="item.error">
        <template v-slot:label>
          <label>{{ item.label }}</label>
        </template>
        <ElInput v-model="formData[item.prop]"></ElInput>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="less" scoped></style>
