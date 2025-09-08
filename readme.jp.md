# 🌟 プロジェクト紹介

vue-templify-layout は Vue3 + TypeScript ベースの 管理システム用レイアウトフレームワーク です。
単なるレイアウトではなく、OOP の抽象化 を中心に設計され、ルーティングのミドルウェア、CSS 変数によるテーマ切替、型安全な i18n 管理を実現しています。

# 🔑 コア特徴

## OOP コア

メニュー制御、テーマ管理、言語管理などをクラスとしてカプセル化し、Vue/React どちらでも再利用可能。

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
    syncMenuInfo()
  }

  return {
    toggleMenu,
  }
}
```

## ルーティング・ミドルウェア

サーバーサイドのミドルウェア思想を導入し、beforeEach をチェーン構成：

ロールベースのアクセス制御

非表示ルートのフィルタリング

TagView・キャッシュ制御などの拡張

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

## テーマ切替 (CSS Variables)

当初は Provider + CSS-in-JS を検討したが、スタイル注入が煩雑。
最終的に Scoped CSS Variables を活用し、軽量なテーマ切替を初めて実現。

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

## 型安全な i18n 管理

ネストされたキーの型を自動推論

labelKey の厳密な型チェック

学び：識別子のないユニオン型では両方のキーが同時に存在し得る

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

# 🛠️ 技術スタック

Vue3 + TypeScript + Pinia + Vue-Router

TailwindCSS + Scoped CSS Variables

ミドルウェア式ルーティング

高度な TypeScript 型プログラミング
