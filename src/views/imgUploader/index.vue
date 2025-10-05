<script lang="ts" setup>
import { uploadImg } from "@/api";
import ImgUploader from "@/components/ImgUploader/index.vue"
import { useCopy } from "@/hooks/useCopy";
import { ElInput, ElButton, type UploadUserFile } from "element-plus"
import { ref } from "vue";
const fileList = ref<UploadUserFile[]>([])
const urlRef = ref<string>("")
const { copy } = useCopy()
const upload = async () => {
	await Promise.all(fileList.value.map(v => uploadImg(v.raw!))).then(
		res => {
			const urls = res.map(v => v.data.url)
			urlRef.value = urls.join("\n")
		}
	)
}
</script>

<template>
	<div class="size-full grid grid-rows-[60%_10%_30%] grid-cols-1 px-10 py-5">
		<header class="flex justify-center items-center">
			<ImgUploader v-model:file-list="fileList" :limit="10" />
		</header>
		<div class="flex justify-center items-center">
			<el-button type="primary" size="large" :disabled="!fileList.length" @click="upload">upload</el-button>
		</div>
		<div>
			<div class="flex items-center">
				<span class="mx-10">result</span>
				<el-input type="textarea" v-model="urlRef" :rows="8" readonly />
				<ElButton type="primary" class="mx-10" @click="() => copy(urlRef)">复制</ElButton>
			</div>
		</div>
	</div>
</template>