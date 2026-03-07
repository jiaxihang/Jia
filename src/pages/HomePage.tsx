import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Hero } from "@/components/Hero";
import { FeaturedQuote } from "@/components/FeaturedQuote";
import { BlogList } from "@/components/BlogList";
import { SITE } from "@/config/site";

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
      <Helmet>
        <title>{SITE.name} - {SITE.tagline}</title>
        <meta property="og:title" content={`${SITE.name} - ${SITE.tagline}`} />
        <meta property="og:description" content={SITE.description} />
        <meta property="og:image" content="/Jia.png" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Hero onNavigate={onNavigate} />
      <FeaturedQuote />
      <BlogList onSelectPost={openPost} />
    </>
  );
}
