<script setup lang="ts">
import { useLanguage } from "@/hooks/useLanguage"
import { useForm } from "./useForm"
import TemplifyForm from "@/components/TemplifyForm/index.vue"
import { ElButton, ElNotification } from "element-plus"
import { login } from "@/api"
import { useUserStore } from "@/store"
import { ELoginStatus, EPemission } from "@/constants"
import router from "@/router"
defineOptions({
	name: "login"
})
const { formData, formTemplate, enableAutoValidate, isValid } = useForm()
enableAutoValidate()
const { t } = useLanguage()
const { setUserInfo } = useUserStore()
function loginHandler() {
	setUserInfo({
		loginStatus: ELoginStatus.logining,
		role: EPemission.visitor
	})
	login(formData).then(res => {
		if (res.msg) throw new Error(res.msg)
		setUserInfo({
			loginStatus: ELoginStatus.logined,
			role: res.data.role,
			name: res.data.name
		})
		router.push({
			name: "home",
		})
	}).catch(err => {
		// console.log(err)
		ElNotification({
			type: "error",
			message: err.message
		})
		setUserInfo({
			loginStatus: ELoginStatus.unlogin,
			role: EPemission.visitor
		})
	})
}

</script>

<template>
	<div role="login-container" class="flex items-center justify-center min-h-screen bg-bg text-text">
		<div class="w-full max-w-md p-8 rounded-2xl shadow-md bg-card-bg border border-border">
			<!-- 标题 -->
			<h1 class="text-2xl font-bold text-center mb-6 text-primary">{{ t("siteName") }}</h1>
			<TemplifyForm :template="formTemplate" :form-data="formData"></TemplifyForm>
			<!-- 登录按钮 -->
			<el-button class="w-full" type="primary" :disabled="!isValid" @click="loginHandler">Login</el-button>
			<!-- <el-button class="w-full mt-10" type="primary" @click="() => reset()">reset</el-button> -->

			<!-- 额外操作 -->
			<!-- <div class="flex justify-between mt-4 text-sm text-muted">
				<a href="#" class="hover:text-primary transition-colors">Forgot password?</a>
				<a href="#" class="hover:text-primary transition-colors">Register</a>
			</div> -->
		</div>
	</div>
</template>
