import DOMPurify from "dompurify";
import { ArrowDown, ArrowRight, CircleHelp, Target, Zap, TrendingUp, GraduationCap, BriefcaseBusiness, Check, ShieldCheck, Compass, CalendarCheck, Network } from "lucide-react";
import { localized, type CmsBlock } from "@/lib/cms";
import type { Lang } from "@/lib/i18n";

const stageIcons = [CircleHelp, Target, Zap, TrendingUp];
const html = (content: string) => ({ __html: DOMPurify.sanitize(content) });

export default function TheoryBlockView({ block, sectionKey, lang }: { block: CmsBlock; sectionKey: string; lang: Lang }) {
  const content = localized(block.content, lang);
  const title = localized(block.title, lang);
  if (sectionKey === "title") return <header id={block.anchor} className="theory-title border-b border-border bg-card px-5 py-12 md:py-16">
    <div className="max-w-6xl mx-auto flex items-center gap-6 md:gap-10">
      <div className="hidden sm:flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Network className="h-12 w-12" strokeWidth={1.4} /></div>
      <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight max-w-3xl break-words">{content}</h1>
    </div>
  </header>;

  if (sectionKey.startsWith("component.") && !sectionKey.includes(".step.")) {
    const document = new DOMParser().parseFromString(DOMPurify.sanitize(content), "text/html");
    const intro: string[] = [];
    const stages: { title: string; body: string }[] = [];
    for (const node of Array.from(document.body.children)) {
      if (node.tagName === "H3") stages.push({ title: node.textContent || "", body: "" });
      else if (stages.length) stages[stages.length - 1].body += node.outerHTML;
      else intro.push(node.outerHTML);
    }
    const second = sectionKey === "component.1";
    const Icon = second ? BriefcaseBusiness : GraduationCap;
    const images = (block.images || []).filter(url => /^https?:\/\//.test(url) || url.startsWith("/"));
    return <section id={block.anchor} className={`theory-path px-5 py-12 md:py-16 border-b border-border ${second ? "bg-secondary/50" : "bg-background"}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start gap-4 md:gap-5 mb-9">
          <div className={`theory-component-icon ${second ? "theory-tone-positive" : "theory-tone-primary"}`}><Icon className="h-7 w-7" strokeWidth={1.6} /></div>
          <div className="min-w-0"><h2 className="text-2xl md:text-3xl font-heading font-bold leading-tight mb-3">{title}</h2><div className="theory-intro text-muted-foreground leading-relaxed max-w-3xl" dangerouslySetInnerHTML={html(intro.join(""))} /></div>
        </div>
        <ol className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 xl:gap-6">
          {stages.map((stage, index) => {
            const StageIcon = stageIcons[index % stageIcons.length];
            return <li key={index} className={`theory-stage relative rounded-lg border border-border bg-card p-5 md:p-6 ${index === stages.length - 1 ? "theory-result" : ""}`}>
              <div className="flex items-center justify-between mb-6"><span className={`theory-stage-icon ${second ? "theory-tone-positive" : "theory-tone-primary"}`}><StageIcon className="h-5 w-5" strokeWidth={1.7} /></span><span className="text-sm font-semibold tabular-nums text-muted-foreground">0{index + 1}</span></div>
              <h3 className="text-lg font-heading font-semibold leading-snug mb-4">{stage.title}</h3>
              <div className="cms-rich-text text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={html(stage.body)} />
              {index < stages.length - 1 && <><ArrowRight aria-hidden="true" className="hidden xl:block absolute top-10 -right-5 z-10 h-4 w-4 text-muted-foreground"/><ArrowDown aria-hidden="true" className="md:hidden absolute -bottom-5 left-1/2 -translate-x-1/2 h-4 w-4 text-muted-foreground"/></>}
            </li>;
          })}
        </ol>
        {!stages.length && <div className="cms-rich-text" dangerouslySetInnerHTML={html(content)} />}
        {images.length > 0 && <div className="grid sm:grid-cols-2 gap-5 mt-8">{images.map((url, index) => <img key={`${url}-${index}`} src={url} alt={title} loading="lazy" className="w-full aspect-[4/3] object-contain bg-card rounded-lg border border-border" />)}</div>}
      </div>
    </section>;
  }

  if (sectionKey === "public.validated") return <section id={block.anchor} className="px-5 py-8 bg-secondary border-t border-border"><div className="max-w-6xl mx-auto flex items-center gap-3 text-sm text-muted-foreground"><CalendarCheck className="h-5 w-5 shrink-0 text-primary" /><p>{content}</p></div></section>;
  const Icon = sectionKey === "public.weDo" ? Compass : sectionKey === "public.weDont" ? ShieldCheck : Check;
  return <section id={block.anchor} className="px-5 py-10 md:py-12 bg-card border-b border-border">
    <div className="max-w-6xl mx-auto grid md:grid-cols-[280px_minmax(0,1fr)] gap-6 md:gap-12">
      <div className="flex items-start gap-3"><Icon className="h-6 w-6 mt-1 text-primary shrink-0" strokeWidth={1.7}/><h2 className="text-2xl font-heading font-bold leading-tight">{title}</h2></div>
      <div className="cms-rich-text theory-principles text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={html(content)} />
    </div>
  </section>;
}