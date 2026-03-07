import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Columns } from "@/components/Columns";
import { SITE } from "@/config/site";

export function ColumnsPage() {
  const navigate = useNavigate();

  const openEntry = (columnId: string, entryId: string) => {
    navigate(`/column/${entryId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>专栏 - {SITE.name}</title>
        <meta property="og:title" content={`专栏 - ${SITE.name}`} />
        <meta property="og:description" content="浏览专题专栏内容" />
        <meta property="og:image" content="/Jia.png" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Columns onSelectEntry={openEntry} />
    </>
  );
}
