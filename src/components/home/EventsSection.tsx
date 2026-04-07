import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const EventsSection = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("site_events").select("*").gte("sort_order", 0).order("sort_order").then(({ data }) => {
      if (data) setEvents(data);
    });
  }, []);

  if (events.length === 0) return null;

  return (
    <section id="events" className="section-padding bg-section-alt w-full">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label={t("events.label")} title={t("events.title")} description={t("events.desc")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((e, i) => (
            <motion.div key={e.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card overflow-hidden group">
              <div className="h-52 overflow-hidden">
                <img src={e.image_url} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span>{e.location}</span><span>•</span><span>{e.event_date}</span>
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">{e.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">{e.description}</p>
                {e.link && (
                  <a href={e.link} target="_blank" rel="noopener noreferrer" className="text-cyan text-sm font-heading font-semibold hover:underline">
                    {t("events.readmore")}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
