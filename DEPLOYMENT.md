# STYLEATLAS Deployment Checklist

## 1. Supabase project setup

- [ ] Create a production Supabase project (separate from any dev/staging project).
- [ ] Run `supabase link --project-ref <ref>` then `supabase db push` to apply all migrations in `supabase/migrations/`.
- [ ] **Do not** run `supabase/seed.sql` against production — it creates test auth users with a known password.
- [ ] Verify RLS is enabled on every table: `select tablename from pg_tables where schemaname='public' and rowsecurity=false;` should return zero rows for application tables.
- [ ] Confirm storage buckets exist and `private-verification-documents` / `job-attachments` are **not** marked public in the Supabase dashboard.
- [ ] Set up a scheduled job (Supabase cron / pg_cron, or an external scheduler) to call `subscription-sync` hourly.

## 2. Environment variables

- [ ] Set all variables from `.env.example` in your hosting provider (Vercel/Netlify/etc.) for the Next.js app: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL`.
- [ ] Set Edge Function secrets separately (these never go into the Next.js build):
  ```bash
  supabase secrets set RESEND_API_KEY=... RESEND_FROM_EMAIL="STYLEATLAS <hello@styleatlas.ng>" \
    PAYSTACK_SECRET_KEY=... PAYSTACK_WEBHOOK_SECRET=... \
    FLUTTERWAVE_SECRET_KEY=... FLUTTERWAVE_WEBHOOK_SECRET=... \
    OPENAI_API_KEY=... INTERNAL_FUNCTION_SECRET=... SITE_URL=https://styleatlas.ng
  ```
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` and every third-party secret key are **absent** from any `NEXT_PUBLIC_*` variable and from client bundle output (`next build` output should not reference them — grep the `.next` build output if in doubt).

## 3. Payments

- [ ] Switch Paystack/Flutterwave from test to live keys.
- [ ] Register the production webhook URLs in each provider's dashboard:
  - Paystack: `https://<project-ref>.supabase.co/functions/v1/paystack-webhook`
  - Flutterwave: `https://<project-ref>.supabase.co/functions/v1/flutterwave-webhook`
- [ ] Deploy both webhook functions with `--no-verify-jwt` (they authenticate via provider signature, not a Supabase session).
- [ ] Send a real test transaction on each provider and confirm: `payment_transactions.status` flips to `success`, a `subscriptions` row is created/updated, `professional_accounts.subscription_status` becomes `active`, and a `notifications` row + email are created.
- [ ] Re-send the same webhook payload manually (or trigger a duplicate) and confirm it's a no-op (idempotency via `webhook_events`).

## 4. Email

- [ ] Verify your sending domain in Resend and update `RESEND_FROM_EMAIL` to a verified address.
- [ ] Send a test email through each template path (welcome, payment success, new lead, review received) and confirm `email_logs` rows are created with `status='sent'`.

## 5. AI chat

- [ ] Set a production `OPENAI_API_KEY` with billing configured and reasonable usage limits/alerts on the OpenAI side.
- [ ] Confirm the chat widget only ever calls `supabase.functions.invoke('ai-live-chat', ...)` — never a direct OpenAI endpoint from the browser (check Network tab).
- [ ] Populate `ai_knowledge_base` and `ai_chat_settings` with real, launch-ready content (seed data is placeholder only).

## 6. SEO

- [ ] Update `NEXT_PUBLIC_SITE_URL` to the real production domain.
- [ ] Submit `/sitemap.xml` to Google Search Console and Bing Webmaster Tools.
- [ ] Spot-check `/robots.txt` disallows `/dashboard`, `/admin`, `/onboarding`, `/auth`, and paginated/search-parameter URLs.
- [ ] Populate `seo_pages` for your highest-priority category/city combinations before launch so they don't fall back to the generic template copy.
- [ ] Verify Open Graph images render correctly (test with a social share debugger) for the homepage, a sample designer profile, and a sample blog post.

## 7. Security

- [ ] Rotate any secret keys that were used during development/testing.
- [ ] Confirm `check_rate_limit` limits (lead forms, reviews, AI chat, job applications, marketplace requests) match your expected launch traffic — tighten if needed.
- [ ] Review `audit_logs` and `security_logs` retention policy and, if required by your compliance needs, set up periodic export/archival.
- [ ] Confirm the first `super_admin` account is created intentionally (there is no self-service path to become admin/super_admin — this must be done via a direct database update or the Supabase dashboard).
- [ ] Enable Supabase's built-in Postgres backups and point-in-time recovery for production.

## 8. Performance

- [ ] Run `npm run build` and confirm no unexpectedly large route bundles.
- [ ] Confirm images are served through Next/Image with the correct `remotePatterns` for your Supabase Storage domain (`next.config.js` already derives this from `NEXT_PUBLIC_SUPABASE_URL`).
- [ ] Load-test the `search_professionals` RPC and directory pages under realistic listing volumes; add composite indexes if query plans show sequential scans at scale.

## 9. Post-launch monitoring

- [ ] Watch `webhook_events` for `status='failed'` rows daily during the first weeks.
- [ ] Watch `security_logs` for repeated `webhook_signature_failure` or `rate_limit_exceeded` events.
- [ ] Review `support_tickets` and `review_reports` queues regularly — nothing currently auto-escalates them.
