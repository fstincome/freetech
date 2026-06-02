ALTER TABLE public.hackathon_registrations
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';

CREATE POLICY "Public read accepted registrations"
ON public.hackathon_registrations
FOR SELECT
TO anon, authenticated
USING (status = 'accepted');