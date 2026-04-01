import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    <div className="absolute inset-0 bg-navy/75" />
    <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="inline-block px-4 py-1.5 rounded-full bg-cyan/15 text-cyan text-xs font-semibold tracking-widest uppercase mb-6 border border-cyan/20"
      >
        Digital Inclusion · Decentralized Technologies
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-[1.1] mb-6"
      >
        Empowering Burundi's Youth Through{" "}
        <span className="text-gradient">Technology</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        Free Tech Institute builds a generation aware, skilled, and ready to harness decentralized technologies like Bitcoin, blockchain, and open finance.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-wrap justify-center gap-4"
      >
        <a href="#programs" className="px-8 py-3.5 rounded-full bg-cyan text-navy font-semibold text-sm hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
          Explore Our Programs
        </a>
        <a href="#about" className="px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-all">
          Learn More
        </a>
      </motion.div>
    </div>
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2"
      >
        <div className="w-1 h-2 rounded-full bg-cyan" />
      </motion.div>
    </div>
  </section>
);

const approachSteps = [
  { title: "Detect", desc: "Identify promising youth and assess their digital needs and potential.", img: "https://freeti.org/images/diapos/INST.jpg" },
  { title: "Instill", desc: "Provide hands-on training in digital skills, blockchain, and open technologies.", img: "https://freeti.org/images/diapos/DET.jpg" },
  { title: "Guide", desc: "Mentor and support learners as they build real projects and launch initiatives.", img: "https://freeti.org/images/diapos/GRAD.jpg" },
];

