import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, BookOpen, Compass } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5 } }),
};

const approachSteps = [
  { titleKey: "approach.detect", shortKey: "approach.detect.short", detailKey: "approach.detect.detail", img: "https://freeti.org/images/diapos/INST.jpg", Icon: Search },
  { titleKey: "approach.instill", shortKey: "approach.instill.short", detailKey: "approach.instill.detail", img: "https://freeti.org/images/diapos/DET.jpg", Icon: BookOpen },
  { titleKey: "approach.guide", shortKey: "approach.guide.short", detailKey: "approach.guide.detail", img: "https://freeti.org/images/diapos/GRAD.jpg", Icon: Compass },
];

const ApproachSection = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <section id="approach" className="section-padding bg-section-alt w-full">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label={t("approach.label")} title={t("approach.title")} description={t("approach.desc")} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {approachSteps.map((step, i) => (
            <motion.div
              key={step.titleKey}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onClick={() => setSelected(i)}
              className="glass-card overflow-hidden group cursor-pointer hover:border-cyan/30 transition-colors"
            >
              <div className="h-52 overflow-hidden">
                <img src={step.img} alt={t(step.titleKey)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-cyan/15 flex items-center justify-center mx-auto mb-3">
                  <step.Icon className="w-6 h-6 text-cyan" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground">{t(step.titleKey)}</h3>
                <p className="text-cyan text-sm font-medium mt-1">{t(step.shortKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={selected !== null} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected !== null && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">{t(approachSteps[selected].titleKey)}</DialogTitle>
                <DialogDescription className="text-cyan font-medium">{t(approachSteps[selected].shortKey)}</DialogDescription>
              </DialogHeader>
              <img src={approachSteps[selected].img} alt={t(approachSteps[selected].titleKey)} className="w-full h-48 object-cover rounded-lg" />
              <p className="text-muted-foreground text-sm leading-relaxed">{t(approachSteps[selected].detailKey)}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ApproachSection;
