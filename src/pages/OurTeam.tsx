import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Linkedin, Twitter, BookOpen } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  is_board?: boolean;
  bio?: string;
  linkedin_url?: string;
  twitter_url?: string;
  slug?: string;
}

const SocialButtons = ({ member, onStop }: { member: TeamMember; onStop: (e: React.MouseEvent) => void }) => (
  <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
    {member.linkedin_url ? (
      <a
        href={member.linkedin_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onStop}
        aria-label={`LinkedIn de ${member.name}`}
        className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-cyan/10 text-cyan hover:bg-cyan hover:text-navy transition-colors"
      >
        <Linkedin size={14} />
      </a>
    ) : null}
    {member.twitter_url ? (
      <a
        href={member.twitter_url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onStop}
        aria-label={`Twitter de ${member.name}`}
        className="h-8 w-8 inline-flex items-center justify-center rounded-full bg-cyan/10 text-cyan hover:bg-cyan hover:text-navy transition-colors"
      >
        <Twitter size={14} />
      </a>
    ) : null}
    <Link
      to={`/our-team/${member.slug || member.id}`}
      onClick={onStop}
      aria-label={`Lire la bio de ${member.name}`}
      className="h-8 inline-flex items-center gap-1.5 px-3 rounded-full bg-cyan/10 text-cyan hover:bg-cyan hover:text-navy transition-colors text-xs font-semibold"
    >
      <BookOpen size={12} /> Read bio
    </Link>
  </div>
);

const OurTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("site_team_members").select("*").order("sort_order").then(({ data }) => {
      if (data) setTeamMembers(data as TeamMember[]);
    });
  }, []);

  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const board = teamMembers.filter(m => m.is_board);
  const team = teamMembers.filter(m => !m.is_board);

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
          <SectionHeading label="Leadership" title="Board Members" description="Our executive board guiding FREETI's vision and strategy." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {board.map((member, i) => (
              <motion.button
                type="button"
                key={member.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                onClick={() => navigate(`/our-team/${member.slug || member.id}`)}
                className="glass-card overflow-hidden group text-center border-2 border-cyan/30 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-cyan"
              >
                <div className="h-72 overflow-hidden bg-section-alt">
                  <img src={member.image_url} alt={member.name} loading="lazy" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-heading font-bold text-foreground text-base">{member.name}</h3>
                  <p className="text-cyan text-xs mt-1 font-semibold">{member.role}</p>
                  <SocialButtons member={member} onStop={stop} />
                </div>
              </motion.button>
            ))}
          </div>

          {team.length > 0 && (
            <div className="my-16 flex items-center gap-4" aria-hidden="true">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
              <span className="text-cyan font-heading font-semibold text-xs tracking-widest uppercase">Our Team</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan to-transparent" />
            </div>
          )}

          {team.length > 0 && (
            <>
              <SectionHeading label="The Team" title="Meet The Rest of The Team" description="Talented individuals dedicated to making a difference." />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {team.map((member, i) => (
                  <motion.button
                    type="button"
                    key={member.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    onClick={() => navigate(`/our-team/${member.slug || member.id}`)}
                    className="glass-card overflow-hidden group text-center cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-cyan"
                  >
                    <div className="h-64 overflow-hidden bg-section-alt">
                      <img src={member.image_url} alt={member.name} loading="lazy" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="font-heading font-bold text-foreground text-sm">{member.name}</h3>
                      <p className="text-muted-foreground text-xs mt-1">{member.role}</p>
                      <SocialButtons member={member} onStop={stop} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default OurTeam;
