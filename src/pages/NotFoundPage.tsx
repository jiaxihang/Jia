import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { SITE } from "@/config/site";

type OutletContext = { onNavigate: (page: string) => void };

export function NotFoundPage() {
    const { onNavigate } = useOutletContext<OutletContext>();
    const navigate = useNavigate();

    const handleGoHome = () => {
        onNavigate("home");
    };

    return (
        <>
            <Helmet>
                <title>页面未找到 - {SITE.name}</title>
                <meta property="og:title" content={`页面未找到 - ${SITE.name}`} />
                <meta property="og:description" content="抱歉，您访问的页面不存在" />
                <meta property="og:image" content="/Jia.png" />
                <meta property="og:type" content="website" />
            </Helmet>
            <section className="relative min-h-[70vh] pt-28 pb-24 px-6 flex items-center justify-center overflow-hidden">
                {/* Background decorations */}
                <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-100/15 rounded-full blur-3xl -translate-x-1/2 dark:bg-cyan-900/10" />
                <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-teal-100/15 rounded-full blur-3xl translate-x-1/2 dark:bg-teal-900/10" />

                <div className="max-w-2xl mx-auto text-center relative z-10">
                    {/* 404 Number */}
                    <div className="mb-8">
                        <span className="text-8xl md:text-9xl font-serif text-cyan-200 dark:text-cyan-800 select-none">
                            404
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="font-serif text-3xl md:text-4xl text-cyan-900 dark:text-cyan-100 mb-4">
                        页面未找到
                    </h1>

                    {/* Description */}
                    <p className="text-slate-500 dark:text-slate-400 font-sans text-lg mb-8 max-w-md mx-auto leading-relaxed">
                        抱歉，您访问的页面不存在。可能是链接错误或页面已被移动。
                    </p>

                    {/* Emoji */}
                    <div className="flex justify-center mb-12">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100/50 flex items-center justify-center shadow-sm dark:from-cyan-950 dark:to-teal-950 dark:border-cyan-800/50">
                            <span className="text-4xl">😵</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={handleGoHome}
                            className="group px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-sans rounded-full hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <span className="flex items-center gap-2">
                                返回首页
                                <svg
                                    className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </span>
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="px-8 py-3 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-sans border border-cyan-200 dark:border-cyan-700 rounded-full hover:bg-cyan-50 dark:hover:bg-cyan-950/50 transition-all duration-300"
                        >
                            返回上一页
                        </button>
                    </div>

                    {/* Decorative ornament */}
                    <div className="mt-16">
                        <span className="text-cyan-300 dark:text-cyan-600 text-2xl">❖</span>
                    </div>
                </div>
            </section>
        </>
    );
}