import { useForm } from "@/views/login/useForm"

export type TLoginForm = ReturnType<typeof useForm>["formData"]

export interface IUser {
  name: string
  loginId: string
  role: EPemission
}
