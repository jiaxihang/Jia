/**
 * 站点全局配置
 * 集中管理导航、元信息等，便于维护与扩展
 */

export const SITE = {
  name: "浮光掠影",
  tagline: "以文字记录时光，用代码编织梦想",
  description: "个人博客 · 技术分享 · 生活随笔",
  year: new Date().getFullYear(),
} as const;

export const NAV_ITEMS = [
  { id: "home", label: "首页", path: "/" },
  { id: "blog", label: "文章", path: "/blog" },
  { id: "columns", label: "专栏", path: "/columns" },
  { id: "reflections", label: "感悟", path: "/reflections" },
  { id: "about", label: "关于", path: "/about" },
] as const;

export type NavId = (typeof NAV_ITEMS)[number]["id"];
