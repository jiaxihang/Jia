import { Helmet } from "react-helmet-async";
import { About } from "@/components/About";
import { SITE } from "@/config/site";

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>关于 - {SITE.name}</title>
        <meta property="og:title" content={`关于 - ${SITE.name}`} />
        <meta property="og:description" content="了解更多关于我的信息" />
        <meta property="og:image" content="/Jia.png" />
        <meta property="og:type" content="website" />
      </Helmet>
      <About />
    </>
  );
}
