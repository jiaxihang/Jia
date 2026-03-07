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
/**
 * Giscus 评论系统配置
 * 基于 GitHub Discussions
 * 
 * 如何配置：
 * 1. Fork 或使用您的 GitHub 仓库
 * 2. 启用 Discussions 功能：仓库设置 → Features → Discussions
 * 3. 访问 https://giscus.app (中文: https://giscus.app/zh-CN)
 * 4. 填入您的仓库信息，获取 repoId 和 categoryId
 * 5. 将下面的配置替换为获取的值
 */
export const GISCUS_CONFIG = {
  // GitHub 仓库信息（格式：owner/repo）
  // 替换为您的仓库，例如：'jiaxihang/elegant-animated-personal-blog'
  repo: "YOUR_GITHUB_USERNAME/YOUR_REPO_NAME" as const,

  // 仓库 ID（从 giscus.app 获取）
  repoId: "YOUR_REPO_ID" as const,

  // Discussion 分类 ID（从 giscus.app 获取）
  categoryId: "YOUR_CATEGORY_ID" as const,

  // 页面与 Discussion 的映射方式
  // 'pathname': 基于页面路径映射（推荐）
  // 'url': 基于完整 URL 映射
  // 'title': 基于页面标题映射
  mapping: "pathname" as const,

  // 评论输入框位置
  inputPosition: "bottom" as const,

  // 是否启用表情反应
  reactionsEnabled: true as const,

  // 是否发送页面元数据
  emitMetadata: false as const,

  // 主题
  // 'light': 亮色主题
  // 'dark': 暗色主题
  // 'dark_dimmed': 暗色 dimmed 主题
  // 'preferred_color_scheme': 跟随系统主题
  theme: "preferred_color_scheme" as const,

  // 语言
  lang: "zh-CN" as const,

  // 是否启用 Giscus
  enabled: process.env.VITE_GISCUS_ENABLED !== "false",
} as const;