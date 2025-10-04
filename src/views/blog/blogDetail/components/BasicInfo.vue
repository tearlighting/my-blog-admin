<script lang="ts" setup>
import { useLanguageStore } from '@/store';
import { useBlogDetailStore, useCurrentStore } from '../store';
import { ElSelect, ElForm, ElFormItem, ElInput } from 'element-plus'
import { storeToRefs } from 'pinia';
import { useLanguage } from '@/hooks/useLanguage';
import { computed, toRef, toRefs } from 'vue';
import type { TLocale } from 'language';

const { currentTranslation, currrentLang } = useCurrentStore();
const { getBlogTranslation } = useBlogDetailStore();
const { languages } = storeToRefs(useLanguageStore())
const { t } = useLanguage()

const title = computed({
	get: () => currentTranslation.value?.title,
	set: (v: string) => {
		if (currentTranslation.value) currentTranslation.value!.title = v
	}
})

const description = computed({
	get: () => currentTranslation.value?.description,
	set: (v: string) => {
		if (currentTranslation.value) currentTranslation.value!.description = v
	}
})
function change(e: TLocale) {
	currentTranslation.value = getBlogTranslation(e)!
}

</script>

<template>
	<div class="size-full">
		<ElForm>
			<el-form-item :label="t('views.blog.blogDetail.basicInfo.language')">
				<el-select v-model="currrentLang" placeholder="请选择" @change="change">
					<el-option v-for="item in languages" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item :label="t('views.blog.blogDetail.basicInfo.title')">
				<el-input v-model="title" />
			</el-form-item>
			<el-form-item :label="t('views.blog.blogDetail.basicInfo.description')">
				<el-input v-model="description" :rows="3" type="textarea" />
			</el-form-item>
		</ElForm>


	</div>
</template>