const ApproachSection = () => (
  <section className="section-padding bg-section-alt">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        label="Our Approach"
        title="Progressive & Human-Centered"
        description="At FREETI, we believe that transformation happens through a progressive and human-centered approach."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {approachSteps.map((step, i) => (
          <motion.div
            key={step.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass-card overflow-hidden group"
          >
            <div className="h-48 overflow-hidden">
              <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <span className="text-cyan font-heading font-bold text-xs tracking-widest uppercase">Step {i + 1}</span>
              <h3 className="text-xl font-heading font-bold mt-2 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="section-padding bg-navy text-white">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        label="Who We Are"
        title="Free Tech Institute"
        description="A non-profit organization promoting digital inclusion and technological freedom in Burundi."
        light
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        {[
          { title: "Vision", text: "To build an inclusive and digitally empowered Burundi where every individual has equal access to opportunities, embraces innovation, and contributes to a free, connected, and prosperous society." },
          { title: "Mission", text: "To reduce the digital divide and promote innovation by empowering Burundian youth with practical skills and digital literacy through hands-on training and open collaboration." },
          { title: "Core Values", text: "Accessibility, Integrity, Empowerment, and Autonomy. We believe knowledge and tools should be available to all, promoting ethical technology use." },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan/15 flex items-center justify-center mb-4">
              <span className="text-cyan font-heading font-bold text-lg">{item.title[0]}</span>
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">{item.title}</h3>
            <p className="text-white/60 text-sm leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const programs = [
  { name: "Global Networking Program", img: "https://freeti.org/images/programs/gnp.jpg" },
  { name: "Bitdevs Program", img: "https://freeti.org/images/programs/bidevs.jpg" },
  { name: "Trezor Academy Program", img: "https://freeti.org/images/programs/trezoro.jpg" },
  { name: "Talk Tech Liberty Program", img: "https://freeti.org/images/programs/talk.jpg" },
  { name: "Digital Inclusion", img: "https://freeti.org/images/programs/digita.jpg" },
];

const ProgramsSection = () => (
  <section id="programs" className="section-padding">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        label="Explore Our Programs"
        title="Empowering Minds Through Digital Literacy"
        description="Our programs inspire creativity, innovation, and inclusion. Each activity brings young minds closer to real solutions for Burundi's future."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((p, i) => (
          <motion.div
            key={p.name}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="group relative rounded-2xl overflow-hidden h-64 cursor-pointer"
          >
            <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-white font-heading font-bold text-lg">{p.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const events = [
  {
    title: "Basic Computer Training",
    location: "Gitega Study Space",
    date: "April 22, 2025",
    desc: "One-month certified Basic Computer Training in Gitega trained and certified 40 participants with support from the State of Israel.",
    img: "https://freeti.org/images/events/bcbc.jpg",
  },
  {
    title: "Open Source Bootcamp",
    location: "Polytechnic University of Gitega",
    date: "October 10, 2025",
    desc: "Participants dived into open-source software development, collaboration tools, and community-driven innovation.",
    img: "https://freeti.org/images/events/bitnob.jpg",
  },
  {
    title: "SecureNet Summit 2025",
    location: "Martha Hotel",
    date: "October 17, 2025",
    desc: "Exploring how AI shapes information, challenges disinformation, and impacts digital security.",
    img: "https://freeti.org/images/events/ged.jpg",
  },
];

const EventsSection = () => (
  <section className="section-padding bg-section-alt">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        label="Latest Events"
        title="Workshops, Bootcamps & Hackathons"
        description="Real learning happens in real spaces. Join our sessions to gain hands-on experience and bring your ideas to life."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((e, i) => (
          <motion.div
            key={e.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass-card overflow-hidden group"
          >
            <div className="h-52 overflow-hidden">
              <img src={e.img} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>{e.location}</span>
                <span>•</span>
                <span>{e.date}</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">{e.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{e.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const partners = [
  "https://freeti.org/images/parterners/atlas.png",
  "https://freeti.org/images/parterners/hrf.png",
  "https://freeti.org/images/parterners/kbf.webp",
  "https://freeti.org/images/parterners/trezorac.webp",
  "https://freeti.org/images/parterners/thewhy.webp",
  "https://freeti.org/images/parterners/sfl.png",
  "https://freeti.org/images/parterners/isoc.png",
  "https://freeti.org/images/parterners/btrust.png",
  "https://freeti.org/images/parterners/atassi.png",
];

const PartnersSection = () => (
  <section className="section-padding">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        label="Our Partners"
        title="Building Together"
        description="We proudly collaborate with institutions and organizations that share our vision for a digitally inclusive Burundi."
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
      >
        {partners.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Partner ${i + 1}`}
            className="h-12 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
          />
        ))}
      </motion.div>
    </div>
  </section>
);

const stats = [
  { value: "800+", label: "Youth Trained" },
  { value: "400+", label: "Certified Graduates" },
  { value: "15", label: "Initiatives Launched" },
  { value: "5", label: "Provinces Reached" },
];

const ImpactSection = () => (
  <section className="section-padding bg-navy">
    <div className="max-w-7xl mx-auto">
      <SectionHeading label="Our Impact" title="Real Numbers, Real Change" light />
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

const testimonials = [
  {
    text: "The relevance of the modules, especially those on research techniques and digital marketing, has been remarkable, offering a strong complement to our existing curriculum.",
    name: "NIBAYEMERE Joseph",
    role: "Director of Lycée Technique New Generation",
    img: "https://freeti.org/img/directeur.jpg",
  },
  {
    text: "This experience truly inspired me. It led me to co-found the 'Vision Digital Club,' an initiative dedicated to promoting responsible and inclusive digital engagement, especially among young girls in Burundi.",
    name: "DUSHIME Delly Santiana",
    role: "Student & Program Laureate",
    img: "https://freeti.org/img/santhiana.jpg",
  },
  {
    text: "We were truly impressed by the quality and creativity of our students' presentations—especially their innovative spirit and ability to address complex concepts rarely explored in our country.",
    name: "Senene François Xavier",
    role: "Directeur académique, UPG",
    img: "https://freeti.org/img/dac.jpg",
  },
];

const TestimonialsSection = () => (
  <section className="section-padding bg-section-alt">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        label="Testimonials"
        title="Real Stories, Real Impact"
        description="Hear from learners, educators, and partners about how Free Tech Institute has inspired them."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-heading font-bold text-sm text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <>
      <Hero />
      <ApproachSection />
      <AboutSection />
      <ProgramsSection />
      <EventsSection />
      <PartnersSection />
      <ImpactSection />
      <TestimonialsSection />
    </>
  );
};

export default Index;
