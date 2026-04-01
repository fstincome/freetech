import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const programs = [
  { name: "Global Networking Program", img: "https://freeti.org/images/programs/gnp.jpg", desc: "Our Global Networking Program connects Burundian youth with international tech communities, fostering cross-cultural collaboration and knowledge exchange. Participants gain exposure to global best practices in technology and innovation." },
  { name: "Bitdevs Program", img: "https://freeti.org/images/programs/bidevs.jpg", desc: "The Bitdevs Program focuses on Bitcoin development and blockchain technology. Through seminars and hands-on workshops, participants learn about decentralized finance, cryptographic protocols, and open-source Bitcoin development." },
  { name: "Trezor Academy Program", img: "https://freeti.org/images/programs/trezoro.jpg", desc: "In partnership with Trezor, this program educates participants on digital security, hardware wallets, and cryptocurrency self-custody." },
  { name: "Talk Tech Liberty Program", img: "https://freeti.org/images/programs/talk.jpg", desc: "Talk Tech Liberty brings together speakers and thought leaders to discuss the intersection of technology, freedom, and human rights." },
  { name: "Digital Inclusion", img: "https://freeti.org/images/programs/digita.jpg", desc: "Our Digital Inclusion program bridges the digital divide by providing basic computer training, internet literacy, and digital skills to underserved communities across Burundi." },
];

const ProgramsSection = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <section id="programs" className="section-padding w-full">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label={t("programs.label")} title={t("programs.title")} description={t("programs.desc")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <motion.div key={p.name} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} onClick={() => setSelected(i)} className="group relative rounded-2xl overflow-hidden h-64 cursor-pointer">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-heading font-bold text-lg">{p.name}</h3>
                <span className="text-cyan text-xs font-medium mt-1 inline-block">{t("programs.learnmore")}</span>
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
                <DialogTitle className="text-xl font-heading">{programs[selected].name}</DialogTitle>
                <DialogDescription>Program Details</DialogDescription>
              </DialogHeader>
              <img src={programs[selected].img} alt={programs[selected].name} className="w-full h-48 object-cover rounded-lg" />
              <p className="text-muted-foreground text-sm leading-relaxed">{programs[selected].desc}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ProgramsSection;
