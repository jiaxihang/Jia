import type { ReactNode } from "react";

/**
 * 简易 Markdown 解析器
 * 支持 ## 标题、> 引用、段落
 * 后续可替换为 react-markdown 等库
 */
export function parseMarkdown(content: string): ReactNode[] {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let blockquoteBuffer: string[] = [];

  const flushBlockquote = () => {
    if (blockquoteBuffer.length > 0) {
      elements.push(
        <blockquote key={`bq-${elements.length}`}>
          {blockquoteBuffer.map((line, i) => (
            <p key={i}>{line.replace(/^>\s*/, "")}</p>
          ))}
        </blockquote>
      );
      blockquoteBuffer = [];
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("> ")) {
      blockquoteBuffer.push(trimmed);
      return;
    }
    flushBlockquote();

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${elements.length}`}>{trimmed.replace("## ", "")}</h2>
      );
    } else if (trimmed !== "") {
      elements.push(<p key={`p-${elements.length}`}>{trimmed}</p>);
    }
  });

  flushBlockquote();
  return elements;
}
