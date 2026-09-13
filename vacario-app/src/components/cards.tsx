import Link from "next/link";
import { Clock, Heart, MapPin, MessageCircle, Rotate3d, Route, Star, Users } from "lucide-react";
import { Avatar, Badge, VerifiedTick } from "./ui";
import { cn, money, parseList, priceAfterDiscount } from "@/lib/utils";

export type PackageCardData = {
  id: string;
  slug: string;
  title: string;
  destination: string;
  country: string;
  durationDays: number;
  durationNights: number;
  price: number;
  currency: string;
  discountPercent: number;
  category: string;
  coverUrl: string | null;
  images: string;
  instantBook: boolean;
  agency: { name: string; slug: string; status: string; city?: string };
  rating?: number | null;
  reviewCount?: number;
};

export function PackageCard({ pkg, compact = false }: { pkg: PackageCardData; compact?: boolean }) {
  const cover = pkg.coverUrl ?? parseList(pkg.images)[0] ?? null;
  const final = priceAfterDiscount(pkg.price, pkg.discountPercent);

  return (
    <Link
      href={`/packages/${pkg.slug}`}
      className="group vc-card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl"
    >
      <div className={cn("relative w-full overflow-hidden bg-ink-100", compact ? "aspect-[16/10]" : "aspect-[4/3]")}>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={pkg.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full vc-sunset" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge tone="lagoon" className="bg-white/90 text-lagoon-700">
            {pkg.category.toLowerCase()}
          </Badge>
          {pkg.discountPercent > 0 ? (
            <Badge tone="rose" className="bg-rose-500 text-white">
              {pkg.discountPercent}% off
            </Badge>
          ) : null}
          {pkg.instantBook ? (
            <Badge tone="emerald" className="bg-emerald-500 text-white">
              instant book
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-display text-base font-extrabold leading-snug text-ink-900 group-hover:text-brand-600">
          {pkg.title}
        </h3>
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
          <span className="inline-flex items-center gap-1 font-semibold">
            <MapPin className="h-3.5 w-3.5 text-brand-500" />
            {pkg.destination}, {pkg.country}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold">
            <Clock className="h-3.5 w-3.5 text-brand-500" />
            {pkg.durationDays}D / {pkg.durationNights}N
          </span>
          {typeof pkg.rating === "number" && pkg.reviewCount ? (
            <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
              <Star className="h-3.5 w-3.5 fill-current" /> {pkg.rating.toFixed(1)} ({pkg.reviewCount})
            </span>
          ) : null}
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-lg font-black text-ink-900">{money(final, pkg.currency)}</span>
              {pkg.discountPercent > 0 ? (
                <span className="text-xs font-semibold text-ink-400 line-through">{money(pkg.price, pkg.currency)}</span>
              ) : null}
            </div>
            <span className="text-[11px] font-semibold text-ink-400">per person</span>
          </div>
          <span className="flex items-center gap-1 truncate text-[11px] font-bold text-lagoon-700">
            {pkg.agency.name}
            {pkg.agency.status === "VERIFIED" ? <VerifiedTick className="h-3.5 w-3.5" /> : null}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function AgencyCard({
  agency,
}: {
  agency: {
    slug: string;
    name: string;
    tagline: string;
    city: string;
    country: string;
    logoUrl: string | null;
    coverUrl: string | null;
    status: string;
    specialties: string;
    packageCount: number;
    rating: number | null;
    reviewCount: number;
  };
}) {
  return (
    <Link href={`/agencies/${agency.slug}`} className="group vc-card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative h-24 w-full overflow-hidden vc-lagoon">
        {agency.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={agency.coverUrl} alt="" className="h-full w-full object-cover opacity-95" loading="lazy" />
        ) : null}
      </div>
      <div className="px-4 pb-4">
        <div className="-mt-8 mb-2 flex items-end gap-3">
          <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow">
            {agency.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={agency.logoUrl} alt={agency.name} className="h-full w-full object-cover" loading="lazy" />
            ) : (
              <span className="grid h-full w-full place-items-center vc-sunset font-display text-xl font-black text-white">
                {agency.name.slice(0, 1)}
              </span>
            )}
          </span>
          {typeof agency.rating === "number" ? (
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-[11px] font-bold text-amber-700">
              <Star className="h-3 w-3 fill-current" /> {agency.rating.toFixed(1)} · {agency.reviewCount}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-1.5">
          <h3 className="truncate font-display text-base font-extrabold text-ink-900 group-hover:text-brand-600">
            {agency.name}
          </h3>
          {agency.status === "VERIFIED" ? <VerifiedTick /> : null}
        </div>
        <p className="line-clamp-2 text-xs text-ink-500">{agency.tagline || `Travel experts in ${agency.city}`}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {parseList(agency.specialties)
            .slice(0, 2)
            .map((item) => (
              <Badge key={item} tone="slate">
                {item}
              </Badge>
            ))}
          <Badge tone="brand">{agency.packageCount} packages</Badge>
        </div>
        <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-ink-400">
          <MapPin className="h-3 w-3" /> {agency.city}, {agency.country}
        </div>
      </div>
    </Link>
  );
}

export function ItineraryCard({
  itinerary,
}: {
  itinerary: {
    id: string;
    title: string;
    destination: string;
    country: string | null;
    days: number;
    budget: number | null;
    currency: string;
    coverUrl: string | null;
    style: string | null;
    tags: string;
    author: { name: string; username: string; avatarUrl: string | null };
    stopCount?: number;
  };
}) {
  return (
    <Link href={`/itineraries/${itinerary.id}`} className="group vc-card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink-100">
        {itinerary.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={itinerary.coverUrl}
            alt={itinerary.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full vc-sunset" />
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-black text-amber-700">
          <Route className="h-3.5 w-3.5" /> {itinerary.days}-day plan
        </span>
        {itinerary.budget ? (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-black text-white">
            {money(itinerary.budget, itinerary.currency)}
          </span>
        ) : null}
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-2 font-display text-base font-extrabold text-ink-900 group-hover:text-brand-600">
          {itinerary.title}
        </h3>
        <p className="flex items-center gap-1 text-xs font-semibold text-ink-500">
          <MapPin className="h-3.5 w-3.5 text-brand-500" /> {itinerary.destination}
          {itinerary.country ? `, ${itinerary.country}` : ""}
          {itinerary.stopCount ? ` · ${itinerary.stopCount} stops` : ""}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Avatar name={itinerary.author.name} src={itinerary.author.avatarUrl} size={26} />
          <span className="truncate text-xs font-semibold text-ink-600">@{itinerary.author.username}</span>
          {itinerary.style ? <Badge tone="violet" className="ml-auto">{itinerary.style}</Badge> : null}
        </div>
      </div>
    </Link>
  );
}

export function PostTile({
  post,
}: {
  post: {
    id: string;
    type: string;
    caption: string;
    media: { url: string; kind: string; posterUrl: string | null }[];
    _count: { likes: number; comments: number };
  };
}) {
  const first = post.media[0];
  return (
    <Link href={`/p/${post.id}`} className="group relative aspect-square overflow-hidden rounded-2xl bg-ink-100">
      {first?.kind === "VIDEO" ? (
        <video src={first.url} poster={first.posterUrl ?? undefined} muted playsInline className="h-full w-full object-cover" />
      ) : first ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={first.url} alt={post.caption.slice(0, 60)} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      ) : (
        <div className="h-full w-full vc-sunset" />
      )}

      {post.type !== "PHOTO" ? (
        <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white backdrop-blur">
          {post.type === "THREESIXTY" ? (
            <Rotate3d className="h-3.5 w-3.5" />
          ) : post.type === "ITINERARY" ? (
            <Route className="h-3.5 w-3.5" />
          ) : (
            <Users className="h-3.5 w-3.5" />
          )}
        </span>
      ) : null}
      {post.media.length > 1 ? (
        <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
          1/{post.media.length}
        </span>
      ) : null}

      <div className="absolute inset-0 hidden items-center justify-center gap-4 bg-black/45 text-sm font-bold text-white group-hover:flex">
        <span className="flex items-center gap-1">
          <Heart className="h-4 w-4 fill-current" /> {post._count.likes}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4 fill-current" /> {post._count.comments}
        </span>
      </div>
    </Link>
  );
}
