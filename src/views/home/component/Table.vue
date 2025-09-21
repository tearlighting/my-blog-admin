<script lang="ts" setup>
import { getBanners } from '@/api';
import { homeTableTemplate } from "../settings/table"
import TemplifyTable from "@/components/TemplifyTable/index.vue"
import { onMounted, ref } from 'vue';
import type { IBannerItem } from 'home';
import { ElImage, ElTableColumn, ElButton } from "element-plus"
import SvgIcon from "@/components/SvgIcon/index.vue"
import { EIcons } from '@/constants';

const emits = defineEmits<{
	edit: [item: IBannerItem]
}>()

const banners = ref<IBannerItem[]>([])

const getTableData = async () => {
	getBanners().then(res => {
		if (res.msg) throw new Error(res.msg)
		banners.value = res.data
	})
}
onMounted(() => {
	getTableData()
})



</script>

<template>

	<div role="home-container" class="size-full ">
		<templify-table :template="homeTableTemplate" :data="banners">
			<template #bigImg="{ item, value }">
				<el-image class="h-20" :src="value[item.prop]" alt="" fit="scale-down" />
			</template>
			<template #append>
				<el-table-column label="操作" width="200px" align="center">
					<template #default="scope">
						<el-button type="primary" size="small" @click="() => emits('edit', scope.row as IBannerItem)">
							<SvgIcon :name="EIcons.Edit" />
						</el-button>
						<el-button type="danger" size="small">
							<SvgIcon :name="EIcons.Delete" />
						</el-button>
					</template>
				</el-table-column>
			</template>
		</templify-table>
	</div>

</template>
