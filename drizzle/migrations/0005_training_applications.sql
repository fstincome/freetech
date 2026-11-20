CREATE TABLE public.training_applications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 full_name text NOT NULL,
 email text NOT NULL,
 phone text NOT NULL,
 age integer NOT NULL,
 city text NOT NULL,
 occupation text NOT NULL,
 education text NOT NULL,
 modules text[] NOT NULL,
 computer_level text NOT NULL,
 design_level text NOT NULL,
 computer_access text NOT NULL,
 availability text NOT NULL,
 motivation text NOT NULL,
 accessibility_needs text NOT NULL DEFAULT '',
 consent boolean NOT NULL,
 language text NOT NULL DEFAULT 'fr',
 status text NOT NULL DEFAULT 'pending',
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT training_name_length CHECK (char_length(trim(full_name)) BETWEEN 2 AND 120),
 CONSTRAINT training_email_valid CHECK (char_length(email) <= 255 AND email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 CONSTRAINT training_phone_valid CHECK (char_length(phone) BETWEEN 6 AND 30 AND phone ~ '^[+0-9() .-]+$'),
 CONSTRAINT training_age_valid CHECK (age BETWEEN 1 AND 120),
 CONSTRAINT training_city_length CHECK (char_length(trim(city)) BETWEEN 2 AND 120),
 CONSTRAINT training_occupation_length CHECK (char_length(trim(occupation)) BETWEEN 2 AND 120),
 CONSTRAINT training_education_length CHECK (char_length(trim(education)) BETWEEN 2 AND 120),
 CONSTRAINT training_modules_valid CHECK (cardinality(modules) BETWEEN 1 AND 2 AND modules <@ ARRAY['basic_computing','graphic_design']::text[]),
 CONSTRAINT training_computer_level_valid CHECK (computer_level IN ('beginner','some','independent')),
 CONSTRAINT training_design_level_valid CHECK (design_level IN ('beginner','some','independent')),
 CONSTRAINT training_access_valid CHECK (computer_access IN ('yes','shared','no')),
 CONSTRAINT training_availability_length CHECK (char_length(trim(availability)) BETWEEN 2 AND 500),
 CONSTRAINT training_motivation_length CHECK (char_length(trim(motivation)) BETWEEN 2 AND 1500),
 CONSTRAINT training_needs_length CHECK (char_length(accessibility_needs) <= 500),
 CONSTRAINT training_consent_valid CHECK (consent = true),
 CONSTRAINT training_language_valid CHECK (language IN ('fr','en','sw')),
 CONSTRAINT training_status_valid CHECK (status IN ('pending','reviewed','accepted','rejected'))
);
GRANT SELECT, UPDATE, DELETE ON public.training_applications TO authenticated;
GRANT ALL ON public.training_applications TO service_role;
ALTER TABLE public.training_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read training applications" ON public.training_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update training applications" ON public.training_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete training applications" ON public.training_applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX training_applications_created_idx ON public.training_applications (created_at DESC);