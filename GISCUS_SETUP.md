# Giscus 评论系统配置指南

本项目已集成 **Giscus** 评论系统，这是一个基于 GitHub Discussions 的现代化评论解决方案。

## 📋 前置要求

- 一个 GitHub 账户
- 一个 GitHub 仓库（用于存放 Discussion）
- 该仓库已启用 Discussions 功能

## ⚙️ 配置步骤

### 1. 在 GitHub 仓库启用 Discussions

1. 登录 GitHub，进入您的仓库
2. 点击 **Settings**（设置）
3. 在左侧菜单中找到 **Features**
4. 勾选 **Discussions** 选项
5. 点击 **Save**

### 2. 创建 Discussion 分类

1. 在仓库页面，点击 **Discussions** 标签
2. 点击 **Categories** 按钮
3. 默认会有一个 "General" 分类，或点击 **New category** 创建新分类
4. 可创建名为 "Blog Comments" 或 "Posts" 的分类用于博客评论
5. 记住分类名称

### 3. 获取 Giscus 配置参数

访问 [giscus.app](https://giscus.app) 或 [中文版本](https://giscus.app/zh-CN)

按以下步骤填写：

1. **Repository**（仓库）
   - 填入：`YOUR_GITHUB_USERNAME/YOUR_REPO_NAME`
   - 例如：`jiaxihang/elegant-animated-personal-blog`
   - 点击搜索，确保仓库信息正确

2. **Page ↔ Discussions Mapping**（页面映射方式）
   - 选择 **pathname**（推荐用于博客）
   - 这样不同页面的评论会自动分离

3. **Discussions Category**（Discussion 分类）
   - 选择您创建的分类
   - 例如："General" 或 "Blog Comments"

4. **Theme**（主题）
   - 默认选择 **Preferred color scheme**
   - 这样会自动跟随用户系统主题设置

完成后，页面会生成配置代码。您需要的参数包括：
- `data-repo`：仓库名（格式：owner/repo）
- `data-repo-id`：仓库 ID
- `data-category-id`：分类 ID

### 4. 更新项目配置

编辑 `src/config/site.ts`，找到 `GISCUS_CONFIG` 对象，替换以下值：

```typescript
export const GISCUS_CONFIG = {
  // 替换为您的仓库
  repo: "jiaxihang/elegant-animated-personal-blog",

  // 从 giscus.app 获取的仓库 ID
  repoId: "R_kgDOKxyz123",

  // 从 giscus.app 获取的分类 ID
  categoryId: "DIC_kwDOKxyz123-xyz456",

  // 其他配置项...
};
```

### 5. 测试配置

1. 在本地启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问任何一篇文章详情页
3. 滚动到页面底部，应该看到 Giscus 评论区域
4. 如果配置有误，会看到提示信息

## 🔧 配置选项说明

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `repo` | GitHub 仓库（格式：owner/repo） | 必填 |
| `repoId` | 仓库的 GraphQL ID | 必填 |
| `categoryId` | Discussion 分类的 GraphQL ID | 必填 |
| `mapping` | 页面与 Discussion 映射方式（pathname/url/title） | `pathname` |
| `inputPosition` | 评论框位置（top/bottom） | `bottom` |
| `reactionsEnabled` | 是否启用表情反应 | `true` |
| `emitMetadata` | 是否发送元数据 | `false` |
| `theme` | 主题（light/dark/preferred_color_scheme） | `preferred_color_scheme` |
| `lang` | 语言 | `zh-CN` |
| `enabled` | 是否启用 Giscus | `true` |

## 🎨 自定义主题

项目已配置 Giscus 自动跟随系统主题（亮色/暗色）。如需修改，编辑 `src/config/site.ts` 中的 `theme` 选项：

- `light`：始终使用亮色主题
- `dark`：始终使用暗色主题
- `preferred_color_scheme`：跟随系统设置（推荐）

## 🚀 启用/禁用评论

### 完全禁用 Giscus

编辑 `src/config/site.ts`，将 `enabled` 设为 `false`：

```typescript
enabled: false,
```

或使用环境变量：

```bash
VITE_GISCUS_ENABLED=false npm run dev
```

### 条件启用

在生产环境启用，开发环境禁用：

```typescript
enabled: import.meta.env.PROD,
```

## 📚 常见问题

### Q: 如何删除所有评论？
**A:** 在 GitHub Discussion 中删除相应的 Discussion 即可。若要保留 Discussion 但隐藏评论，可编辑 Discussion 为锁定状态。

### Q: 可以在多个博客使用同一个 Discussion 分类吗？
**A:** 可以，但不同站点的评论会混在一起。建议为不同站点创建不同的仓库或分类。

### Q: 评论不显示怎么办？
1. 确认仓库信息正确（`repo`、`repoId`、`categoryId`）
2. 确认该仓库已启用 Discussions
3. 确认浏览器没有阻止脚本加载
4. 检查浏览器控制台是否有错误信息

### Q: 可以修改评论框的样式吗？
**A:** Giscus 的样式由 Giscus 官方控制，但项目的容器样式可在 `src/components/GiscusComments.tsx` 中修改。

## 📖 相关资源

- [Giscus 官方文档](https://giscus.app)
- [Giscus GitHub 仓库](https://github.com/giscus/giscus)
- [GitHub Discussions 文档](https://docs.github.com/en/discussions)

## 🆘 需要帮助？

如遇到问题，请：
1. 检查 Giscus 配置是否正确
2. 查看浏览器控制台的错误信息
3. 访问 [Giscus Discussions](https://github.com/giscus/giscus/discussions) 获取支持
