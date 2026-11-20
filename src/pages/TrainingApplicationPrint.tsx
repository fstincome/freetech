import { useQuery } from "@tanstack/react-query";
import { Loader2, Printer, RotateCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { trainingContentSchema, TRAINING_CONTENT_KEY, type TrainingFormContent } from "@/lib/trainingApplication";

const Checkbox = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-2 mr-6 mb-2">
    <span className="inline-block h-4 w-4 border-2 border-navy rounded-sm align-middle" aria-hidden="true" />
    <span>{label}</span>
  </span>
);

const Line = ({ label, wide = false }: { label: string; wide?: boolean }) => (
  <div className={wide ? "col-span-2" : ""}>
    <p className="text-xs font-semibold uppercase tracking-wide text-navy/70 mb-1">{label}</p>
    <div className="border-b-2 border-dotted border-navy/40 h-7" />
  </div>
);

const WritingLines = ({ label, rows }: { label: string; rows: number }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-navy/70 mb-1">{label}</p>
    {Array.from({ length: rows }).map((_, i) => <div key={i} className="border-b-2 border-dotted border-navy/40 h-7" />)}
  </div>
);

export default function TrainingApplicationPrint() {
  const { data: content, isPending, error, refetch } = useQuery({ queryKey: ["training-content"], queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", TRAINING_CONTENT_KEY).single();
    if (error) throw error;
    return trainingContentSchema.parse(JSON.parse(data.value)) as TrainingFormContent;
  }});
  if (isPending) return <div className="min-h-96 flex items-center justify-center" role="status"><Loader2 className="animate-spin" /></div>;
  if (error || !content) return <div className="min-h-96 flex items-center justify-center"><Button aria-label="Réessayer" variant="outline" onClick={() => refetch()}><RotateCw /></Button></div>;
  const text = (key: string) => content[key]?.fr || key;
  return (
    <div className="bg-muted min-h-screen py-8 print:py-0 print:bg-background">
      <div className="no-print fixed top-4 right-4 z-10 print:hidden">
        <Button onClick={() => window.print()} className="bg-cyan text-navy font-bold hover:bg-cyan/90 rounded-full shadow-lg"><Printer />Imprimer</Button>
      </div>
      <div className="mx-auto w-[210mm] max-w-full bg-background shadow-xl print:shadow-none print:w-full px-[14mm] py-[10mm] text-navy">
        <header className="bg-navy text-hero-foreground rounded-xl print:rounded-none -mx-[4mm] px-[6mm] py-6 mb-8 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(hsl(var(--cyan))_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="relative flex items-center gap-5">
            <img src="/logo.png" alt="Logo Free Tech Institute" className="h-16 w-16 object-contain bg-background rounded-full p-1" />
            <div className="flex-1">
              <p className="text-cyan text-xs font-bold uppercase tracking-[0.2em]">Free Tech Institute</p>
              <h1 className="text-2xl font-heading font-bold leading-tight mt-1">{text("title")}</h1>
              <p className="text-hero-foreground/80 text-sm mt-1">{text("period")}</p>
            </div>
          </div>
          <p className="relative text-sm text-hero-foreground/75 mt-4 leading-relaxed">{text("intro")}</p>
        </header>

        <section className="mb-8">
          <h2 className="font-heading font-bold text-lg mb-3 pb-2 border-b-2 border-cyan"><span className="text-cyan">01</span> · {text("module_section")}</h2>
          <p className="text-sm text-navy/70 mb-3">{text("module_hint")}</p>
          <div className="grid grid-cols-2 gap-4">
            {(["basic_computing", "graphic_design"] as const).map(value => (
              <div key={value} className="flex items-center gap-3 border-2 border-navy/25 rounded-lg px-4 py-3">
                <span className="inline-block h-5 w-5 border-2 border-navy rounded-full" aria-hidden="true" />
                <span className="font-semibold">{text(value)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading font-bold text-lg mb-4 pb-2 border-b-2 border-cyan"><span className="text-cyan">02</span> · {text("personal_section")}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <Line label={text("full_name")} wide />
            <Line label={text("email")} />
            <Line label={text("phone")} />
            <Line label={text("age")} />
            <Line label={text("province")} />
            <Line label={text("commune")} />
            <Line label={text("quartier")} />
          </div>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy/70 mb-2">{text("contact_owner")}</p>
            {(["self", "parent", "relative", "other"] as const).map(v => <Checkbox key={v} label={text("owner_" + v)} />)}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading font-bold text-lg mb-4 pb-2 border-b-2 border-cyan"><span className="text-cyan">03</span> · {text("background_section")}</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-5">
            <Line label={text("occupation")} />
            <Line label={text("education")} />
          </div>
          <div className="space-y-4">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-navy/70 mb-2">{text("computer_level")}</p>{(["beginner", "some", "independent"] as const).map(v => <Checkbox key={v} label={text(v)} />)}</div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-navy/70 mb-2">{text("design_level")}</p>{(["beginner", "some", "independent"] as const).map(v => <Checkbox key={v} label={text(v)} />)}</div>
            <div><p className="text-xs font-semibold uppercase tracking-wide text-navy/70 mb-2">{text("computer_access")}</p>{(["yes", "shared", "no"] as const).map(v => <Checkbox key={v} label={text(v)} />)}</div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="font-heading font-bold text-lg mb-4 pb-2 border-b-2 border-cyan"><span className="text-cyan">04</span> · {text("goals_section")}</h2>
          <div className="space-y-6">
            <WritingLines label={text("motivation")} rows={5} />
            <WritingLines label={text("accessibility_needs")} rows={2} />
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-start gap-3 border-2 border-navy/25 rounded-lg p-4">
            <span className="inline-block h-5 w-5 border-2 border-navy rounded-sm mt-0.5 shrink-0" aria-hidden="true" />
            <p className="text-sm leading-relaxed">{text("consent")}</p>
          </div>
          <p className="text-xs text-navy/60 mt-3 leading-relaxed">{text("privacy")}</p>
          <div className="grid grid-cols-2 gap-x-8 mt-6">
            <Line label="Signature du candidat / de la candidate" />
            <Line label="Date" />
          </div>
        </section>

        <footer className="border-t-2 border-cyan pt-4 text-center text-xs text-navy/70 leading-relaxed">
          <p className="font-semibold text-navy">Free Tech Institute</p>
          <p>Gitega, Quartier Musinzira, Avenue de la Culture, N°15 · Tél : +257 69 03 49 65 · Email : info@freeti.org</p>
        </footer>
      </div>
    </div>
  );
}
