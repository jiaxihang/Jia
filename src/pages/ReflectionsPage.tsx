import { Helmet } from "react-helmet-async";
import { Reflections } from "@/components/Reflections";
import { SITE } from "@/config/site";

export function ReflectionsPage() {
  return (
    <>
      <Helmet>
        <title>感悟 - {SITE.name}</title>
        <meta property="og:title" content={`感悟 - ${SITE.name}`} />
        <meta property="og:description" content="个人感悟与思考" />
        <meta property="og:image" content="/Jia.png" />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="pt-28">
        <Reflections />
      </section>
    </>
  );
}
