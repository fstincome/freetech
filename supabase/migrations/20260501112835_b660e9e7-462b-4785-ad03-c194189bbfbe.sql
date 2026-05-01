ALTER TABLE public.site_team_members ADD COLUMN IF NOT EXISTS is_board boolean NOT NULL DEFAULT false;

UPDATE public.site_team_members SET is_board = true WHERE sort_order IN (1, 2, 3);