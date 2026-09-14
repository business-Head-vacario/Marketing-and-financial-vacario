# Vacario Budget Engine

An interactive budget calculator for the Vacario / Friendship Travel Tech growth plan.
Set a marketing budget, watch traction, break-even, funding need and cumulative cash respond.

**Source of truth:** `src/app.html` (a self-contained page fragment).
`index.html` is generated from it by `./build.sh` — edit the fragment, not the build output.

```sh
./build.sh && open index.html
```

No dependencies, no build tooling, no network calls except the Google Fonts stylesheet.

---

## Two models, three tabs

The **preset selector** switches between the two plans on file:

| Preset | Horizon | Budget | Traffic | Conversion |
|---|---|---|---|---|
| **Growth Plan A** | 36 months | CAD 15,000 floor, 25% reinvestment from year 2 | 9 paid channels, blended 17.4 INR | ramps 40% → 100% over 12 months |
| **Community-led** | 36 months | same budget rule | 44% of budget into community + content | same, plus owned-traffic uplift |
| **Year 1 lean** | 12 months | CAD 15,000 flat | single stated rate, 10.9 INR | full from month 1 |

Five tabs: **Model** (scenarios, J-curve, ledger, top suggestions), **Channels & CAC** (the marketing
mix, budget by family, channel contribution, revenue by stream, sensitivity), **Suggestions**,
**Traction check** (assumption audit), **Export** (Excel workbook, Word brief).

## Visuals

| Chart | Shows |
|---|---|
| Cumulative cash J-curve | three budgets against the published plan, with payback markers |
| Net revenue vs total cost | the crossing point, with the burn window shaded |
| Budget by channel family | one 100% bar over six families, ordinal ramp, every slice labelled |
| Channels punching above their weight | budget share against share of paid sessions, per channel |
| Where the traffic comes from | paid / owned / returning sessions over the horizon |
| Cost per booking | blended CAC by month |
| Revenue by stream | six sparkline tiles, one per revenue line |
| What moves the answer most | tornado: ±20% on each assumption against cumulative cash |

## Suggestions

The **Suggestions** tab reads the current model and ranks what to do about it — high priority for
anything that changes a number a stakeholder would quote, amber for allocation calls, the rest
housekeeping. Where an impact figure is shown the change was *actually simulated*: the assumption is
moved, the full horizon re-run, and the difference in cumulative cash reported. Where a suggestion
needs a channel the current mix does not contain, it says so rather than showing a misleading zero.
The top three also appear under the finding on the Model tab, and the full list ships in both the
workbook and the Word brief.

## Marketing channels and the owned audience

Every channel has a type, and the type decides what the money buys:

| Type | Buys | Behaviour |
|---|---|---|
| **Paid** | a session | gone next month; pay again for the next one |
| **Community** | a member | returns `sessionsPerMember` times a month and refers others until they lapse |
| **Content** | a follower | compounding owned reach at a lower monthly yield |

That is the whole mechanism behind a falling CAC: an owned audience is paid for once and keeps
returning, and warm traffic converts better than cold (the *owned conversion uplift*). The
community-led default mix:

**32 channels across six families**, the ones travel and tourism actually use. Community-led shares:

| Family | Share | Channels |
|---|---|---|
| Paid search & shopping | 20% | Google Search brand / non-brand, Google Hotel Ads & Things to do, Performance Max / Demand Gen |
| Paid social & video | 15% | Meta prospecting, Meta retargeting, YouTube & short-form ads, app install (UAC/Meta), programmatic display & retargeting, native & discovery, OTT & connected TV |
| Metasearch & partnerships | 14% | Metasearch (Skyscanner, Kayak, Trivago, Wego), affiliates & cashback, bank & credit-card, telco & wallet (Paytm, PhonePe), airline & hotel co-marketing, travel agent / B2B2C |
| Community & owned | 31% | Travel community (WhatsApp, Telegram, Discord), in-app community & UGC feed, loyalty & membership, referral credits, email & CRM lifecycle, push & WhatsApp broadcast |
| Content & creators | 19% | SEO destination guides & itineraries, short-form video (Reels, Shorts), YouTube long-form, creator & UGC partnerships, campus ambassadors |
| Offline & brand | 1% | PR & media, events & travel fairs, OOH & transit, regional print & radio |

