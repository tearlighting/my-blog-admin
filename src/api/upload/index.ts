import request from "@/utils/request"

export function uploadImg(file: File) {
  return request<{ url: string }>({
    url: "/upload/imgs",
    method: "post",
    data: {
      file,
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
