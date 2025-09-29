<script lang="ts" setup>
import TemplifyForm from '@/components/TemplifyForm/index.vue'
import { useFormStore } from '../store/useFormStore';
import { useLanguage } from '@/hooks/useLanguage';
import { type UploadUserFile, ElButton, ElMessage } from 'element-plus';
import { ref, watchEffect } from 'vue';
import { useDialogStore, useTableStore } from '../store';
import { useFormSubmit } from '../hooks';

const { formData, formTemplate, isValid, extraData, enableAutoValidate } = useFormStore()
enableAutoValidate()
const { show, hideDialog } = useDialogStore()
const { requestRemoteData } = useTableStore()
const { t } = useLanguage()

const fileList = ref<UploadUserFile[]>()
watchEffect(() => {
	if (show.value) {
		if (formData.thumb) {
			fileList.value = [{
				url: formData.thumb,
				name: "thumb"
			}]
		} else {
			fileList.value = []
		}
	}
})
const { sumbit } = useFormSubmit()
const handleSubmit = () => {
	sumbit({
		formData,
		fileList: fileList.value!,
		extras: extraData.current!
	}).then(() => {
		hideDialog()
		requestRemoteData()
	}).catch(() => {
		ElMessage.error("blog item sumbit failed")
	})
}



</script>

<template>
	<div class="size-full">
		<templify-form :template="formTemplate" :form-data="formData">
			<template #thumb="{ item }">
				<el-form-item>
					<template v-slot:label>
						<span :class="item.formItemLabelClassName">{{ item.label.resolve({ t }) }}</span>
					</template>
					<ImgUploader v-model:file-list="fileList"></ImgUploader>
				</el-form-item>
			</template>
		</templify-form>
		<footer class="text-center">
			<el-button type="primary" :disabled="!isValid" @click="handleSubmit">
				提交
			</el-button>
		</footer>
	</div>
</template>