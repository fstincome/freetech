import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { tr } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

// Translation keys for slides loaded from DB (index-based fallback)
const slideTranslationKeys = [
  { label: "hero.slide1.label", title: "hero.slide1.title", subtitle: "hero.slide1.subtitle", desc: "hero.slide1.desc" },
  { label: "hero.slide2.label", title: "hero.slide2.title", subtitle: "hero.slide2.subtitle", desc: "hero.slide2.desc" },
  { label: "hero.slide3.label", title: "hero.slide3.title", subtitle: "hero.slide3.subtitle", desc: "hero.slide3.desc" },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const { t, lang } = useLanguage();

  useEffect(() => {
    supabase.from("site_hero_slides").select("*").order("sort_order").then(({ data }) => {
      if (data && data.length > 0) setSlides(data);
    });
  }, []);

  const next = useCallback(() => setCurrent((p) => (p + 1) % (slides.length || 1)), [slides.length]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + (slides.length || 1)) % (slides.length || 1)), [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) return <section className="h-screen w-full bg-navy" />;

  const slide = slides[current];
  const keys = slideTranslationKeys[current];
  const hasDb = !!slide.translations?.[lang] && Object.values(slide.translations[lang]).some((v: any) => v && String(v).trim());
  const useTranslation = !hasDb && lang !== "en" && keys;
  const slideLabel = useTranslation ? t(keys.label) : tr(slide, "label", lang);
  const slideTitle = useTranslation ? t(keys.title) : tr(slide, "title", lang);
  const slideSubtitle = useTranslation ? t(keys.subtitle) : tr(slide, "subtitle", lang);
  const slideDesc = useTranslation ? t(keys.desc) : tr(slide, "description", lang);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img src={slide.image_url} alt={slide.label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/15 text-cyan text-xs font-heading font-semibold tracking-widest uppercase mb-4 border border-cyan/25">
                {slideLabel}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.1] mb-4">
                {slideTitle}
              </h1>
              <p className="text-cyan font-heading font-medium text-lg md:text-xl mb-4">
                {slideSubtitle}
              </p>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
                {slideDesc}
              </p>
              <div className="flex gap-4">
                <a href="#programs" className="px-7 py-3 rounded-full bg-cyan text-navy font-heading font-semibold text-sm hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
                  {t("hero.cta1")}
                </a>
                <a href="#about" className="px-7 py-3 rounded-full border border-white/25 text-white font-heading font-semibold text-sm hover:bg-white/10 transition-all">
                  {t("hero.cta2")}
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-cyan/30 transition-colors">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-cyan/30 transition-colors">
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-cyan" : "w-2 bg-white/40"}`} />
        ))}
      </div>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-cyan" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroCarousel;
