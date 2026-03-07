import { useState } from "react";
import { posts, categories } from "@/data/posts";
import { BlogCard } from "@/components/BlogCard";
import { useInView } from "@/hooks/useInView";

interface BlogListProps {
  onSelectPost: (id: number) => void;
}

export function BlogList({ onSelectPost }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState("全部");
  const { ref: titleRef, isInView: titleInView } = useInView();

  const filteredPosts =
    activeCategory === "全部"
      ? posts
      : posts.filter((p) => p.category === activeCategory);

  return (
    <section className="relative pt-28 pb-24 px-6" id="blog">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <div ref={titleRef} className={`text-center mb-16 ${titleInView ? "" : "opacity-0"}`}>
          <div className={`${titleInView ? "animate-fade-in-up" : "opacity-0"}`}>
            <span className="text-xs tracking-[0.3em] text-cyan-500/60 font-sans uppercase block mb-3">
              Articles
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-cyan-900 dark:text-cyan-100 mb-4">
              文章集
            </h2>
            <div className="divider-ornament max-w-xs mx-auto">
              <span className="text-cyan-300 text-lg">✦</span>
            </div>
            <p className="mt-6 text-slate-500 font-sans text-sm max-w-xl mx-auto">
              独立文章
            </p>
          </div>
        </div>

        {/* Category filter */}
        <div className={`flex flex-wrap items-center justify-center gap-2 mb-12 ${titleInView ? "animate-fade-in-up delay-200" : "opacity-0"}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-sm font-sans rounded-full transition-all duration-400 ${activeCategory === cat
                ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md shadow-cyan-200 dark:shadow-slate-900/50"
                : "text-slate-500 hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-400 bg-white/50 dark:bg-slate-800/50 border border-cyan-100/50 dark:border-slate-700/50 hover:border-cyan-200 dark:hover:border-slate-600"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              index={index}
              onClick={() => onSelectPost(post.id)}
            />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <span className="text-4xl mb-4 block">🍃</span>
            <p className="text-slate-400 font-sans">这个分类下暂时还没有文章</p>
          </div>
        )}
      </div>
    </section>
  );
}
