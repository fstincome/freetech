
-- Registrations table
CREATE TABLE public.hackathon_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  profession text DEFAULT '',
  bitcoin_level text NOT NULL DEFAULT 'Beginner',
  target_hackathon text NOT NULL DEFAULT 'both',
  specialty text NOT NULL DEFAULT 'Full Stack',
  languages text[] NOT NULL DEFAULT '{}',
  motivation text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.hackathon_registrations TO anon;
GRANT INSERT ON public.hackathon_registrations TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.hackathon_registrations TO authenticated;
GRANT ALL ON public.hackathon_registrations TO service_role;

ALTER TABLE public.hackathon_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a registration"
  ON public.hackathon_registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins manage registrations"
  ON public.hackathon_registrations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Trainers table
CREATE TABLE public.hackathon_trainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL DEFAULT 'Trainer',
  bio text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  twitter_url text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hackathon_trainers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hackathon_trainers TO authenticated;
GRANT ALL ON public.hackathon_trainers TO service_role;

ALTER TABLE public.hackathon_trainers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read hackathon trainers"
  ON public.hackathon_trainers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage hackathon trainers"
  ON public.hackathon_trainers FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER hackathon_trainers_updated_at
  BEFORE UPDATE ON public.hackathon_trainers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed trainers
INSERT INTO public.hackathon_trainers (name, role, bio, image_url, twitter_url, sort_order) VALUES
  ('Advaxe Ndayisenga', 'Lead Trainer', 'Passionné par l''éducation Bitcoin et le développement communautaire en Afrique.', 'https://lerdurdmbownqeaaiwmn.supabase.co/storage/v1/object/public/speakers/ddfa813d-08d7-43dc-864e-a839a344aa5a-1779953771912.JPG', 'https://x.com/AdvaxeIr', 1),
  ('Belyi Nobel Kubwayo', 'Trainer', 'Expert en développement logiciel et applications décentralisées.', 'https://bujahackaton.lovable.app/speakers/belyi.png', 'https://x.com/belyi_nobel', 2),
  ('Wilfried Cubahiro', 'Trainer', 'Spécialiste en sécurité et infrastructure réseau.', 'https://bujahackaton.lovable.app/speakers/wilfried.png', '', 3);