Channels at 0% stay in the table greyed out, so the full menu is visible and one edit away. Growth
Plan A keeps its own nine documented channels untouched — that is the plan of record.

A member at 60 INR who returns 0.55 times a month and churns at 5% lives about 20 months, so roughly
11 sessions for 60 INR — about 3× cheaper than a paid session, which is a real but not fantastical
advantage. The traction check flags any configuration claiming more than 10×.

**The serviceable audience ceiling** stops the model running away. Owned stocks compound and the
reinvestment rule feeds them, so without a ceiling the plan reaches implausible scale. Acquisition
efficiency degrades as the base fills toward the ceiling. Growth Plan A and Year 1 lean carry **no**
ceiling because that is how those documents were written; Community-led sets one at 3,000,000 monthly
users, roughly ixigo's reported monthly transacting base for all of India. Comparing presets straight
across flatters the uncapped ones — set the same ceiling on both first.

## What it answers

1. **What does a given marketing budget buy?** Paid visitors → active users → bookings → commission.
2. **When does it break even?** Operating break-even, cash payback and peak funding need, separately.
3. **What budget hits a revenue target by a given month?** Solved by bisection, and reported with the
   number of active users and bookings required to get there.
4. **Is more spend worth it?** Three scenarios side by side, with cash returned per unit of marketing.

The core tension the tool exists to show: marketing is paid this month, traction arrives over many
months. Raise the budget and break-even can move out and the cash hole deepen before the curve turns.
The finding line under the J-curve names the month one scenario overtakes another on cumulative cash.

## The model

Each month, for scenario budget `B`:

```
cities_live  = launches on or before this month
cpv          = base_cpv × learning × saturation
                 learning   = max(floor, (1 − improvement)^(m−1))
                 saturation = max(1, (B ÷ cities_live ÷ reference_per_city)) ^ exponent
paid         = B × FX ÷ cpv
organic      = organic₁ × (1 + organic_growth)^(m−1)
halo         = paid × halo_rate            halo_rate ramps start → steady
returning    = returning_pct × MAU(m−1)
MAU          = paid + organic + halo + returning

views        = MAU × search% × view%
bookings(s)  = views × conversion(s) × maturity      maturity ramps m1 → steady
GMV(s)       = bookings(s) × average booking value(s)
revenue(s)   = GMV(s) × take rate(s)
net revenue  = Σ revenue(s) + group sales (B2B)

cost         = payment gateway + promotions + salaries + B + subscriptions
                 + office + group enablement
EBITDA       = net revenue − cost
cash(m)      = cash(m−1) + EBITDA − capex
```

From `reinvest_from` the budget stops being a fixed floor and becomes
`max(floor, reinvest% × last month's net revenue)` — the flywheel that steepens the late curve.

**Saturation is the reason more budget is not simply better.** At exponent `0.5`, doubling spend in a
city buys about `1.41×` the visitors. At `0` spend never saturates; at `1` it stops working entirely.
Spending *below* the per-city reference carries no penalty.

Three numbers, deliberately kept apart:

- **Operating break-even** — first month from which monthly EBITDA stays positive for the rest of the horizon.
- **Cash payback** — the month cumulative cash climbs back through zero. Always later.
- **Peak funding need** — the deepest point of the cumulative cash curve. This is what has to be funded.

## Where the defaults come from

`Vacario-India-Growth-Plan-Financial-Model-Scenario-A.xlsx`, 36 months from Sep-2026: per-stream
commission, average booking value and conversion; CAD 15,000 monthly floor with 25% reinvestment from
year 2; saturation exponent 0.5; reference spend CAD 15,000 per live city; cities launching in months
1, 4, 10, 18, 25; payment gateway 2.36% of GMV; 12% statutory load inside the salary line; corporate
tax 25.17%; CAD/INR 68.

### Validation

Run at the defaults, the traffic engine reproduces the plan's own published monthly active users:

| Month | Model | Published | Δ |
|---|---|---|---|
| 1 | 72,510 | 72,510 | 0.00% |
| 12 | 147,508 | 147,509 | 0.00% |
| 24 | 1,352,611 | 1,349,152 | +0.26% |

Cumulative cash at month 36 lands at CAD 6,871,822 against the published 6,869,702 (+0.03%), and the
reinvestment rule reproduces published monthly marketing to the cent in month 13
(25% × month-12 net revenue = 29,798.177).

