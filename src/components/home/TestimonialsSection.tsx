import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { tr } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const { t, lang } = useLanguage();

  useEffect(() => {
    supabase.from("site_testimonials").select("*").order("sort_order").then(({ data }) => {
      if (data) setTestimonials(data);
    });
  }, []);

  const next = useCallback(() => setCurrent((p) => (p + 1) % (testimonials.length || 1)), [testimonials.length]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + (testimonials.length || 1)) % (testimonials.length || 1)), [testimonials.length]);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="section-padding bg-section-alt w-full">
      <div className="max-w-5xl mx-auto">
        <SectionHeading label={t("testimonials.label")} title={t("testimonials.title")} description={t("testimonials.desc")} />

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5 }} className="glass-card p-8 md:p-12">
              <Quote className="w-10 h-10 text-cyan/30 mb-6" />
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 italic">
                "{tr(testimonials[current], "text", lang)}"
              </p>
              <div className="flex items-center gap-4">
                <img src={testimonials[current].author_image_url} alt={testimonials[current].author_name} className="w-14 h-14 rounded-full object-cover border-2 border-cyan/30" />
                <div>
                  <p className="font-heading font-bold text-foreground">{testimonials[current].author_name}</p>
                  <p className="text-sm text-muted-foreground">{tr(testimonials[current], "author_role", lang)}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center hover:bg-cyan/20 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-cyan" : "w-2 bg-foreground/20"}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center hover:bg-cyan/20 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
