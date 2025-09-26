<script lang="ts" setup>

import TemplifyForm from "@/components/TemplifyForm/index.vue"
import { ElButton, ElFormItem, ElMessage, type UploadUserFile } from "element-plus"
import ImgUploader from "@/components/ImgUploader/index.vue"
import { nextTick, onMounted, ref, watchEffect, } from "vue"
import { useLanguage } from "@/hooks/useLanguage"
import { useDialogStore, useFormStore, useTableStore } from "../store"
import { useFormSubmit } from "../hooks"


const { t } = useLanguage()
const { enableAutoValidate, formData, formTemplate, isValid, extraData } = useFormStore()
const { requestRemoteData } = useTableStore()
const { show, hideDialog } = useDialogStore()

onMounted(() => {
	enableAutoValidate()
})

const fileList = ref<UploadUserFile[]>()
watchEffect(() => {
	if (show.value) {
		if (formData.bigImg) {
			fileList.value = [{
				url: formData.bigImg,
				name: "bigImg"
			}]
		} else {
			fileList.value = []
		}

	}
})

const submit = () => {
	useFormSubmit().sumbit({
		fileList: fileList.value!,
		formData,
		extras: extraData.current!
	}).then(() => {
		ElMessage.success("save success")
		hideDialog()
		nextTick(() => {
			requestRemoteData()
		})
	}).catch(e => {
		ElMessage.error(e.message)
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
					<ImgUploader v-model:file-list="fileList"></ImgUploader>
				</el-form-item>
			</template>
		</templify-form>
		<div class="text-center ">
			<el-button type="primary" size="large" :disabled="!isValid" @click="submit">提交</el-button>
		</div>
	</div>
</template>
