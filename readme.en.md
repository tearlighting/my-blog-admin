# 🌟 Introduction

vue-templify-layout is a Vue3 + TypeScript based layout framework for admin dashboards.
It is not just a UI shell — its core is designed with OOP abstraction, featuring middleware-based routing, theme switching via CSS variables, and strongly-typed i18n keys.

# 🔑 Core Features

## OOP Core

Encapsulated controllers for Menu, Theme, and Language, making the logic reusable across frameworks (Vue/React).

```ts
//menu core
export class MenuController {
  private _state: EMenuState

  constructor(initial: EMenuState = EMenuState.EXPANDED) {
    this._state = initial
  }

  get current() {
    return this._state
  }

  // 切换展开 / 折叠
  toggleCollapse() {
    this._state = this._state === EMenuState.COLLAPSED ? EMenuState.EXPANDED : EMenuState.COLLAPSED
  }
  toggleHidden() {
    this._state = this._state === EMenuState.HIDDEN ? EMenuState.EXPANDED : EMenuState.HIDDEN
  }
  //...
}

//menu store
export const menuManager = createMenuManager()

export const useMenuStore = defineStore("menu", () => {
  const isCollapse = ref(menuManager.isCollapsed())
  const isHidden = ref(menuManager.isHidden())
  function syncMenuInfo() {
    isCollapse.value = menuManager.isCollapsed()
    isHidden.value = menuManager.isHidden()
  }
  return {
    isCollapse,
    isHidden,
    syncMenuInfo,
  }
})

//menu hook
export const useMenu = () => {
  const { deviceType } = storeToRefs(useAppStoreHook())
  const { syncMenuInfo } = useMenuStoreHook()

  function toggleMenu() {
    if (deviceType.value === EDeviceType.MOBILE) menuManager.toggleHidden()
    else menuManager.toggleCollapse()
    syncMenuInfo() // 同步菜单信息
  }

  return {
    toggleMenu,
  }
}
```

## Middleware for Router

Inspired by server frameworks, routing guards are composed in a middleware chain:

Role-based access filtering

Hidden route filtering

Custom logics (tagView, cache control)

```ts
export function setupRouteGuard<T extends IAllStoreProps>(stores: T) {
  const changeRecactiveDataMiddleware = createChangeRecactiveDataMiddleware(stores)
  const routerBeforeEachMiddleware = createFlowMiddleware<Parameters<NavigationGuardWithThis<any>>>()
    .use(isLoginGuard)
    .use(createAuthGuard(stores.userStore, { path: "/" }))
    .use((ctx, next) => {
      changeRecactiveDataMiddleware.run(ctx)
      next()
    })
    .use(turn2PageGuard)

  router.beforeEach(async (...args) => await routerBeforeEachMiddleware.run(args))
}
```

## Theme Switching (CSS Variables)

Initially tried Provider + CSS-in-JS, but it was too verbose.
Ended up using Scoped CSS Variables, a clean way to enable theme switching.

```ts
export const themeManager = createThemeManager()
  .register({
    value: "light",
    palette: lightPalette,
    labelKey: "theme.light",
  })
  .register({
    value: "dark",
    palette: darkPalette,
    labelKey: "theme.dark",
  })
  .register({
    value: "pastel",
    palette: pastelPalette,
    labelKey: "theme.pastel",
  })
//...

export const useThemeStore = defineStore("theme", () => {
  const currentTheme = ref(themeManager.current)
  const themes = ref(themeManager.themes)
  const setTheme = (theme: Parameters<typeof themeManager.setTheme>[0]) => {
    themeManager.setTheme(theme)
    currentTheme.value = theme
  }
  return {
    currentTheme,
    themes,
    setTheme,
  }
})
```

## Strongly Typed i18n Keys

Recursive key type inference

Enforced labelKey typing

Notable TS quirk: union types without discriminators may allow both keys simultaneously

```ts
export type NestedKeys<T, P extends string = ""> =
  | ("_" extends keyof T ? (P extends "" ? never : P) : never)
  | {
      [K in Exclude<keyof T, "_"> & string]: T[K] extends Record<string, any> ? NestedKeys<T[K], AddPrefix<K, P>> : AddPrefix<K, P>
    }[Exclude<keyof T, "_"> & string]

type AddPrefix<T extends string, P extends string> = P extends "" ? T : `${P}.${T}`
//store
const languageManagerCoreIns = createLanguageCore()
  .register({
    label: "中文",
    value: "zh",
    message: zh,
  })
  .register({
    label: "English",
    value: "en",
    message: en,
  })
  .register({
    label: "日本語",
    value: "jp",
    message: jp,
  })

export const languageManager = createLanguageManagerGlue(languageManagerCoreIns, createLanguageManager)

export const useLanguageStore = defineStore("language", () => {
  const currentLocale = ref(languageManager.currentLocale)
  const languages = ref(languageManager.languages)
  return {
    currentLocale,
    languages,
  }
})

//hook
export function useLanguage() {
  const { currentLocale } = storeToRefs(useLanguageStoreHooks())

  const t = languageManager.t.bind(languageManager)
  function setLocale(locale: Parameters<typeof languageManager.setLocale>[0]) {
    languageManager.setLocale(locale)
    currentLocale.value = languageManager.currentLocale
  }
  function getMenuTitle<T extends { meta: StrictMeta }>({ meta }: T) {
    if (meta.hidden) {
      return ""
    }
    const { title, titleKey } = meta
    return titleKey ? t(titleKey) : title
  }
  return {
    setLocale,
    t,
    getMenuTitle,
  }
}
```

# 🛠️ Tech Stack

Vue3 + TypeScript + Pinia + Vue-Router

TailwindCSS + Scoped CSS Variables

Middleware-styled routing

Advanced TypeScript type-level programming
