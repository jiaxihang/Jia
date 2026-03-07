import { HashRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { HomePage } from "@/pages/HomePage";
import { BlogPage } from "@/pages/BlogPage";
import { ColumnsPage } from "@/pages/ColumnsPage";
import { ReflectionsPage } from "@/pages/ReflectionsPage";
import { AboutPage } from "@/pages/AboutPage";
import { PostPage } from "@/pages/PostPage";
import { ColumnEntryPage } from "@/pages/ColumnEntryPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="reflections" element={<ReflectionsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="columns" element={<ColumnsPage />} />
          <Route path="column/:entryId" element={<ColumnEntryPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="post/:id" element={<PostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
