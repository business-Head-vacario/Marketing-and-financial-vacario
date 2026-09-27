import { db } from "@/lib/db";
import { ok, toResponse, sessionUser, requireSessionUser, HttpError } from "@/lib/api";
import { postSchema } from "@/lib/validators";
import { postInclude, toFeedPost } from "@/lib/serialize";
import { stringifyList } from "@/lib/utils";

const PAGE_SIZE = 8;

/** Cursor-paginated feed. `scope=following` limits it to accounts you follow. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const type = searchParams.get("type");
    const scope = searchParams.get("scope");
    const username = searchParams.get("username");
    const viewer = await sessionUser();

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (username) where.author = { username };
    if (scope === "following") {
      if (!viewer) throw new HttpError("Sign in to see your following feed", 401);
      const following = await db.follow.findMany({
        where: { followerId: viewer.id },
        select: { followingId: true },
      });
      where.authorId = { in: [...following.map((f) => f.followingId), viewer.id] };
    }

    const posts = await db.post.findMany({
      where,
      include: postInclude(viewer?.id),
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });

    const hasMore = posts.length > PAGE_SIZE;
    const page = hasMore ? posts.slice(0, PAGE_SIZE) : posts;

    return ok({
      posts: page.map(toFeedPost),
      nextCursor: hasMore ? page[page.length - 1]?.id ?? null : null,
    });
  } catch (error) {
    return toResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();
    const input = postSchema.parse(await request.json());

    if (input.type === "THREESIXTY" && !input.media.some((m) => m.kind === "PANORAMA")) {
      throw new HttpError("A 360° post needs at least one panorama image", 422);
    }
    if (input.type === "REEL" && !input.media.some((m) => m.kind === "VIDEO" || m.kind === "IMAGE")) {
      throw new HttpError("A reel needs a video", 422);
    }

    const post = await db.post.create({
      data: {
        authorId: user.id,
        type: input.type,
        caption: input.caption,
        locationName: input.locationName || null,
        country: input.country || null,
        tags: stringifyList(input.tags.map((t) => t.replace(/^#/, ""))),
        budget: input.budget ?? null,
        currency: input.currency,
        tripMonth: input.tripMonth || null,
        rating: input.rating ?? null,
        itineraryId: input.itineraryId || null,
        packageId: input.packageId || null,
        agencyId: user.agency?.id ?? null,
        media: {
          create: input.media.map((m, index) => ({
            url: m.url,
            kind: m.kind,
            posterUrl: m.posterUrl || null,
            alt: m.alt || null,
            order: index,
          })),
        },
      },
      include: postInclude(user.id),
    });

    return ok({ post: toFeedPost(post) }, 201);
  } catch (error) {
    return toResponse(error);
  }
}
