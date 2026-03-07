# 浮光掠影 · 个人博客

我的个人博客，采用 React + TypeScript + Vite + Tailwind CSS 构建

在这里面，会介绍我的主要文章作品、特色专栏、感悟随想、以及我的介绍
## 💬 评论系统

本项目已集成 **Giscus** 评论系统，基于 GitHub Discussions

### 快速启用

1. 查看 [GISCUS_SETUP.md](./GISCUS_SETUP.md) 了解详细配置步骤
2. 在 [giscus.app](https://giscus.app/zh-CN) 获取配置参数
3. 更新 `src/config/site.ts` 中的 `GISCUS_CONFIG`
4. 完成！评论区会自动显示在文章详情页底部

## 🚀 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```