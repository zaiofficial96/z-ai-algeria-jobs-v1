/*
# Create resources table

1. New Tables
- `resources` — career resource articles.
  - `id` (uuid, primary key)
  - `slug` (text, unique)
  - `title_ar` (text) — Arabic title
  - `title_fr` (text) — French title
  - `title_en` (text) — English title
  - `excerpt_ar` (text) — Arabic excerpt
  - `excerpt_fr` (text) — French excerpt
  - `excerpt_en` (text) — English excerpt
  - `content_ar` (text) — Arabic full content
  - `content_fr` (text) — French full content
  - `content_en` (text) — English full content
  - `category` (text) — category slug
  - `reading_time` (integer) — reading time in minutes
  - `is_active` (boolean, default true)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `resources`.
- Allow anon + authenticated to SELECT.
- INSERT/UPDATE/DELETE restricted to authenticated.

3. Indexes
- Index on `slug`.
*/

CREATE TABLE IF NOT EXISTS public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE,
  title_ar text DEFAULT '',
  title_fr text DEFAULT '',
  title_en text DEFAULT '',
  excerpt_ar text DEFAULT '',
  excerpt_fr text DEFAULT '',
  excerpt_en text DEFAULT '',
  content_ar text DEFAULT '',
  content_fr text DEFAULT '',
  content_en text DEFAULT '',
  category text,
  reading_time integer DEFAULT 5,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_resources" ON public.resources;
CREATE POLICY "anon_select_resources" ON public.resources FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_resources" ON public.resources;
CREATE POLICY "auth_insert_resources" ON public.resources FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_resources" ON public.resources;
CREATE POLICY "auth_update_resources" ON public.resources FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_resources" ON public.resources;
CREATE POLICY "auth_delete_resources" ON public.resources FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_resources_slug ON public.resources (slug);
