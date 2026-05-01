ALTER TABLE public.site_team_members
  ADD COLUMN IF NOT EXISTS linkedin_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS twitter_url  text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS bio          text NOT NULL DEFAULT '';