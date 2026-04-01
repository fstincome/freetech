
CREATE TABLE public.site_team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read team" ON public.site_team_members FOR SELECT TO public USING (true);
CREATE POLICY "Admin manage team" ON public.site_team_members FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_team_members_updated_at BEFORE UPDATE ON public.site_team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
