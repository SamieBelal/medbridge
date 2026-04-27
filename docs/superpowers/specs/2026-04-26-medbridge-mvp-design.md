# MedBridge MVP — Design Spec

**Date:** 2026-04-26
**Status:** Draft — pending review

---

## 1. What is MedBridge?

A DFW-anchored cash-pay healthcare marketplace that shows patients transparent prices from verified providers and compares cash prices against their insurance costs using clearinghouse eligibility data. The MVP focuses on aesthetics (Botox, fillers, laser, PRP) — the highest-LTV, 100% cash-pay-native vertical.

**The thesis differentiator:** No competitor uses Availity-style clearinghouse data to render side-by-side cash-vs-insurance comparisons at point of booking. Sesame and MDsave deliberately ignore insurance. ZocDoc does eligibility but won't surface "cash is cheaper" because it cannibalizes their booking economics.

**This MVP proves:** a patient in DFW can search for aesthetics providers, see transparent cash prices, optionally check their insurance eligibility, see that cash is cheaper, book and pay through Stripe, and receive an HSA-formatted receipt.

---

## 2. Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript | SSR for SEO, same stack as OmniRecord |
| Styling | Tailwind CSS v4 + shadcn/ui | Consistent with existing patterns |
| Database | Supabase (Postgres + Auth + Storage + RLS) | Free tier for MVP |
| Auth | Supabase Auth | Email/password + magic link, patient/provider roles |
| Payments | Stripe Checkout | HSA/FSA compatible. Connect deferred to $50K GMV |
| Eligibility | Availity REST APIs (stubbed) | Full UI built, backend returns mock data |
| NPI Lookup | NPPES public API | Real, free API — no stub needed |
| Email | Resend | Free tier (3K/mo) for booking confirmations, GFEs, HSA receipts |
| Hosting | Vercel | Free hobby tier |
| Package mgr | pnpm | |
| Node | 20 LTS | |

---

## 3. Architecture

Single Next.js monolith with API routes. Role-gated routing via Supabase Auth + RLS.

### Route Structure

```
app/
├── page.tsx                              # Landing page
├── about/page.tsx
├── how-it-works/page.tsx
├── auth/
│   ├── login/page.tsx
│   ├── register/page.tsx                 # Patient or Provider role selection
│   └── callback/route.ts                 # Supabase OAuth callback
├── (patient)/                            # Patient-facing (route group, no URL segment)
│   ├── search/page.tsx                   # Provider search + filter by category/zip/price
│   ├── provider/[slug]/page.tsx          # Provider profile + pricing + reviews
│   ├── book/[slug]/page.tsx              # Booking flow (date/time → pay)
│   ├── eligibility/page.tsx              # Insurance eligibility check (Availity stub)
│   ├── compare/page.tsx                  # Cash vs insurance comparison
│   ├── dashboard/page.tsx                # Patient home (upcoming appts, receipts)
│   ├── appointments/page.tsx
│   ├── receipts/page.tsx                 # HSA-formatted receipt downloads
│   └── settings/page.tsx
├── (provider)/                           # Provider portal (route group)
│   ├── onboarding/page.tsx               # Step 1: NPI lookup + license
│   ├── onboarding/profile/page.tsx       # Step 2: Bio + photos
│   ├── onboarding/pricing/page.tsx       # Step 3: Service catalog
│   ├── onboarding/stripe/page.tsx        # Step 4: Payment setup
│   ├── portal/page.tsx                   # Provider dashboard
│   ├── portal/appointments/page.tsx
│   ├── portal/patients/page.tsx
│   ├── portal/payouts/page.tsx
│   ├── portal/reviews/page.tsx
│   ├── portal/profile/page.tsx           # Edit listing
│   └── portal/settings/page.tsx
├── blog/[slug]/page.tsx                  # SEO content
├── pricing/[city]/[specialty]/page.tsx   # Programmatic SEO pages
└── api/
    ├── auth/callback/route.ts
    ├── providers/route.ts                # CRUD
    ├── providers/[id]/route.ts
    ├── bookings/route.ts
    ├── bookings/[id]/route.ts
    ├── eligibility/check/route.ts        # Availity stub
    ├── payments/checkout/route.ts        # Stripe session creation
    ├── payments/webhook/route.ts         # Stripe webhooks
    ├── gfe/generate/route.ts             # Good Faith Estimate
    ├── nppes/lookup/route.ts             # Real NPPES API proxy
    └── reviews/route.ts
```

### Shared Code

