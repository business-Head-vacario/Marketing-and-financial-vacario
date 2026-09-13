# Vacario — travel social network + agency marketplace

A full-stack travel app: an Instagram-shaped feed built for travel (photos, reels, drag-to-explore
360° panoramas), day-by-day itineraries with real costs, verified travel-agency portfolios, and
bookable packages with checkout, bookings and an agent dashboard.

One Next.js codebase, one database, no external services required to run it.

```sh
npm install
cp .env.example .env      # then edit AUTH_SECRET
npm run setup             # generate client + create db + demo media + seed
npm run dev               # http://localhost:3000
```

**Demo logins** (password `vacario123` for all):

| Role | Email | Lands on |
|---|---|---|
| Traveller | `ananya@vacario.app` | feed, itineraries, bookings |
| Travel agent | `arjun@himalayatrails.in` | `/dashboard` — packages & bookings |
| Admin | `admin@vacario.app` | `/admin` — agency verification |

---

## What's in it

### Social
- **Feed** with *For you* / *Following* tabs, cursor-based infinite scroll, likes, saves, comments,
  follows and a stories rail.
- **Post types**: photo carousels, vertical reels, **360° panoramas** and itinerary posts. Travel
  metadata is first-class — location, country, #tags, trip budget, month travelled and a 1–5 rating
  render as badges on the card.
- **Reels** — a full-screen vertical player with snap scrolling, viewport-triggered playback and a
  *Book* button when a reel promotes a package.
- **360° World** (`/threesixty`) — every panorama is a real equirectangular texture wrapped on a
  sphere with three.js: drag to look around, scroll to zoom. three.js is imported lazily, so pages
  without a panorama never download it.
- **Explore** — search across captions, places, tags and people, filtered by post type.
- **Profiles** — cover, avatar, interests, travel style, follower counts, and tabs for posts, 360°,
  itineraries and saved posts.
- **Notifications** for likes, comments, follows, bookings and verification decisions.

### Itineraries
- A **builder** with days → stops (time, place, category, cost, note), live per-day and total cost.
- Public plans are **copyable**: one tap forks someone's itinerary into your account as a private
  draft you can edit.
- Itineraries attach to feed posts, and the itinerary page cross-sells agency packages for the same
  destination.

### Agencies & the marketplace
- **Agent onboarding** — a three-step form (agency → contact & licence → profile) that creates the
  agency, flips the account to `AGENT` and queues it for verification. Agents can publish and sell
  immediately; the blue tick follows.
- **Agency portfolio** (`/agencies/[slug]`) — cover, logo, stats, packages, photo/reel/360 portfolio,
  reviews, credentials and contact details.
- **Packages** — full CRUD from the dashboard: pricing with discounts, group sizes, availability
  window, inclusions/exclusions/highlights, gallery, day-by-day plan, draft/publish/archive.
- **Booking & checkout** — date and guest picker, live quote (discount + 5% tax), traveller details,
  three payment methods, booking reference, payment record, and instant confirmation on
  instant-book packages.
- **Agent dashboard** — revenue, bookings, travellers and package counts; confirm / complete /
  cancel bookings; edit the agency profile.
- **Admin console** — verify, reject or reset agencies; marketplace-wide stats.

### Payments
Checkout is **simulated**: no gateway is called, no card details are stored or transmitted. Everything
around it is real — the `Booking` row, the `Payment` record with its reference and status, the agent's
dashboard entry, the notification and the traveller's booking page. To go live, replace the payment
block in `src/app/api/bookings/route.ts` with a Stripe/Razorpay call and keep the same status
transitions.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, React 19, server components) |
| Language | TypeScript, strict |
| Styling | Tailwind CSS v4 with a custom theme (`src/app/globals.css`) |
| Database | Prisma 6 + SQLite by default, Postgres-ready |
| Auth | Email/username + bcrypt, signed JWT session cookie (`jose`), httpOnly |
| Validation | Zod on every write endpoint |
| 3D | three.js, lazily imported, for the 360° viewer |

No CSS framework beyond Tailwind, no component library, no state-management library — pages are
server components that fetch through Prisma and hand plain data to small client components.

## Layout

