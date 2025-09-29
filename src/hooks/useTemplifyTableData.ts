import { ref } from "vue"

interface ICreateUseTableDataProps<T, R extends any[] = []> {
  defaultTableData?: T[]
  request?: (...args: R) => Promise<T[]>
}
export const createUseTableData = <T, R extends any[] = []>(payload?: ICreateUseTableDataProps<T, R>) => {
  const { defaultTableData = [], request } = payload ?? {}
  return function useTableData() {
    const tableData = ref<T[]>(defaultTableData)
    const getTableRow = (filter: (x: T) => boolean) => tableData.value.find((x) => filter(x as T))

    const resetTableData = (newTableData: T[] = []) => {
      tableData.value = newTableData
    }
    const requestRemoteData = async (...args: R) => {
      if (request) {
        try {
          const data = await request(...args)
          tableData.value = data
        } catch (e) {
          throw e
        }
      } else {
        console.log("dont have requset function")
      }
    }
    return {
      tableData,
      getTableRow,
      resetTableData,
      requestRemoteData,
    }
  }
}
