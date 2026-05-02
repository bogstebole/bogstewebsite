import { V2Canvas } from "@/components/canvas/V2Canvas";
import { getLatestSubstackPost } from "@/lib/substack";

export default async function Home() {
  const latestPost = await getLatestSubstackPost();
  return <V2Canvas latestPost={latestPost} />;
}
