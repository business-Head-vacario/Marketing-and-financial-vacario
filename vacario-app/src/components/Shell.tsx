"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Bookmark,
  Clapperboard,
  Compass,
  Globe,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Map,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  SquarePlus,
  Ticket,
  Building,
  X,
} from "lucide-react";
import { Avatar, Button } from "./ui";
import { cn } from "@/lib/utils";

export type ShellUser = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  role: string;
  agencySlug: string | null;
  agencyStatus: string | null;
  unread: number;
};

const PRIMARY = [
  { href: "/", label: "Feed", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/reels", label: "Reels", icon: Clapperboard },
  { href: "/threesixty", label: "360° World", icon: Globe },
  { href: "/itineraries", label: "Itineraries", icon: Map },
  { href: "/packages", label: "Packages", icon: Ticket },
  { href: "/agencies", label: "Agencies", icon: Building },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-2xl vc-sunset text-lg font-black text-white shadow-lg shadow-brand-500/30">
        V
      </span>
      {!compact && (
        <span className="font-display text-2xl font-black tracking-tight">
          <span className="vc-gradient-text">Vacario</span>
        </span>
      )}
    </Link>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  badge,
  onClick,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  active: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition",
        active ? "bg-white text-brand-600 shadow-sm ring-1 ring-brand-100" : "text-ink-600 hover:bg-white/70",
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", active ? "text-brand-500" : "text-ink-400 group-hover:text-brand-500")} />
      <span className="truncate">{label}</span>
      {badge ? (
        <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full vc-sunset px-1.5 text-[10px] font-bold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </Link>
  );
}

function SearchBox({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  return (
    <form
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/explore?q=${encodeURIComponent(q.trim())}`);
      }}
    >
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search places, people, #tags"
        aria-label="Search Vacario"
        className="w-full rounded-full border border-ink-200 bg-white/90 py-2.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-ink-300 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
      />
    </form>
  );
}

function accountLinks(user: ShellUser | null) {
  if (!user) return [];
  const links = [
    { href: `/u/${user.username}`, label: "My profile", icon: Home },
    { href: "/saved", label: "Saved", icon: Bookmark },
    { href: "/bookings", label: "My bookings", icon: Ticket },
    { href: "/settings", label: "Settings", icon: Settings },
  ];
  if (user.agencySlug || user.role === "AGENT") {
    links.splice(1, 0, { href: "/dashboard", label: "Agent dashboard", icon: LayoutDashboard });
  }
  if (user.role === "ADMIN") links.push({ href: "/admin", label: "Admin", icon: ShieldCheck });
  return links;
}

export function Shell({ user, children }: { user: ShellUser | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const immersive = pathname.startsWith("/reels");

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className={cn("min-h-screen", immersive ? "bg-ink-900" : "vc-mesh")}>
      {/* top bar */}
      <header
        className={cn(
          "sticky top-0 z-40 border-b lg:hidden",
          immersive ? "border-white/10 bg-ink-900/90" : "border-ink-100/80 vc-glass",
        )}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className={cn("rounded-xl p-2 lg:hidden", immersive ? "text-white" : "text-ink-600")}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo compact />
          <SearchBox className="ml-auto hidden max-w-xs flex-1 sm:block" />
          {user ? (
            <Link href="/notifications" className="relative rounded-xl p-2 text-ink-600">
              <Bell className={cn("h-5 w-5", immersive && "text-white")} />
              {user.unread > 0 && (
                <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white" />
              )}
            </Link>
          ) : (
            <Button href="/login" size="sm" className="ml-auto">
              <LogIn className="h-4 w-4" /> Log in
            </Button>
          )}
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] gap-6 px-0 lg:px-6">
        {/* desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-4 overflow-y-auto py-6 lg:flex">
          <Logo />
          <SearchBox />
          <nav className="flex flex-col gap-1">
            {PRIMARY.map((item) => (
              <NavLink key={item.href} {...item} active={isActive(item.href)} />
            ))}
          </nav>
          <div className="h-px bg-ink-200/70" />
          <nav className="flex flex-col gap-1">
            {user ? (
              <>
                <NavLink
                  href="/notifications"
                  label="Notifications"
                  icon={Bell}
                  active={isActive("/notifications")}
                  badge={user.unread}
                />
                {accountLinks(user).map((item) => (
                  <NavLink key={item.href} {...item} active={isActive(item.href)} />
                ))}
              </>
            ) : (
              <>
                <NavLink href="/login" label="Log in" icon={LogIn} active={isActive("/login")} />
                <NavLink href="/signup" label="Join Vacario" icon={SquarePlus} active={isActive("/signup")} />
                <NavLink
                  href="/onboarding/agent"
                  label="List your agency"
                  icon={Building}
                  active={isActive("/onboarding/agent")}
                />
              </>
            )}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <Button href="/create" full size="lg">
              <SquarePlus className="h-5 w-5" /> Create
            </Button>
            {user ? (
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 p-2.5">
                <Avatar name={user.name} src={user.avatarUrl} size={38} ring />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-ink-900">{user.name}</div>
                  <div className="truncate text-xs text-ink-400">@{user.username}</div>
                </div>
                <LogoutButton />
              </div>
            ) : null}
          </div>
        </aside>

        <main className={cn("min-w-0 flex-1 pb-24 lg:pb-10", immersive ? "py-0" : "py-4 lg:py-8")}>{children}</main>
      </div>

      {/* mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col gap-3 overflow-y-auto bg-sand p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button aria-label="Close menu" onClick={() => setMenuOpen(false)} className="rounded-xl p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {PRIMARY.map((item) => (
                <NavLink key={item.href} {...item} active={isActive(item.href)} />
              ))}
            </nav>
            <div className="h-px bg-ink-200" />
            <nav className="flex flex-col gap-1">
              {user ? (
                <>
                  <NavLink href="/notifications" label="Notifications" icon={Bell} active={isActive("/notifications")} badge={user.unread} />
                  {accountLinks(user).map((item) => (
                    <NavLink key={item.href} {...item} active={isActive(item.href)} />
                  ))}
                </>
              ) : (
                <>
                  <NavLink href="/login" label="Log in" icon={LogIn} active={false} />
                  <NavLink href="/signup" label="Join Vacario" icon={SquarePlus} active={false} />
                  <NavLink href="/onboarding/agent" label="List your agency" icon={Building} active={false} />
                </>
              )}
            </nav>
            {user ? (
              <div className="mt-auto">
                <LogoutButton withLabel />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* mobile bottom bar */}
      <nav
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t px-2 py-2 lg:hidden",
          immersive ? "border-white/10 bg-ink-900/95 text-white" : "border-ink-100 vc-glass",
        )}
      >
        {[
          { href: "/", label: "Feed", icon: Home },
          { href: "/explore", label: "Explore", icon: Compass },
          { href: "/create", label: "Create", icon: SquarePlus },
          { href: "/reels", label: "Reels", icon: Clapperboard },
          { href: "/packages", label: "Trips", icon: Ticket },
        ].map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-bold transition",
                active ? "text-brand-600" : immersive ? "text-white/70" : "text-ink-400",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
        <Link
          href={user ? `/u/${user.username}` : "/login"}
          className={cn(
            "flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[10px] font-bold",
            immersive ? "text-white/70" : "text-ink-400",
          )}
        >
          {user ? <Avatar name={user.name} src={user.avatarUrl} size={20} /> : <LogIn className="h-5 w-5" />}
          {user ? "You" : "Login"}
        </Link>
      </nav>
    </div>
  );
}

export function LogoutButton({ withLabel = false }: { withLabel?: boolean }) {
  const router = useRouter();
  const busy = useRef(false);
  return (
    <button
      title="Log out"
      onClick={async () => {
        if (busy.current) return;
        busy.current = true;
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
      }}
      className={cn(
        "flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-semibold text-ink-500 transition hover:bg-rose-50 hover:text-rose-600",
        withLabel && "w-full justify-center border border-ink-200 bg-white",
      )}
    >
      <LogOut className="h-4 w-4" />
      {withLabel ? "Log out" : null}
    </button>
  );
}
