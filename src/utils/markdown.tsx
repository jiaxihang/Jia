import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import type { ReactNode } from "react";

/**
 * Markdown 解析器
 * 使用 react-markdown + remark-gfm + remark-breaks + rehype-highlight 支持完整 Markdown 语法、硬换行和代码高亮
 */
export function parseMarkdown(content: string): ReactNode {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkBreaks, remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
    >
      {content}
    </ReactMarkdown>
  );
}
