<script lang="ts" setup>
import { VueDraggableNext as draggable } from "vue-draggable-next"
import { useOrderStore, useTableStore } from "../store";
import { ElButton, ElMessage } from "element-plus"
import { updateBlogTypeOrder } from "@/api";
import { nextTick } from "vue";
const { list, hideOrderDialog } = useOrderStore()
const { requestRemoteData } = useTableStore()
const handleSave = () => {
	const res = list.value.map((item, index) => ({ ...item, order: index + 1 }))
	updateBlogTypeOrder(res).then(() => {
		ElMessage.success("save success")
		nextTick(() => {
			hideOrderDialog()
			requestRemoteData()
		})
	}).catch(() => {
		ElMessage.error("save failed")
	})
}

</script>

<template>
	<div role="blog-type-order">
		<draggable v-model="list" item-key="prop">
			<div v-for="element in list" class="bg-card-bg mb-2 py-1 text-sm flex items-center justify-center rounded-md
				">
				{{ element.name }}
			</div>
		</draggable>
		<footer class="text-center">
			<el-button type="primary" size="large" @click="handleSave">save</el-button>
		</footer>
	</div>
</template>

<style lang="less" scoped></style>