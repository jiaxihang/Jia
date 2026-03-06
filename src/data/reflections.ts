/**
 * 每日感悟 · 小日记
 * 按时间倒序，最新在最上
 */
export interface Reflection {
  id: string;
  date: string;
  content: string;
  mood?: string;
  location?: string;
}

export const reflections: Reflection[] = [
  {
    id: "r1",
    date: "2025-03-06",
    content: "代码写多了，偶尔抬头看看窗外的云，会发现调试的焦虑会随着风飘走。",
    mood: "☁️",
    location: "杭州 · 西湖边",
  },
  {
    id: "r2",
    date: "2025-03-05",
    content: "最好的设计往往来自减法，而不是加法。",
    mood: "✨",
    location: "上海",
  },
  {
    id: "r3",
    date: "2025-03-04",
    content: "一杯咖啡的温度，恰好能融化一个卡住的 bug。",
    mood: "☕",
    location: "杭州 · 某咖啡馆",
  },
  {
    id: "r4",
    date: "2025-03-03",
    content: "写代码和写诗一样，都需要留白。",
    mood: "📝",
    location: "家中",
  },
  {
    id: "r5",
    date: "2025-03-02",
    content: "有时候，停下来比跑得更快更重要。",
    mood: "🌿",
    location: "大理",
  },
  {
    id: "r6",
    date: "2025-03-01",
    content: "每一个 commit 都是写给未来自己的信。",
    mood: "💌",
    location: "杭州",
  },
  {
    id: "r7",
    date: "2025-02-28",
    content: "技术会过时，但思考问题的方式不会。",
    mood: "💡",
    location: "北京",
  },
  {
    id: "r8",
    date: "2025-02-27",
    content: "在快节奏里，慢下来是一种能力。",
    mood: "🍃",
    location: "成都",
  },
  {
    id: "r8",
    date: "2025-02-27",
    content: "每个人的故事都值得去记录。",
    mood: "💌",
    location: "武汉",
  },

];
