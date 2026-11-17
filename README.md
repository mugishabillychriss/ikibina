# IKIBINA Management System

A Next.js App Router and Supabase application for an Ikibina savings group.

## Setup

1. Copy `.env.local.example` to `.env.local`.
2. Install dependencies:

```bash
npm install
```

3. Run the SQL migration in `supabase/migrations/001_initial_schema.sql` from Supabase SQL Editor.
4. Create a Supabase Auth leader user, then insert matching profile into `public.leaders` with the leader UUID as `auth_user_id`.
5. Run locally:

```bash
npm run dev
```

## Financial rules

- Category A: 10,000 RWF; Category B: 15,000 RWF.
- Penalties are 10% once after the due date.
- Contribution payments require exact outstanding amount.
- Financial writes should use database functions, RLS, and audit records.
- Never expose a Supabase service-role key in browser or Next.js public variables.

## Deploy

Deploy on Vercel and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in project environment variables.
