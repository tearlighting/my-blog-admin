import { ref } from "vue"

export const useDialog = () => {
  const show = ref(false)
  const showDialog = () => {
    // 打开对话框
    show.value = true
  }

  const hideDialog = () => {
    // 关闭对话框
    show.value = false
  }

  return {
    showDialog,
    hideDialog,
    show,
  }
}
