<script lang="ts" setup>
import { ElButton, ElDialog } from "element-plus"
import { useDialogStore, useFormModeStore, useFormStore, useOrderStore, useTableStore } from "../store";
import { EFormSubmitMode } from "../constants";
import Order from "./Order.vue"

const { reset } = useFormStore()
const { showDialog } = useDialogStore()
const { setFormMode } = useFormModeStore()
const { tableData, requestRemoteData } = useTableStore()
const { setOrder, showOrder, showOrderDialog } = useOrderStore()
const handleCreate = () => {
	reset()
	setFormMode(EFormSubmitMode.create)
	showDialog()
}

const handleOrder = () => {
	showOrderDialog()
	setOrder(tableData.value)
}


</script>

<template>

	<div role="blog-type-controls" class="size-full flex items-center justify-end">
		<el-button type="primary" size="large" @click="handleCreate" class="mr-10">create</el-button>
		<el-button type="primary" size="large" @click="handleOrder" class="mr-10">order</el-button>
		<el-button type="primary" size="large" @click="requestRemoteData">refresh</el-button>
		<el-dialog v-model="showOrder" width="40%">
			<Order></Order>
		</el-dialog>
	</div>

</template>
