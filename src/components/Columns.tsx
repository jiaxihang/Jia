import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { columns, columnEntries } from "@/data/columns";
import { cn } from "@/utils/cn";

interface ColumnsProps {
  onSelectEntry?: (columnId: string, entryId: string) => void;
}

export function Columns({ onSelectEntry }: ColumnsProps) {
  const { ref: titleRef, isInView: titleInView } = useInView();
  const [searchQuery, setSearchQuery] = useState("");

  const getEntriesByColumnId = (columnId: string) =>
    columnEntries
      .filter((e) => e.columnId === columnId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 过滤专栏和条目
  const filteredColumns = columns.filter((column) => {
    const entries = getEntriesByColumnId(column.id);

    // 检查专栏本身是否匹配搜索
    const columnMatch = searchQuery === "" ||
      column.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      column.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      column.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (column.intro && column.intro.toLowerCase().includes(searchQuery.toLowerCase()));

    // 检查专栏下的条目是否匹配搜索
    const entriesMatch = entries.some(entry =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return columnMatch || entriesMatch;
  });

  return (
    <section className="relative pt-28 pb-24 px-6" id="columns">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-cyan-100/8 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto">
        <div
          ref={titleRef}
          className={cn("text-center mb-16", !titleInView && "opacity-0")}
        >
          <div className={cn(titleInView ? "animate-fade-in-up" : "opacity-0")}>
            <span className="text-xs tracking-[0.3em] text-cyan-500/60 font-sans uppercase block mb-3">
              Columns
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-cyan-900 dark:text-cyan-100 mb-4">
              专栏
            </h2>
            <div className="divider-ornament max-w-xs mx-auto">
              <span className="text-cyan-300 text-lg">✦</span>
            </div>
            <p className="mt-6 text-slate-500 dark:text-slate-400 font-sans text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              按主题整理的系列内容，与零散文章独立，深入探索技术与生活的交汇
            </p>
          </div>
        </div>

        {/* Search box */}
        <div className={`max-w-md mx-auto mb-12 ${titleInView ? "animate-fade-in-up delay-100" : "opacity-0"}`}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索专栏或条目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-cyan-100/50 dark:border-slate-700/50 rounded-full text-sm font-sans placeholder-slate-400 dark:placeholder-slate-500 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 dark:focus:ring-cyan-400/50 focus:border-cyan-300 dark:focus:border-cyan-600 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColumns.map((column, index) => {
            const entries = getEntriesByColumnId(column.id);
            const accentClass =
              column.accent === "teal"
                ? "from-teal-50/90 via-cyan-50/70 to-teal-50/90"
                : "from-cyan-50/90 via-teal-50/70 to-cyan-50/90";

            return (
              <ColumnCard
                key={column.id}
                column={column}
                entries={entries}
                index={index}
                accentClass={accentClass}
                onSelectEntry={onSelectEntry}
              />
            );
          })}
        </div>

        {filteredColumns.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-slate-400 dark:text-slate-500 font-sans">
              {searchQuery ? "没有找到匹配的专栏或条目" : "暂无专栏内容"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 px-4 py-2 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-sans underline underline-offset-2 transition-colors duration-200"
              >
                清除搜索
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

interface ColumnCardProps {
  column: (typeof columns)[0];
  entries: (typeof columnEntries)[0][];
  index: number;
  accentClass: string;
  onSelectEntry?: (columnId: string, entryId: string) => void;
}

function ColumnCard({
  column,
  entries,
  index,
  accentClass,
  onSelectEntry,
}: ColumnCardProps) {
  const { ref, isInView } = useInView(0.1);
  const [showIntro, setShowIntro] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={cn("opacity-0", isInView && "animate-fade-in-up")}
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <motion.article
        className={cn(
          "group relative h-full rounded-2xl border overflow-hidden transition-all duration-500",
          "bg-gradient-to-br dark:from-slate-800/60 dark:via-cyan-950/30 dark:to-slate-800/60",
          accentClass,
          "dark:from-slate-800/70 dark:via-cyan-950/40 dark:to-slate-800/70",
          "border-cyan-100/40 dark:border-cyan-900/30 hover:border-cyan-200/60 dark:hover:border-cyan-800/40 hover:-translate-y-0.5"
        )}
        whileHover={{
          y: -2,
          boxShadow: "0 0 30px rgba(6,182,212,0.08), inset 0 0 30px rgba(6,182,212,0.06)"
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative p-8 pb-6">
          <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-cyan-200/15 dark:bg-cyan-500/10 blur-xl group-hover:bg-cyan-200/25 transition-colors duration-500" />
          <div className="relative">
            <span className="text-xs tracking-[0.2em] text-cyan-600/60 dark:text-cyan-400/60 font-sans uppercase block mb-3">
              {column.subtitle}
            </span>
            <div className="flex items-start gap-4 mb-4">
              <span className="text-5xl group-hover:scale-105 transition-transform duration-500 drop-shadow-sm">
                {column.emoji}
              </span>
              <div>
                <h3 className="font-serif text-xl text-cyan-900 dark:text-cyan-100 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors duration-300">
                  {column.title}
                </h3>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              {column.description}
            </p>
            {column.intro && (
              <div className="mt-4">
                <button
                  onClick={() => setShowIntro(!showIntro)}
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-sans flex items-center gap-1 transition-colors"
                >
                  {showIntro ? "收起介绍" : "专栏介绍"}
                  <svg className={cn("w-3.5 h-3.5 transition-transform", showIntro && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showIntro && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    {column.intro}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {entries.length > 0 && (
          <div className="px-8 pb-8 pt-2">
            <div className="pt-4 border-t border-cyan-100/40">
              <span className="text-xs text-slate-400 font-sans tracking-wider block mb-3">
                专栏内容
              </span>
              <ul className="space-y-2 max-h-46 overflow-y-auto">
                {entries.map((entry) => (
                  <li key={entry.id}>
                    <button
                      onClick={() => onSelectEntry?.(column.id, entry.id)}
                      className={cn(
                        "w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl",
                        "text-sm font-sans text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300",
                        "bg-white/30 dark:bg-slate-700/20 hover:bg-white/60 dark:hover:bg-slate-700/40 border border-transparent hover:border-cyan-100/40 dark:hover:border-cyan-800/30",
                        "transition-all duration-300 group/card"
                      )}
                    >
                      <span className="text-lg">{entry.emoji}</span>
                      <span className="flex-1 truncate">{entry.title}</span>
                      <svg
                        className="w-4 h-4 text-cyan-400 opacity-0 group-hover/card:opacity-100 transition-opacity flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
              {entries.length > 3 && (
                <p className="text-xs text-slate-400 mt-2">
                  共 {entries.length} 篇
                </p>
              )}
            </div>
          </div>
        )}
      </motion.article>
    </div>
  );
}
