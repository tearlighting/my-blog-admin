<script lang="ts" setup>

import { EPemission } from '@/constants';
import { useLoadings } from '@/hooks/useLoadings';
import router from '@/router';
import { useUserStore } from '@/store';
import { onMounted, watchEffect } from 'vue';

const { showLoading } = useLoadings()
const { userInfo } = useUserStore()

onMounted(() => {
	showLoading()
})

watchEffect(() => {
	if ([EPemission.user, EPemission.admin].includes(userInfo.role)) {
		router.push({
			name: "home"
		})
	}
})

</script>

<template>
	<div role="wait-login" class="size-full"></div>
</template>
