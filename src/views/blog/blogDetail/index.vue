<script lang="ts" setup>
import { useRouter } from 'vue-router';
import BasicInfo from './components/BasicInfo.vue'
import { useBlogDetailStore, useCurrentStore } from './store';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import TranslationEditor from "./components/TranslationEditor.vue"

defineOptions({
	name: 'blogDetail'
})
const getId = () => {
	const router = useRouter()
	const { setValue, getValue } = useLocalStorage<"blogDetail", { id: string }>()
	const id = (router.options.history.state.id as string) || getValue("blogDetail")!.id
	setValue("blogDetail", { id })
	return id
}
const { blogId, currrentLang, currentTranslation } = useCurrentStore()
const { requestBlogDetail, getBlogTranslation, blogDetail } = useBlogDetailStore()
blogId.value = getId()

const init = async () => {
	await requestBlogDetail(blogId.value!)
	console.log(blogDetail);
	currentTranslation.value = getBlogTranslation(currrentLang.value)!
}
init()


</script>

<template>
	<div v-if="currentTranslation" role="blogList" class="size-full grid grid-rows-[30%_auto] grid-cols-1 px-10 py-5">
		<header class="size-full ">
			<BasicInfo />
		</header>
		<main class="size-full">
			<TranslationEditor />
		</main>

	</div>
</template>