/**
 * 专栏 · 独立于散文的系列内容
 * 每个专栏有专属的条目，与文章( posts )完全区分
 */

export interface ColumnEntry {
  id: string;
  columnId: string;
  title: string;
  subtitle: string;
  date: string;
  excerpt: string;
  content: string;
  emoji: string;
}

export interface Column {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  description: string;
  /** 专栏详细介绍，展示在专栏页或条目页 */
  intro?: string;
  accent?: "cyan" | "teal" | "slate";
}

export const columns: Column[] = [
  {
    id: "game",
    title: "游戏专栏",
    subtitle: "Game Column",
    emoji: "⚡",
    description: "游戏推荐。",
    intro: "优秀的游戏进行模拟世界，完成个人未实现的幻想体验，并且强化自身的英雄主义，对动机强化有帮助，开设专栏记录游戏世界。",
    accent: "cyan",
  },
  {
    id: "design",
    title: "设计美学",
    subtitle: "Design & Aesthetics",
    emoji: "🎨",
    description: "东方美学与现代 UI 的碰撞，留白、韵律与意境的探索。",
    intro: "设计不仅是视觉，更是感受。本专栏尝试将东方美学的留白、韵律、意境融入现代数字产品设计，探索一种既有文化底蕴又符合当代审美的设计语言。",
    accent: "teal",
  },
  {
    id: "life",
    title: "生活随笔",
    subtitle: "Life & Thoughts",
    emoji: "🌿",
    description: "深夜的灵感、旅途的风景、咖啡与代码的交织。",
    intro: "在快节奏中寻找属于自己的节奏。记录那些不期而遇的灵感、旅途中的见闻、以及代码与生活交织的瞬间。生活需要记录，也需要留白。",
    accent: "teal",
  },
];

/** 专栏专属内容，与 posts 独立 */
export const columnEntries: ColumnEntry[] = [
  {
    id: "ce1",
    columnId: "game",
    title: "待玩游戏清单",
    subtitle: "即可享受的大作与爽感游戏",
    date: "2026年3月",
    excerpt: "组件不是越细越好，关键在于边界的划分与职责的清晰。",
    content: `
    
## 失落迷城 群星的诅咒

> 国产的类魂游戏，动漫风格

## 第一狂战士 卡赞

> 爽感类魂游戏，动漫风格

## 逐鹿汉末

> 策略的三国背景游戏

## 四海兄弟 故乡

> 四海兄弟的新作品，刷系列跟的游戏

## 末日危城 希望

> 丧尸2.5D俯视角，画风不错，玩法有点像暗黑

## 无主之地4

> 玩过无主之地3，游戏的第一人称射击刷子游戏，优秀

## 阿凡达 潘多拉边境

> 育碧的阿凡达作品，值得体验

## 生化危机9 安魂曲

> 生化危机新作，必玩作品

## 毁灭战士 黑暗时代

> 爽感游戏，值得体验

`,
    emoji: "⚡",
  },
  {
    id: "ce2",
    columnId: "game",
    title: "已玩游戏简评",
    subtitle: "从 any 到精确表达",
    date: "2024年11月",
    excerpt: "类型系统是文档，也是约束。用好它，代码会自我解释。",
    content: `## 类型的意义

类型不仅仅是编译时的检查，更是对业务逻辑的建模。

## 渐进式严格

从宽松到严格，是一个循序渐进的过程。`,
    emoji: "🎭",
  },
  {
    id: "ce3",
    columnId: "design",
    title: "留白在 UI 中的运用",
    subtitle: "少即是多的数字诠释",
    date: "2024年10月",
    excerpt: "留白不是空白，而是呼吸的空间。",
    content: `## 留白的层次

间距、边距、留白——三者共同构成了界面的呼吸感。

## 东方美学的现代转化

将传统绘画的留白理念，转化为现代 UI 的设计语言。`,
    emoji: "🎨",
  },
  {
    id: "ce4",
    columnId: "life",
    title: "咖啡馆编程记",
    subtitle: "环境与心流的关系",
    date: "2024年10月",
    excerpt: "有时候，换一个环境，就能换一种思路。",
    content: `## 环境与效率

白噪音、咖啡香、适度的嘈杂——这些元素意外地能促进专注。

## 流动的状态

心流不需要绝对安静，需要的是与当下环境的和谐。`,
    emoji: "☕",
  },
  {
    id: "ce5",
    columnId: "life",
    title: "深夜代码的仪式感",
    subtitle: "当世界安静下来",
    date: "2024年9月",
    excerpt: "深夜写代码，是一种与自己的对话。",
    content: `## 安静的力量

当白天的喧嚣褪去，思维会变得格外清晰。

## 仪式感

泡一杯茶，打开编辑器，这是一个人的仪式。`,
    emoji: "🌙",
  },
];
