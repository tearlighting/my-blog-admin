import { useDialog } from "@/views/home/hooks"
import type { IBlogTypeItem } from "blog"
import { ref } from "vue"

export const useOrder = () => {
  const list = ref<IBlogTypeItem[]>([])
  const { show: showOrder, showDialog: showOrderDialog, hideDialog: hideOrderDialog } = useDialog()
  const setOrder = (payload: IBlogTypeItem[]) => {
    list.value = payload.map((x) => ({ ...x }))
  }
  return {
    list,
    setOrder,
    showOrderDialog,
    hideOrderDialog,
    showOrder,
  }
}
