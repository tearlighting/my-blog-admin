<script lang="ts" setup>
import { ElButton } from "element-plus"
import { useDialogStore, useFormModeStore, useFormStore, useTableStore } from "../store"
import { EFormSubmitMode } from "../constants"

const { reset, } = useFormStore()
const { requestRemoteData } = useTableStore()
const handleCreate = () => {
	const { setFormMode } = useFormModeStore()
	setFormMode(EFormSubmitMode.create)
	reset()
	const { showDialog } = useDialogStore()
	showDialog()

}

const handleRefresh = () => {
	requestRemoteData()
}

</script>

<template>
	<div class="size-full flex items-center justify-end gap-10">

		<el-button type="primary" size="large" @click="handleCreate">create</el-button>
		<el-button type="primary" size="large" @click="handleRefresh">refresh</el-button>

	</div>
</template>