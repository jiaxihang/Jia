import { motion } from "framer-motion";
import { useState } from "react";
import type { BlogPost } from "@/data/posts";

interface BlogCardProps {
  post: BlogPost;
  index: number;
  onClick: () => void;
}

export function BlogCard({ post, index, onClick }: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 100,
          damping: 15,
          delay: index * 0.15
        }
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.article
        onClick={onClick}
        className="group cursor-pointer relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-cyan-100/40 dark:border-slate-700/40 overflow-hidden transition-all duration-500 ease-out hover:border-cyan-200/60 dark:hover:border-slate-600/60 hover:-translate-y-0.5"
        whileHover={{
          y: -2,
          boxShadow: "0 0 30px rgba(6,182,212,0.1), inset 0 0 30px rgba(6,182,212,0.06)"
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Cover area with emoji */}
        <div className="relative h-48 bg-gradient-to-br from-cyan-50/90 via-teal-50/80 to-cyan-100/40 dark:from-slate-700/90 dark:via-slate-700/80 dark:to-slate-600/40 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-cyan-200/40 dark:bg-slate-600/40 blur-xl" />
            <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-teal-200/40 dark:bg-slate-500/40 blur-xl" />
          </div>
          <motion.span
            className="text-6xl drop-shadow-sm relative z-10"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {post.coverEmoji}
          </motion.span>
          {/* Category badge */}
          <motion.span
            className="absolute top-4 left-4 px-3 py-1 text-xs font-sans tracking-wider text-cyan-700 dark:text-cyan-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-cyan-100 dark:border-slate-700"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.05 }}
          >
            {post.category}
          </motion.span>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 font-sans mb-3">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-cyan-300 dark:bg-slate-600" />
            <span>{post.readTime}</span>
          </div>

          <h3 className="font-serif text-xl text-cyan-900 dark:text-cyan-100 mb-1 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors duration-300 leading-tight">
            {post.title}
          </h3>
          <p className="text-sm text-slate-400 dark:text-slate-400 mb-3 font-sans">{post.subtitle}</p>

          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 font-sans mb-4">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 text-xs text-cyan-600/70 dark:text-cyan-300/70 bg-cyan-50/80 dark:bg-slate-700/80 rounded-full font-sans"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Read more indicator */}
          <motion.div
            className="mt-4 flex items-center gap-2 text-cyan-500 dark:text-cyan-400 text-sm font-sans"
            initial={{ opacity: 0, x: -10 }}
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span>阅读全文</span>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </motion.svg>
          </motion.div>
        </div>
      </motion.article>
    </motion.div>
  );
}
