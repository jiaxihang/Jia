import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { FeaturedQuote } from "@/components/FeaturedQuote";
import { BlogList } from "@/components/BlogList";

type OutletContext = { onNavigate: (page: string) => void };

export function HomePage() {
  const { onNavigate } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  const openPost = (id: number) => {
    navigate(`/post/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Hero onNavigate={onNavigate} />
      <FeaturedQuote />
      <BlogList onSelectPost={openPost} />
    </>
  );
}
