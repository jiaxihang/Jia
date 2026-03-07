import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BlogPostView } from "@/components/BlogPostView";
import { posts } from "@/data/posts";
import { SITE } from "@/config/site";

export function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = id ? parseInt(id, 10) : NaN;
  const post = posts.find((p) => p.id === postId);

  const goBack = () => navigate("/blog");

  const openPost = (targetId: number) => {
    navigate(`/post/${targetId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!id || isNaN(postId)) {
    return (
      <>
        <Helmet>
          <title>文章不存在 - {SITE.name}</title>
          <meta property="og:title" content={`文章不存在 - ${SITE.name}`} />
          <meta property="og:description" content="抱歉，您访问的文章不存在" />
          <meta property="og:image" content="/Jia.png" />
          <meta property="og:type" content="website" />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-400">文章不存在</p>
        </div>
      </>
    );
  }

  const sortedIds = [...posts].sort((a, b) => a.id - b.id);
  const currentIndex = sortedIds.findIndex((p) => p.id === postId);
  const prevPost = currentIndex > 0 ? sortedIds[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < sortedIds.length - 1
    ? sortedIds[currentIndex + 1]
    : null;

  return (
    <>
      <Helmet>
        <title>{post ? `${post.title} - ${SITE.name}` : `文章 - ${SITE.name}`}</title>
        <meta property="og:title" content={post ? `${post.title} - ${SITE.name}` : `文章 - ${SITE.name}`} />
        <meta property="og:description" content={post?.excerpt || "阅读技术文章和博客内容"} />
        <meta property="og:image" content="/Jia.png" />
        <meta property="og:type" content="article" />
      </Helmet>
      <BlogPostView
        postId={postId}
        onBack={goBack}
        prevPostId={prevPost?.id}
        nextPostId={nextPost?.id}
        onNavigatePost={openPost}
      />
    </>
  );
}
