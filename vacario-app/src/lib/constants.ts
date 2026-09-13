export const ROLES = ["TRAVELLER", "AGENT", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const POST_TYPES = ["PHOTO", "REEL", "THREESIXTY", "ITINERARY"] as const;
export type PostType = (typeof POST_TYPES)[number];

export const POST_TYPE_LABEL: Record<PostType, string> = {
  PHOTO: "Photo",
  REEL: "Reel",
  THREESIXTY: "360°",
  ITINERARY: "Itinerary",
};

export const MEDIA_KINDS = ["IMAGE", "VIDEO", "PANORAMA"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const AGENCY_STATUSES = ["PENDING", "VERIFIED", "REJECTED"] as const;
export type AgencyStatus = (typeof AGENCY_STATUSES)[number];

export const PACKAGE_CATEGORIES = [
  "ADVENTURE",
  "BEACH",
  "HONEYMOON",
  "FAMILY",
  "GROUP",
  "LUXURY",
  "PILGRIMAGE",
  "WILDLIFE",
  "WEEKEND",
  "WORKATION",
] as const;
export type PackageCategory = (typeof PACKAGE_CATEGORIES)[number];

export const STOP_CATEGORIES = ["STAY", "FOOD", "ACTIVITY", "TRANSPORT", "SIGHT"] as const;
export type StopCategory = (typeof STOP_CATEGORIES)[number];

export const STOP_META: Record<StopCategory, { label: string; emoji: string; tint: string }> = {
  STAY: { label: "Stay", emoji: "🛏️", tint: "bg-violet-100 text-violet-700" },
  FOOD: { label: "Food", emoji: "🍜", tint: "bg-amber-100 text-amber-700" },
  ACTIVITY: { label: "Activity", emoji: "🎒", tint: "bg-emerald-100 text-emerald-700" },
  TRANSPORT: { label: "Transport", emoji: "🚌", tint: "bg-sky-100 text-sky-700" },
  SIGHT: { label: "Sight", emoji: "📸", tint: "bg-rose-100 text-rose-700" },
};

export const TRAVEL_INTERESTS = [
  "Mountains",
  "Beaches",
  "Backpacking",
  "Food trails",
  "Wildlife",
  "Road trips",
  "Culture & heritage",
  "Scuba & water sports",
  "Trekking",
  "Photography",
  "Festivals",
  "Wellness & yoga",
  "Nightlife",
  "Luxury stays",
  "Solo travel",
  "Workation",
];

export const TRAVEL_STYLES = [
  "Budget backpacker",
  "Comfort seeker",
  "Luxury traveller",
  "Family holidays",
  "Solo explorer",
  "Group trips",
  "Digital nomad",
];

export const AGENCY_SPECIALTIES = [
  "Domestic tours",
  "International tours",
  "Honeymoon",
  "Adventure & trekking",
  "Corporate & MICE",
  "Pilgrimage",
  "Wildlife safari",
  "Cruises",
  "Visa assistance",
  "Custom itineraries",
];

export const LANGUAGES = [
  "English",
  "Hindi",
  "Bengali",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Gujarati",
  "Punjabi",
  "French",
  "Spanish",
];

export const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  CAD: "C$",
  AED: "AED ",
};

export const TAX_RATE = 0.05; // 5% GST on tour packages
