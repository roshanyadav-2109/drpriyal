# Dr. Priyal Agarwal — Women's Health Platform

An all-in-one women's health website for **Dr. Priyal Agarwal**: online consultations,
period & pregnancy trackers, a due-date calculator, an SEO blog, and a doctor/admin back-office.

Built with **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Framer Motion**,
backed by **Supabase** (Postgres + Auth + Storage + RLS) and designed for **India**
(UPI/Razorpay, WhatsApp, Hindi/English).

> **Design language:** "Cool Clinical Modern" — warm ivory canvas, pine/sage palette,
> Fraunces serif headlines, Inter body, gold hairlines, and subtle medical wave/lotus motifs.

---

## ⚠️ FIRST: rotate your leaked token

A Supabase **Personal Access Token** (`sbp_…`) was shared in chat. That token can manage your
whole Supabase org. **Revoke it now** and create a fresh one:

1. Supabase Dashboard → **Account** → **Access Tokens** → revoke the exposed token.
2. This app **never needs** that management token. It only uses the project's **anon** key
   (public, safe) and the **service_role** key (server-only secret).

---

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

The site **works immediately without any keys**:
- Trackers run locally on-device (no account, fully private).
- Booking falls back to a WhatsApp request flow when Razorpay isn't configured.
- The admin area is reachable at `/admin` (passcode below).

Add keys to enable live payments, video, and the database-backed CMS.

---

## Environment variables

Copy `.env.example` → `.env.local`. Key ones:

| Variable | Where to get it | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | ✅ public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` | ✅ public (RLS-guarded) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` | ⛔ **server only** |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay dashboard | ✅ public |
| `RAZORPAY_KEY_SECRET` | Razorpay dashboard | ⛔ server only |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay → Webhooks | ⛔ server only |
| `HMS_ACCESS_KEY` / `HMS_SECRET` / `HMS_TEMPLATE_ID` | 100ms dashboard | ⛔ server only |
| `RESEND_API_KEY` | Resend | ⛔ server only |
| `MSG91_AUTH_KEY` / `WHATSAPP_TOKEN` / `WHATSAPP_PHONE_ID` | provider | ⛔ server only |
| `ADMIN_PASSCODE` | you choose | ⛔ server only (default `priyal-admin`) |

**Golden rule:** anything `NEXT_PUBLIC_*` ships to the browser. Server secrets must NOT have that prefix.

The project URL is already pre-filled in `.env.local`:
`https://baujdadxiaeyhcpkbvhu.supabase.co`

---

## Connect Supabase

1. Paste your **anon** and **service_role** keys into `.env.local`.
2. Run the SQL migrations in `supabase/migrations/` (in order):
   - `0001_init.sql` — tables, enums, RLS policies, helper functions, storage buckets, triggers.
   - `0002_seed.sql` — services, blog categories, FAQs.
   Run them via the Supabase **SQL Editor** (paste & run), or with the CLI:
   ```bash
   npx supabase link --project-ref baujdadxiaeyhcpkbvhu
   npx supabase db push
   ```
3. (Optional) Generate types: `npx supabase gen types typescript --linked > src/lib/database.types.ts`

Once connected, `/admin` switches from seeded sample content to live data, and the
`/admin/settings` page shows a green check for each configured integration.

---

## Project structure

```
src/
  app/
    (site)/            # public site (shared header/footer/WhatsApp FAB)
      page.tsx         # homepage
      about, services, services/[slug]
      tools/           # period-tracker, pregnancy-tracker, due-date-calculator
      blog, blog/[slug]
      book/            # guest booking flow
      my-health/       # local-first "my data" space (no login)
      contact, faq, privacy, terms, refund-policy, disclaimer
    admin/
      login/           # passcode gate (no user accounts)
      (dash)/          # back-office: overview, appointments, consultations,
                       #   blog, reviews, faqs, settings
    api/
      razorpay/        # order, verify, webhook
      video/token/     # 100ms join token
    sitemap.ts, robots.ts
  components/          # ui/, layout/, motion/, decor/, tools/, booking/, admin/
  lib/
    site.ts            # central content (verified facts only)
    sample-content.ts  # seed blog/faq/testimonials
    booking.ts         # slots, fees, refs
    trackers/          # period + pregnancy logic, local storage, content
    supabase/          # client, server, admin, status
  proxy.ts             # admin route guard (Next 16 renamed middleware → proxy)
supabase/migrations/   # SQL schema + seed
```

---

## Key product decisions

- **Auth-free for patients.** No sign-up. Trackers persist in `localStorage` (private by design);
  bookings are guest-based and identified by a reference code. The DB schema still ships full,
  privacy-first RLS so an optional patient portal can be enabled later.
- **Verified facts only.** Copy reflects Dr. Agarwal's confirmed public profile (MBBS GMCH,
  OB-GYN training at CMH Bengaluru, Founder of WomanHood). No fabricated seniority, sub-specialties,
  or patient counts. Update `src/lib/site.ts` with her confirmed bio, clinic, phone, email, and fees.
- **Testimonials are placeholders.** Replace with real, consented reviews before launch
  (`src/lib/sample-content.ts`, or via `/admin/reviews` once the DB is connected).

---

## Compliance (India)

The site is structured around **DPDP Act 2023** and the **Telemedicine Practice Guidelines 2020**:
consent capture, data-export/erasure (in *My Health*), audit logging (schema), medical disclaimers,
and emergency guidance. Legal pages are starter templates — **have them reviewed by Indian
healthcare-law counsel before going live.**

---

## Deploy (Vercel + Supabase)

1. Push this repo to GitHub.
2. Import into **Vercel**. Set all env vars (production) in Vercel → Project → Settings → Environment Variables.
3. Use the Supabase **Mumbai (ap-south-1)** region for latency + data residency.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
5. Configure the **Razorpay webhook** to `https://YOUR_DOMAIN/api/razorpay/webhook` with `RAZORPAY_WEBHOOK_SECRET`.
6. Add a real doctor photo at `public/doctor-portrait.jpg` and pass `src="/doctor-portrait.jpg"`
   to `<DoctorPortrait />` in `src/app/(site)/page.tsx` and `about/page.tsx`.

```bash
npm run build   # production build
npm run start   # serve the build locally
npm run lint    # eslint
```

---

## Before launch — checklist

- [ ] Rotate the leaked `sbp_…` Supabase token.
- [ ] Fill `src/lib/site.ts`: real phone, email, WhatsApp number, clinic address, fees.
- [ ] Confirm Dr. Agarwal's bio/credentials/services; update copy where needed.
- [ ] Replace placeholder testimonials with consented real ones.
- [ ] Add the doctor's real portrait + an OG share image.
- [ ] Run migrations; verify `/admin/settings` shows green checks.
- [ ] Wire Razorpay (live keys + webhook) and 100ms for video consults.
- [ ] Set a strong `ADMIN_PASSCODE`.
- [ ] Legal review of Privacy / Terms / Refund / Disclaimer.
