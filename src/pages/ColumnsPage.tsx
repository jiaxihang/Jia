import { useNavigate } from "react-router-dom";
import { Columns } from "@/components/Columns";

export function ColumnsPage() {
  const navigate = useNavigate();

  const openEntry = (columnId: string, entryId: string) => {
    navigate(`/column/${entryId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <Columns onSelectEntry={openEntry} />;
}
