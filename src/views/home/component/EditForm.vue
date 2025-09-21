<script lang="ts" setup>
import { useForm } from "../settings/form"
import TemplifyForm from "@/components/TemplifyForm/index.vue"
import { ElButton, ElFormItem, type UploadUserFile } from "element-plus"
import ImgUploader from "@/components/ImgUploader/index.vue"

import type { IBannerItem } from "home"
import { computed, nextTick, onMounted, watch } from "vue"
import { useLanguage } from "@/hooks/useLanguage"

interface Props {
	currentFormData: IBannerItem | null
}
const props = defineProps<Props>()

const { enableAutoValidate, formData, formTemplate, isValid, reset } = useForm()

onMounted(() => {
	enableAutoValidate()
})


watch(() => props.currentFormData, () => {
	reset(props.currentFormData ?? {})
}, {
	immediate: true
})

const fileList = computed(() => {
	return [{
		name: "bigImg",
		url: formData.bigImg as string
	}] as UploadUserFile[]
})

const { t } = useLanguage()

const handleDelete = () => {
	reset({
		...formData,
		bigImg: ""
	})
}
</script>

<template>
	<div class="size-full">
		<templify-form :template="formTemplate" :form-data="formData">
			<template #bigImg="{ item }">
				<el-form-item>
					<template v-slot:label>
						<span :class="item.formItemLabelClassName">{{ item.label.resolve({ t }) }}</span>
					</template>
					<ImgUploader :file-list="fileList" :handle-remove="handleDelete"></ImgUploader>
				</el-form-item>
			</template>
		</templify-form>
		<el-button type="primary" :disabled="!isValid" @click="$emit('submit')">提交</el-button>
	</div>
</template>
