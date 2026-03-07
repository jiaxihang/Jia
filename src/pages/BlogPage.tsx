import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BlogList } from "@/components/BlogList";
import { SITE } from "@/config/site";

export function BlogPage() {
  const navigate = useNavigate();

  const openPost = (id: number) => {
    navigate(`/post/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>文章 - {SITE.name}</title>
        <meta property="og:title" content={`文章 - ${SITE.name}`} />
        <meta property="og:description" content="浏览所有技术文章和博客内容" />
        <meta property="og:image" content="/Jia.png" />
        <meta property="og:type" content="website" />
      </Helmet>
      <BlogList onSelectPost={openPost} />
    </>
  );
}
