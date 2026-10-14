import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { V2Canvas } from "@/components/canvas/V2Canvas";
import { getLatestSubstackPost } from "@/lib/substack";
import { CASE_STUDIES, caseStudyBySlug, caseStudyMetadata } from "@/lib/case-studies";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASE_STUDIES.map(({ slug }) => ({ slug }));
}

// Same tags as the public case study, canonical included, so the review copy
// never competes with it. The /dive layout keeps it noindex.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cs = caseStudyBySlug((await params).slug);
  return cs ? caseStudyMetadata(cs) : {};
}

// The review copy of a case study link, kept inside /dive.
export default async function DiveCaseStudyPage({ params }: Props) {
  const cs = caseStudyBySlug((await params).slug);
  if (!cs) redirect("/dive");
  const latestPost = await getLatestSubstackPost();
  return <V2Canvas latestPost={latestPost} initialProject={cs.key} />;
}
