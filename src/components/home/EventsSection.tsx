import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, CalendarDays } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const PER_PAGE = 3;

const EventsSection = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase.from("site_events").select("*").gte("sort_order", 0).order("sort_order").then(({ data }) => {
      if (data) setEvents(data);
    });
  }, []);

  const pageCount = Math.max(1, Math.ceil(events.length / PER_PAGE));

  const next = useCallback(() => setCurrent((p) => (p + 1) % pageCount), [pageCount]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + pageCount) % pageCount), [pageCount]);

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, events.length]);

  if (events.length === 0) return null;

  const visible = events.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  return (
    <section id="events" className="section-padding bg-section-alt w-full">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label={t("events.label")} title={t("events.title")} description={t("events.desc")} />

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {visible.map((event) => (
                <article key={event.id} className="glass-card overflow-hidden flex flex-col group">
                  <div className="h-44 shrink-0 overflow-hidden">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 p-5 flex flex-col">
                    <div className="flex flex-wrap items-center gap-3 text-xs text-cyan font-heading font-medium mb-2">
                      <span className="flex items-center gap-1.5"><MapPin size={13} /> {event.location}</span>
                      <span className="flex items-center gap-1.5"><CalendarDays size={13} /> {event.event_date}</span>
                    </div>
                    <h3 className="text-lg font-heading font-bold text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{event.description}</p>
                    {event.link && (
                      <a href={event.link} target="_blank" rel="noopener noreferrer" className="self-start px-5 py-2 rounded-full bg-cyan text-navy font-heading font-semibold text-sm hover:bg-cyan/90 transition-all">
                        {t("events.readmore")}
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </motion.div>
          </AnimatePresence>

          {pageCount > 1 && (
            <>
              <button onClick={prev} aria-label="Previous events" className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-foreground hover:bg-cyan/30 transition-colors">
                <ChevronLeft size={20} />
              </button>
              <button onClick={next} aria-label="Next events" className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-foreground hover:bg-cyan/30 transition-colors">
                <ChevronRight size={20} />
              </button>

              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to page ${i + 1}`} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-cyan" : "w-2 bg-white/40"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
