<script lang="ts" setup>
import { ref } from 'vue'
import SvgIcon from '../SvgIcon/index.vue'
import { type UploadFile, type UploadUserFile, ElMessage, ElUpload } from 'element-plus'
import { EIcons } from '@/constants'


interface Props {
	fileList?: UploadUserFile[]
	limit?: number
	handleRemove?: (file: UploadFile) => void
}


const props = defineProps<Props>()

const fileList = ref<UploadUserFile[]>(props.fileList || [])
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
		await props.handleRemove?.(file)
		fileList.value = fileList.value.filter((item) => item.uid !== file.uid)
	} catch (err) {
		ElMessage.error("delete img fail")
	}
}

</script>
<template>
	<el-upload :limit="limit" v-model:file-list="fileList" action="#" list-type="picture-card" :auto-upload="false">
		<el-icon :role="fileList.length < limit ? '' : 'disabled'">
			<SvgIcon :name="EIcons.Plus"></SvgIcon>
		</el-icon>
		<template #file="{ file }">
			<div>
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
