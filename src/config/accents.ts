/**
 * 主题色配置
 * 每套配色包含：色板标识、Canvas 粒子用的 RGB 字符串、星星配色
 * CSS 侧通过 [data-accent] 覆盖 Tailwind 的 --color-cyan-* / --color-teal-* 变量，
 * 让全站 cyan/teal 工具类整体换色（见 index.css）
 */

export type AccentId = "cyan" | "violet" | "rose" | "amber" | "blue" | "emerald";

export interface Accent {
  id: AccentId;
  label: string;
  swatch: string; // 面板色块
  rgb: string; // 主色 500
  rgb2: string; // 辅色 500
  bright: string; // 主色 400（暗色模式高亮）
  starsDark: string[]; // 夜空星色
  starsLight: string[]; // 浅色墨点
}

export const ACCENTS: Accent[] = [
  {
    id: "cyan",
    label: "青绿",
    swatch: "#06b6d4",
    rgb: "6,182,212",
    rgb2: "13,148,136",
    bright: "34,211,238",
    starsDark: ["165,243,252", "153,246,228", "224,242,254", "255,255,255"],
    starsLight: ["8,145,178", "13,148,136", "6,182,212"],
  },
  {
    id: "violet",
    label: "紫韵",
    swatch: "#8b5cf6",
    rgb: "139,92,246",
    rgb2: "217,70,239",
    bright: "167,139,250",
    starsDark: ["221,214,254", "245,208,254", "196,181,253", "255,255,255"],
    starsLight: ["124,58,237", "192,38,211", "139,92,246"],
  },
  {
    id: "rose",
    label: "樱粉",
    swatch: "#f43f5e",
    rgb: "244,63,94",
    rgb2: "236,72,153",
    bright: "251,113,133",
    starsDark: ["254,205,211", "251,207,232", "253,164,175", "255,255,255"],
    starsLight: ["225,29,72", "219,39,119", "244,63,94"],
  },
  {
    id: "amber",
    label: "鎏金",
    swatch: "#f59e0b",
    rgb: "245,158,11",
    rgb2: "249,115,22",
    bright: "251,191,36",
    starsDark: ["253,230,138", "254,215,170", "252,211,77", "255,255,255"],
    starsLight: ["217,119,6", "234,88,12", "245,158,11"],
  },
  {
    id: "blue",
    label: "碧蓝",
    swatch: "#3b82f6",
    rgb: "59,130,246",
    rgb2: "99,102,241",
    bright: "96,165,250",
    starsDark: ["191,219,254", "199,210,254", "147,197,253", "255,255,255"],
    starsLight: ["37,99,235", "79,70,229", "59,130,246"],
  },
  {
    id: "emerald",
    label: "翠绿",
    swatch: "#10b981",
    rgb: "16,185,129",
    rgb2: "34,197,94",
    bright: "52,211,153",
    starsDark: ["167,243,208", "187,247,208", "110,231,185", "255,255,255"],
    starsLight: ["5,150,105", "22,163,74", "16,185,129"],
  },
];

export function getAccent(id: AccentId): Accent {
  return ACCENTS.find((a) => a.id === id) ?? ACCENTS[0];
}
