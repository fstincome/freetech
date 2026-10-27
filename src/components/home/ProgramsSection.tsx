import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { tr } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const ProgramsSection = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const { t, lang } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    supabase.from("site_programs").select("*").order("sort_order").then(({ data }) => {
      if (data) setPrograms(data);
    });
  }, []);

  useEffect(() => {
    if (!autoScroll || !scrollRef.current || programs.length === 0) return;
    const container = scrollRef.current;
    let animationId: number;
    let scrollPos = 0;

    const step = () => {
      scrollPos += 0.5;
      if (scrollPos >= container.scrollWidth / 2) scrollPos = 0;
      container.scrollLeft = scrollPos;
      animationId = requestAnimationFrame(step);
    };
    animationId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationId);
  }, [autoScroll, programs.length]);

  const scroll = (dir: number) => {
    if (!scrollRef.current) return;
    setAutoScroll(false);
    scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    setTimeout(() => setAutoScroll(true), 5000);
  };

  if (programs.length === 0) return null;

  return (
    <section id="programs" className="section-padding w-full">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label={t("programs.label")} title={t("programs.title")} description={t("programs.desc")} />
      </div>

      <div className="relative max-w-full">
        <button onClick={() => scroll(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-navy/70 backdrop-blur flex items-center justify-center text-white hover:bg-cyan/30 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => scroll(1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-navy/70 backdrop-blur flex items-center justify-center text-white hover:bg-cyan/30 transition-colors">
          <ChevronRight size={20} />
        </button>

        <div ref={scrollRef} className="flex gap-6 overflow-x-hidden px-4 md:px-8 py-4 scrollbar-hide">
          {[...programs, ...programs].map((p, i) => (
            <motion.div
              key={`${p.id}-${i}`}
              custom={i % programs.length}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onClick={() => { setSelected(i % programs.length); setAutoScroll(false); }}
              className="group relative rounded-2xl overflow-hidden h-72 min-w-[280px] w-[280px] flex-shrink-0 cursor-pointer"
            >
              <img src={p.image_url} alt={tr(p, "name", lang)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-heading font-bold text-lg">{tr(p, "name", lang)}</h3>
                <span className="text-cyan text-xs font-medium mt-1 inline-block">{t("programs.learnmore")}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={selected !== null} onOpenChange={() => { setSelected(null); setAutoScroll(true); }}>
        <DialogContent className="sm:max-w-lg">
          {selected !== null && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-heading">{tr(programs[selected], "name", lang)}</DialogTitle>
                <DialogDescription>Program Details</DialogDescription>
              </DialogHeader>
              <img src={programs[selected].image_url} alt={tr(programs[selected], "name", lang)} className="w-full h-48 object-cover rounded-lg" />
              <p className="text-muted-foreground text-sm leading-relaxed">{tr(programs[selected], "description", lang)}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProgramsSection;
