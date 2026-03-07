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
    content: "面对拉康的镜像阶段，看见的不是自我，而是一个断裂的他者。",
    mood: "🪞",
    location: "武汉",
  },
  {
    id: "r2",
    date: "2025-03-05",
    content: "萨特说存在先于本质，于是我们便能在世界中寻找我的存在。",
    mood: "💭",
    location: "武汉",
  },
  {
    id: "r3",
    date: "2025-03-04",
    content: "康德的星空在我面前展开，逻辑与直觉交织成无限的可能。",
    mood: "🌌",
    location: "武汉",
  },
  {
    id: "r4",
    date: "2025-03-03",
    content: "弗洛伊德的潜意识像一座未探明的岛屿，我的梦便是那潮汐。",
    mood: "🌊",
    location: "武汉",
  },
  {
    id: "r5",
    date: "2025-03-02",
    content: "在黑格尔的辩证法里，每一次否定都是对自己的再认识。",
    mood: "⚖️",
    location: "武汉",
  },
  {
    id: "r6",
    date: "2025-03-01",
    content: "当我读德里达，文字的边缘开始颤抖，意义逃逸于裂缝之间。",
    mood: "📜",
    location: "武汉",
  },
  {
    id: "r7",
    date: "2025-02-28",
    content: "柏拉图的洞穴里，我们都是看影子的人，真实被光遮蔽。",
    mood: "🔦",
    location: "武汉",
  },
  {
    id: "r8",
    date: "2025-02-27",
    content: "拉康说话语即无意识，诗句里藏着我无法述说的渴望。",
    mood: "✒️",
    location: "武汉",
  },


];
