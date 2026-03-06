import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    document.title = entry ? `${entry.title} · ${SITE.name}` : `${SITE.name} · 个人博客`;
    return () => {
      document.title = `${SITE.name} · 个人博客`;
    };
  }, [entry]);

  const goBack = () => navigate("/columns");

  const openEntry = (id: string) => {
    navigate(`/column/${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!entryId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400 dark:text-slate-500">内容不存在</p>
      </div>
    );
  }

  return (
    <ColumnEntryView
      entryId={entryId}
      onBack={goBack}
      prevEntryId={prevEntry?.id}
      nextEntryId={nextEntry?.id}
      onNavigateEntry={openEntry}
    />
  );
}
