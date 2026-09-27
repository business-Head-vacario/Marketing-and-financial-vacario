import Link from "next/link";
import { Bell, CalendarDays, Heart, MessageCircle, ShieldCheck, UserPlus } from "lucide-react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { MarkAllRead } from "@/components/MarkAllRead";
import { Avatar, EmptyState } from "@/components/ui";
import { cn, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Notifications" };

const ICONS: Record<string, { icon: typeof Bell; tint: string }> = {
  LIKE: { icon: Heart, tint: "bg-rose-100 text-rose-600" },
  COMMENT: { icon: MessageCircle, tint: "bg-sky-100 text-sky-600" },
  FOLLOW: { icon: UserPlus, tint: "bg-violet-100 text-violet-600" },
  BOOKING: { icon: CalendarDays, tint: "bg-emerald-100 text-emerald-600" },
  BOOKING_STATUS: { icon: CalendarDays, tint: "bg-amber-100 text-amber-600" },
  AGENCY_STATUS: { icon: ShieldCheck, tint: "bg-lagoon-100 text-lagoon-600" },
};

export default async function NotificationsPage() {
  const user = await requireUser("/login?next=/notifications");

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 60,
    include: { actor: { select: { name: true, username: true, avatarUrl: true } } },
  });

  const unread = notifications.filter((notification) => !notification.read).length;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-3 sm:px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-black tracking-tight">Notifications</h1>
          <p className="text-sm text-ink-500">{unread ? `${unread} unread` : "You're all caught up"}</p>
        </div>
        {unread ? <MarkAllRead /> : null}
      </div>

      {notifications.length ? (
        <ul className="space-y-2">
          {notifications.map((notification) => {
            const meta = ICONS[notification.type] ?? { icon: Bell, tint: "bg-ink-100 text-ink-600" };
            const Icon = meta.icon;
            const body = (
              <div
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4 transition",
                  notification.read ? "border-ink-100 bg-white" : "border-brand-200 bg-brand-50/60",
                )}
              >
                {notification.actor ? (
                  <Avatar name={notification.actor.name} src={notification.actor.avatarUrl} size={40} />
                ) : (
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full", meta.tint)}>
                    <Icon className="h-5 w-5" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink-800">{notification.message}</p>
                  <p className="text-[11px] font-semibold text-ink-400">{timeAgo(notification.createdAt)}</p>
                </div>
                <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-full", meta.tint)}>
                  <Icon className="h-3.5 w-3.5" />
                </span>
              </div>
            );
            return (
              <li key={notification.id}>
                {notification.href ? <Link href={notification.href}>{body}</Link> : body}
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState emoji="🔔" title="Nothing yet" body="Likes, comments, follows and bookings all land here." />
      )}
    </div>
  );
}
