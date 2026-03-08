import { useEffect } from "react";
import { motion } from "framer-motion";
import { columnEntries, columns } from "@/data/columns";
import { parseMarkdown } from "@/utils/markdown";

interface ColumnEntryViewProps {
  entryId: string;
  onBack: () => void;
  prevEntryId?: string;
  nextEntryId?: string;
  onNavigateEntry?: (entryId: string) => void;
}

export function ColumnEntryView({
  entryId,
  onBack,
  prevEntryId,
  nextEntryId,
  onNavigateEntry,
}: ColumnEntryViewProps) {
  const entry = columnEntries.find((e) => e.id === entryId);
  const column = entry ? columns.find((c) => c.id === entry.columnId) : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [entryId]);

  if (!entry || !column) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400 dark:text-slate-500">内容未找到</p>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen pt-28 pb-20 px-6">
      <div className="absolute top-40 left-0 w-64 h-64 bg-cyan-100/15 dark:bg-cyan-900/10 rounded-full blur-3xl" />
      <div className="absolute top-80 right-0 w-48 h-48 bg-teal-100/15 dark:bg-teal-900/10 rounded-full blur-3xl" />

      <div className="max-w-3xl mx-auto relative z-10">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors duration-300 mb-10 animate-fade-in"
        >
          <motion.svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            whileHover={{
              x: -4,
              transition: {
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1]
              }
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m4 4h18" />
          </motion.svg>
          返回专栏
        </button>

        {/* 专栏介绍 */}
        {column.intro && (
          <div className="mb-10 p-5 rounded-xl bg-cyan-50/60 dark:bg-cyan-950/20 border border-cyan-100/50 dark:border-cyan-800/30 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-cyan-600 dark:text-cyan-400 font-sans text-xs font-medium tracking-wider">
                专栏介绍
              </span>
              <span>{column.emoji}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              {column.intro}
            </p>
          </div>
        )}

        <header className="mb-12 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-sans tracking-wider text-cyan-700 dark:text-cyan-300 bg-cyan-50/80 dark:bg-cyan-900/40 rounded-full border border-cyan-100/60 dark:border-cyan-800/40 mb-6">
            <span>{column.emoji}</span>
            {column.title}
          </span>
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/30 dark:to-teal-900/30 border border-cyan-100/50 dark:border-cyan-800/30 flex items-center justify-center shadow-sm">
              <span className="text-4xl">{entry.emoji}</span>
            </div>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-cyan-900 dark:text-cyan-100 text-center mb-3 leading-tight">
            {entry.title}
          </h1>
          <p className="text-center text-slate-400 dark:text-slate-500 font-sans text-sm mb-6">
            {entry.subtitle}
          </p>
          <p className="text-center text-xs text-slate-400 dark:text-slate-500">{entry.date}</p>
          <div className="divider-ornament max-w-xs mx-auto mt-6">
            <span className="text-cyan-300 dark:text-cyan-600">❖</span>
          </div>
        </header>

        <article className="prose-blog animate-fade-in-up delay-200" style={{ opacity: 0 }}>
          {parseMarkdown(entry.content)}
        </article>

        {/* 上下篇导航 */}
        <div className="mt-16 pt-8 border-t border-cyan-100/50 dark:border-cyan-800/30 flex justify-between items-center animate-fade-in-up delay-400" style={{ opacity: 0 }}>
          {prevEntryId != null && onNavigateEntry ? (
            <button
              onClick={() => onNavigateEntry(prevEntryId)}
              className="text-sm text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m4 4h18" />
              </svg>
              上一篇
            </button>
          ) : (
            <div />
          )}
          {nextEntryId != null && onNavigateEntry ? (
            <button
              onClick={() => onNavigateEntry(nextEntryId)}
              className="text-sm text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-2"
            >
              下一篇
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}
