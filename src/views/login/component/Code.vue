<script lang="ts" setup>
import { useLanguage } from "@/hooks/useLanguage";
import { ElInput } from "element-plus"
import type { I18nResolveCxt, IFormTemplateItem } from "templifyFormNew";
import { getCaptcha } from "@/api";
import { ref } from "vue";
interface Props {
	item: IFormTemplateItem<any, I18nResolveCxt, any>
	formData: any
}
defineProps<Props>()
const { t } = useLanguage()

const img = ref<string | null>(null)

const getCode = () => {
	getCaptcha().then(res => {
		if (res.msg) throw new Error(res.msg)
		const uint8 = new Uint8Array(res.data!.data)
		img.value = URL.createObjectURL(new Blob([uint8], { type: 'image/svg+xml' }))
	}).catch(e => console.log(e))
}

getCode()


</script>

<template>
	<ElFormItem :prop="item.prop" :error="item.error.resolve({ t })" :class="item.formItemClassName">
		<template #label>
			<span :class="item.formItemLabelClassName">{{ item.label.resolve({ t }) }}</span>
		</template>
		<div class="size-full flex ">
			<div class="flex-3">
				<ElInput size="large" v-model="formData[item.prop as keyof typeof formData]"
					:class="item.formItemContentClassName"></ElInput>
			</div>
			<div class="flex-2 bg-text/80 hover:cursor-pointer text-text" @click="getCode">
				<img :src="img!" alt="" />
			</div>
		</div>
	</ElFormItem>
</template>
