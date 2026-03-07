import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ColumnEntryView } from "@/components/ColumnEntryView";
import { SITE } from "@/config/site";
import { columnEntries } from "@/data/columns";

export function ColumnEntryPage() {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const entry = entryId ? columnEntries.find((e) => e.id === entryId) : null;

  const sortedEntries = [...columnEntries]
    .filter((e) => e.columnId === entry?.columnId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const currentIndex = sortedEntries.findIndex((e) => e.id === entryId);
  const prevEntry = currentIndex > 0 ? sortedEntries[currentIndex - 1] : null;
  const nextEntry = currentIndex >= 0 && currentIndex < sortedEntries.length - 1
    ? sortedEntries[currentIndex + 1]
    : null;

  const goBack = () => navigate("/columns");

  const openEntry = (id: string) => {
    navigate(`/column/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!entryId) {
    return (
      <>
        <Helmet>
          <title>内容不存在 - {SITE.name}</title>
          <meta property="og:title" content={`内容不存在 - ${SITE.name}`} />
          <meta property="og:description" content="抱歉，您访问的内容不存在" />
          <meta property="og:image" content="/Jia.png" />
          <meta property="og:type" content="website" />
        </Helmet>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-400 dark:text-slate-500">内容不存在</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{entry ? `${entry.title} - ${SITE.name}` : `专栏内容 - ${SITE.name}`}</title>
        <meta property="og:title" content={entry ? `${entry.title} - ${SITE.name}` : `专栏内容 - ${SITE.name}`} />
        <meta property="og:description" content={entry?.excerpt || "阅读专栏内容"} />
        <meta property="og:image" content="/Jia.png" />
        <meta property="og:type" content="article" />
      </Helmet>
      <ColumnEntryView
        entryId={entryId}
        onBack={goBack}
        prevEntryId={prevEntry?.id}
        nextEntryId={nextEntry?.id}
        onNavigateEntry={openEntry}
      />
    </>
  );
}
