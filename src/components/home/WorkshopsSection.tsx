import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

const workshops = [
  { title: "SecureNet Summit 2025", img: "https://freeti.org/images/events/GED2025.jpg", gallery: ["https://freeti.org/images/events/GED2025.jpg", "https://freeti.org/images/events/ged.jpg", "https://freeti.org/images/parterners/ged.jpg"] },
  { title: "Computer Training Program", img: "https://freeti.org/images/events/TRAIN.jpg", gallery: ["https://freeti.org/images/events/TRAIN.jpg", "https://freeti.org/images/events/bcbc.jpg"] },
  { title: "Trezor Academy", img: "https://freeti.org/images/events/TREZOR1.jpg", gallery: ["https://freeti.org/images/events/TREZOR1.jpg", "https://freeti.org/images/programs/trezoro.jpg", "https://freeti.org/images/programs/trezor.jpg"] },
  { title: "FRB Bootcamp", img: "https://freeti.org/images/events/FRB1.jpg", gallery: ["https://freeti.org/images/events/FRB1.jpg", "https://freeti.org/images/events/bitnob.jpg", "https://freeti.org/images/frb/ZZY_7754.jpg"] },
  { title: "Global Encryption Day 2024", img: "https://freeti.org/images/events/GED2024.jpg", gallery: ["https://freeti.org/images/events/GED2024.jpg"] },
];

const WorkshopsSection = () => {
  const [selectedWorkshop, setSelectedWorkshop] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <section id="workshops" className="section-padding bg-section-alt w-full">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label="Workshops Gallery" title="Our Workshops, Bootcamps & Hackathons" description="Click on any event to see more photos from the workshop." />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {workshops.map((w, i) => (
            <motion.div key={w.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} onClick={() => setSelectedWorkshop(i)} className="group relative rounded-xl overflow-hidden h-48 cursor-pointer">
              <img src={w.img} alt={w.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/20 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-navy/80 to-transparent">
                <p className="text-white text-xs font-heading font-semibold">{w.title}</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-heading font-semibold bg-cyan/80 px-4 py-1.5 rounded-full">Open</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={selectedWorkshop !== null} onOpenChange={() => setSelectedWorkshop(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedWorkshop !== null && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-heading">{workshops[selectedWorkshop].title}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3">
                {workshops[selectedWorkshop].gallery.map((img, i) => (
                  <img key={i} src={img} alt={`${workshops[selectedWorkshop].title} - ${i + 1}`} className="w-full h-48 object-cover rounded-lg hover:scale-[1.02] transition-transform" />
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default WorkshopsSection;
