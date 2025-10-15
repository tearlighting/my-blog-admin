<script lang="ts" setup>
import Table from './components/Table.vue';
import Form from './components/Form.vue';
import Controls from "./components/Controls.vue"
import { ElDialog } from "element-plus"
import { useDialogStore } from './store/useDialogStore';
import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

defineOptions({
	name: 'blogType'
})
const { show } = useDialogStore()
const route = useRoute()

onMounted(() => console.log('mounted', route.name))
onActivated(() => console.log('activated', route.name))
onDeactivated(() => console.log('deactivated', route.name))
onUnmounted(() => console.log('unmounted', route.name))
</script>

<template>

	<div role="blog-type" class="size-full grid grid-cols-1 grid-rows-[10%_90%] px-10 py-5">
		<header class="size-full">

			<Controls />
		</header>
		<main class="size-full">
			<Table />
			<ElDialog v-model="show" width="30%" align-center>
				<Form />
			</ElDialog>
		</main>

	</div>

</template>

<style lang="less" scoped></style>