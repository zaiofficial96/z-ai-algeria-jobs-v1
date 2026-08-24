/*
# Create jobs table

1. New Tables
- `jobs` — stores job listings aggregated from multiple Algerian sources.
  - `id` (uuid, primary key)
  - `title_ar` (text) — Arabic title
  - `title_fr` (text) — French title
  - `title_en` (text) — English title
  - `slug` (text, unique) — URL-friendly identifier
  - `city` (text) — commune/city name
  - `category` (text) — category slug
  - `contract_type` (text) — contract type (CDI, CDD, etc.)
  - `company_id` (uuid, nullable, FK to companies) — linked company
  - `company_name` (text) — display company name
  - `wilaya` (text) — wilaya code as string
  - `description_ar` (text) — Arabic description
  - `description_fr` (text) — French description
  - `description_en` (text) — English description
  - `requirements` (jsonb) — array of localized requirement strings
  - `job_type` (text) — additional job type metadata
  - `experience_level` (text) — experience level enum string
  - `remote_type` (text) — remote/hybrid/onsite
  - `skills` (jsonb) — array of skill strings
  - `salary_min` (numeric, nullable) — minimum salary
  - `salary_max` (numeric, nullable) — maximum salary
  - `salary_currency` (text, nullable) — currency code (e.g. DZD)
  - `source_url` (text, nullable) — original source URL for application
  - `source_name` (text) — name of the source
  - `source_type` (text) — type of source
  - `verification_status` (text) — verification status
  - `is_active` (boolean, default true) — whether the job is currently active
  - `created_at` (timestamptz) — record creation time
  - `updated_at` (timestamptz) — last update time
  - `published_at` (timestamptz) — original publication date
  - `expires_at` (timestamptz, nullable) — expiration date

2. Security
- Enable RLS on `jobs`.
- Allow anon + authenticated to SELECT (public job board, no sign-in required).
- INSERT/UPDATE/DELETE restricted to authenticated (admin/employer management).

3. Indexes
- Index on `slug` for fast lookups.
- Index on `is_active` for filtering active jobs.
- Index on `wilaya` for location filtering.
- Index on `category` for category filtering.
- Index on `published_at` for sorting by date.
*/

CREATE TABLE IF NOT EXISTS public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar text DEFAULT '',
  slug text UNIQUE,
  title_fr text DEFAULT '',
  title_en text DEFAULT '',
  city text,
  category text,
  contract_type text,
  company_id uuid,
  company_name text,
  wilaya text,
  description_ar text DEFAULT '',
  description_fr text DEFAULT '',
  description_en text DEFAULT '',
  requirements jsonb DEFAULT '[]'::jsonb,
  job_type text,
  experience_level text,
  remote_type text,
  skills jsonb DEFAULT '[]'::jsonb,
  salary_min numeric,
  salary_max numeric,
  salary_currency text,
  source_url text,
  source_name text,
  source_type text,
  verification_status text DEFAULT 'unverified',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  expires_at timestamptz
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_jobs" ON public.jobs;
CREATE POLICY "anon_select_jobs" ON public.jobs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_jobs" ON public.jobs;
CREATE POLICY "auth_insert_jobs" ON public.jobs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_jobs" ON public.jobs;
CREATE POLICY "auth_update_jobs" ON public.jobs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_jobs" ON public.jobs;
CREATE POLICY "auth_delete_jobs" ON public.jobs FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_jobs_slug ON public.jobs (slug);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs (is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_wilaya ON public.jobs (wilaya);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs (category);
CREATE INDEX IF NOT EXISTS idx_jobs_published_at ON public.jobs (published_at DESC);
