# STYLEATLAS

Nigeria's trusted online destination for discovering, comparing, reviewing, and contacting fashion designers, brands, stylists, schools, jobs, and events — built as a premium fashion directory, marketplace, and lead-generation platform.

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router) + React 18 + TypeScript |
| Styling | Tailwind CSS + custom design system (`tailwind.config.ts`) |
| UI primitives | Radix UI + a small shadcn-style component library (`src/components/ui`) |
| Forms | react-hook-form + Zod |
| Data fetching | Server Components for reads, Server Actions for writes, TanStack Query available for client-side needs |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) |
| Payments | Paystack + Flutterwave, brokered entirely through Edge Functions |
| Email | Resend, via the `resend-transactional-email` Edge Function |
| AI chat | OpenAI, via the `ai-live-chat` Edge Function only (never called from the browser) |

## Project layout

```
src/
  app/                    Routes (App Router). Public pages, /dashboard, /admin, /auth
  components/
    ui/                   Design-system primitives (button, card, dialog, ...)
    layout/               Header, mega menu, footer, mobile nav
    directory/            Search, filters, listing cards, profile page pieces
    dashboard/            Shared dashboard shell/sidebar for professional/customer/admin
    cms/                  Rich text editor + blog post editor
    home/, blog/, jobs/, marketplace/, onboarding/, auth/, admin/, chat/, shared/
  lib/
    supabase/             Browser/server/admin Supabase clients + middleware session refresh
    auth/rbac.ts           getCurrentProfile / requireAuth / requireRole / staff permission checks
    data/                 Server-side read queries (one file per domain)
    actions/              Server Actions for writes (leads, reviews, portfolio, onboarding, ...)
    validations/          Zod schemas shared by forms and actions
    seo.ts, sitemap.ts     Metadata + JSON-LD + sitemap helpers
  types/                  Domain types (index.ts) + Supabase Database placeholder (database.ts)
supabase/
  migrations/             40+ numbered SQL migrations: schema, indexes, RLS, storage policies
  functions/               13 Edge Functions (payments, webhooks, AI chat, email, leads, ...)
  seed.sql                Development-only seed data
```

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a Supabase project** (or run `supabase start` for local dev with the Supabase CLI).

3. **Copy environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase URL/keys. The service role key and all third-party secret keys (Resend, Paystack, Flutterwave, OpenAI) are **server-only** — they must also be set as Supabase Edge Function secrets (`supabase secrets set ...`), not just in `.env.local`, since the Next.js app itself never calls those providers directly.

4. **Run migrations**
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
   This applies all 40+ migrations in `supabase/migrations/` in order: extensions/enums → every table → search indexes/views → RLS policies (every table) → storage buckets/policies.

5. **Seed development data** (optional, local/dev only — never run against production)
   ```bash
   supabase db reset   # applies migrations + supabase/seed.sql
   ```
   Seeded logins (password `StyleAtlas123!` for all): `superadmin@styleatlas.ng`, `admin@styleatlas.ng`, `designer.lagos@styleatlas.ng`, `bridal.abuja@styleatlas.ng`, `school.ph@styleatlas.ng`, `customer1@styleatlas.ng`, `customer2@styleatlas.ng`.

6. **Deploy Edge Functions**
   ```bash
   supabase functions deploy create-payment-checkout
   supabase functions deploy paystack-webhook --no-verify-jwt
   supabase functions deploy flutterwave-webhook --no-verify-jwt
   supabase functions deploy resend-transactional-email
   supabase functions deploy ai-live-chat
   supabase functions deploy lead-matching
   supabase functions deploy submit-fashion-request
   supabase functions deploy submit-review
   supabase functions deploy generate-sitemap
   supabase functions deploy process-media-upload
   supabase functions deploy admin-plan-management
   supabase functions deploy subscription-sync
   supabase functions deploy send-notification
   ```
   Webhook functions must be deployed with `--no-verify-jwt` since Paystack/Flutterwave call them without a Supabase session — signature verification inside the function is the actual security boundary (see below).

7. **Run the app**
   ```bash
   npm run dev
   ```

## Architecture notes

