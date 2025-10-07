<script lang="ts" setup>
import { useRouter } from "vue-router"

import { useLocalStorage } from "@/hooks/useLocalStorage"

import BasicInfo from "./components/BasicInfo.vue"
import TranslationEditor from "./components/TranslationEditor.vue"
import { useCurrentStore, useProjectDetailStore } from "./store"

defineOptions({
	name: "projectDetail",
})
const getId = () => {
	const router = useRouter()
	const { setValue, getValue } = useLocalStorage<"projectDetail", { id: string }>()
	const id = (router.options.history.state.id as string) || getValue("projectDetail")!.id
	setValue("projectDetail", { id })
	return id
}
const { currrentLang, currentTranslation, projectId } = useCurrentStore()
const { requestProjectDetail, getProjectTranslation } = useProjectDetailStore()
projectId.value = getId()

const init = async () => {
	await requestProjectDetail(projectId.value!)
	currentTranslation.value = getProjectTranslation(currrentLang.value)!
	console.log(currrentLang.value);

}
init()
</script>

<template>
	<div v-if="currentTranslation" role="blogList" class="size-full grid grid-rows-[30%_auto] grid-cols-1 px-10 py-5">
		<header class="size-full">
			<BasicInfo />
		</header>
		<main class="size-full">
			<TranslationEditor />
		</main>
	</div>
</template>
