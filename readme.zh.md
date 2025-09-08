# 🌟 项目介绍

vue-templify-layout 是一个基于 Vue3 + TypeScript 的管理系统布局框架。
它不仅仅是一个简单的 layout，而是尝试将 核心逻辑抽象为 OOP 对象，并在实践中引入了中间件式的路由处理、主题切换、以及类型安全的 i18n 管理。

# 🔑 核心特性

## 面向对象的核心 (OOP Core)

将菜单控制、主题管理、语言管理等封装为类，逻辑清晰，便于跨框架迁移（Vue/React 都可重用）。

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

## 路由中间件 (Middleware for Router)

借鉴服务端框架的中间件机制，实现了 beforeEach 的链式过滤：

权限过滤（roles-based）

隐藏路由过滤（hidden routes）

其它自定义逻辑（如 tagView、缓存控制）

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

## 主题切换 (CSS Variables)

起初尝试过 Provider + CSS-in-JS，但在样式注入上过于繁琐。
最终采用 CSS 变量 + 作用域特性，首次实现了轻量级的主题切换。

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

## 强类型的 i18n 管理

自动推导嵌套的 locale key 类型

实现了 labelKey 的强校验

踩坑记录：发现 TS 的联合类型在没有模式区分时会导致两个 key 同时存在

```ts
export type NestedKeys<T, P extends string = ""> =
  // 如果有 "_"，把自己算一个 key
  | ("_" extends keyof T ? (P extends "" ? never : P) : never)
  // 然后继续递归子节点
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

# 🛠️ 技术点

Vue3 + TypeScript + Pinia + Vue-Router

TailwindCSS + Scoped CSS Variables

Middleware 风格的路由控制

强类型工具链（泛型推导、联合/交叉类型计算）
