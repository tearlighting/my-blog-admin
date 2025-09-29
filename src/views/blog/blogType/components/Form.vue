<script lang="ts" setup>
import { updateBlogTypeName, addBlogType } from '@/api';
import { useDialogStore, useFormModeStore, useFormStore, useTableStore } from '../store';
import TemplifyForm from '@/components/TemplifyForm/index.vue'
import { ElButton, ElMessage } from "element-plus"
import { nextTick } from 'vue';
import { EFormSubmitMode } from '../constants';


const { formData, formTemplate, extraData, enableAutoValidate } = useFormStore()
enableAutoValidate()
const { hideDialog } = useDialogStore()
const { requestRemoteData } = useTableStore()
const { formMode } = useFormModeStore()
const { tableData } = useTableStore()
const strategy: Record<EFormSubmitMode, () => Promise<any>> = {
	[EFormSubmitMode.update]: () => {
		const extras = extraData.current!
		return updateBlogTypeName({ ...extras, ...formData }).then(() => {
			ElMessage.success('save success')
			nextTick(() => {
				hideDialog()
				requestRemoteData()
			})
		}).catch(() => ElMessage.error('save failed'))
	},
	[EFormSubmitMode.create]: () => {
		return addBlogType({ ...formData, order: tableData.value.length + 1 }).then(() => {
			ElMessage.success('save success')
			nextTick(() => {
				hideDialog()
				requestRemoteData()
			})
		}).catch(() => ElMessage.error('save failed'))
	}
}

const submit = () => {
	strategy[formMode.value]()
}
</script>

<template>

	<div role="blog-type-form">
		<templify-form :template="formTemplate" :form-data="formData">
		</templify-form>
		<footer class="text-center ">
			<el-button type="primary" size="large" @click="submit">提交</el-button>
		</footer>
	</div>

</template>
