<script setup lang="ts">
import PanelContainer from "@/components/PanelContainer/index.vue"
import Aside from "@/components/Aside/index.vue"
import NavBar from "@/components/NavBar/index.vue"
import TagViews from "@/components/TagViews/index.vue"
import { useTagViewStore } from "@/store"
import { usePageHostStore } from "@/store/pageHost"
import { storeToRefs } from "pinia"
import Settings from "@/components/Settings/index.vue"
import { watchEffect } from "vue"




const { hostRef } = storeToRefs(usePageHostStore())
const { allCachedTags } = storeToRefs(useTagViewStore())

watchEffect(() => {
	console.log(allCachedTags.value);
})


</script>

<template>
	<PanelContainer class="text-text/90 bg-bg">
		<template v-slot:left>
			<Aside></Aside>
		</template>
		<template v-slot:centerLine1>
			<NavBar></NavBar>
		</template>
		<template v-slot:centerLine2>
			<TagViews></TagViews>
		</template>
		<div role="page-host " class="size-full overflow-auto bg-bg text-text" ref="hostRef">
			<RouterView #="{ Component }">
				<KeepAlive :include="allCachedTags">
					<component :is="Component" />
				</KeepAlive>
			</RouterView>
			<Settings class="fixed top-1/2 right-0 -translate-y-1/2"></Settings>
		</div>
	</PanelContainer>
</template>

<style lang="less" scoped></style>
