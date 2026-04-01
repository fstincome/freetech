import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const ImpactSection = () => {
  const { t } = useLanguage();

  const stats = [
    { value: "800+", labelKey: "impact.youth" },
    { value: "400+", labelKey: "impact.certified" },
    { value: "15", labelKey: "impact.initiatives" },
    { value: "5", labelKey: "impact.provinces" },
  ];

  return (
    <section id="impact" className="section-padding bg-navy w-full">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label={t("impact.label")} title={t("impact.title")} light />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={s.labelKey} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center">
              <span className="text-5xl md:text-6xl font-heading font-bold text-cyan">{s.value}</span>
              <p className="text-white/60 text-sm mt-2">{t(s.labelKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
