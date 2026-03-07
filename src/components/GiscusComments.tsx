import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { GISCUS_CONFIG } from "@/config/site";

/**
 * Giscus 评论组件
 * 基于 GitHub Discussions 的评论系统
 */
export function GiscusComments() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    // 如果 Giscus 未启用，则不加载
    if (!GISCUS_CONFIG.enabled) {
      return;
    }

    // 检查是否已配置（防止使用默认占位符）
    if (
      GISCUS_CONFIG.repo === "YOUR_GITHUB_USERNAME/YOUR_REPO_NAME" ||
      GISCUS_CONFIG.repoId === "YOUR_REPO_ID" ||
      GISCUS_CONFIG.categoryId === "YOUR_CATEGORY_ID"
    ) {
      console.warn(
        "Giscus 配置未完成。请先配置 GISCUS_CONFIG，详见 src/config/site.ts"
      );
      return;
    }

    // 清理之前的评论区域
    const existingScript = document.querySelector('script[src="https://giscus.app/client.js"]');
    if (existingScript?.parentElement?.id === "giscus-container") {
      existingScript.parentElement.innerHTML = "";
    }

    // 创建脚本元素
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    // 设置脚本属性
    script.setAttribute("data-repo", GISCUS_CONFIG.repo);
    script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
    script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
    script.setAttribute("data-mapping", GISCUS_CONFIG.mapping);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", GISCUS_CONFIG.reactionsEnabled ? "1" : "0");
    script.setAttribute("data-emit-metadata", GISCUS_CONFIG.emitMetadata ? "1" : "0");
    script.setAttribute("data-input-position", GISCUS_CONFIG.inputPosition);
    script.setAttribute("data-theme", isDark ? "dark" : "light");
    script.setAttribute("data-lang", GISCUS_CONFIG.lang);

    // 获取容器并附加脚本
    const container = document.getElementById("giscus-container");
    if (container) {
      container.innerHTML = ""; // 清空容器
      container.appendChild(script);
    }
  }, [isDark]);

  if (!GISCUS_CONFIG.enabled) {
    return null;
  }

  // 检查是否已配置
  if (
    GISCUS_CONFIG.repo === "YOUR_GITHUB_USERNAME/YOUR_REPO_NAME" ||
    GISCUS_CONFIG.repoId === "YOUR_REPO_ID" ||
    GISCUS_CONFIG.categoryId === "YOUR_CATEGORY_ID"
  ) {
    return (
      <div className="mt-16 pt-8 border-t border-cyan-100/50 dark:border-cyan-800/50 animate-fade-in-up">
        <div className="rounded-lg bg-cyan-50/50 dark:bg-cyan-950/30 border border-cyan-200/50 dark:border-cyan-800/50 p-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            💬 评论系统未配置
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
            请编辑 <code className="text-xs bg-slate-200/50 dark:bg-slate-800/50 px-2 py-1 rounded">src/config/site.ts</code> 文件，
            根据说明配置 Giscus 评论系统（基于 GitHub Discussions）
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      id="giscus-container"
      className="mt-16 pt-8 border-t border-cyan-100/50 dark:border-cyan-800/50 animate-fade-in-up"
    />
  );
}
