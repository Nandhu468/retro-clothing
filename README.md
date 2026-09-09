# Retro Clothing

Full-stack storefront + admin dashboard for Retro Clothing (Balaji & Surya Perumal, Tirunelveli).

Stack: React + Vite + Tailwind CSS · Supabase (Postgres, Auth with TOTP MFA, Storage, Row Level
Security) · WhatsApp ordering · deployed on Vercel's free tier.

## 1. Set up Supabase (free tier)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the entire contents of `supabase/schema.sql`. This creates the
   `products` and `admins` tables, all RLS policies, and the public `product-images` storage bucket.
3. Go to **Authentication → Providers** and make sure Email is enabled.
4. Create the owner's login: **Authentication → Users → Add user** (email + password), or have them
   sign up once from a temporary sign-up form (not included by default, since only admins need
   accounts).
5. Copy that user's UUID and run in the SQL editor:
   ```sql
   insert into admins (user_id, role) values ('PASTE-USER-UUID-HERE', 'admin');
   ```
   Only rows added here can ever reach `/admin` — this is intentional and must be done manually
   for every new admin.
6. Copy your **Project URL** and **anon public key** from Settings → API.

## 2. Configure the app

```bash
cp .env.example .env
```
Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. `VITE_WHATSAPP_NUMBER` already
defaults to +91 86678 73216.

## 3. Run locally

```bash
npm install
npm run dev
```

## 4. First admin login

1. Go to `/admin/login`, sign in with the email/password created in step 1.4.
2. Since no TOTP factor exists yet, you'll be routed to `/admin/mfa-setup` — scan the QR code
   with Google Authenticator, Microsoft Authenticator, Authy, or similar, then enter the 6-digit
   code to activate MFA. **Save the manual key shown there somewhere safe** — Supabase's TOTP
   flow doesn't issue separate recovery codes, so losing the authenticator app means you'd need
   direct database access to remove and re-enroll the factor.
3. From then on, login requires email + password + a fresh 6-digit code every time.

## 5. Deploy to Vercel (free)

1. Push this repo to GitHub.
2. Import it in Vercel, framework preset **Vite**.
3. Add the same three environment variables from `.env` in Vercel's Project Settings →
   Environment Variables.
4. Deploy. `vercel.json` already rewrites all routes to `index.html` so client-side routing
   (`/shop`, `/product/:slug`, `/admin`, etc.) works after a hard refresh or direct link.

No redeploy is ever needed to add, edit, or delete a product — the admin dashboard writes
straight to Supabase and the storefront reads live.

## What's implemented

- Storefront: home, shop with filters/sort, category pages, product detail with gallery,
  cart and wishlist (both `localStorage`, no customer account), search, about, contact.
- WhatsApp ordering (single product and full cart) with no payment gateway.
- Admin: password + mandatory TOTP MFA login, dashboard stats, product CRUD with drag-reorder
  multi-image upload (client-side WEBP compression before upload), stock page with quick
  +/− editing, product/stock filters and search, settings page (view account, disable MFA
  with a confirmation).
- Database-level security via Supabase RLS: public can only read `published` products;
  writes require both `admins` table membership and a verified `aal2` (MFA) session — enforced
  in Postgres, not just in the UI.
- Responsive down to 360px, skeleton loading states, empty states, `prefers-reduced-motion`
  support, SEO meta tags.

## Reasonable next steps (not included, to keep this a manageable first build)

- Editable announcement-bar text and other site settings from `/admin/settings` (currently
  the bar text lives in `AnnouncementBar.jsx`).
- Product structured data (JSON-LD) and per-route `<title>`/meta updates (currently the
  homepage's static meta tags are in `index.html`).
- Pagination on the shop grid once the catalog grows past a page or two.
- A second recovery/backup TOTP factor flow for admins (Supabase's TOTP MFA has no built-in
  recovery codes — see the setup screen's warning).
