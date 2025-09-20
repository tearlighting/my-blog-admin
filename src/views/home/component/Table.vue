<script lang="ts" setup>
import { getBanners } from '@/api';


getBanners().then(res => {
	console.log(res)
})
</script>

<template>

	<div role="home-container" class="size-full ">
		home
	</div>

</template>
