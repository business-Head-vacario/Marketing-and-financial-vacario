import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { postInclude, toFeedPost } from "@/lib/serialize";
import { ReelViewer } from "@/components/post/ReelViewer";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reels" };

export default async function ReelsPage() {
  const viewer = await getCurrentUser();
  const reels = await db.post.findMany({
    where: { type: "REEL" },
    include: postInclude(viewer?.id),
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  return <ReelViewer reels={reels.map(toFeedPost)} signedIn={Boolean(viewer)} />;
}
