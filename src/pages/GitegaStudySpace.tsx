import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const gallery = [
  "https://freeti.org/gss/111.jpg",
  "https://freeti.org/gss/222.jpg",
  "https://freeti.org/gss/333.jpg",
  "https://freeti.org/gss/444.jpg",
  "https://freeti.org/gss/555.jpg",
  "https://freeti.org/gss/666.jpg",
  "https://freeti.org/gss/777.jpg",
  "https://freeti.org/gss/888.jpg",
];

const stats = [
  { value: "250", label: "Youth Trained" },
  { value: "164", label: "Certified" },
  { value: "15", label: "Initiatives Launched" },
  { value: "5", label: "Clubs in Highschools" },
];

const GitegaStudySpace = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://freeti.org/img/bg_1.jpg')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-cyan/15 text-cyan text-xs font-semibold tracking-widest uppercase mb-4 border border-cyan/20"
          >
            Our Digital Hub
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-4"
          >
            Gitega Study Space
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            A digital learning and innovation hub based in the heart of Burundi.
          </motion.p>
        </div>
      </section>

      {/* About */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-cyan font-heading font-semibold text-sm tracking-widest uppercase mb-3 block">About the Hub</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Bridging the Digital Divide
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Established by the Free Tech Institute (FREETI), a Burundian non-profit that promotes freedom through emerging technologies, the center serves as a platform for young people to acquire practical digital skills, explore new technologies, and develop innovative projects that drive local impact.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              <strong className="text-foreground">Our mission</strong> is to bridge the digital divide by providing access to technology, mentorship, and quality training, empowering youth to become active contributors to Burundi's digital transformation and sustainable development.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl"
          >
            <img src="https://freeti.org/img/gss.jpg" alt="Gitega Study Space" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Objectives */}
      <section className="section-padding bg-navy">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden"
          >
            <img src="https://freeti.org/img/cetas.jpg" alt="Study room" className="w-full object-cover rounded-2xl" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-cyan font-heading font-semibold text-sm tracking-widest uppercase mb-3 block">Our Objective</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
              Equipping Youth for the Future
            </h2>
            <p className="text-white/70 leading-relaxed mb-6">
              Our main objective is to equip young secondary school graduates and university students with essential digital and entrepreneurial skills to enhance their employability and encourage innovation.
            </p>
            <ul className="space-y-3">
              {[
                "Programming and software development",
                "Digital marketing and communication",
                "Digital entrepreneurship and innovation",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/80 text-sm">
                  <span className="w-2 h-2 rounded-full bg-cyan flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Future */}
      <section className="section-padding bg-section-alt">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            label="Future Perspectives"
            title="Scaling Our Impact"
            description="Building on the success of previous cohorts, the project will continue over the next three years, with continued support from the King Baudouin Foundation."
          />
          <div className="space-y-3 text-left max-w-xl mx-auto">
            {[
              "Train 150 additional young people in digital professions",
              "Support the creation of new initiatives and tech startups",
              "Expand the model to other regions of Burundi",
            ].map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <span className="w-6 h-6 rounded-full bg-cyan/15 text-cyan text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                <p className="text-sm text-muted-foreground">{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-navy">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
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
              <span className="text-5xl font-heading font-bold text-cyan">{s.value}</span>
              <p className="text-white/60 text-sm mt-2">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <SectionHeading label="Gallery" title="Inside the Space" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((src, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="rounded-xl overflow-hidden aspect-square"
              >
                <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default GitegaStudySpace;
