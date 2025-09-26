<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import SvgIcon from '../SvgIcon/index.vue'
import { type UploadFile, type UploadUserFile, ElMessage, ElUpload } from 'element-plus'
import { EIcons } from '@/constants'


interface Props {
	fileList?: UploadUserFile[]
	limit?: number
	handleRemove?: (file: UploadFile) => Promise<boolean>
}

const props = withDefaults(defineProps<Props>(), {
	limit: 1,
	fileList: () => [],
	handleRemove: () => Promise.resolve(true)
})

const fileList = defineModel<UploadUserFile[]>('fileList')

const limit = ref(props.limit || 1)

//#region 
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const handlePictureCardPreview = (file: UploadFile) => {
	dialogImageUrl.value = file.url!
	dialogVisible.value = true
}
//#endregion
const handleRemove = async (file: UploadFile) => {
	try {
		const res = await props.handleRemove?.(file)
		if (!res) throw new Error("delete img fail")
		const index = fileList.value!.findIndex((item) => (item as any).uid === file.uid)
		fileList.value!.splice(index, 1)
	} catch (err) {
		ElMessage.error("delete img fail")
	}
}



const showAddIcon = computed(() => {
	return fileList.value!.length < limit.value
})


</script>
<template>
	<el-upload :limit="limit" v-model:file-list="fileList" action="#" list-type="picture-card" :auto-upload="false">
		<el-icon :role="showAddIcon ? '' : 'disabled'">
			<SvgIcon :name="EIcons.Plus"></SvgIcon>
		</el-icon>
		<template #file="{ file }">
			<div v-if="file?.url">
				<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
				<span class="el-upload-list__item-actions">
					<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
						<SvgIcon :name="EIcons.ZoomIn"></SvgIcon>
					</span>

					<span class="el-upload-list__item-delete" @click="handleRemove(file)">
						<SvgIcon :name="EIcons.Delete"></SvgIcon>
					</span>
				</span>
			</div>
		</template>
	</el-upload>

	<el-dialog v-model="dialogVisible">
		<img w-full :src="dialogImageUrl" alt="Preview Image" />
	</el-dialog>
</template>
