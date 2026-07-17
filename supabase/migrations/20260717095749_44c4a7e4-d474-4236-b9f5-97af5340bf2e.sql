
ALTER TABLE public.site_impact_stats
  ADD COLUMN IF NOT EXISTS label_fr text,
  ADD COLUMN IF NOT EXISTS label_en text,
  ADD COLUMN IF NOT EXISTS label_sw text;

UPDATE public.site_impact_stats SET label_en = COALESCE(label_en, label);

INSERT INTO public.site_about (section_key, label, fr, en, sw, sort_order)
VALUES
  ('impact.label', 'Impact — étiquette', 'Notre Impact', 'Our Impact', 'Athari Yetu', 100),
  ('impact.title', 'Impact — titre', 'Des chiffres qui parlent d''eux-mêmes', 'Numbers that speak for themselves', 'Namba zinazojieleza zenyewe', 101),
  ('impact.description', 'Impact — description', '', '', '', 102)
ON CONFLICT (section_key) DO NOTHING;
