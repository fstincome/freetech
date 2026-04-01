
DROP POLICY "Anyone can insert visitor logs" ON public.visitor_logs;
CREATE POLICY "Anon can insert visitor logs" ON public.visitor_logs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Authenticated can insert visitor logs" ON public.visitor_logs FOR INSERT TO authenticated WITH CHECK (true);
