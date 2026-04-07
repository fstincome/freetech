
CREATE TABLE public.site_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT 2024,
  description TEXT NOT NULL DEFAULT '',
  drive_link TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read reports" ON public.site_reports FOR SELECT USING (true);
CREATE POLICY "Admin manage reports" ON public.site_reports FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_site_reports_updated_at BEFORE UPDATE ON public.site_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
