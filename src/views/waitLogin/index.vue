<script lang="ts" setup>

import { ELoginStatus, EPemission } from '@/constants';
import { useLoadings } from '@/hooks/useLoadings';
import router from '@/router';
import { useUserStore } from '@/store';
import { storeToRefs } from 'pinia';

import { onMounted, watch, nextTick } from 'vue';

const { showLoading, hideLoading } = useLoadings()
const { userInfo } = storeToRefs(useUserStore())

onMounted(() => {
	showLoading()
})


watch([() => userInfo.value.loginStatus], () => {

	if (userInfo.value.loginStatus === ELoginStatus.logining) return
	let name = "login"

	if ([EPemission.user, EPemission.admin].includes(userInfo.value.role)) {
		name = "home"
	}
	nextTick(() => {
		hideLoading()
		router.push({
			name
		})
	})
}, {
	immediate: true
})


</script>

<template>
	<div role="wait-login" class="size-full"></div>
</template>
