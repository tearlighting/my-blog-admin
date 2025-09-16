/**
 * 在localStorge中操作
 */
enum EMyblogToken {
  key = "MyblogAdminToken",
}
function useAuthorization() {
  /**
   *  如果同时使用了cookie，可能需要后台清下cookie
   */
  function clearAuthorization() {
    localStorage.removeItem(EMyblogToken.key)
  }
  function setAuthorization<T extends { authorization?: string }>({ authorization }: T) {
    authorization && localStorage.setItem(EMyblogToken.key, authorization)
  }
  function getAuthorization() {
    return localStorage.getItem(EMyblogToken.key)
  }
  return {
    clearAuthorization,
    setAuthorization,
    getAuthorization,
  }
}

export const { clearAuthorization, setAuthorization, getAuthorization } = useAuthorization()
