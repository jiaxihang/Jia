import { useEffect, useState } from "react";
import { posts } from "@/data/posts";
import { parseMarkdown } from "@/utils/markdown";

interface BlogPostViewProps {
  postId: number;
  onBack: () => void;
  prevPostId?: number;
  nextPostId?: number;
  onNavigatePost?: (id: number) => void;
}

export function BlogPostView({
  postId,
  onBack,
  prevPostId,
  nextPostId,
  onNavigatePost,
}: BlogPostViewProps) {
  const post = posts.find((p) => p.id === postId);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [postId]);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">文章未找到</p>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen pt-28 pb-20 px-6">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 opacity-[0.025] dark:opacity-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='2' /%3E%3C/filter%3E%3Crect width='100' height='100' fill='%23000' filter='url(%23noise)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-cyan-100 dark:bg-slate-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Background decorations */}
      <div className="absolute top-40 left-0 w-64 h-64 bg-cyan-100/20 rounded-full blur-3xl dark:bg-cyan-900/10" />
      <div className="absolute top-80 right-0 w-48 h-48 bg-teal-100/20 rounded-full blur-3xl dark:bg-teal-900/10" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Back button */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-600 dark:text-slate-500 dark:hover:text-cyan-400 transition-colors duration-300 mb-10 animate-fade-in"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m4 4h18" />
          </svg>
          返回文章列表
        </button>

        {/* Post header */}
        <header className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 text-xs font-sans tracking-wider text-cyan-700 bg-cyan-50 rounded-full border border-cyan-100 dark:text-cyan-300 dark:bg-cyan-950 dark:border-cyan-800">
              {post.category}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-cyan-300 dark:bg-cyan-600" />
            <span className="text-xs text-slate-400 dark:text-slate-500">{post.readTime}</span>
          </div>

          {/* Emoji cover */}
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100/50 flex items-center justify-center shadow-sm dark:from-cyan-950 dark:to-teal-950 dark:border-cyan-800/50">
              <span className="text-5xl">{post.coverEmoji}</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl md:text-4xl text-cyan-900 dark:text-cyan-100 text-center mb-3 leading-tight">
            {post.title}
          </h1>
          <p className="text-center text-slate-400 dark:text-slate-500 font-sans text-sm mb-6">
            {post.subtitle}
          </p>

          <div className="divider-ornament max-w-xs mx-auto">
            <span className="text-cyan-300 dark:text-cyan-600">❖</span>
          </div>
        </header>

        {/* Post content */}
        <article className="prose-blog animate-fade-in-up delay-200" style={{ opacity: 0 }}>
          {parseMarkdown(post.content)}
        </article>

        {/* Tags */}
        <div className="mt-16 pt-8 border-t border-cyan-100/50 dark:border-cyan-800/50 animate-fade-in-up delay-400" style={{ opacity: 0 }}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">标签：</span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs text-cyan-600 bg-cyan-50/80 rounded-full border border-cyan-100/50 font-sans dark:text-cyan-400 dark:bg-cyan-950 dark:border-cyan-800/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between items-center animate-fade-in-up delay-500" style={{ opacity: 0 }}>
          {prevPostId != null && onNavigatePost ? (
            <button
              onClick={() => onNavigatePost(prevPostId)}
              className="text-sm text-slate-400 hover:text-cyan-600 dark:text-slate-500 dark:hover:text-cyan-400 transition-colors"
            >
              ← 上一篇
            </button>
          ) : (
            <div />
          )}
          {nextPostId != null && onNavigatePost ? (
            <button
              onClick={() => onNavigatePost(nextPostId)}
              className="text-sm text-slate-400 hover:text-cyan-600 dark:text-slate-500 dark:hover:text-cyan-400 transition-colors"
            >
              下一篇 →
            </button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </section>
  );
}
