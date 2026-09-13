import { z } from "zod";
import {
  AGENCY_STATUSES,
  BOOKING_STATUSES,
  MEDIA_KINDS,
  PACKAGE_CATEGORIES,
  POST_TYPES,
  STOP_CATEGORIES,
} from "./constants";

const trimmed = (max: number) => z.string().trim().max(max);

export const signupSchema = z.object({
  name: trimmed(80).min(2, "Tell us your name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "At least 3 characters")
    .max(24, "At most 24 characters")
    .regex(/^[a-z0-9._]+$/, "Letters, numbers, dots and underscores only"),
  password: z.string().min(8, "Use at least 8 characters").max(100),
  role: z.enum(["TRAVELLER", "AGENT"]).default("TRAVELLER"),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(3, "Email or username required"),
  password: z.string().min(1, "Password required"),
});

export const travellerProfileSchema = z.object({
  name: trimmed(80).min(2).optional(),
  bio: trimmed(280).optional(),
  homeCity: trimmed(60).optional(),
  country: trimmed(60).optional(),
  website: z.string().trim().max(120).optional().or(z.literal("")),
  avatarUrl: z.string().trim().max(500).optional().or(z.literal("")),
  coverUrl: z.string().trim().max(500).optional().or(z.literal("")),
  interests: z.array(z.string().trim().max(40)).max(12).default([]),
  travelStyle: trimmed(40).optional(),
});

export const agencySchema = z.object({
  name: trimmed(90).min(2, "Agency name required"),
  tagline: trimmed(120).optional().default(""),
  about: trimmed(2000).optional().default(""),
  city: trimmed(60).min(2, "City required"),
  country: trimmed(60).default("India"),
  address: trimmed(200).optional().default(""),
  phone: z.string().trim().min(7, "Contact number required").max(20),
  email: z.string().trim().toLowerCase().email("Business email required"),
  website: z.string().trim().max(150).optional().or(z.literal("")),
  licenseNo: trimmed(60).optional().or(z.literal("")),
  gstNo: trimmed(40).optional().or(z.literal("")),
  yearsInBusiness: z.coerce.number().int().min(0).max(100).default(0),
  teamSize: z.coerce.number().int().min(1).max(10000).default(1),
  specialties: z.array(z.string().trim().max(40)).max(12).default([]),
  languages: z.array(z.string().trim().max(30)).max(12).default([]),
  logoUrl: z.string().trim().max(500).optional().or(z.literal("")),
  coverUrl: z.string().trim().max(500).optional().or(z.literal("")),
});

export const mediaSchema = z.object({
  url: z.string().trim().min(1, "Media URL required").max(1000),
  kind: z.enum(MEDIA_KINDS).default("IMAGE"),
  posterUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  alt: trimmed(160).optional().or(z.literal("")),
});

export const stopSchema = z.object({
  time: trimmed(20).optional().or(z.literal("")),
  title: trimmed(120).min(1, "Add a title"),
  place: trimmed(120).optional().or(z.literal("")),
  note: trimmed(400).optional().or(z.literal("")),
  cost: z.coerce.number().min(0).max(10_000_000).optional(),
  category: z.enum(STOP_CATEGORIES).default("ACTIVITY"),
});

export const itineraryDaySchema = z.object({
  title: trimmed(120).optional().default(""),
  notes: trimmed(600).optional().default(""),
  stops: z.array(stopSchema).max(20).default([]),
});

export const itinerarySchema = z.object({
  title: trimmed(120).min(3, "Give the trip a title"),
  destination: trimmed(80).min(2, "Where did you go?"),
  country: trimmed(60).optional().or(z.literal("")),
  summary: trimmed(1000).optional().default(""),
  budget: z.coerce.number().min(0).max(100_000_000).optional(),
  currency: z.string().trim().max(4).default("INR"),
  coverUrl: z.string().trim().max(1000).optional().or(z.literal("")),
  style: trimmed(40).optional().or(z.literal("")),
  bestSeason: trimmed(40).optional().or(z.literal("")),
  tags: z.array(z.string().trim().max(30)).max(12).default([]),
  isPublic: z.boolean().default(true),
  dayPlans: z.array(itineraryDaySchema).min(1, "Add at least one day").max(60),
  shareToFeed: z.boolean().default(true),
});

export const postSchema = z.object({
  type: z.enum(POST_TYPES).default("PHOTO"),
  caption: trimmed(2200).default(""),
  locationName: trimmed(100).optional().or(z.literal("")),
  country: trimmed(60).optional().or(z.literal("")),
  tags: z.array(z.string().trim().max(30)).max(15).default([]),
  budget: z.coerce.number().min(0).max(100_000_000).optional(),
  currency: z.string().trim().max(4).default("INR"),
  tripMonth: trimmed(20).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  itineraryId: z.string().trim().optional().or(z.literal("")),
  packageId: z.string().trim().optional().or(z.literal("")),
  media: z.array(mediaSchema).min(1, "Add at least one photo, video or 360 image").max(10),
});

export const commentSchema = z.object({ body: trimmed(600).min(1, "Say something") });

export const packageDaySchema = z.object({
  title: trimmed(120).min(1, "Day title required"),
  description: trimmed(800).optional().default(""),
  meals: trimmed(80).optional().default(""),
  stay: trimmed(120).optional().default(""),
});

export const packageSchema = z.object({
  title: trimmed(120).min(4, "Package title required"),
  destination: trimmed(80).min(2, "Destination required"),
  country: trimmed(60).default("India"),
  startCity: trimmed(60).optional().or(z.literal("")),
  summary: trimmed(300).optional().default(""),
  description: trimmed(4000).optional().default(""),
  category: z.enum(PACKAGE_CATEGORIES).default("ADVENTURE"),
  durationDays: z.coerce.number().int().min(1).max(90),
  durationNights: z.coerce.number().int().min(0).max(90),
  price: z.coerce.number().min(0).max(100_000_000),
  currency: z.string().trim().max(4).default("INR"),
  discountPercent: z.coerce.number().int().min(0).max(90).default(0),
  minGuests: z.coerce.number().int().min(1).max(500).default(1),
  maxGuests: z.coerce.number().int().min(1).max(500).default(12),
  inclusions: z.array(z.string().trim().max(120)).max(30).default([]),
  exclusions: z.array(z.string().trim().max(120)).max(30).default([]),
  highlights: z.array(z.string().trim().max(120)).max(20).default([]),
  images: z.array(z.string().trim().max(1000)).max(12).default([]),
  availableFrom: z.string().trim().optional().or(z.literal("")),
  availableTo: z.string().trim().optional().or(z.literal("")),
  instantBook: z.boolean().default(true),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  dayPlans: z.array(packageDaySchema).max(90).default([]),
});

export const bookingSchema = z.object({
  packageId: z.string().trim().min(1),
  travelDate: z.string().trim().min(4, "Pick a travel date"),
  guests: z.coerce.number().int().min(1).max(500),
  travellerName: trimmed(90).min(2, "Name required"),
  travellerEmail: z.string().trim().toLowerCase().email("Valid email required"),
  travellerPhone: z.string().trim().min(7, "Phone required").max(20),
  notes: trimmed(800).optional().default(""),
  paymentMethod: z.enum(["MOCK_CARD", "MOCK_UPI", "PAY_AT_AGENCY"]).default("MOCK_CARD"),
});

export const bookingStatusSchema = z.object({ status: z.enum(BOOKING_STATUSES) });

export const agencyStatusSchema = z.object({
  status: z.enum(AGENCY_STATUSES),
  reviewNote: trimmed(300).optional().or(z.literal("")),
});

export const reviewSchema = z.object({
  agencyId: z.string().trim().min(1),
  packageId: z.string().trim().optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  body: trimmed(800).optional().default(""),
});
