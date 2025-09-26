<script lang="ts" setup>
import { ElButton } from "element-plus"
import { useDialogStore, useFormModeStore, useFormStore, useTableStore } from "../store";
import { EFormSubmitMode } from "../constants";
const { showDialog } = useDialogStore()
const { setFormMode } = useFormModeStore()
const { reset } = useFormStore()
const { requestRemoteData } = useTableStore()
const handleCreate = () => {
	setFormMode(EFormSubmitMode.create)
	reset()
	showDialog()
}
</script>

<template>

	<div class="size-full flex justify-end items-center">
		<el-button type="primary" size="large" class="mr-10" @click="handleCreate">create</el-button>
		<el-button type="primary" size="large" @click="requestRemoteData">refresh</el-button>
	</div>

</template>
