import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const stats = [
  { value: "800+", label: "Youth Trained" },
  { value: "400+", label: "Certified Graduates" },
  { value: "15", label: "Initiatives Launched" },
  { value: "5", label: "Provinces Reached" },
];

const ImpactSection = () => (
  <section className="section-padding bg-navy">
    <div className="max-w-7xl mx-auto">
      <SectionHeading label="Our Impact" title="Our Impact in Numbers" light />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <span className="text-5xl md:text-6xl font-heading font-bold text-cyan">{s.value}</span>
            <p className="text-white/60 text-sm mt-2">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ImpactSection;
