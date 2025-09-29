<script lang="ts" setup>
import Table from "./components/Table.vue"
import { ElDialog } from "element-plus"
import Form from "./components/Form.vue"
import Controls from "./components/Controls.vue"
import { useDialogStore } from "./store/useDialogStore"


defineOptions({
	name: 'blogList'
})

const { show } = useDialogStore()
</script>

<template>
	<div role="blogList" class="size-full grid grid-rows-[10%_90%] grid-cols-1 px-10 py-5">
		<header class="size-full ">
			<Controls />
		</header>
		<main class="size-full">
			<Table />
		</main>
		<ElDialog v-model="show">
			<Form />
		</ElDialog>
	</div>
</template>