### Auth & RBAC
- Supabase Auth issues sessions; a Postgres trigger (`handle_new_auth_user`, migration `0002`) creates the matching `profiles` row on signup, reading `role`/`full_name` from signup metadata.
- `src/lib/auth/rbac.ts` exposes `getCurrentProfile()`, `requireAuth()`, `requireRole(...)`, and staff-permission checks for use in Server Components/Actions. These are **UX guards**, not the security boundary.
- The real security boundary is **Postgres RLS** — every table has RLS enabled with policies in `supabase/migrations/0022`–`0039`. Helper functions (`is_admin()`, `owns_professional_account()`, `has_staff_permission()`, `can_manage_professional_account()`) keep policies readable and consistent.
- `src/middleware.ts` refreshes the Supabase session on every request and redirects unauthenticated visitors away from `/dashboard` and `/admin` — again, a convenience layer on top of RLS, not a replacement for it.

### Payments
- The frontend (`PlanCheckoutButton`) only ever sends `{ plan_slug, billing_cycle, provider }`. The `create-payment-checkout` Edge Function looks up the authoritative price from `subscription_plans` and creates the Paystack/Flutterwave session — **prices are never trusted from the client**.
- `paystack-webhook` and `flutterwave-webhook` verify the provider's signature before touching the database, record every event in `webhook_events` keyed by `(provider, event_id)` for idempotency, and only then activate/renew a subscription. Flutterwave additionally re-verifies the transaction against Flutterwave's own API rather than trusting the webhook payload.
- Manual admin overrides (extend/upgrade/downgrade/cancel) go through `admin-plan-management` and are written to `subscription_overrides` for audit.

### AI chat
- `ai-live-chat` grounds every response in real `professional_accounts` rows matched by category/city, explicitly instructing the model never to name a business that wasn't in that grounding context — so it can't hallucinate listings.
- The OpenAI key lives only in Edge Function secrets. The browser calls `supabase.functions.invoke('ai-live-chat', ...)`, never OpenAI directly.

### SEO
- Location/category directory pages (`/directory/[category]/[city]`) pull admin-authored intro copy + FAQs from `seo_pages` when available, and fall back to a template that still produces unique, non-thin content per combination (`buildFallbackIntro`) — see `src/lib/data/seo-pages.ts`.
- `/sitemap.xml` is a sitemap index pointing at per-domain sitemaps under `/sitemaps/*.xml` (listings, blog, categories, cities, jobs, events, schools, inspiration), each computed live from the database.
- JSON-LD helpers (`src/lib/seo.ts`) cover LocalBusiness, BreadcrumbList, FAQPage, Article/BlogPosting, JobPosting, and Event schemas.

### Known warnings (safe to ignore)
- `@supabase/supabase-js` logs an Edge Runtime compatibility warning during build because `src/middleware.ts` runs on the Edge runtime — this is the documented behavior of `@supabase/ssr` in Next.js middleware and doesn't affect functionality.
- `src/types/database.ts` is a deliberate placeholder (`Database = any`) until you run `supabase gen types typescript` against your linked project — see the comment in that file.

## Follow-up work

The spec's full scope is enormous; what's built is real and wired end-to-end, but a few lower-priority admin screens described in the spec are not yet implemented (the nav in `src/components/dashboard/admin-nav.ts` only links to pages that exist): jobs/events/schools moderation queues, outfit inspiration manager, location manager, media library UI, SEO page manager, redirect manager UI, featured/ad placement manager, email template editor, AI chat knowledge-base editor, support ticket inbox, and analytics/security-log dashboards. The underlying tables, RLS policies, and (where relevant) Edge Function logic for all of these already exist — only the admin UI screens remain.

## Security summary

See `DEPLOYMENT.md` for the pre-launch checklist. Highlights:
- RLS enabled on every table; storage buckets scoped per-owner-folder; verification documents live in a private bucket with admin-only + owner-only access.
- Zod validation on every form/Server Action; rich text sanitized server-side with DOMPurify before storage.
- Rate limiting (`check_rate_limit` Postgres function) applied to lead submission, review submission, AI chat, job applications, and marketplace requests.
- All secret keys (service role, Resend, Paystack, Flutterwave, OpenAI) are Edge Function secrets only — never `NEXT_PUBLIC_*`.
