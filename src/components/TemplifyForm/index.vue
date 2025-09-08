<script setup lang="ts">
import { ElForm, ElInput } from "element-plus"
import type { IFormTemplateItem } from "templifyForm"

interface ITemplifyFormProps<TProps extends string = string> {
	template: IFormTemplateItem<TProps>[]
	formData: Record<TProps, any>
}
const props = defineProps<ITemplifyFormProps>()

</script>

<template>
	<div role="templify-form" class="size-full">
		<ElForm>
			<template v-for="item of props.template" :key="item.prop">
				<template v-if="item.render">
					<component :is="item.render(formData)"></component>
				</template>
				<template v-else>
					<ElFormItem :prop="item.prop" :error="item.error" :class="item.formItemClassName">
						<template v-slot:label>
							<span :class="item.formItemLabelClassName">{{ item.label }}</span>
						</template>
						<ElInput size="large" v-model="formData[item.prop]" :class="item.formItemContentClassName">
						</ElInput>
					</ElFormItem>
				</template>

			</template>
		</ElForm>
	</div>
</template>

<style lang="less" scoped></style>
