/**
 * Giscus 配置示例
 * 
 * 这是一个完整配置示例。
 * 请根据您的 GitHub 仓库信息，
 * 将这里的值复制到 src/config/site.ts 中的 GISCUS_CONFIG
 */

// 示例 1：基础配置（推荐）
export const GISCUS_CONFIG_EXAMPLE_1 = {
  // 仓库名称（GitHub username/repository name）
  repo: "jiaxihang/elegant-animated-personal-blog",

  // 从 https://giscus.app 获取的仓库 ID
  // 步骤：访问 giscus.app → 填入仓库 → 复制 data-repo-id 的值
  repoId: "R_kgDOLsTKww",

  // Discussion 分类 ID
  // 步骤：在 giscus.app 选择分类后，复制 data-category-id 的值
  categoryId: "DIC_kwDOLsTKws4CdiPh",

  // 映射方式：使用路径名（不同页面自动分离评论）
  mapping: "pathname" as const,

  // 评论输入框位置
  inputPosition: "bottom" as const,

  // 启用表情反应
  reactionsEnabled: true as const,

  // 不发送页面元数据
  emitMetadata: false as const,

  // 自动跟随系统主题
  theme: "preferred_color_scheme" as const,

  // 中文界面
  lang: "zh-CN" as const,

  // 启用 Giscus
  enabled: true,
} as const;

// 示例 2：更多高级配置选项
export const GISCUS_CONFIG_EXAMPLE_2 = {
  repo: "your-username/your-repo",
  repoId: "YOUR_REPO_ID",
  categoryId: "YOUR_CATEGORY_ID",

  // 映射方式选择（三选一）：
  // - "pathname"：基于页面路径（推荐用于博客）
  // - "url"：基于完整 URL
  // - "title"：基于页面标题
  mapping: "pathname" as const,

  // 严格模式：只有完全匹配的页面才显示评论
  // 0 = 禁用（推荐）, 1 = 启用
  strict: "0" as const,

  // 表情反应
  reactionsEnabled: true as const,

  // 发送元数据（GitHub 用户信息等）
  emitMetadata: false as const,

  // 输入框位置
  inputPosition: "bottom" as const,

  // 主题选择（四选一）：
  // - "light"：亮色主题
  // - "dark"：暗色主题
  // - "dark_dimmed"：暗色 dimmed
  // - "preferred_color_scheme"：跟随系统（推荐）
  theme: "preferred_color_scheme" as const,

  // 语言选择
  // 支持的语言：de, en, es, fr, it, ja, ko, pt, ru, tr, zh-CN, zh-TW
  lang: "zh-CN" as const,

  enabled: true,
} as const;

/**
 * 获取 Giscus 配置的步骤：
 * 
 * 1. 前往 https://giscus.app（中文版 https://giscus.app/zh-CN）
 * 
 * 2. 在 "Repository" 字段输入您的仓库名
 *    格式：username/repository
 *    例如：jiaxihang/elegant-animated-personal-blog
 * 
 * 3. 页面会显示您的仓库 ID，复制 data-repo-id 的值
 *    示例：data-repo-id="R_kgDOLsTKww"
 * 
 * 4. 在 "Discussion category" 选择一个分类
 *    （如果还没有创建分类，先在 GitHub 仓库创建一个）
 * 
 * 5. 复制 data-category-id 的值
 *    示例：data-category-id="DIC_kwDOLsTKws4CdiPh"
 * 
 * 6. 将上面的值填入 src/config/site.ts 的 GISCUS_CONFIG
 */

/**
 * 创建 Discussion 分类的步骤：
 * 
 * 1. 进入您的 GitHub 仓库
 * 2. 点击 "Discussions" 标签页
 * 3. 点击 "Categories" 按钮
 * 4. 点击 "New category" 创建新分类
 * 5. 输入分类名（如 "Blog Comments"）和描述
 * 6. 点击 "Create"
 * 
 * 提示：如果要在同一个仓库中管理多个博客的评论，
 * 建议为每个博客创建一个专属的分类。
 */
