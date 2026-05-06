import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Linkedin, Twitter, BookOpen } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
}

const SocialButtons = ({
  member,
  onStop,
  onReadBio,
}: {
  member: TeamMember;
  onStop: (e: React.MouseEvent) => void;
  onReadBio: (e: React.MouseEvent) => void;
}) => (
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
    <button
      type="button"
      onClick={onReadBio}
      aria-label={`Lire la bio de ${member.name}`}
      className="h-8 inline-flex items-center gap-1.5 px-3 rounded-full bg-cyan/10 text-cyan hover:bg-cyan hover:text-navy transition-colors text-xs font-semibold"
    >
      <BookOpen size={12} /> Read bio
    </button>
  </div>
);

const OurTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selected, setSelected] = useState<TeamMember | null>(null);

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
          {/* Board Members */}
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
                onClick={() => setSelected(member)}
                className="glass-card overflow-hidden group text-center border-2 border-cyan/30 cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-cyan"
              >
                <div className="h-72 overflow-hidden bg-section-alt">
                  <img src={member.image_url} alt={member.name} loading="lazy" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-heading font-bold text-foreground text-base">{member.name}</h3>
                  <p className="text-cyan text-xs mt-1 font-semibold">{member.role}</p>
                  <SocialButtons member={member} onStop={stop} onReadBio={(e) => { e.stopPropagation(); setSelected(member); }} />
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
                    onClick={() => setSelected(member)}
                    className="glass-card overflow-hidden group text-center cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-cyan"
                  >
                    <div className="h-64 overflow-hidden bg-section-alt">
                      <img src={member.image_url} alt={member.name} loading="lazy" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="font-heading font-bold text-foreground text-sm">{member.name}</h3>
                      <p className="text-muted-foreground text-xs mt-1">{member.role}</p>
                      <SocialButtons member={member} onStop={stop} onReadBio={(e) => { e.stopPropagation(); setSelected(member); }} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Bio Modal */}
      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="sm:max-w-md">
          {selected && (
            <>
              <div className="flex items-center gap-4">
                <img src={selected.image_url} alt={selected.name} className="h-20 w-20 rounded-full object-cover object-top border-2 border-cyan/30" />
                <div>
                  <DialogHeader className="text-left space-y-1">
                    <DialogTitle className="font-heading text-xl">{selected.name}</DialogTitle>
                    <DialogDescription className="text-cyan font-semibold text-xs uppercase tracking-wide">
                      {selected.role}
                    </DialogDescription>
                  </DialogHeader>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2 whitespace-pre-line">
                {selected.bio?.trim() ? selected.bio : "Aucune biographie disponible pour le moment."}
              </p>
              <div className="flex items-center gap-3 pt-2">
                {selected.linkedin_url && (
                  <a href={selected.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan hover:text-navy transition-colors text-sm font-semibold">
                    <Linkedin size={14} /> LinkedIn
                  </a>
                )}
                {selected.twitter_url && (
                  <a href={selected.twitter_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan hover:text-navy transition-colors text-sm font-semibold">
                    <Twitter size={14} /> Twitter
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OurTeam;