```
components/
├── ui/                    # shadcn primitives (Button, Card, Input, etc.)
├── shared/                # PriceCard, ProviderCard, EligibilityBadge,
│                          # BookingForm, ComparisonTable, StarRating,
│                          # InsuranceCheckForm, GFEDocument
└── layout/                # NavBar, Footer, Sidebar (provider portal)

lib/
├── supabase/              # Server + browser clients
│   ├── server.ts
│   ├── client.ts
│   └── middleware.ts      # Auth middleware
├── queries/               # Typed data access (getProviders, getBookings, etc.)
├── availity/              # Stub client + response types
│   ├── client.ts          # Returns mock eligibility data
│   └── types.ts           # 270/271 response types, PCE types
├── stripe/                # Checkout session helpers
├── nppes/                 # NPI lookup client (real API)
├── gfe/                   # Good Faith Estimate generator
├── constants.ts           # DFW cities, service categories, etc.
└── utils.ts               # cn(), formatCurrency(), etc.

supabase/
├── migrations/            # Schema migrations
├── seed.sql               # Mock DFW providers + services
└── types.ts               # Generated from schema
```

---

## 4. Database Schema

All tables use Supabase RLS. Public can browse providers/services. Patients see their own data. Providers see their own listings + associated bookings.

### profiles
Extends `auth.users`. Created on registration via trigger.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | FK to auth.users |
| role | enum ('patient', 'provider') | Set at registration |
| display_name | text | |
| phone | text | |
| avatar_url | text | Supabase Storage |
| created_at | timestamptz | |

### providers
Provider business profile. 1:1 with profiles where role='provider'.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| user_id | uuid FK profiles | |
| npi | text UNIQUE | 10-digit NPI |
| license_number | text | |
| license_state | text | Default 'TX' |
| license_verified | boolean | Default false (stub) |
| business_name | text | |
| specialty | text | 'aesthetics' for MVP |
| bio | text | |
| address | text | |
| city | text | DFW cities |
| zip | text | |
| lat | numeric | For distance search |
| lng | numeric | |
| phone | text | |
| website | text | |
| slug | text UNIQUE | URL-friendly name |
| is_active | boolean | |
| npdb_checked_at | timestamptz | |
| onboarding_step | int | Track onboarding progress |
| stripe_account_id | text | For future Connect |
| created_at | timestamptz | |

### services
Provider's price catalog.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| provider_id | uuid FK providers | |
| name | text | e.g. "Botox (20 units)" |
| description | text | |
| category | text | 'botox', 'filler', 'laser', 'prp', 'other' |
| cash_price | integer | Cents |
| duration_min | integer | Appointment duration |
| is_active | boolean | |
| created_at | timestamptz | |

### bookings

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| patient_id | uuid FK profiles | |
| provider_id | uuid FK providers | |
| service_id | uuid FK services | |
| status | enum | pending, confirmed, completed, cancelled, no_show |
| appointment_at | timestamptz | |
| stripe_payment_id | text | |
| gfe_sent | boolean | Default false |
| notes | text | Patient notes |
| created_at | timestamptz | |

### reviews

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| booking_id | uuid FK bookings | UNIQUE — one review per booking |
| patient_id | uuid FK profiles | |
| provider_id | uuid FK providers | |
| rating | smallint | 1-5 |
| title | text | |
| body | text | |
| provider_reply | text | |
| created_at | timestamptz | |

### eligibility_checks
Stores (stubbed) Availity responses for the comparison UI.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| patient_id | uuid FK profiles | |
| payer_name | text | e.g. "BCBS of Texas" |
| member_id | text | |
| service_type | text | CPT code or category |
| deductible_total | integer | Cents |
| deductible_met | integer | Cents — how much used |
| copay | integer | Cents |
| coinsurance_pct | numeric | e.g. 0.20 for 20% |
| plan_year_start | date | For trajectory calculation |
| estimated_patient_cost | integer | Cents — through insurance |
| checked_at | timestamptz | |

### gfe_documents
Good Faith Estimates (No Surprises Act compliance).

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| booking_id | uuid FK bookings | |
| service_items | jsonb | Array of {name, code, price} |
| total_estimate | integer | Cents |
| generated_at | timestamptz | |

### payments

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | |
| booking_id | uuid FK bookings | |
| stripe_session_id | text | |
| amount | integer | Cents |
| status | enum | pending, succeeded, failed, refunded |
| payment_method | text | card, hsa, fsa |
| receipt_url | text | HSA-formatted receipt |
| paid_at | timestamptz | |

---

## 5. Core User Flows

### 5.1 Patient Booking Flow (the thesis)

1. **Search** — Patient searches "Botox near Plano." Filter by category, zip code, price range. See provider cards with transparent cash prices, ratings, distance.

2. **Provider Profile** — Full service catalog with cash prices. Reviews + ratings. Location, hours, NPI-verified credentials. Two CTAs: "Book Now" (skip insurance check) or "Check My Insurance First."

