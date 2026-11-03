import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { tr } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { isPublicTheorySection } from "@/lib/theorySections";

const TheoryOfChange = () => {
  const { lang } = useLanguage();
  const { data: rows = [], isPending, error, refetch } = useQuery({
    queryKey: ["theory-content"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_theory_sections").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const item = (key: string) => rows.find(r => r.section_key === key);
  const text = (key: string, field = "title") => tr(item(key), field, lang);
  useEffect(() => { if (text("title")) document.title = `${text("title")} | Free Tech Institute`; }, [rows, lang]);
  const title = item("title");
  const sections = rows.filter(r => r.section_key !== "title" && isPublicTheorySection(r.section_key));
  const photos = (row: typeof rows[number]) => {
    const images = [row.image_url, row.image_url_2].filter((url): url is string => Boolean(url));
    if (!images.length) return null;
    return <div className={`grid gap-4 ${images.length > 1 ? "sm:grid-cols-2" : ""}`}>
      {images.map((url, i) => <img key={`${url}-${i}`} src={url} alt={tr(row, "title", lang)} loading="lazy"
        className="w-full aspect-[4/3] object-contain rounded-lg" />)}
    </div>;
  };
  if (isPending) return <div className="pt-32 min-h-screen text-center" role="status">…</div>;
  if (error) return <div className="pt-32 min-h-screen text-center"><Button variant="outline" aria-label="Retry" onClick={() => refetch()}><RotateCw /></Button></div>;
  return <>
    <header className="relative pt-32 pb-16 overflow-hidden bg-secondary text-secondary-foreground">
      {title?.image_url && <img src={title.image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
      <div className={`relative max-w-4xl mx-auto px-4 text-center ${title?.image_url ? "bg-background/90 py-8" : ""}`}>
        {text("title", "tag") && <p className="text-cyan text-sm font-heading font-semibold uppercase mb-4">{text("title", "tag")}</p>}
        <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight">{text("title")}</h1>
        {text("title", "description") && <p className="mt-5 text-lg text-muted-foreground leading-relaxed whitespace-pre-line">{text("title", "description")}</p>}
      </div>
    </header>
    {sections.map((row, index) => {
      const hasImages = Boolean(row.image_url || row.image_url_2);
      return <section key={row.id} className={`section-padding ${index % 2 ? "bg-section-alt" : "bg-background"}`}>
        <div className={`max-w-6xl mx-auto ${hasImages ? "grid lg:grid-cols-2 gap-8 lg:gap-12 items-center" : "max-w-3xl"}`}>
          <div className={hasImages && index % 2 ? "lg:order-2" : ""}>
            {tr(row,"tag",lang) && <p className="text-cyan font-heading font-semibold text-sm uppercase mb-3">{tr(row,"tag",lang)}</p>}
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 leading-tight">{tr(row,"title",lang)}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{tr(row,"description",lang)}</p>
          </div>
          {photos(row)}
        </div>
      </section>;
    })}
  </>;
};
export default TheoryOfChange;
