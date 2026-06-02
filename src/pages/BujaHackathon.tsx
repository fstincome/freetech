import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bitcoin, Calendar, MapPin, Users, Zap, Trophy, CheckCircle2, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const stats = [
  { value: "30", label: "Participants" },
  { value: "2", label: "Hackathons" },
  { value: "3", label: "Workshops" },
  { value: "✓", label: "Prizes" },
];

const program = [
  { n: "01", title: "Bitcoin fundamentals", desc: "Permissionless P2P exchanges — no intermediaries, no KYC." },
  { n: "02", title: "Vexl & security", desc: "Intro to Vexl and security in decentralized systems." },
  { n: "03", title: "Node & Lightning", desc: "Spin up a Bitcoin Core node and Lightning SDKs live." },
  { n: "04", title: "Hackathon & pitches", desc: "Team formation, mentorship, final demos in front of a jury." },
];

const schedule = [
  { date: "05 JUNE 2026", title: "Hackathon #1", desc: "Building P2P Bitcoin tools — Vexl style" },
  { date: "06 JUNE 2026", title: "Hackathon #2", desc: "Lightning Network apps & pitch session" },
];

const outcomes = [
  "2 working P2P Bitcoin prototypes",
  "30 trained & certified participants",
  "70% interact with a Bitcoin Core node",
  "10+ P2P transactions during the event",
  "2 projects selected for post-hackathon mentorship",
];

const languagesList = [
  "JavaScript", "TypeScript", "Python", "Rust", "Go", "Java", "C", "C++", "C#",
  "PHP", "Ruby", "Kotlin", "Swift", "Dart", "Solidity", "HTML/CSS",
];

const regSchema = z.object({
  full_name: z.string().trim().min(1, "Required").max(120),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(40).optional().default(""),
  profession: z.string().trim().max(200).optional().default(""),
  bitcoin_level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  target_hackathon: z.enum(["both", "day1", "day2"]),
  specialty: z.enum(["Backend", "Frontend", "Full Stack"]),
  languages: z.array(z.string()).max(20),
  motivation: z.string().trim().max(2000).optional().default(""),
});

const MAX_SPOTS = 30;

