<script setup lang="ts">
import { useAppStore } from "@/store"
import ControllerContainer from "../NavBar/ControllerContainer.vue"
import { EIcons } from "@/constants/icons"
import SvgIcon from "../SvgIcon/index.vue"
import { ElDrawer, ElForm, ElFormItem, ElSwitch } from "element-plus"
import { ref, toRefs } from "vue"
import { useLanguage } from "@/hooks/useLanguage"

interface ISettingsProp {
	class?: string
	svgClass?: string
}

defineProps<ISettingsProp>()
const { settings } = useAppStore()
const showDrawer = ref(false)

const { t } = useLanguage()
const {
	showMenuSwitch, showTitle,
	showLocaleSwitch,
	showThemeSwitch,
	showFullScreenSwitch,
	showUserAvatar,
	showNavBar,
	showTagsView

} = toRefs(settings)
</script>

<template>
	<div role="settings" :class="class" class="">
		<ControllerContainer v-if="settings.showSettings"
			class="bg-primary/90! rounded-l-xl! active:text-btn-text! group/settings">
			<SvgIcon :name="EIcons.Setting" class="group-hover/settings:text-btn-text! text-btn-text/80"
				:class="svgClass" @click="showDrawer = true"></SvgIcon>
		</ControllerContainer>
	</div>
	<el-drawer v-model="showDrawer" :with-header="false" direction="rtl" size="300">
		<div class="size-full flex flex-col bg-bg">
			<hear class="w-full text-center text-text">settings </hear>
			<main class="flex w-full flex-1 ">
				<ElForm class="w-full" :label-width="120">

					<ElFormItem :label="t('layoutSettings.menuSwitch')">
						<div class="text-center w-full">
							<ElSwitch v-model="showMenuSwitch"></ElSwitch>
						</div>
					</ElFormItem>
					<ElFormItem :label="t('layoutSettings.title')">
						<div class="text-center w-full">
							<ElSwitch v-model="showTitle"></ElSwitch>
						</div>
					</ElFormItem>

					<ElFormItem :label="t('layoutSettings.localeSwitch')">
						<div class="text-center w-full">
							<ElSwitch v-model="showLocaleSwitch"></ElSwitch>
						</div>
					</ElFormItem>
					<ElFormItem :label="t('layoutSettings.themeSwitch')">
						<div class="text-center w-full">
							<ElSwitch v-model="showThemeSwitch"></ElSwitch>
						</div>
					</ElFormItem>
					<ElFormItem :label="t('layoutSettings.fullScreenSwitch')">
						<div class="text-center w-full">
							<ElSwitch v-model="showFullScreenSwitch"></ElSwitch>
						</div>
					</ElFormItem>
					<ElFormItem :label="t('layoutSettings.userAvatar')">
						<div class="text-center w-full">
							<ElSwitch v-model="showUserAvatar"></ElSwitch>
						</div>
					</ElFormItem>
					<ElFormItem :label="t('layoutSettings.navBar')">
						<div class="text-center w-full">
							<ElSwitch v-model="showNavBar"></ElSwitch>
						</div>
					</ElFormItem>
					<ElFormItem :label="t('layoutSettings.tagsView')">
						<div class="text-center w-full">
							<ElSwitch v-model="showTagsView"></ElSwitch>
						</div>
					</ElFormItem>
				</ElForm>
			</main>
		</div>
	</el-drawer>
</template>

<style lang="less" scoped></style>
