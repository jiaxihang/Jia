import { useInView } from "@/hooks/useInView";
import { cn } from "@/utils/cn";
import {
  profile,
  stats,
  experiences,
  skillCategories,
  highlights,
  interests,
  contacts,
} from "@/data/about";

const avatarImg = new URL("@/assets/avatar/Jia.png", import.meta.url).href;

export function About() {
  const { ref: heroRef, isInView: heroInView } = useInView(0.2);
  const { ref: statsRef, isInView: statsInView } = useInView(0.2);
  const { ref: bioRef, isInView: bioInView } = useInView(0.1);
  const { ref: expRef, isInView: expInView } = useInView(0.1);
  const { ref: skillsRef, isInView: skillsInView } = useInView(0.1);
  const { ref: highlightsRef, isInView: highlightsInView } = useInView(0.1);
  const { ref: quoteRef, isInView: quoteInView } = useInView(0.1);
  const { ref: contactRef, isInView: contactInView } = useInView(0.1);

  return (
    <section className="relative pt-28 pb-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-200/50 to-transparent" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-100/15 rounded-full blur-3xl -translate-x-1/2" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-teal-100/15 rounded-full blur-3xl translate-x-1/2" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Hero */}
        <div ref={heroRef} className={cn("text-center mb-20", !heroInView && "opacity-0")}>
          <div className={cn(heroInView ? "animate-fade-in-up" : "opacity-0")}>
            <span className="text-xs tracking-[0.3em] text-cyan-500/60 font-sans uppercase block mb-6">
              About Me
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-cyan-900 mb-4">
              {profile.name}
            </h1>
            <p className="font-serif text-lg md:text-xl text-cyan-700/90 mb-2">
              {profile.title}
            </p>
            <p className="text-slate-500 dark:text-slate-400 font-sans text-sm mb-6 max-w-md mx-auto">
              {profile.tagline}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <span className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {profile.location}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-sans bg-cyan-50 dark:bg-slate-700 text-cyan-600 dark:text-cyan-200 border border-cyan-100/80 dark:border-slate-600/80">
                {profile.status}
              </span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div ref={statsRef} className={cn("mb-20", !statsInView && "opacity-0")}>
          <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-4", statsInView ? "animate-fade-in-up" : "opacity-0")}>
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-cyan-100/50 dark:border-slate-700/50 p-6 text-center hover-lift"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 to-teal-50/20 dark:from-slate-700/30 dark:to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="text-2xl md:text-3xl font-serif text-gradient font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-sans tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bio + Avatar */}
        <div ref={bioRef} className={cn("mb-24", !bioInView && "opacity-0")}>
          <div className={cn("grid md:grid-cols-5 gap-12 items-center", bioInView ? "animate-fade-in-up" : "opacity-0")}>
            <div className="md:col-span-2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-cyan-300/20 to-teal-300/20 rounded-[2rem] blur-2xl animate-gentle-pulse" />
                <div className="absolute -inset-1 rounded-[1.5rem] bg-gradient-to-br from-cyan-400/30 to-teal-400/30 blur opacity-60 animate-glow-ring" />
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-cyan-50 via-white to-teal-50 dark:from-slate-700 dark:via-slate-800 dark:to-slate-700 border border-cyan-100/60 dark:border-slate-600/60 shadow-xl shadow-cyan-100/30 dark:shadow-slate-900/30 flex items-center justify-center overflow-hidden">
                  <img src={avatarImg} alt="Avatar" className="w-full h-full object-cover rounded-3xl" />
                  <div className="absolute -top-2 -right-2 w-20 h-20 rounded-full bg-cyan-200/25 dark:bg-slate-600/25 blur-xl" />
                  <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-teal-200/25 dark:bg-slate-500/25 blur-xl" />
                </div>
              </div>
            </div>
            <div className="md:col-span-3 space-y-5">
              {profile.bio.map((para, i) => (
                <p
                  key={i}
                  className={cn(
                    "text-slate-600 dark:text-slate-300 leading-relaxed font-sans",
                    i === 0 ? "text-base" : "text-sm text-slate-500 dark:text-slate-400"
                  )}
                >
                  {para}
                </p>
              ))}
              <div className="flex flex-wrap gap-2 pt-2">
                {interests.map((item) => (
                  <span
                    key={item.label}
                    className="px-3 py-1.5 text-sm text-cyan-700 bg-cyan-50/80 rounded-full border border-cyan-100/50 font-sans hover:bg-cyan-100/60 hover:border-cyan-200/60 transition-colors duration-300 cursor-default"
                  >
                    {item.emoji} {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Experience Timeline */}
        <div ref={expRef} className={cn("mb-24", !expInView && "opacity-0")}>
          <div className={cn(expInView ? "animate-fade-in-up" : "opacity-0")}>
            <div className="text-center mb-12">
              <span className="text-xs tracking-[0.2em] text-cyan-500/60 font-sans uppercase block mb-2">
                Experience
              </span>
              <h3 className="font-serif text-2xl text-cyan-900">经历</h3>
              <div className="divider-ornament max-w-xs mx-auto mt-4">
                <span className="text-cyan-300">✦</span>
              </div>
            </div>

            <div className="relative pl-4 md:pl-0">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-cyan-200 via-cyan-300/50 to-transparent" />
              <div
                className={cn(
                  "absolute left-4 md:left-1/2 md:-translate-x-px top-0 w-px bg-gradient-to-b from-cyan-400/60 to-teal-400/40",
                  expInView && "animate-timeline-grow"
                )}
              />

              <div className="space-y-8">
                {experiences.map((exp, i) => (
                  <div
                    key={i}
                    className={cn(
                      "relative flex gap-8 items-start pl-8 md:pl-0",
                      i % 2 === 1 && "md:flex-row-reverse"
                    )}
                    style={{ animationDelay: `${i * 0.15}s` }}
                  >
                    <div className="hidden md:block flex-1" />
                    <div className="flex-1 md:max-w-[calc(50%-2rem)] min-w-0">
                      <div className="group relative rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-cyan-100/50 dark:border-slate-700/50 p-6 hover-lift overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-100/20 dark:bg-slate-700/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-100/30 dark:group-hover:bg-slate-700/30 transition-colors" />
                        <div className="relative">
                          <span className="text-xs font-sans text-cyan-600 dark:text-cyan-400 tracking-wider">
                            {exp.period}
                          </span>
                          <h4 className="font-serif text-lg text-cyan-900 dark:text-cyan-100 mt-1">
                            {exp.role}
                          </h4>
                          <p className="text-sm text-cyan-600/90 dark:text-cyan-400/90 font-sans mb-3">
                            {exp.company}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                            {exp.description}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {exp.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 text-xs text-cyan-600 dark:text-cyan-400 bg-cyan-50/80 dark:bg-slate-700/80 rounded-full font-sans"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute left-4 md:left-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 border-4 border-white shadow-lg shadow-cyan-200/50 -translate-x-1/2 mt-6 z-10" />
                    <div className="hidden md:block flex-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div ref={skillsRef} className={cn("mb-24", !skillsInView && "opacity-0")}>
          <div className={cn(skillsInView ? "animate-fade-in-up" : "opacity-0")}>
            <div className="text-center mb-12">
              <span className="text-xs tracking-[0.2em] text-cyan-500/60 font-sans uppercase block mb-2">
                Skills
              </span>
              <h3 className="font-serif text-2xl text-cyan-900">技能树</h3>
              <div className="divider-ornament max-w-xs mx-auto mt-4">
                <span className="text-cyan-300">✦</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {skillCategories.map((cat, catIndex) => (
                <div
                  key={cat.name}
                  className="rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-cyan-100/50 dark:border-slate-700/50 p-6 hover-lift"
                  style={{ animationDelay: `${catIndex * 0.1}s` }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">{cat.icon}</span>
                    <h4 className="font-serif text-lg text-cyan-900 dark:text-cyan-100">{cat.name}</h4>
                  </div>
                  <div className="space-y-4">
                    {cat.skills.map((skill, index) => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between items-center text-sm font-sans">
                          <span className="text-slate-600 dark:text-slate-300">{skill.name}</span>
                          <span className="text-cyan-500 font-medium">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-cyan-50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: skillsInView ? `${skill.level}%` : "0%",
                              transitionDelay: `${(catIndex * 4 + index) * 0.1}s`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div ref={highlightsRef} className={cn("mb-24", !highlightsInView && "opacity-0")}>
          <div className={cn(highlightsInView ? "animate-fade-in-up" : "opacity-0")}>
            <div className="text-center mb-12">
              <span className="text-xs tracking-[0.2em] text-cyan-500/60 font-sans uppercase block mb-2">
                Highlights
              </span>
              <h3 className="font-serif text-2xl text-cyan-900">亮点</h3>
              <div className="divider-ornament max-w-xs mx-auto mt-4">
                <span className="text-cyan-300">✦</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {highlights.map((h, i) => (
                <div
                  key={h.title}
                  className="group rounded-2xl bg-gradient-to-br from-cyan-50/80 to-teal-50/50 dark:from-slate-700/80 dark:to-slate-600/50 border border-cyan-100/50 dark:border-slate-600/50 p-6 hover-lift text-center"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                    {h.emoji}
                  </span>
                  <h4 className="font-serif text-lg text-cyan-900 dark:text-cyan-100 mb-2">{h.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
                    {h.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quote */}
        <div ref={quoteRef} className={cn("mb-24", !quoteInView && "opacity-0")}>
          <div className={cn(quoteInView ? "animate-fade-in-up" : "opacity-0")}>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-50/80 via-teal-50/50 to-cyan-50/60 dark:from-slate-700/80 dark:via-slate-600/50 dark:to-slate-700/60 border border-cyan-100/40 dark:border-slate-600/40 py-14 px-8 md:px-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-200/15 dark:bg-slate-600/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative text-center">
                <svg
                  className="w-10 h-10 text-cyan-200 dark:text-slate-500 mx-auto mb-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="font-serif text-lg md:text-xl text-cyan-800/90 dark:text-cyan-200/90 leading-relaxed mb-4">
                  生活中最美好的事物，往往是那些不期而遇的小确幸。
                </p>
                <p className="font-serif text-lg md:text-xl text-cyan-800/90 dark:text-cyan-200/90 leading-relaxed mb-6">
                  代码也是如此，最优雅的解决方案，总是在不经意间浮现。
                </p>
                <span className="text-sm text-cyan-500/70 dark:text-cyan-400/70 font-sans">—— 浮光掠影</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div ref={contactRef} className={cn(!contactInView && "opacity-0")}>
          <div className={cn(contactInView ? "animate-fade-in-up" : "opacity-0")}>
            <div className="text-center mb-10">
              <span className="text-xs tracking-[0.2em] text-cyan-500/60 font-sans uppercase block mb-2">
                Contact
              </span>
              <h3 className="font-serif text-2xl text-cyan-900">联系方式</h3>
              <div className="divider-ornament max-w-xs mx-auto mt-4">
                <span className="text-cyan-300">✦</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {contacts.map((c) => {
                const isLink = c.type === "email" || c.type === "link";
                const href = c.type === "email" ? `mailto:${c.value}` : c.type === "link" ? `https://${c.value}` : undefined;
                const Comp = isLink ? "a" : "div";
                return (
                  <Comp
                    key={c.label}
                    {...(isLink ? { href } : {})}
                    className={cn(
                      "group flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-cyan-100/50 dark:border-slate-700/50 hover-lift min-w-[140px]",
                      isLink ? "cursor-pointer" : "cursor-default"
                    )}
                  >
                    <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                      {c.icon}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">{c.label}</span>
                    <span className="text-sm text-cyan-700 dark:text-cyan-300 font-sans truncate max-w-full px-2">
                      {c.value}
                    </span>
                  </Comp>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
