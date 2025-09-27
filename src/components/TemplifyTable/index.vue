<script lang="ts" setup>
import { useLanguage } from "@/hooks/useLanguage";
import { ElTable, ElTableColumn } from "element-plus"
import type { ITemplifyTableItem } from "table";


interface IProps {
	data: Record<string, any>[],
	template: ITemplifyTableItem<any>[]
}

defineProps<IProps>()

interface ISlots {
	[scope: string]: (scope: { item: ITemplifyTableItem<any>, value: any }) => any
	append: () => any
}
defineSlots<ISlots>()

const { t } = useLanguage()


</script>

<template>

	<div role="templify-table" class="size-full">

		<el-table :data="data" border stripe class-name="h-full!" :draggable="false">
			<el-table-column v-for="item in template" :key="item.prop" :prop="item.prop"
				:label="item.label.resolve({ t })" align="center">
				<template #default="scope">
					<slot :name="item.prop" :item="item" :value="scope.row">
						{{ scope.row[item.prop] }}
					</slot>
				</template>
			</el-table-column>
			<slot name="append"></slot>
		</el-table>

	</div>

</template>
