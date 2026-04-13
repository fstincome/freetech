import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Shield, Eye, Zap, Key } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

const WhoWeAreSection = () => {
  const { t } = useLanguage();

  const coreValues = [
    { icon: Eye, titleKey: "about.accessibility", descKey: "about.accessibility.desc" },
    { icon: Shield, titleKey: "about.integrity", descKey: "about.integrity.desc" },
    { icon: Zap, titleKey: "about.empowerment", descKey: "about.empowerment.desc" },
    { icon: Key, titleKey: "about.autonomy", descKey: "about.autonomy.desc" },
  ];

  return (
    <section id="about" className="section-padding w-full relative overflow-hidden">
      <iframe
        src="https://www.youtube.com/embed/av7KgNM5PhA?autoplay=1&mute=1&loop=1&playlist=av7KgNM5PhA&controls=0&showinfo=0&modestbranding=1"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ border: 0, transform: "scale(1.5)", transformOrigin: "center center" }}
        allow="autoplay; encrypted-media"
        tabIndex={-1}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-navy/85" />
      <div className="relative z-10 max-w-7xl mx-auto">
        <SectionHeading label={t("about.label")} title={t("about.title")} light />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="space-y-6">
            <p className="text-white/70 text-base leading-relaxed">{t("about.p1")}</p>
            <p className="text-white/70 text-base leading-relaxed">{t("about.p2")}</p>
            <p className="text-white/70 text-base leading-relaxed">{t("about.p3")}</p>
          </motion.div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-cyan font-heading font-bold text-lg mb-2">{t("about.vision")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("about.vision.desc")}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h3 className="text-cyan font-heading font-bold text-lg mb-2">{t("about.mission")}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{t("about.mission.desc")}</p>
            </motion.div>
          </div>
        </div>

        <div className="mt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">{t("about.values")}</h3>
            <p className="text-white/50 text-sm mt-2 max-w-2xl mx-auto">{t("about.values.desc")}</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => (
              <motion.div key={v.titleKey} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan/30 transition-colors backdrop-blur-sm">
                <div className="w-14 h-14 rounded-xl bg-cyan/15 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-cyan" />
                </div>
                <h4 className="font-heading font-bold text-white mb-2">{t(v.titleKey)}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{t(v.descKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAreSection;