```
prisma/schema.prisma     16 models: users, follows, posts, media, itineraries,
                         agencies, packages, bookings, payments, reviews, notifications
prisma/seed.ts           9 accounts, 3 agencies, 8 packages, 20 posts, 3 itineraries, 7 bookings
scripts/generate-media.mjs   writes the demo images — SVG scenes plus real
                             equirectangular PNG panoramas (no binaries in git)
src/lib/                 db, auth/session, validators, pricing, serializers, constants
src/app/api/             18 route handlers (see below)
src/app/                 pages
src/components/          UI kit, cards, media (carousel, video, panorama), forms
```

### API

| Method & path | Purpose |
|---|---|
| `POST /api/auth/signup` · `login` · `logout` | session lifecycle |
| `PATCH /api/profile` | traveller onboarding + settings |
| `POST /api/upload` | media upload (40 MB cap, type allow-list) |
| `GET/POST /api/posts` · `DELETE /api/posts/[id]` | feed pagination and authoring |
| `POST /api/posts/[id]/like` · `save` · `comments` | interactions |
| `POST /api/follow` | follow / unfollow |
| `POST /api/itineraries` · `POST/DELETE /api/itineraries/[id]` | create, fork, delete |
| `POST /api/agencies` · `PATCH /api/agencies/[id]` | agent onboarding, profile edit |
| `POST /api/packages` · `PATCH/DELETE /api/packages/[id]` | package CRUD (archives if booked) |
| `POST /api/bookings` · `PATCH /api/bookings/[id]` | book, then confirm/complete/cancel |
| `POST /api/reviews` | review an agency you booked with |
| `POST /api/notifications` | mark all read |
| `PATCH /api/admin/agencies/[id]` | verification decision |

Every handler validates its body with Zod and checks ownership before writing. Travellers can only
cancel their own bookings; only the owning agency (or an admin) can confirm or complete one.

## Scripts

| Script | Does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` / `start` | production build and serve |
| `npm run setup` | generate client, create the DB, build demo media, seed |
| `npm run db:reset` | wipe and re-seed |
| `npm run db:studio` | Prisma Studio |
| `npm run media:generate` | regenerate the demo images |
| `npm run typecheck` | `tsc --noEmit` |

## Environment

```sh
DATABASE_URL="file:./dev.db"   # or a postgres:// URL
AUTH_SECRET="…"                # openssl rand -base64 32 — required
UPLOAD_DIR="uploads"           # folder under /public for uploaded media
```

## Deploying

**Any host with a disk** (Render, Railway, Fly.io, a VPS, Docker) — works as built:

```sh
npm ci && npm run build && npm start
```

A `Dockerfile` is included. Mount a volume at `/app/public/uploads` (and, if you stay on SQLite, at
the database file) so uploads and data survive restarts.

**Postgres** (recommended for production):

1. `provider = "postgresql"` in `prisma/schema.prisma`
2. `DATABASE_URL="postgres://…"`
3. `npx prisma migrate deploy` (or `db push`), then optionally `npm run db:seed`

**Vercel** — the app itself deploys as-is, but the serverless filesystem is read-only and ephemeral,
so `POST /api/upload` cannot write there. Either point media at S3/Cloudinary by swapping the body of
that one route handler, or use the "paste a URL" input the uploader already offers. Use Postgres, not
SQLite, on serverless.

### Production checklist

- [ ] Set a long random `AUTH_SECRET` (sessions are signed with it; changing it logs everyone out)
- [ ] Move to Postgres and run `prisma migrate deploy`
- [ ] Put uploads on object storage, or mount a persistent volume
- [ ] Swap the simulated checkout for a real gateway
- [ ] Serve over HTTPS — the session cookie sets `secure` automatically in production

## Notes and limits

- Media in `public/seed/` is generated, not photography — colourful SVG scenes plus procedurally
  drawn equirectangular PNGs. Nothing is fetched from the network at build or run time.
- The seeded "reels" use images rather than video files, so the repo carries no binaries; the reel
  player handles both (`kind: VIDEO` plays, `kind: IMAGE` gets a Ken Burns pan). Upload an MP4 and it
  plays as a real reel.
- `npm audit` reports an advisory in `deepmerge-ts`, a transitive dependency of the **Prisma CLI**
  (a devDependency). It is not in the runtime bundle.
- Direct messaging, push notifications and map views are deliberately out of scope for this stage.
