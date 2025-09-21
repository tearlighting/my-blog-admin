<script lang="ts" setup>
import Table from "./component/Table.vue"
import EditForm from "./component/EditForm.vue"
import { ElDialog } from "element-plus"
import { ref } from "vue"
import type { IBannerItem } from "home"

const dialogVisible = ref(false)
const currentFormData = ref<IBannerItem | null>(null)
const showEditForm = (row: IBannerItem) => {
	currentFormData.value = row
	dialogVisible.value = true
}

</script>

<template>
	<div role="home-container" class="size-full ">
		<Table @edit="showEditForm"></Table>
		<el-dialog v-model="dialogVisible" width="50%" center>
			<EditForm class="p-10" :current-form-data="currentFormData">
			</EditForm>
		</el-dialog>
	</div>
</template>
