import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const teamMembers = [
  { name: "Belyi Nobel Kubwayo", role: "Chief Executive Officer", img: "https://freeti.org/images/team/GR1.png" },
  { name: "Ir Advaxe Ndayisenga", role: "Chief Technology Officer", img: "https://freeti.org/teams/Advaxe.png" },
  { name: "Guy Eudes Barakana", role: "Chief Operating Officer", img: "https://freeti.org/images/team/GR5.png" },
  { name: "Fadette Munezero", role: "Public Relations Officer", img: "https://freeti.org/teams/Fadette.png" },
  { name: "IRANGABIYE Reine Délicia", role: "Director of Finance and Accounting", img: "https://freeti.org/teams/dede.png" },
  { name: "Digne Marie Grace Irakoze", role: "Projects Coordinator", img: "https://freeti.org/teams/didi.png" },
  { name: "Dushime Elina Chelsea", role: "Director of Development & Innovation", img: "https://freeti.org/teams/cheche.png" },
  { name: "Kessy Ardy Muheto", role: "Gitega Study Space Director", img: "https://freeti.org/teams/Kessy.png" },
  { name: "Francis W. Rumbete", role: "Marketing & Communications Officer", img: "https://freeti.org/teams/Rumbete.png" },
  { name: "Martha Benita Ikezwe", role: "Contributor", img: "https://freeti.org/teams/Martha.png" },
  { name: "Providence Muhire", role: "Editor In Chief", img: "https://freeti.org/teams/Providence.png" },
  { name: "Tony Parker", role: "Fullstack Developer", img: "https://freeti.org/teams/parker.jpg" },
  { name: "Jean Darcy Horanimana", role: "Contributor", img: "https://freeti.org/teams/darcy.jpg" },
  { name: "Clément Havyarimana", role: "Contributor", img: "https://freeti.org/teams/Cl%C3%A9ment.png" },
];

const OurTeam = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block px-4 py-1.5 rounded-full bg-cyan/15 text-cyan text-xs font-semibold tracking-widest uppercase mb-4 border border-cyan/20"
          >
            Meet Our Team
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-heading font-bold text-white mb-4"
          >
            Our Dedicated Team
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            Each member brings unique expertise and dedication, working together to empower our students through innovative learning and technology.
          </motion.p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="glass-card overflow-hidden group text-center"
              >
                <div className="h-64 overflow-hidden bg-section-alt">
                  <img
                    src={member.img}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-foreground text-sm">{member.name}</h3>
                  <p className="text-muted-foreground text-xs mt-1">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default OurTeam;
