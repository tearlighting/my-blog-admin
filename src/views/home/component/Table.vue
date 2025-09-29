<script lang="ts" setup>
import { useTableStore } from "../store/useTableStore"
import TemplifyTable from "@/components/TemplifyTable/index.vue"
import { onMounted, } from 'vue';
import { ElImage, ElTableColumn, ElButton, ElMessage, ElMessageBox } from "element-plus"
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from '@/constants';
import { useDialogStore, useFormModeStore, useFormStore } from '../store';
import { EFormSubmitMode } from '../constants';
import { deleteBanner } from "@/api"

const { tableData, tableTemplate, requestRemoteData, getRowById } = useTableStore()
const { reset } = useFormStore()
const { showDialog } = useDialogStore()
const { setFormMode } = useFormModeStore()

onMounted(() => {
	console.log("m");

	requestRemoteData()
})

const handleEdit = (id: string) => {
	const row = getRowById(id)!
	reset(row)
	showDialog()
	setFormMode(EFormSubmitMode.update)
}

const handleDelete = (id: string) => {
	ElMessageBox.confirm("you want to delete?", 'warning',
		{
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning',
		}
	).then(() => {
		deleteBanner(id).then(() => {
			requestRemoteData()
		}).catch(() => {
			ElMessage.error("delete error")
		})
	})
}


</script>

<template>

	<div role="home-container" class="size-full">
		<templify-table :template="tableTemplate" :data="tableData">
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
