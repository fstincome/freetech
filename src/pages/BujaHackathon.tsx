import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Bitcoin, Calendar, MapPin, Users, Zap, Trophy, CheckCircle2 } from "lucide-react";

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

const trainers = [
  {
    name: "Advaxe Ndayisenga",
    role: "Lead Trainer",
    bio: "Passionné par l'éducation Bitcoin et le développement communautaire en Afrique.",
    img: "https://lerdurdmbownqeaaiwmn.supabase.co/storage/v1/object/public/speakers/ddfa813d-08d7-43dc-864e-a839a344aa5a-1779953771912.JPG",
    x: "https://x.com/AdvaxeIr",
  },
  {
    name: "Belyi Nobel Kubwayo",
    role: "Trainer",
    bio: "Expert en développement logiciel et applications décentralisées.",
    img: "https://bujahackaton.lovable.app/speakers/belyi.png",
    x: "https://x.com/belyi_nobel",
  },
  {
    name: "Wilfried Cubahiro",
    role: "Trainer",
    bio: "Spécialiste en sécurité et infrastructure réseau.",
    img: "https://bujahackaton.lovable.app/speakers/wilfried.png",
  },
];

const outcomes = [
  "2 working P2P Bitcoin prototypes",
  "30 trained & certified participants",
  "70% interact with a Bitcoin Core node",
  "10+ P2P transactions during the event",
  "2 projects selected for post-hackathon mentorship",
];

const BujaHackathon = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Minimal top bar - just back to site link */}
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
              href="https://bujahackaton.lovable.app/register"
              target="_blank"
              rel="noopener noreferrer"
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

          {/* Stats */}
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
                key={t.name}
                className="rounded-2xl border border-border bg-card overflow-hidden group hover:border-orange-500/50 transition-colors"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg">{t.name}</h3>
                  <div className="text-orange-500 text-xs font-mono tracking-wider mt-0.5">{t.role}</div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t.bio}</p>
                  {t.x && (
                    <a
                      href={t.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium hover:text-orange-500 transition-colors"
                    >
                      @x →
                    </a>
                  )}
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
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://bujahackaton.lovable.app/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
              >
                <Users size={16} /> Submit my application
              </a>
              <a
                href="https://bujahackaton.lovable.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full border border-border text-sm font-semibold hover:bg-accent transition-colors"
              >
                Visit official site
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer mini */}
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
