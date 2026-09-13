import type { Prisma } from "@prisma/client";
import { parseList } from "./utils";

const ANON = "__anonymous__";

export function postInclude(viewerId?: string | null) {
  const viewer = viewerId ?? ANON;
  return {
    author: {
      select: {
        id: true,
        name: true,
        username: true,
        avatarUrl: true,
        role: true,
        agency: { select: { name: true, slug: true, status: true } },
      },
    },
    media: { orderBy: { order: "asc" } },
    itinerary: {
      select: {
        id: true,
        title: true,
        destination: true,
        country: true,
        days: true,
        budget: true,
        currency: true,
        style: true,
        summary: true,
      },
    },
    package: {
      select: {
        id: true,
        slug: true,
        title: true,
        destination: true,
        price: true,
        currency: true,
        discountPercent: true,
        durationDays: true,
        durationNights: true,
        coverUrl: true,
        images: true,
        agency: { select: { name: true, slug: true, status: true } },
      },
    },
    likes: { where: { userId: viewer }, select: { id: true } },
    saves: { where: { userId: viewer }, select: { id: true } },
    comments: {
      take: 2,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        body: true,
        createdAt: true,
        user: { select: { name: true, username: true, avatarUrl: true } },
      },
    },
    _count: { select: { likes: true, comments: true, saves: true } },
  } satisfies Prisma.PostInclude;
}

export type PostWithRelations = Prisma.PostGetPayload<{ include: ReturnType<typeof postInclude> }>;

export type FeedPost = ReturnType<typeof toFeedPost>;

export function toFeedPost(post: PostWithRelations) {
  return {
    id: post.id,
    type: post.type,
    caption: post.caption,
    locationName: post.locationName,
    country: post.country,
    tags: parseList(post.tags),
    budget: post.budget,
    currency: post.currency,
    tripMonth: post.tripMonth,
    rating: post.rating,
    createdAt: post.createdAt.toISOString(),
    author: {
      id: post.author.id,
      name: post.author.name,
      username: post.author.username,
      avatarUrl: post.author.avatarUrl,
      role: post.author.role,
      agencyName: post.author.agency?.name ?? null,
      agencySlug: post.author.agency?.slug ?? null,
      agencyVerified: post.author.agency?.status === "VERIFIED",
    },
    media: post.media.map((m) => ({
      id: m.id,
      url: m.url,
      kind: m.kind,
      posterUrl: m.posterUrl,
      alt: m.alt,
    })),
    itinerary: post.itinerary
      ? {
          id: post.itinerary.id,
          title: post.itinerary.title,
          destination: post.itinerary.destination,
          country: post.itinerary.country,
          days: post.itinerary.days,
          budget: post.itinerary.budget,
          currency: post.itinerary.currency,
          style: post.itinerary.style,
          summary: post.itinerary.summary,
        }
      : null,
    package: post.package
      ? {
          id: post.package.id,
          slug: post.package.slug,
          title: post.package.title,
          destination: post.package.destination,
          price: post.package.price,
          currency: post.package.currency,
          discountPercent: post.package.discountPercent,
          durationDays: post.package.durationDays,
          durationNights: post.package.durationNights,
          coverUrl: post.package.coverUrl ?? parseList(post.package.images)[0] ?? null,
          agencyName: post.package.agency.name,
          agencySlug: post.package.agency.slug,
          agencyVerified: post.package.agency.status === "VERIFIED",
        }
      : null,
    counts: {
      likes: post._count.likes,
      comments: post._count.comments,
      saves: post._count.saves,
    },
    liked: post.likes.length > 0,
    saved: post.saves.length > 0,
    previewComments: post.comments
      .slice()
      .reverse()
      .map((c) => ({
        id: c.id,
        body: c.body,
        createdAt: c.createdAt.toISOString(),
        user: c.user,
      })),
  };
}
