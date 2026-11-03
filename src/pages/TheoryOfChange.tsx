import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { tr } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Eye, Target, X } from "lucide-react";

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
  const photos = (key: string) => {
    const r = item(key);
    const images = [r?.image_url, r?.image_url_2].filter(Boolean);
    return images.length ? <div className="grid sm:grid-cols-2 gap-4 mb-6">{images.map((url, i) => <img key={i} src={url} alt={text(key)} className="w-full aspect-[4/3] object-contain bg-muted rounded-lg" />)}</div> : null;
  };
  if (isPending) return <div className="pt-32 min-h-screen text-center" role="status">…</div>;
  if (error) return <div className="pt-32 min-h-screen text-center"><Button variant="outline" onClick={() => refetch()}>↻</Button></div>;
  return <div className="pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto space-y-14">
    <header className="text-center border-b border-border pb-10">
      <p className="text-cyan text-sm font-semibold uppercase">{text("period")}</p>
      <h1 className="text-4xl md:text-5xl font-heading font-bold mt-3">{text("title")}</h1>
      {photos("title")}
    </header>
    <section className="grid md:grid-cols-2 gap-8">
      {[{ key: "vision", Icon: Eye }, { key: "mission", Icon: Target }].map(({key, Icon}) => <div key={key}>
        <Icon className="text-cyan mb-3" /><h2 className="text-2xl font-bold mb-3">{text(key)}</h2>
        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{text(key, "description")}</p>{photos(key)}
      </div>)}
    </section>
    <section><h2 className="text-3xl font-bold mb-6">{text("axes")}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{rows.filter(r => r.section_key.startsWith("axis.")).map((r, i) => <article key={r.id} className="p-5 border border-border bg-card rounded-lg">
        <p className="text-cyan text-sm mb-3">{i + 1} / {tr(r,"tag",lang)}</p><h3 className="font-bold mb-3">{tr(r,"title",lang)}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{tr(r,"description",lang)}</p>{photos(r.section_key)}
      </article>)}</div>
    </section>
    <section><h2 className="text-3xl font-bold mb-8">{text("logic")}</h2>
      <div className="space-y-12">{rows.filter(r => /^component\.\d+$/.test(r.section_key)).map(r => <div key={r.id}>
        <h3 className="font-bold text-2xl mb-3">{tr(r,"title",lang)}</h3><p className="text-muted-foreground mb-5">{tr(r,"description",lang)}</p>{photos(r.section_key)}
        <div className="grid md:grid-cols-4 gap-6">{rows.filter(s => s.section_key.startsWith(r.section_key + ".step.")).map((s,i) => <div key={s.id} className="relative border-t-2 border-cyan pt-4">
          <h4 className="text-cyan font-semibold mb-3">{tr(s,"title",lang)}</h4><p className="text-sm text-muted-foreground leading-relaxed">{tr(s,"description",lang)}</p>
          {i < 3 && <ArrowRight className="hidden md:block absolute -right-5 top-4 w-4 text-cyan" />}
        </div>)}</div>
      </div>)}</div>
    </section>
    <section className="grid md:grid-cols-2 gap-8 border-t border-border pt-8">{[{ key: "weDo", Icon: Check }, { key: "weDont", Icon: X }].map(({key,Icon}) => <div key={key}>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Icon className="text-cyan" />{text(key)}</h2><p className="text-muted-foreground leading-relaxed whitespace-pre-line">{text(key,"description")}</p>{photos(key)}
    </div>)}</section>
    <section className="border-t border-border pt-8"><h2 className="text-2xl font-bold mb-5">{text("hypothesesTitle")}</h2>
      <ol className="list-decimal pl-6 space-y-3 text-muted-foreground">{rows.filter(r => r.section_key.startsWith("assumption.")).map(r => <li key={r.id}>{tr(r,"title",lang)}</li>)}</ol>
      <p className="text-sm text-muted-foreground mt-8">{text("validated")}</p>
    </section>
  </div>;
};
export default TheoryOfChange;
