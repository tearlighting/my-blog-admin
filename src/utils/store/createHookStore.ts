export const createHookStore = <T>(hook: () => T) => {
  const closure = hook()
  return () => closure
}
