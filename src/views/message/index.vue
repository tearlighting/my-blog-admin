<script lang="ts" setup>
import { ElInput } from 'element-plus'
import { ref } from 'vue';
const res = ref('')
</script>

<template>
	<div class="size-full">
		message
		<el-input type=" primary" v-model="res"></el-input>
	</div>
</template>