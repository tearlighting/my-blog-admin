// 环境变量定义你的网站完整前缀（带或不带域名都行）
// 例如：
// VITE_SITE_BASE = 'https://myblog.com/my-site'
const SITE_BASE = import.meta.env.VITE_SITE_BASE?.replace(/\/$/, "") ?? ""

/**
 * 显示阶段：补上站点前缀
 * 例：/uploads/a.png → https://myblog.com/my-site/uploads/a.png
 */
export function addSiteBase(srcStr: string) {
  if (!SITE_BASE) return srcStr
  return srcStr.replace(/src="\/(uploads\/[^"]+)"/g, (_, path) => `src="${SITE_BASE}/${path}"`)
}

/**
 * 保存阶段：去掉站点前缀（域名 + 网站名）
 * 例：https://myblog.com/my-site/uploads/a.png → /uploads/a.png
 */
export function removeSiteBase(srcStr: string) {
  if (!SITE_BASE) return srcStr
  const escapedBase = SITE_BASE.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
  const regex = new RegExp(`src="${escapedBase}/(uploads/[^"]+)"`, "g")
  return srcStr.replace(regex, 'src="/$1"')
}

export function addSiteBaseToMd(md: string) {
  if (!SITE_BASE) return md
  return md.replace(/!\[(.*?)\]\(\/(uploads\/.*?)\)/g, (_, alt, path) => `![${alt}](${SITE_BASE}/${path})`)
}

export function removeSiteBaseFromMd(md: string) {
  if (!SITE_BASE) return md
  const escapedBase = SITE_BASE.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
  const regex = new RegExp(`!\\[(.*?)\\]\\(${escapedBase}/(uploads/.*?)\\)`, "g")
  return md.replace(regex, "![$1](/$2)")
}

/** 保存前：如果是自家站点的完整 URL，就还原成相对路径；否则保持不变 */
export function removeSiteBaseFromUrl(url: string): string {
  if (!SITE_BASE) return url
  // 统一比较：把 base 和 url 都处理成不以 / 结尾
  const base = SITE_BASE
  if (url.startsWith(base + "/")) {
    const rest = url.slice(base.length) // 前面去掉 base
    return rest.startsWith("/") ? rest : "/" + rest // 确保以 / 开头
  }
  return url
}

/** 显示前：如果是相对路径（/开头，非 //、非 http），给它补上站点前缀；否则保持不变 */
export function addSiteBaseToUrl(pathOrUrl: string): string {
  if (!SITE_BASE) return pathOrUrl
  if (/^https?:\/\//i.test(pathOrUrl) || pathOrUrl.startsWith("//")) return pathOrUrl
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : "/" + pathOrUrl
  return `${SITE_BASE}${path}`
}
