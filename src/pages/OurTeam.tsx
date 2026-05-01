import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

const OurTeam = () => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("site_team_members").select("*").order("sort_order").then(({ data }) => {
      if (data) setTeamMembers(data);
    });
  }, []);

  return (
    <>
      <section className="relative pt-32 pb-20 bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block px-4 py-1.5 rounded-full bg-cyan/15 text-cyan text-xs font-semibold tracking-widest uppercase mb-4 border border-cyan/20">
            Meet Our Team
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl md:text-6xl font-heading font-bold text-white mb-4">
            Our Dedicated Team
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-white/70 text-lg max-w-2xl mx-auto">
            Each member brings unique expertise and dedication, working together to empower our students through innovative learning and technology.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {(() => {
            const board = teamMembers.filter(m => m.is_board);
            const team = teamMembers.filter(m => !m.is_board);
            return (
              <>
                {/* Board Members */}
                <SectionHeading label="Leadership" title="Board Members" description="Our executive board guiding FREETI's vision and strategy." />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                  {board.map((member, i) => (
                    <motion.div key={member.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card overflow-hidden group text-center border-2 border-cyan/30">
                      <div className="h-72 overflow-hidden bg-section-alt">
                        <img src={member.image_url} alt={member.name} loading="lazy" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading font-bold text-foreground text-base">{member.name}</h3>
                        <p className="text-cyan text-xs mt-1 font-semibold">{member.role}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Visible Separator */}
                {team.length > 0 && (
                  <div className="my-16 flex items-center gap-4" aria-hidden="true">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
                    <span className="text-cyan font-heading font-semibold text-xs tracking-widest uppercase">Our Team</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
                  </div>
                )}

                {/* Team Members */}
                {team.length > 0 && (
                  <>
                    <SectionHeading label="The Team" title="Meet The Rest of The Team" description="Talented individuals dedicated to making a difference." />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {team.map((member, i) => (
                        <motion.div key={member.id} custom={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glass-card overflow-hidden group text-center">
                          <div className="h-64 overflow-hidden bg-section-alt">
                            <img src={member.image_url} alt={member.name} loading="lazy" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-5">
                            <h3 className="font-heading font-bold text-foreground text-sm">{member.name}</h3>
                            <p className="text-muted-foreground text-xs mt-1">{member.role}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </>
            );
          })()}
        </div>
      </section>
    </>
  );
};

export default OurTeam;
