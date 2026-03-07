export interface BlogPost {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  coverEmoji: string;
  excerpt: string;
  content: string;
  readTime: string;
  tags: string[];
}

export { posts } from 'virtual:posts';

export const categories = ["全部", "成长", "情感", "思想"];
