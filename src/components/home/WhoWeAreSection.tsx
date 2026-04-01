import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Shield, Eye, Zap, Key } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

const coreValues = [
  { icon: Eye, title: "Accessibility", desc: "We believe knowledge and tools should be available to all, not just a few." },
  { icon: Shield, title: "Integrity", desc: "We promote ethical technology use that respects people and their data." },
  { icon: Zap, title: "Empowerment", desc: "We focus on practical learning that enables action and independence." },
  { icon: Key, title: "Autonomy", desc: "We value individual autonomy and digital self-sovereignty." },
];

const WhoWeAreSection = () => (
  <section id="about" className="section-padding bg-navy text-white">
    <div className="max-w-7xl mx-auto">
      <SectionHeading label="Who We Are" title="Free Tech Institute" light />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <p className="text-white/70 text-base leading-relaxed">
            Free Tech Institute (FREETI) is a non-profit organization promoting digital inclusion and technological freedom in Burundi.
          </p>
          <p className="text-white/70 text-base leading-relaxed">
            We train and inspire young people to use technology as a tool for innovation, entrepreneurship, and community development.
          </p>
          <p className="text-white/70 text-base leading-relaxed">
            Through workshops, hackathons, bootcamps, and conferences, we aim to bridge the digital divide, enhance creativity, and foster innovation so that technology becomes a driver of social and economic progress.
          </p>
        </motion.div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-cyan font-heading font-bold text-lg mb-2">Vision</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              To build an inclusive and digitally empowered Burundi where every individual has equal access to opportunities, embraces innovation, and contributes to a free, connected, and prosperous society.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-cyan font-heading font-bold text-lg mb-2">Mission</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              To reduce the digital divide and promote innovation by empowering Burundian youth with practical skills and digital literacy. Through hands-on training and open collaboration, we foster understanding of decentralized technologies, privacy, and responsible internet use.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Core Values */}
      <div className="mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">Our Core Values</h3>
          <p className="text-white/50 text-sm mt-2 max-w-2xl mx-auto">
            At Free Tech Institute, our core values shape everything we do: from the way we teach, to the technologies we promote.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((v, i) => (
            <motion.div
              key={v.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-xl bg-cyan/15 flex items-center justify-center mx-auto mb-4">
                <v.icon className="w-6 h-6 text-cyan" />
              </div>
              <h4 className="font-heading font-bold text-white mb-2">{v.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhoWeAreSection;
