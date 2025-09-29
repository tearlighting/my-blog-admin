<script lang="ts" setup>
import TemplifyTable from '@/components/TemplifyTable/index.vue'
import { useDialogStore, useFormModeStore, useFormStore, useTableStore } from '../store';
import type { IBlogItem } from 'blog';
import { nextTick, onMounted, } from 'vue';
import { ElTableColumn, ElButton, ElImage, ElPagination, ElMessageBox, ElMessage } from 'element-plus'
import SvgIcon from '@/components/SvgIcon/index.vue';
import { useLanguageStore } from '@/store';
import { EIcons } from '@/constants';
import { storeToRefs } from 'pinia';
import { EFormSubmitMode } from '../constants';
import { deleteBlogItem } from '@/api';
import { useRouter } from 'vue-router';


const { tableData, tableTemplate, requestRemoteData, getTableRow, paginationInfo } = useTableStore()
const { showDialog } = useDialogStore()
const { reset, } = useFormStore()
onMounted(() => {
	requestRemoteData()
})

function getTranslationDefault(item: IBlogItem) {
	const { currentLocale } = storeToRefs(useLanguageStore())
	let target = item.translations.find(x => x.lang === currentLocale.value)
	if (target) return target
	else return item.translations.find(x => x.lang === 'zh')
}

function handleEdit(id: string) {
	const row = getTableRow(id)!
	const { setFormMode } = useFormModeStore()
	setFormMode(EFormSubmitMode.update)
	reset(row)
	showDialog()

}

function handleDelete(id: string) {
	ElMessageBox.confirm("you want to delete?", 'warning',
		{
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning',
		}
	).then(() => {
		deleteBlogItem(id).then(() => {
			ElMessage.success("delete success")
			nextTick(() => {
				requestRemoteData()
			})
		}).catch(() => {
			ElMessage.error("delete fail")
		})
	})

}
const router = useRouter()
function handleToDetail(id: string) {
	console.log("???", id);

	router.push({
		name: 'blogDetail',
		state: {
			id
		}
	})
}

</script>

<template>
	<div role="blog-list-table" class="size-full grid grid-rows-[90%_10%] ">

		<div class="size-full overflow-hidden ">
			<templify-table :data="tableData" :template="tableTemplate">
				<template #thumb="{ value, item }">
					<el-image class="h-20" :src="value[item.prop]" alt="" fit="scale-down" />
				</template>
				<template #title="{ value }">
					{{ getTranslationDefault(value)?.title }}
				</template>
				<template #description="{ value }">
					{{ getTranslationDefault(value)?.description }}
				</template>
				<template #category="{ value }">
					{{ (value as IBlogItem).category.name }}
				</template>

				<template #append>
					<el-table-column align="center" width="200">
						<template #default="scope">
							<el-button type="primary" size="small" @click="() => handleEdit(scope.row.id)">
								<SvgIcon :name="EIcons.Edit" />
							</el-button>
							<el-button type="danger" size="small" @click="() => handleDelete(scope.row.id)">
								<SvgIcon :name="EIcons.Delete" />
							</el-button>
							<el-button type="text" size="small">
								<SvgIcon :name="EIcons.More" @click="() => handleToDetail(scope.row.id)" />
							</el-button>
						</template>
					</el-table-column>
				</template>

			</templify-table>
		</div>


		<div class="size-full flex items-center">
			<el-pagination v-model:current-page="paginationInfo.page" v-model:page-size="paginationInfo.limit"
				:total="paginationInfo.total" :page-sizes="[5, 10, 15]" @current-change="() => requestRemoteData()">
			</el-pagination>
		</div>
	</div>
</template>