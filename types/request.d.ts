type IResponse<T> =
  | {
      data: T
      code: number
      msg: never
    }
  | {
      data: never
      code: number
      msg: string
    }
