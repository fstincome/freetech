CREATE TABLE public.cms_pages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 slug text NOT NULL UNIQUE,
 name text NOT NULL DEFAULT '',
 titles jsonb NOT NULL DEFAULT '{}'::jsonb,
 draft_blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
 published_titles jsonb NOT NULL DEFAULT '{}'::jsonb,
 published_blocks jsonb,
 updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cms_pages TO authenticated;
GRANT SELECT (id,slug,published_titles,published_blocks,updated_at) ON public.cms_pages TO anon;
GRANT ALL ON public.cms_pages TO service_role;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage CMS pages" ON public.cms_pages FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Visitors read published CMS pages" ON public.cms_pages FOR SELECT TO anon, authenticated USING (published_blocks IS NOT NULL);
CREATE TRIGGER cms_pages_updated_at BEFORE UPDATE ON public.cms_pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();