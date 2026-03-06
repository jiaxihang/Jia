import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BlogPostView } from "@/components/BlogPostView";
import { posts } from "@/data/posts";
import { SITE } from "@/config/site";

export function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = id ? parseInt(id, 10) : NaN;
  const post = posts.find((p) => p.id === postId);

  useEffect(() => {
    document.title = post ? `${post.title} · ${SITE.name}` : `${SITE.name} · 个人博客`;
    return () => {
      document.title = `${SITE.name} · 个人博客`;
    };
  }, [post]);

  const goBack = () => navigate("/blog");

  const openPost = (targetId: number) => {
    navigate(`/post/${targetId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!id || isNaN(postId)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400">文章不存在</p>
      </div>
    );
  }

  const sortedIds = [...posts].sort((a, b) => a.id - b.id);
  const currentIndex = sortedIds.findIndex((p) => p.id === postId);
  const prevPost = currentIndex > 0 ? sortedIds[currentIndex - 1] : null;
  const nextPost = currentIndex >= 0 && currentIndex < sortedIds.length - 1
    ? sortedIds[currentIndex + 1]
    : null;

  return (
    <BlogPostView
      postId={postId}
      onBack={goBack}
      prevPostId={prevPost?.id}
      nextPostId={nextPost?.id}
      onNavigatePost={openPost}
    />
  );
}
