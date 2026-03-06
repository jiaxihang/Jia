import { useNavigate } from "react-router-dom";
import { BlogList } from "@/components/BlogList";

export function BlogPage() {
  const navigate = useNavigate();

  const openPost = (id: number) => {
    navigate(`/post/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <BlogList onSelectPost={openPost} />;
}
