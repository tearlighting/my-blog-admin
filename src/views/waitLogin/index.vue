<script lang="ts" setup>

import { ELoginStatus } from '@/constants';
import { useLoadings } from '@/hooks/useLoadings';

import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';

import { onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const { showLoading, hideLoading } = useLoadings()
const { userInfo } = storeToRefs(useUserStore())

onMounted(() => {
	showLoading()
})


watch([() => userInfo.value.loginStatus], () => {

	if (userInfo.value.loginStatus === ELoginStatus.logining) return
	const router = useRouter()

	nextTick(() => {
		const { name: toName, params: toParams } = router.options.history.state;
		const name = toName as string ?? 'home'
		const params = JSON.parse(JSON.stringify(toParams ?? {}))

		hideLoading()
		router.push({
			name,
			params
		})
	})
}, {
	immediate: true
})


</script>

<template>
	<div role="wait-login" class="size-full"></div>
</template>
