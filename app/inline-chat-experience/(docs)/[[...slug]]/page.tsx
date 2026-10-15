import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocPager } from "@/components/kit-docs/doc-pager";
import { DOCS_REGISTRY } from "@/components/kit-docs/registry";
import styles from "@/components/kit-docs/docs.module.css";

interface Props {
  params: Promise<{ slug?: string[] }>;
}

/* Every page is known at build time (they are files), so each is rendered
   once, then, and anything not in the registry is a 404 rather than a render. */
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(DOCS_REGISTRY).map((path) => ({ slug: path ? path.split("/") : [] }));
}

async function load(params: Props["params"]) {
  const { slug } = await params;
  const path = (slug ?? []).join("/");
  const loader = DOCS_REGISTRY[path];
  if (!loader) notFound();
  return { path, page: await loader() };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path, page } = await load(params);
  return {
    title: path ? page.meta.title : { absolute: "inline-chat-kit" },
    description: page.meta.description,
  };
}

export default async function DocsPage({ params }: Props) {
  const { path, page } = await load(params);
  const Page = page.default;
  return (
    <>
      <article className={styles.article} data-doc-article>
        <Page />
      </article>
      <DocPager path={path} />
    </>
  );
}