The dashed line on the J-curve is the plan's published cash track, so any divergence you create by
changing inputs stays visible against it. The badge in the header reads **Matches plan of record**
until an input moves off the published assumptions.

The earlier 12-month workbook (`Revenue_Projections_Model_v2.xlsx`) was also reproduced exactly —
every month's revenue and expense to four decimal places — during development. Its structure
(4 streams, flat 20% new-user growth, single city) is superseded by Scenario A.

### Two known deviations

- **Group sales (B2B)** are spread as a straight ramp across year 1 and evenly thereafter, because the
  plan states only annual totals for that line. Early months therefore differ from the published
  series by up to ~11%; months 8 onward track within ~2%.
- The 12-month workbook's dashboard reports **peak cumulative investment of CAD 31,510**. That is
  month 1 alone. Its own cash flow sums to **CAD 116,177**, which is the figure that plan has to fund.
  This tool computes the true running minimum.

## Traction check

The Traction check tab audits whichever assumption set is loaded against benchmarks drawn from the
plan's own sources — blended cost per visitor, conversion at launch, Year-1 EBITDA margin, blended
take rate, marketing as a share of GMV, funding requirement, returning-user share, bookings per
active user and the saturation exponent. Each check reports the observed value, the benchmark and
what it means, marked OK / Review / Outside range with an icon and label, never colour alone.

Running it over the **Year 1 lean** criteria as supplied produces four flags:

| Check | Value | Benchmark |
|---|---|---|
| Cost per paid visitor | 10.9 INR | 15.6–17.4 INR |
| Booking conversion at launch | 100% of steady | 40% of steady |
| Year-1 EBITDA margin | 42% | −8% (Scenario A) |
| Spend saturation | none | 0.5 exponent |

Those assumptions make the Year 1 model EBITDA-positive from month 1 with **zero funding need**,
which contradicts its own dashboard note ("break-even by Month 12", plus a funding line and a 15%
buffer) and Scenario A's −8% for the same year. At a cost per visitor of 0.45 CAD with full
conversion, the Year 1 plan turns positive in month 11 and needs about CAD 31,000 including the
stated buffer — the shape its note describes.

## Export

**Download Excel** sits in the masthead on every tab — one click, no navigation. It writes the whole
model, both files built in the browser with no dependencies:

- **`.xlsx`** — ten sheets: a read-me for stakeholders, summary, month-by-month P&L, traffic and
  funnel build, revenue split by stream, all three scenarios side by side, scenario comparison,
  channel mix, every assumption with its unit, and the traction check. Written by a small ZIP +
  SpreadsheetML writer in `src/app.html`, so there is no CDN to fail.
- **`.docx`** — a plain-language brief for someone who will not open the model: what the plan is,
  the three break-even dates and why they differ, the scenario comparison, and the assumptions that
  carry the risk. Written by a matching WordprocessingML writer on the same ZIP code.

In the published Artifact, saves go through the viewer's `downloads` capability (it asks before
writing). Opened as a local `index.html` the page falls back to an ordinary download link.
Copy-to-clipboard fallbacks (ledger as CSV, summary as text) cover either case.

Pre-generated examples live in [`deliverables/`](deliverables/).

| Sheet | Holds |
|---|---|
| Read me | What the workbook is, which preset and scenario, how to read the three dates |
| Summary | Break-even, funding need, revenue, cash, the decision paragraph |
| P&L monthly | Every revenue and cost line, month by month, down to cumulative cash |
| Traffic & funnel | Sessions by source, members, followers, searches, views, bookings, cost per booking |
| Revenue by stream | Bookings, GMV and commission for each of the five streams |
| All scenarios | Marketing, net revenue, EBITDA and cash for all three budgets side by side |
| Scenario comparison | The three budgets summarised |
| Channel mix | Every channel, its type, share, unit cost and output |
| Assumptions | Every input with its unit |
| Traction check | Each assumption against its benchmark |

## Editing assumptions

Everything is editable in the left rail. Drivers are in the open; revenue streams, the annual cost
base and the finer traffic assumptions sit behind collapsible sections. Inputs persist in
`localStorage`; **Reset to plan** restores the published Scenario A values.

Display currency toggles between CAD and INR at the model's exchange rate. All internal maths is in CAD.

## Caveat

A planning model, not a forecast. Treat break-even months as ranges, and re-run against real cost per
visitor and booking conversion once live cohorts land.
