import { useInView } from "@/hooks/useInView";

export function FeaturedQuote() {
  const { ref, isInView } = useInView();

  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Background ink wash effect */}
      <div className="absolute inset-0 ink-wash" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100/8 rounded-full blur-3xl" />

      <div ref={ref} className="relative max-w-3xl mx-auto text-center">
        <div className={`${isInView ? "animate-fade-in-up" : "opacity-0"}`}>
          {/* Decorative top */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-cyan-300/50" />
            <div className="mx-4">
              <svg className="w-6 h-6 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z" />
              </svg>
            </div>
            <div className="w-12 h-px bg-gradient-to-r from-cyan-300/50 to-transparent" />
          </div>

          <blockquote className="font-serif text-xl md:text-2xl text-cyan-800/80 leading-relaxed mb-6">
            <span className="text-cyan-300 text-3xl leading-none">"</span>
            <br />
            每一行代码都是一首诗，
            <br />
            每一个项目都是一幅画。
            <br />
            在数字的世界里，
            <br />
            我们是诗人，也是画家。
            <br />
            <span className="text-cyan-300 text-3xl leading-none">"</span>
          </blockquote>

          <div className="divider-ornament max-w-xs mx-auto mb-6">
            <span className="text-cyan-300 text-xs">◆</span>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-12 mt-12">
            {[
              { number: "200＋", label: "篇文章" },
              { number: "∞", label: "杯咖啡" },
              { number: "365", label: "天热爱" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center ${isInView ? "animate-fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: `${0.3 + index * 0.15}s` }}
              >
                <div className="text-2xl md:text-3xl font-serif text-gradient font-bold mb-1">
                  {stat.number}
                </div>
                <div className="text-xs text-slate-400 font-sans tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
