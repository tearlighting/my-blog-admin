<script lang="ts" setup>
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRouter } from 'vue-router';

defineOptions({
	name: 'blogDetail'
})

const getId = () => {
	const router = useRouter()
	const { setValue, getValue } = useLocalStorage<"blogDetail", { id: string }>()
	const id = router.options.history.state.id as string || getValue('blogDetail')!.id
	setValue('blogDetail', { id })
	return id
}
console.log(getId());






</script>

<template>
	<div class="size-full">
		detail
	</div>
</template>