const BujaHackathon = () => {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [accepted, setAccepted] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    profession: "",
    bitcoin_level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    target_hackathon: "both" as "both" | "day1" | "day2",
    specialty: "Full Stack" as "Backend" | "Frontend" | "Full Stack",
    languages: [] as string[],
    motivation: "",
  });

  useEffect(() => {
    supabase.from("hackathon_trainers" as any).select("*").order("sort_order").then(({ data }) => {
      if (data) setTrainers(data as any[]);
    });
    supabase
      .from("hackathon_registrations" as any)
      .select("id, full_name, profession, specialty, bitcoin_level, target_hackathon")
      .eq("status", "accepted")
      .order("created_at", { ascending: true })
      .then(({ data }) => setAccepted((data as any[]) || []));
  }, []);

  const isFull = accepted.length >= MAX_SPOTS;

  const toggleLang = (l: string) => {
    setForm((p) => ({
      ...p,
      languages: p.languages.includes(l) ? p.languages.filter((x) => x !== l) : [...p.languages, l],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = regSchema.safeParse(form);
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] || "Please check your inputs";
      toast({ title: "Form error", description: first, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("hackathon_registrations" as any).insert(parsed.data as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Application sent ✓", description: "We will contact you soon." });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="absolute top-4 left-4 z-50">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-background/70 backdrop-blur border border-border text-xs font-medium hover:text-cyan transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Free Tech Institute
        </Link>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden pt-28 pb-20 px-4 md:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-background to-amber-300/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(var(--cyan)/0.08),transparent_70%)]" />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs md:text-sm font-medium mb-6"
          >
            <MapPin size={14} /> Hôtel Emeraude · Bujumbura
            <span className="opacity-50">·</span>
            <Calendar size={14} /> June 5–6, 2026
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
            className="text-5xl md:text-7xl font-heading font-bold leading-[1.05] tracking-tight"
          >
            Bitcoin <span className="text-orange-500">P2P</span>
            <br />
            Hackathons
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Two days of hacking, three hands-on workshops, 30 developers. Let's build
            peer-to-peer Bitcoin exchanges — no intermediaries — powered by Vexl & the
            Lightning Network.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="#register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
            >
              <Zap size={16} /> Apply now
            </a>
            <a
              href="#program"
              className="px-6 py-3 rounded-full border border-border text-sm font-semibold hover:bg-accent transition-colors"
            >
              Explore the program
            </a>
          </motion.div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.4 + i * 0.08 } }}
                className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6"
              >
                <div className="text-4xl md:text-5xl font-heading font-bold text-orange-500">{s.value}</div>
                <div className="mt-2 text-[11px] tracking-[0.18em] uppercase text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section id="program" className="py-20 px-4 md:px-8 bg-section-alt">
        <div className="max-w-6xl mx-auto">
          <span className="text-orange-500 text-xs font-mono tracking-widest">// PROGRAM</span>
          <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold">From theory to practice</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Three preparatory workshops, followed by two full-day hackathons.
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            {program.map((p) => (
              <div
                key={p.n}
                className="group relative rounded-2xl border border-border bg-card p-6 hover:border-orange-500/50 transition-colors"
              >
                <div className="text-orange-500 font-mono text-sm mb-3">{p.n}</div>
                <h3 className="text-xl font-heading font-bold mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCHEDULE */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <span className="text-orange-500 text-xs font-mono tracking-widest">// SCHEDULE</span>
          <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold">Two days, two hackathons</h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {schedule.map((s) => (
              <div
                key={s.title}
                className="relative rounded-2xl border border-border bg-gradient-to-br from-orange-500/5 to-transparent p-8"
              >
                <div className="text-xs font-mono text-orange-500 tracking-widest">{s.date}</div>
                <h3 className="mt-3 text-2xl font-heading font-bold">{s.title}</h3>
                <p className="mt-2 text-muted-foreground">{s.desc}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                  <Trophy size={16} /> Prizes will be awarded to the best projects
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRAINERS */}
      <section className="py-20 px-4 md:px-8 bg-section-alt">
        <div className="max-w-6xl mx-auto">
          <span className="text-orange-500 text-xs font-mono tracking-widest">// TRAINERS</span>
          <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold">The team</h2>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {trainers.map((t) => (
              <div
                key={t.id}
                className="rounded-2xl border border-border bg-card overflow-hidden group hover:border-orange-500/50 transition-colors"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  {t.image_url && (
                    <img
                      src={t.image_url}
                      alt={t.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg">{t.name}</h3>
                  <div className="text-orange-500 text-xs font-mono tracking-wider mt-0.5">{t.role}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.bio}</p>
                  <div className="mt-4 flex gap-3 text-sm">
                    {t.twitter_url && (
                      <a href={t.twitter_url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors font-medium">
                        @x →
                      </a>
                    )}
                    {t.linkedin_url && (
                      <a href={t.linkedin_url} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors font-medium">
                        LinkedIn →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Remote guest speaker:</span> an online intervention from a Vexl representative.
          </p>
        </div>
      </section>

      {/* OUTCOMES */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <span className="text-orange-500 text-xs font-mono tracking-widest">// OUTCOMES</span>
            <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold">Expected outcomes</h2>
            <ul className="mt-8 space-y-3">
              {outcomes.map((o) => (
                <li key={o} className="flex items-start gap-3">
                  <CheckCircle2 className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-muted-foreground">{o}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-300/5 p-8 md:p-10 flex flex-col justify-center">
            <Bitcoin className="text-orange-500" size={40} />
            <h3 className="mt-4 text-2xl md:text-3xl font-heading font-bold">Join the cohort</h3>
            <p className="mt-2 text-muted-foreground">
              30 spots available. Secure yours and help build the future of peer-to-peer Bitcoin in Burundi.
            </p>
            <a
              href="#register"
              className="mt-6 inline-flex w-fit items-center gap-2 px-5 py-3 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
            >
              <Users size={16} /> Submit my application
            </a>
          </div>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <section id="register" className="py-20 px-4 md:px-8 bg-section-alt">
        <div className="max-w-3xl mx-auto">
          <span className="text-orange-500 text-xs font-mono tracking-widest">// APPLICATION</span>
          <h2 className="mt-2 text-3xl md:text-5xl font-heading font-bold">HACKATON BUJUMBURA registration</h2>
          <p className="mt-3 text-muted-foreground">
            30 spots. Workshops + 2 hackathons at Hôtel Emeraude, Bujumbura, June 5–6, 2026.
          </p>

          {submitted ? (
            <div className="mt-10 rounded-2xl border border-orange-500/40 bg-orange-500/10 p-8 text-center">
              <CheckCircle2 className="mx-auto text-orange-500" size={48} />
              <h3 className="mt-4 text-2xl font-heading font-bold">Application received!</h3>
              <p className="mt-2 text-muted-foreground">Thanks for applying. Our team will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Full name *</label>
                  <Input required maxLength={120} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email *</label>
                  <Input type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Phone</label>
                  <Input maxLength={40} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Profession / Student in</label>
                  <Input maxLength={200} value={form.profession} onChange={(e) => setForm({ ...form, profession: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Bitcoin/Dev level *</label>
                  <select
                    required
                    value={form.bitcoin_level}
                    onChange={(e) => setForm({ ...form, bitcoin_level: e.target.value as any })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Target hackathon *</label>
                  <select
                    required
                    value={form.target_hackathon}
                    onChange={(e) => setForm({ ...form, target_hackathon: e.target.value as any })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="both">Both (June 5 & 6)</option>
                    <option value="day1">Hackathon #1 — June 5</option>
                    <option value="day2">Hackathon #2 — June 6</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Developer specialty *</label>
                  <div className="flex flex-wrap gap-2">
                    {(["Backend", "Frontend", "Full Stack"] as const).map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setForm({ ...form, specialty: s })}
                        className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                          form.specialty === s
                            ? "bg-orange-500 text-white border-orange-500"
                            : "border-border hover:border-orange-500/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Languages you use</label>
                <p className="text-xs text-muted-foreground mb-2">Select all that apply</p>
                <div className="flex flex-wrap gap-2">
                  {languagesList.map((l) => (
                    <button
                      type="button"
                      key={l}
                      onClick={() => toggleLang(l)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                        form.languages.includes(l)
                          ? "bg-orange-500 text-white border-orange-500"
                          : "border-border hover:border-orange-500/50"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Motivation</label>
                <Textarea rows={4} maxLength={2000} value={form.motivation} onChange={(e) => setForm({ ...form, motivation: e.target.value })} />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 text-white hover:bg-orange-600 font-semibold"
              >
                {submitting ? <Loader2 size={16} className="mr-2 animate-spin" /> : <Zap size={16} className="mr-2" />}
                Send my application
              </Button>
            </form>
          )}
        </div>
      </section>

      <footer className="py-10 px-4 md:px-8 border-t border-border text-center text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Bitcoin size={16} className="text-orange-500" />
          <span>Hackaton Bujumbura — powered by Free Tech Institute</span>
        </div>
        <Link to="/" className="mt-3 inline-block hover:text-cyan transition-colors">
          ← Back to Free Tech Institute
        </Link>
      </footer>
    </div>
  );
};

export default BujaHackathon;
