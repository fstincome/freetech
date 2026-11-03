import DOMPurify from "dompurify";
import { localized, type CmsBlock } from "@/lib/cms";
import type { Lang } from "@/lib/i18n";
import HeroCarousel from "@/components/home/HeroCarousel";
import ApproachSection from "@/components/home/ApproachSection";
import WhoWeAreSection from "@/components/home/WhoWeAreSection";
import ProgramsSection from "@/components/home/ProgramsSection";
import VideoSection from "@/components/home/VideoSection";
import WorkshopsSection from "@/components/home/WorkshopsSection";
import EventsSection from "@/components/home/EventsSection";
import PartnersSection from "@/components/home/PartnersSection";
import ImpactSection from "@/components/home/ImpactSection";
import ReportsSection from "@/components/home/ReportsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import OurTeam from "@/pages/OurTeam";
import JobOpportunities from "@/pages/JobOpportunities";
import TheoryOfChange from "@/pages/TheoryOfChange";
import TeamMemberBio from "@/pages/TeamMemberBio";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { tr } from "@/lib/i18n";

const sources = {hero:HeroCarousel,approach:ApproachSection,about:WhoWeAreSection,programs:ProgramsSection,video:VideoSection,workshops:WorkshopsSection,events:EventsSection,partners:PartnersSection,impact:ImpactSection,reports:ReportsSection,testimonials:TestimonialsSection,team:OurTeam,jobs:JobOpportunities,theory:TheoryOfChange,biography:TeamMemberBio};
export function CmsBlockView({block,lang}: {block:CmsBlock;lang:Lang}) {
  const {data:theory}=useQuery({queryKey:["cms-theory-record",block.theoryId],enabled:Boolean(block.theoryId),queryFn:async()=>{
    const {data,error}=await supabase.from("site_theory_sections").select("*").eq("id",block.theoryId || "").maybeSingle();if(error)throw error;return data;
  }});
  if(theory && !Object.keys(block.content).length)block={...block,content:{[lang]:block.type==="heading"?tr(theory,"title",lang):tr(theory,"description",lang)},title:block.type==="heading"?undefined:{[lang]:tr(theory,"title",lang)},images:[theory.image_url,theory.image_url_2].filter(Boolean)};
  const text=localized(block.content,lang);
  const images=(block.images || []).filter(url=> /^https?:\/\//.test(url) || url.startsWith("/"));
  if(block.type==="collection") {
    const Source = sources[block.source as keyof typeof sources];
    return Source ? <Source /> : null;
  }
  const rich=<div className="cms-rich-text text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(text)}} />;
  if(block.type==="heading") return <header id={block.anchor} className="px-4 py-12 md:py-16 bg-secondary text-center"><h1 className="max-w-5xl mx-auto text-4xl md:text-5xl font-heading font-bold break-words">{text}</h1></header>;
  return <section id={block.anchor} className="px-4 md:px-8 py-10 md:py-14">
    <div className="max-w-6xl mx-auto">
      {block.title && <h2 className="text-3xl font-heading font-bold mb-6 break-words">{localized(block.title,lang)}</h2>}
      {block.type==="text" && <div className="max-w-3xl mx-auto">{rich}</div>}
      {block.type==="textImage" && <div className="grid lg:grid-cols-2 gap-8 items-center"><div>{rich}</div><div className="grid gap-4">{images.map((url,i)=><img key={`${url}-${i}`} src={url} alt={localized(block.title,lang)} className="w-full aspect-[4/3] object-contain rounded-lg" loading="lazy" />)}</div></div>}
      {(block.type==="image" || block.type==="gallery") && <figure><div className={block.type==="gallery" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "max-w-4xl mx-auto"}>{images.map((url,i)=><img key={`${url}-${i}`} src={url} alt={text} className="w-full aspect-[4/3] object-contain rounded-lg" loading="lazy" />)}</div>{text && <figcaption className="mt-3 text-muted-foreground text-sm text-center whitespace-pre-line">{text}</figcaption>}</figure>}
    </div>
  </section>;
}
export default function CmsRenderer({blocks,lang,preview=false}:{blocks:CmsBlock[];lang:Lang;preview?:boolean}) {
 return <div className={preview ? "" : "pt-20"}>{blocks.filter(b=>!b.hidden).map(block=><CmsBlockView key={block.id} block={block} lang={lang} />)}</div>;
}