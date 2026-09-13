import { CURRENCY_SYMBOL } from "./constants";

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
  } catch {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
}

export function stringifyList(values: unknown): string {
  if (Array.isArray(values)) return JSON.stringify(values.map(String).filter(Boolean));
  if (typeof values === "string") return JSON.stringify(parseList(values));
  return "[]";
}

export function money(amount: number, currency = "INR") {
  const symbol = CURRENCY_SYMBOL[currency] ?? `${currency} `;
  const rounded = Math.round(amount);
  const grouped =
    currency === "INR"
      ? rounded.toLocaleString("en-IN")
      : rounded.toLocaleString("en-US");
  return `${symbol}${grouped}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

export function timeAgo(date: Date | string) {
  const then = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const units: Array<[number, string]> = [
    [60, "m"],
    [3600, "h"],
    [86400, "d"],
    [604800, "w"],
  ];
  if (seconds < 3600) return `${Math.floor(seconds / units[0][0])}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / units[1][0])}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / units[2][0])}d ago`;
  return then.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Deterministic gradient per id/name, so avatars and covers stay colourful but stable. */
const GRADIENTS = [
  "from-rose-500 via-orange-400 to-amber-300",
  "from-fuchsia-500 via-purple-500 to-indigo-500",
  "from-cyan-400 via-sky-500 to-blue-600",
  "from-emerald-400 via-teal-500 to-cyan-500",
  "from-amber-400 via-orange-500 to-rose-500",
  "from-indigo-500 via-blue-500 to-teal-400",
  "from-pink-500 via-rose-400 to-orange-300",
  "from-lime-400 via-emerald-500 to-teal-600",
];

export function gradientFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  return GRADIENTS[hash % GRADIENTS.length];
}

export function bookingReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `VC-${out}`;
}

export function priceAfterDiscount(price: number, discountPercent: number) {
  return Math.max(0, Math.round(price * (1 - (discountPercent || 0) / 100)));
}

export function nights(days: number) {
  return Math.max(0, days - 1);
}
