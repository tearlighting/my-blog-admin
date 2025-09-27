<script lang="ts" setup>
import Table from "./component/Table.vue"
import EditForm from "./component/EditForm.vue"
import { ElDialog } from "element-plus"
import { useDialogStore } from "./store"
import Controls from "./component/Controls.vue"
defineOptions({
	name: "home"
})
const { show } = useDialogStore()

</script>

<template>
	<div role="home-container" class="size-full grid grid-rows-[10%_90%] grid-cols-1 px-10 py-5">
		<header class="size-full">
			<Controls></Controls>
		</header>
		<div class="size-full overflow-hidden">
			<Table></Table>
			<el-dialog v-model="show" width="50%" center>
				<EditForm class="p-10">
				</EditForm>
			</el-dialog>
		</div>

	</div>
</template>
