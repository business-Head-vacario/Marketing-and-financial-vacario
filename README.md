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

## Editing assumptions

Everything is editable in the left rail. Drivers are in the open; revenue streams, the annual cost
base and the finer traffic assumptions sit behind collapsible sections. Inputs persist in
`localStorage`; **Reset to plan** restores the published Scenario A values.

Display currency toggles between CAD and INR at the model's exchange rate. All internal maths is in CAD.

## Caveat

A planning model, not a forecast. Treat break-even months as ranges, and re-run against real cost per
visitor and booking conversion once live cohorts land.
