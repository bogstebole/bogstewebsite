import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { V2Canvas } from "@/components/canvas/V2Canvas";
import { getLatestSubstackPost } from "@/lib/substack";
import { CASE_STUDIES, caseStudyBySlug, caseStudyMetadata } from "@/lib/case-studies";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASE_STUDIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cs = caseStudyBySlug((await params).slug);
  return cs ? caseStudyMetadata(cs) : {};
}

// The home page with one case study already open, so a shared link lands on it.
// A slug that names no case study goes home rather than to a dead end.
export default async function CaseStudyPage({ params }: Props) {
  const cs = caseStudyBySlug((await params).slug);
  if (!cs) redirect("/");
  const latestPost = await getLatestSubstackPost();
  return <V2Canvas latestPost={latestPost} initialProject={cs.key} />;
}