3. **Insurance Eligibility Check (THE WEDGE)** — Optional step. Patient enters payer name + member ID. System calls Availity 270/271 (stubbed) → returns deductible remaining, copay/coinsurance. Renders side-by-side comparison:
   - Left card: "Through Insurance: $187" (with deductible math breakdown)
   - Right card: "Cash on MedBridge: $79 — You save $108"
   - Smart insight: "You've spent $850 of your $3,000 deductible. At your trajectory, you'll hit deductible in late October — paying cash now is cheaper than insurance."

4. **Book + Pay** — Select date/time from provider's availability. Good Faith Estimate auto-generated (No Surprises Act). Stripe Checkout with HSA/FSA card support. Confirmation email via Resend.

5. **Post-Visit** — HSA-formatted receipt emailed. Review prompt (24h after appointment). Deductible tracker updated. Referral credit offer ($20 booking credit).

### 5.2 Provider Onboarding

4-step wizard:
1. **Verify** — Enter NPI → NPPES API lookup returns name, taxonomy, address. Enter license number (verification stubbed). Sign BAA (checkbox for MVP).
2. **Profile** — Business name, bio, photos (Supabase Storage), address, hours.
3. **Pricing** — Add services to catalog. Name, category (botox/filler/laser/prp), cash price, duration.
4. **Payments** — Stripe onboarding (Checkout for v1, Connect later).

### 5.3 Provider Portal

- **Dashboard** — Upcoming appointments, recent reviews, booking stats.
- **Appointments** — Calendar view, confirm/cancel, mark completed.
- **Patients** — Roster of patients who've booked (name, service, date).
- **Payouts** — Payment history (Stripe dashboard link for v1).
- **Reviews** — See patient reviews, write replies.
- **Profile** — Edit listing, update services/prices.

---

## 6. Visual Design Direction

**Navy Trust palette** — dark navy hero, amber accents, cream content sections.

| Token | Value | Use |
|-------|-------|-----|
| Navy deep | #1E3A5F | Hero backgrounds, primary buttons |
| Navy light | #2D5A8E | Hover states, secondary elements |
| Amber warm | #D97706 | CTAs, highlights, savings badge |
| Cream | #FAF7F2 | Content section backgrounds |
| Charcoal | #2A2723 | Body text |
| Success green | #22C55E | Cash price, savings |
| Error red | #EF4444 | Insurance price (higher cost) |
| White | #FFFFFF | Cards, inputs |

**Typography:** Inter for body text, a display font (Fraunces or similar) for hero headings.

**Component style:** Rounded cards (12px radius), subtle shadows, clean spacing. Trust badges prominent (NPDB Verified, HSA/FSA Accepted, No Surprise Bills). The comparison card is the hero component — it should feel like a financial tool, not a healthcare form.

---

## 7. Seed Data

Mock DFW aesthetics providers for development:

- 5-8 providers across DFW suburbs (Plano, Frisco, Dallas, Fort Worth, Arlington, Richardson)
- Each with 3-6 services (Botox, Juvederm, lip filler, laser resurfacing, PRP facial, etc.)
- Realistic cash prices ($79-$1,500 range)
- Mock NPI numbers (valid format, not real)
- Mock reviews (3-5 per provider, 3.5-5.0 rating range)

---

## 8. Availity Stub Design

The stub returns realistic mock data that exercises the full comparison UI:

```typescript
// lib/availity/client.ts
export async function checkEligibility(params: EligibilityRequest): Promise<EligibilityResponse> {
  // In production: call Availity 270/271 API
  // For now: return mock data based on payer selection
  return {
    eligible: true,
    payer: params.payerName,
    memberId: params.memberId,
    deductible: { total: 300000, met: 85000 },  // $3,000 / $850
    copay: 0,
    coinsurance: 0.20,
    planYearStart: '2026-01-01',
    estimatedPatientCost: 18700,  // $187 through insurance
  };
}
```

The stub should support 3-4 mock payer scenarios:
1. **High deductible, early in plan year** — cash is much cheaper
2. **Deductible nearly met** — insurance might be cheaper
3. **Low copay plan** — insurance is cheaper (edge case)
4. **Ineligible/not covered** — cash is the only option

---

## 9. What's NOT in MVP

- Real Availity production integration (stubbed)
- Stripe Connect (manual payouts via ACH)
- GLP-1, dental, imaging verticals (aesthetics only)
- Mobile app
- Employer B2B dashboard
- Consumer subscription tier
- DMPO registration features
- Telehealth integration
- Real license verification (TMB API)
- Programmatic SEO content generation (page structure exists, content is placeholder)
- Referral credit system (UI placeholder only)

---

## 10. Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=

# Feature flags
NEXT_PUBLIC_AVAILITY_ENABLED=false   # Toggle stub vs real
```
