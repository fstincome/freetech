CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA extensions;

ALTER TABLE public.site_team_members ADD COLUMN IF NOT EXISTS slug text;

CREATE OR REPLACE FUNCTION public.slugify(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public, extensions
AS $$
  SELECT trim(both '-' from regexp_replace(
    lower(extensions.unaccent(coalesce(value, ''))),
    '[^a-z0-9]+', '-', 'g'
  ));
$$;

WITH base AS (
  SELECT id, public.slugify(name) AS s FROM public.site_team_members
),
numbered AS (
  SELECT id, s, row_number() OVER (PARTITION BY s ORDER BY id) AS rn FROM base
)
UPDATE public.site_team_members m
SET slug = CASE WHEN n.rn = 1 THEN n.s ELSE n.s || '-' || substr(m.id::text, 1, 4) END
FROM numbered n
WHERE m.id = n.id;

CREATE UNIQUE INDEX IF NOT EXISTS site_team_members_slug_unique ON public.site_team_members(slug);

CREATE OR REPLACE FUNCTION public.set_team_member_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_slug text;
  candidate text;
  i int := 1;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' OR (TG_OP = 'UPDATE' AND NEW.name IS DISTINCT FROM OLD.name AND (NEW.slug = OLD.slug OR NEW.slug IS NULL)) THEN
    base_slug := public.slugify(NEW.name);
    IF base_slug = '' THEN base_slug := substr(NEW.id::text, 1, 8); END IF;
    candidate := base_slug;
    WHILE EXISTS (SELECT 1 FROM public.site_team_members WHERE slug = candidate AND id <> NEW.id) LOOP
      i := i + 1;
      candidate := base_slug || '-' || i;
    END LOOP;
    NEW.slug := candidate;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_team_member_slug ON public.site_team_members;
CREATE TRIGGER trg_set_team_member_slug
BEFORE INSERT OR UPDATE ON public.site_team_members
FOR EACH ROW EXECUTE FUNCTION public.set_team_member_slug();