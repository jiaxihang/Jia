/**
 * 专栏  独立于散文的系列内容
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
    subtitle: "Game",
    emoji: "⚡",
    description: "游戏推荐。",
    intro: "优秀的游戏进行模拟世界，完成个人未实现的幻想体验，并且强化自身的英雄主义，对动机强化有帮助，开设专栏记录游戏世界。",
    accent: "cyan",
  },
  {
    id: "Contemplation",
    title: "关于我的思考",
    subtitle: "Thoughts",
    emoji: "✨",
    description: "反思带来人生深度。",
    intro: "关于哲学、精神分析、心理学、语言学等诸多领域的思考。",
    accent: "teal",
  },
  {
    id: "Education",
    title: "成长路上我们早就该教给孩子的那几堂课",
    subtitle: "Education",
    emoji: "🌿",
    description: "我们的心中的都有一个孩子。",
    intro: "教育是激发，而非灌输，在专栏中讲一些关于看见的教育分享。",
    accent: "slate",
  },
];

/** 专栏专属内容，与 posts 独立，从 markdown 文件动态读取 */
export { columnEntries } from 'virtual:columns';
