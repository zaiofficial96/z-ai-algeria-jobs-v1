/*
# Create companies table

1. New Tables
- `companies` — stores company profiles.
  - `id` (uuid, primary key)
  - `slug` (text, unique) — URL-friendly identifier
  - `name` (text) — company name
  - `industry` (text) — industry/category slug
  - `wilaya` (text, nullable) — wilaya code
  - `description_ar` (text) — Arabic description
  - `description_fr` (text) — French description
  - `description_en` (text) — English description
  - `website` (text, nullable) — company website URL
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `companies`.
- Allow anon + authenticated to SELECT (public directory).
- INSERT/UPDATE/DELETE restricted to authenticated.

3. Indexes
- Index on `slug` for fast lookups.
*/

CREATE TABLE IF NOT EXISTS public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  name text NOT NULL,
  industry text,
  wilaya text,
  description_ar text DEFAULT '',
  description_fr text DEFAULT '',
  description_en text DEFAULT '',
  website text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_companies" ON public.companies;
CREATE POLICY "anon_select_companies" ON public.companies FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_companies" ON public.companies;
CREATE POLICY "auth_insert_companies" ON public.companies FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_companies" ON public.companies;
CREATE POLICY "auth_update_companies" ON public.companies FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_companies" ON public.companies;
CREATE POLICY "auth_delete_companies" ON public.companies FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies (slug);

-- Add FK from jobs.company_id to companies.id (safe: column already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_jobs_company' AND table_name = 'jobs'
  ) THEN
    ALTER TABLE public.jobs
      ADD CONSTRAINT fk_jobs_company
      FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE SET NULL;
  END IF;
END $$;
