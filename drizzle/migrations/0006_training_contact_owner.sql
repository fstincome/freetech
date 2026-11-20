ALTER TABLE public.training_applications ADD COLUMN IF NOT EXISTS contact_owner text NOT NULL DEFAULT 'self';
ALTER TABLE public.training_applications ALTER COLUMN availability SET DEFAULT '';