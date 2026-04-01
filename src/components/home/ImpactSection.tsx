import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const CountUp = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const parseStatValue = (value: string) => {
  const num = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9]/g, "");
  return { num: isNaN(num) ? 0 : num, suffix };
};

const ImpactSection = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("site_impact_stats").select("*").order("sort_order").then(({ data }) => {
      if (data) setStats(data);
    });
  }, []);

  if (stats.length === 0) return null;

  return (
    <section id="impact" className="section-padding bg-navy w-full">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label={t("impact.label")} title={t("impact.title")} light />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => {
            const { num, suffix } = parseStatValue(s.value);
            return (
              <motion.div key={s.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
                <span className="text-5xl md:text-6xl font-heading font-bold text-cyan">
                  <CountUp target={num} suffix={suffix} />
                </span>
                <p className="text-white/60 text-sm mt-2">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
