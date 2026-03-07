import { useState } from "react";
import { posts, categories } from "@/data/posts";
import { BlogCard } from "@/components/BlogCard";
import { useInView } from "@/hooks/useInView";

interface BlogListProps {
  onSelectPost: (id: number) => void;
}

export function BlogList({ onSelectPost }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [searchQuery, setSearchQuery] = useState("");
  const { ref: titleRef, isInView: titleInView } = useInView();

  const filteredPosts = posts.filter((post) => {
    // 分类过滤
    const categoryMatch = activeCategory === "全部" || post.category === activeCategory;

    // 搜索过滤
    const searchMatch = searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return categoryMatch && searchMatch;
  });

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

        {/* Search box */}
        <div className={`max-w-md mx-auto mb-8 ${titleInView ? "animate-fade-in-up delay-100" : "opacity-0"}`}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="搜索文章标题、标签或内容..."
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
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-slate-400 dark:text-slate-500 font-sans">
              {searchQuery ? "没有找到匹配的文章" : "这个分类下暂时还没有文章"}
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
