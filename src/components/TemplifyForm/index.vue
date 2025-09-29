<script setup lang="ts">
import { useLanguage } from "@/hooks/useLanguage"
import { ETemplateType } from "@/utils"
import { ElForm, ElInput, ElFormItem, ElSelect, ElOption } from "element-plus"
import type { IFormTemplateItem } from "templifyForm"

interface ITemplifyFormProps<TProps extends string = string, TResolveCxt = any> {
	template: IFormTemplateItem<TProps, TResolveCxt>[]
	formData: Record<TProps, any>
}
const props = defineProps<ITemplifyFormProps>()
interface ISlots {
	[scope: string]: (scope: { item: IFormTemplateItem<string, any>, value: any }) => any

}
defineSlots<ISlots>()
const { t } = useLanguage()
</script>

<template>
	<div role="templify-form" class="size-full">
		<ElForm>
			<template v-for="item of props.template" :key="item.prop">
				<template v-if="item.render">
					<component :is="item.render(item, formData, t)"></component>
				</template>
				<template v-else>
					<slot :name="item.prop" :item="item" :value="formData">
						<ElFormItem :prop="item.prop" :error="item.error.resolve({ t })"
							:class="item.formItemClassName">
							<template v-slot:label>
								<span :class="item.formItemLabelClassName">{{ item.label.resolve({ t }) }}</span>
							</template>
							<template v-if="item.type === ETemplateType.input">
								<ElInput size="large" v-model="formData[item.prop]"
									:class="item.formItemContentClassName">
								</ElInput>
							</template>
							<template v-else-if="item.type === ETemplateType.select">
								<ElSelect size="large" v-model="formData[item.prop]"
									:class="item.formItemContentClassName">
									<ElOption v-for="option of item.option" :key="option.value"
										:label="option.label.resolve({ t })" :value="option.value">
									</ElOption>
								</ElSelect>
							</template>
							<template v-else-if="item.type === ETemplateType.textarea">
								<ElInput size="large" v-model="formData[item.prop]" type="textarea"
									:class="item.formItemContentClassName" :rows="4"></ElInput>
							</template>
						</ElFormItem>
					</slot>
				</template>
			</template>
		</ElForm>
	</div>
</template>

<style lang="less" scoped></style>
