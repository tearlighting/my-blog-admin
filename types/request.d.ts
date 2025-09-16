type IResponse<T> =
  | {
      data: T
      code: number
      msg: null
    }
  | {
      data: null
      code: number
      msg: string
    }
