import type { ELoginStatus, EPemission } from "@/constants"
export interface IUserInfo {
  name?: string
  loginId?: string
  role: EPemission
  loginStatus: ELoginStatus
}
