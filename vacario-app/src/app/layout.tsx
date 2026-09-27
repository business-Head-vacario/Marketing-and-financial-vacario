import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import { Shell, type ShellUser } from "@/components/Shell";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vacario — the travel social network",
    template: "%s · Vacario",
  },
  description:
    "Share trips in photos, reels and 360°, publish day-by-day itineraries, discover verified travel agencies and book their packages — all in one place.",
  keywords: ["travel", "social network", "itineraries", "360 travel", "tour packages", "travel agents"],
  openGraph: {
    title: "Vacario — the travel social network",
    description: "Photos, reels, 360° trips, itineraries and bookable packages from verified agencies.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ff5a1f",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const current = await getCurrentUser();
  let shellUser: ShellUser | null = null;

  if (current) {
    const unread = await db.notification.count({ where: { userId: current.id, read: false } });
    shellUser = {
      id: current.id,
      name: current.name,
      username: current.username,
      avatarUrl: current.avatarUrl,
      role: current.role,
      agencySlug: current.agency?.slug ?? null,
      agencyStatus: current.agency?.status ?? null,
      unread,
    };
  }

  return (
    <html lang="en" className={`${jakarta.variable} ${outfit.variable}`}>
      <body>
        <Shell user={shellUser}>{children}</Shell>
      </body>
    </html>
  );
}
