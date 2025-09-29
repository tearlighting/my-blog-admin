<script lang="ts" setup>
import { useDialogStore, useFormStore, useTableStore, useFormModeStore } from '../store';
import TemplifyTable from "@/components/TemplifyTable/index.vue"
import { EIcons } from '@/constants';
import { nextTick, onMounted } from 'vue';
import { EFormSubmitMode } from '../constants';
import { deleteBlogType } from '@/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute } from 'vue-router';
defineOptions({
	name: 'BlogTypeTable'
})
const { tableData, template, requestRemoteData, getTableRow } = useTableStore()
const { reset } = useFormStore()
const { showDialog } = useDialogStore()
const { setFormMode } = useFormModeStore()
onMounted(() => {
	console.log("onMounted blogTypeTable", useRoute().fullPath);
	requestRemoteData()
})
const handleEdit = (id: string) => {
	const row = getTableRow(id)!
	reset(row)
	setFormMode(EFormSubmitMode.update)
	showDialog()
}

const handleDelete = (id: string) => {
	ElMessageBox.confirm("you want to delete?", 'warning',
		{
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning',
		}
	).then(() => {
		deleteBlogType({ id }).then(() => {
			ElMessage.success("delete success")
			nextTick(() => {
				requestRemoteData()
			})
		}).catch(() => {
			ElMessage.error("delete fail")
		})
	})
}

</script>

<template>

	<div role="blog-type-table" class="size-full">
		<templify-table :template="template" :data="tableData">
			<template #bigImg="{ item, value }">
				<el-image class="h-20" :src="value[item.prop]" alt="" fit="scale-down" />
			</template>
			<template #append>
				<el-table-column label="操作" width="200px" align="center">
					<template #default="scope">
						<el-button type="primary" size="small" @click="() => handleEdit(scope.row.id)">
							<SvgIcon :name="EIcons.Edit" />
						</el-button>
						<el-button type="danger" size="small" @click="() => handleDelete(scope.row.id)">
							<SvgIcon :name="EIcons.Delete" />
						</el-button>
					</template>
				</el-table-column>
			</template>
		</templify-table>

	</div>

</template>
