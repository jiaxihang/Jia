import { motion } from "framer-motion";
import { reflections } from "@/data/reflections";
import { cn } from "@/utils/cn";

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekday = weekdays[d.getDay()];
  return `${month}月${day}日 周${weekday}`;
};

export function Reflections() {
  return (
    <section className="relative py-24 px-6" id="reflections">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-teal-100/10 rounded-full blur-3xl -translate-x-1/2" />

      <div className="max-w-2xl mx-auto relative">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 100,
              damping: 15
            }
          }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <span className="text-xs tracking-[0.3em] text-cyan-500/60 font-sans uppercase block mb-3">
            Daily
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-cyan-900 dark:text-cyan-100 mb-4">
            感悟
          </h2>
          <div className="divider-ornament max-w-xs mx-auto">
            <span className="text-cyan-300 text-lg">✦</span>
          </div>
          <p className="mt-6 text-slate-500 dark:text-slate-400 font-sans text-sm max-w-md mx-auto">
            零碎的思绪，片刻的停留
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative pl-6 md:pl-8">
          <div className="absolute left-[11px] md:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-200/60 via-cyan-300/40 to-transparent" />

          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {reflections.map((r, i) => (
              <ReflectionItem key={r.id} reflection={r} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ReflectionItem({
  reflection,
}: {
  reflection: (typeof reflections)[0];
  index: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
          }
        }
      }}
    >
      <div className="absolute left-0 md:left-0 w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 border-2 border-white shadow-sm -translate-x-[calc(0.5rem+5px)] md:-translate-x-[calc(1rem+5px)] mt-2.5" />
      <motion.article
        className={cn(
          "group pl-6 md:pl-8 py-4 pr-4 rounded-xl",
          "bg-white/50 dark:bg-slate-800/40 backdrop-blur-sm border border-cyan-50/80 dark:border-cyan-900/30",
          "hover:bg-white/80 dark:hover:bg-slate-800/60 hover:border-cyan-100/60 dark:hover:border-cyan-800/40 hover:shadow-md hover:shadow-cyan-50/50 dark:hover:shadow-cyan-950/20"
        )}
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="flex items-start gap-3">
          {reflection.mood && (
            <motion.span
              className="text-xl opacity-70 group-hover:opacity-100 flex-shrink-0"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {reflection.mood}
            </motion.span>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-serif text-cyan-900/90 dark:text-cyan-100/90 leading-relaxed text-[15px]">
              {reflection.content}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <time className="text-xs text-slate-400 dark:text-slate-500 font-sans">
                {formatDate(reflection.date)}
              </time>
              {reflection.location && (
                <>
                  <span className="w-1 h-1 rounded-full bg-cyan-300/60" />
                  <span className="text-xs text-cyan-600/80 dark:text-cyan-400/80 font-sans px-2 py-0.5 rounded-md bg-cyan-50/60 dark:bg-cyan-900/30 border border-cyan-100/50 dark:border-cyan-800/50">
                    📍 {reflection.location}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
