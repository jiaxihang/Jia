import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import fs from "fs";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 自定义插件：解析 Markdown 文件
function markdownPlugin() {
  return {
    name: 'markdown-plugin',
    resolveId(id) {
      if (id === 'virtual:posts') {
        return id;
      }
    },
    load(id) {
      if (id === 'virtual:posts') {
        const postsDir = path.resolve(__dirname, 'src/content/posts');
        const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
        const posts = files.map(file => {
          const filePath = path.join(postsDir, file);
          const content = fs.readFileSync(filePath, 'utf-8');
          const { data, content: body } = matter(content);
          const id = parseInt(file.replace('.md', ''));
          return {
            id,
            ...data,
            content: body.trim(),
          };
        }).sort((a, b) => b.id - a.id); // 按 id 降序排序

        return `export const posts = ${JSON.stringify(posts, null, 2)};`;
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [react(), tailwindcss(), markdownPlugin()];
  // 单文件模式：SINGLE_FILE=true npm run build
  if (process.env.SINGLE_FILE === "true") {
    plugins.push(viteSingleFile());
  }

  return {
    base: '/Jia/',
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  };
});