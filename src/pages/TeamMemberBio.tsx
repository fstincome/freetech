import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Linkedin, Twitter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

const TeamMemberBio = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase.from("site_team_members").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setMember(data as TeamMember | null);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (member) document.title = `${member.name} – ${member.role} | FREETI`;
  }, [member]);

  return (
    <>
      <section className="relative pt-32 pb-12 bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan/5 to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <Link to="/our-team" className="inline-flex items-center gap-2 text-cyan hover:text-white transition-colors text-sm font-semibold">
            <ArrowLeft size={16} /> Back to team
          </Link>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : !member ? (
            <p className="text-muted-foreground">Member not found.</p>
          ) : (
            <article className="grid md:grid-cols-[260px_1fr] gap-8">
              <div>
                <img src={member.image_url} alt={member.name} className="w-full rounded-2xl object-cover object-top border-2 border-cyan/30" />
                <div className="flex items-center gap-3 mt-4">
                  {member.linkedin_url && (
                    <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan hover:text-navy transition-colors text-sm font-semibold">
                      <Linkedin size={14} /> LinkedIn
                    </a>
                  )}
                  {member.twitter_url && (
                    <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan hover:text-navy transition-colors text-sm font-semibold">
                      <Twitter size={14} /> Twitter
                    </a>
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{member.name}</h1>
                <p className="text-cyan font-semibold mt-2 uppercase tracking-wide text-sm">{member.role}</p>
                <div className="mt-6 text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {member.bio?.trim() ? member.bio : "Aucune biographie disponible pour le moment."}
                </div>
              </div>
            </article>
          )}
        </div>
      </section>
    </>
  );
};

export default TeamMemberBio;
