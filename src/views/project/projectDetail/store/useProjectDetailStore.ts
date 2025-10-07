import { createHookStore } from "@/utils/store/createHookStore"

import { useProjectDetail } from "../hooks"

export const useProjectDetailStore = createHookStore(useProjectDetail)
