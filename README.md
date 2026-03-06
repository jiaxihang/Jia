# 浮光掠影 · 个人博客

优雅动效的个人博客项目，采用 React + TypeScript + Vite + Tailwind CSS 构建。

## 功能特性

- **首页**：Hero 区、精选语录、专栏、文章列表
- **文章**：分类筛选、卡片展示、详情阅读
- **专栏**：按主题整理的系列内容
- **关于**：个人主页 / 简历风格展示
- **路由**：基于 React Router 的 Hash 路由，支持深链接与浏览器前进后退
- **动效**：滚动进入动画、过渡效果、粒子背景

## 技术栈

- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- React Router DOM

## 开发

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 构建

```bash
# 标准构建（多文件，利于缓存与 CDN）
npm run build

# 单文件构建（适合离线或特殊部署）
npm run build:single
```

## 项目结构

```
src/
├── components/     # 可复用组件
├── config/         # 站点配置（导航、元信息）
├── data/           # 数据（文章、专栏、关于）
├── hooks/          # 自定义 Hooks
├── pages/          # 页面组件
├── routes/         # 路由配置
├── types/          # 类型定义
└── utils/          # 工具函数
```

## 自定义

- **站点信息**：`src/config/site.ts`
- **文章数据**：`src/data/posts.ts`
- **专栏数据**：`src/data/columns.ts`
- **关于页**：`src/data/about.ts`

## License

MIT
