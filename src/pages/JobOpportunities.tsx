import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { BriefcaseBusiness, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { tr } from "@/lib/i18n";
import { applicationsOpen } from "@/lib/jobRules";
import { Button } from "@/components/ui/button";

const JobOpportunities = () => {
  const { lang } = useLanguage();
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["job-opportunities"],
    queryFn: async () => {
      const [jobs, labels] = await Promise.all([
        supabase.from("site_job_opportunities").select("*").order("sort_order"),
        supabase.from("site_theory_sections").select("*").like("section_key", "jobs.%"),
      ]);
      if (jobs.error) throw jobs.error;
      if (labels.error) throw labels.error;
      return { jobs: jobs.data, labels: labels.data };
    },
  });
  const label = (key: string) => tr(data?.labels.find(r => r.section_key === `jobs.${key}`), "title", lang);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { if (label("title")) document.title = `${label("title")} | Free Tech Institute`; }, [data, lang]);
  if (isPending) return <div className="pt-32 min-h-screen text-center" role="status">…</div>;
  if (error) return <div className="pt-32 min-h-screen text-center"><Button variant="outline" onClick={() => refetch()}>↻</Button></div>;
  return <div className="pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
    <header className="border-b border-border pb-10 mb-10">
      <p className="text-cyan font-semibold mb-3">Free Tech Institute</p>
      <h1 className="text-4xl md:text-5xl font-bold">{label("title")}</h1>
    </header>
    {!data?.jobs.length && <p className="text-muted-foreground">{label("empty")}</p>}
    <div className="space-y-12">{data?.jobs.map(job => <article key={job.id} className="border-b border-border pb-12 last:border-0">
      {job.image_url && <img src={job.image_url} alt={tr(job, "title", lang)} className="w-full max-h-96 object-contain bg-muted rounded-lg mb-6" />}
      <div className="flex items-start gap-4"><BriefcaseBusiness className="text-cyan shrink-0 mt-1" /><h2 className="text-2xl md:text-3xl font-bold">{tr(job, "title", lang)}</h2></div>
      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground my-5">
        <span className="flex items-center gap-2"><MapPin size={16} />{tr(job, "location", lang)}</span>
        {job.deadline && <span className="flex items-center gap-2"><CalendarDays size={16} />{label("deadline")} : {new Intl.DateTimeFormat(lang, { dateStyle: "long" }).format(new Date(`${job.deadline}T12:00:00`))}</span>}
      </div>
      <p className="text-muted-foreground leading-relaxed mb-6 whitespace-pre-line">{tr(job, "introduction", lang)}</p>
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-7">
        {["role", "responsibilities", "expectations", "contract"].map(field => <section key={field}>
          <h3 className="font-semibold mb-3">{label(field)}</h3>
          {field === "responsibilities" ? <ul className="list-disc pl-5 space-y-2 text-muted-foreground">{tr(job, field, lang).split("\n").filter(Boolean).map((line,i) => <li key={i}>{line.replace(/^[-•]\s*/, "")}</li>)}</ul> : <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{tr(job, field, lang)}</p>}
        </section>)}
      </div>
      <div className="mt-7">{applicationsOpen(job.deadline) && job.application_url ? <Button asChild><a href={job.application_url} target="_blank" rel="noopener noreferrer">{label("apply")}<ExternalLink size={16} className="ml-2" /></a></Button> : <Button disabled variant="secondary">{label("closed")}</Button>}</div>
    </article>)}</div>
  </div>;
};
export default JobOpportunities;