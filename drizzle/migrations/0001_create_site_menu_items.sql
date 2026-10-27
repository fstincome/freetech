CREATE TABLE public.site_menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.site_menu_items(id) ON DELETE CASCADE,
  label_fr text NOT NULL DEFAULT '',
  label_en text NOT NULL DEFAULT '',
  label_sw text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '',
  highlight boolean NOT NULL DEFAULT false,
  visible boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_menu_items TO authenticated;
GRANT ALL ON public.site_menu_items TO service_role;
ALTER TABLE public.site_menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read menu" ON public.site_menu_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin manage menu" ON public.site_menu_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER update_site_menu_items_updated_at BEFORE UPDATE ON public.site_menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();