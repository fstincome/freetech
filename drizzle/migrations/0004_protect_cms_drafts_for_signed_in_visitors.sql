DROP POLICY "Visitors read published CMS pages" ON public.cms_pages;
CREATE POLICY "Visitors read published CMS pages" ON public.cms_pages FOR SELECT TO anon USING (published_blocks IS NOT NULL);
CREATE FUNCTION public.read_published_cms_page(page_slug text)
RETURNS TABLE (id uuid, slug text, published_titles jsonb, published_blocks jsonb, updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT p.id,p.slug,p.published_titles,p.published_blocks,p.updated_at FROM public.cms_pages p WHERE p.slug=page_slug AND p.published_blocks IS NOT NULL $$;
REVOKE ALL ON FUNCTION public.read_published_cms_page(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.read_published_cms_page(text) TO anon, authenticated, service_role;