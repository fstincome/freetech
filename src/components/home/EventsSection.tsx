import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, CalendarDays } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const EventsSection = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase.from("site_events").select("*").gte("sort_order", 0).order("sort_order").then(({ data }) => {
      if (data) setEvents(data);
    });
  }, []);

  const next = useCallback(() => setCurrent((p) => (p + 1) % (events.length || 1)), [events.length]);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + (events.length || 1)) % (events.length || 1)), [events.length]);

  useEffect(() => {
    if (events.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, events.length]);

  if (events.length === 0) return null;

  const event = events[current];

  return (
    <section id="events" className="section-padding bg-section-alt w-full">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label={t("events.label")} title={t("events.title")} description={t("events.desc")} />

        <div className="relative glass-card overflow-hidden">
          <div className="relative h-[420px] md:h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/60 to-navy/20" />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${event.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-10 max-w-2xl"
              >
                <div className="flex flex-wrap items-center gap-3 text-xs text-cyan font-heading font-medium mb-3">
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location}</span>
                  <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {event.event_date}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">{event.title}</h3>
                <p className="text-white/75 text-sm md:text-base leading-relaxed mb-5 line-clamp-3">{event.description}</p>
                {event.link && (
                  <a href={event.link} target="_blank" rel="noopener noreferrer" className="inline-block px-6 py-2.5 rounded-full bg-cyan text-navy font-heading font-semibold text-sm hover:bg-cyan/90 transition-all">
                    {t("events.readmore")}
                  </a>
                )}
              </motion.div>
            </AnimatePresence>

            <button onClick={prev} aria-label="Previous event" className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-cyan/30 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button onClick={next} aria-label="Next event" className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-cyan/30 transition-colors">
              <ChevronRight size={20} />
            </button>

            <div className="absolute top-5 right-5 z-20 flex gap-2">
              {events.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to event ${i + 1}`} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-cyan" : "w-2 bg-white/40"}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
