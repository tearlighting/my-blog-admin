<script lang="ts" setup>
import Editor from "@toast-ui/editor"
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import uml from '@toast-ui/editor-plugin-uml';
import chart from '@toast-ui/editor-plugin-chart';
import { useCurrentStore } from '../store';
import { computed, onMounted, ref, watchEffect } from 'vue';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import { ElButton, ElMessage } from 'element-plus'
import { useSubmit } from "../hooks";


const { currentTranslation, currrentLang, blogId } = useCurrentStore()
const htmlContent = computed({
	get: () => currentTranslation.value?.htmlContent!,
	set: (value) => currentTranslation.value!.htmlContent = value
})


const editorRef = ref<HTMLDivElement>()
let editor: Editor
onMounted(() => {
	editor = new Editor({
		el: editorRef.value!,
		height: '650px',
		previewStyle: 'vertical',
		plugins: [colorSyntax, codeSyntaxHighlight, tableMergedCell, uml, chart],

	})
	editor.setScrollTop(0)
	watchEffect(() => {
		editor.setHTML(htmlContent.value)
	})
})

const { sumbit } = useSubmit()
function submitMd() {
	sumbit({
		payload: {
			blogId: blogId.value!,
			lang: currrentLang.value,
			markdownContent: editor.getMarkdown(),
			id: currentTranslation.value?.id,
			title: currentTranslation.value!.title,
			description: currentTranslation.value!.description,
		}
	}).then(() => {
		ElMessage.success('submit success')
	}).catch(() => {
		ElMessage.error('submit failed')
	})
}


</script>

<template>
	<div class="size-full  bg-gray-300">
		<div class="not-tailwind">
			<div ref="editorRef"></div>
		</div>
	</div>
	<div class="mt-10 flex justify-center items-center">
		<ElButton type="primary" @click="submitMd" size="large">提交</ElButton>
	</div>

</template>