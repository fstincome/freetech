import { useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Eye, Check, X, Lightbulb, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const T = {
  title: { fr: "Théorie du Changement", en: "Theory of Change", sw: "Nadharia ya Mabadiliko" },
  period: { fr: "Plan stratégique 2026 - 2031", en: "Strategic plan 2026 - 2031", sw: "Mpango mkakati 2026 - 2031" },
  axes: { fr: "Axes stratégiques", en: "Strategic axes", sw: "Nguzo za kimkakati" },
  logic: { fr: "Logique de changement", en: "Change logic", sw: "Mantiki ya mabadiliko" },
};

const axes = [
  ["Mission", "Pédagogie et accès", "Garantir à chaque jeune, quel que soit son point de départ, un accès réel à des compétences numériques pratiques et à des espaces d'apprentissage adaptés à son âge."],
  ["Mission", "Insertion économique et entrepreneuriat", "Structurer, au-delà de la formation, un accompagnement qui transforme concrètement les compétences numériques en emploi, en revenu ou en activité entrepreneuriale."],
  ["Interne", "Système de pilotage par les résultats (MEL)", "Passer d'un suivi des activités et du nombre de participants à un système de suivi-évaluation capable de démontrer les changements produits chez les jeunes."],
  ["Interne", "Gouvernance, leadership et capacité opérationnelle", "Réduire la dépendance envers le Directeur exécutif fondateur et sécuriser la capacité de l'organisation à absorber sa propre croissance."],
  ["Interne", "Modèle économique et gestion financière", "Diversifier durablement les revenus sans fragiliser la qualité de gestion financière déjà acquise."],
  ["Interne", "Consolider les acquis (communication, conformité, partenariats)", "Donner un espace explicite, avec des objectifs de maintien vérifiables, aux domaines déjà solides mais qui ne se maintiennent pas seuls dans un contexte de croissance."],
];

const volets = [
  {
    name: "Volet 1 (12-18 ans)",
    steps: [
      ["Problème central", "Les jeunes de cette tranche manquent de compétences de base, de confiance et d'orientation face au numérique."],
      ["Changement visé", "Les jeunes de 12-18 ans développent des compétences numériques de base, la confiance et l'orientation nécessaires pour envisager des parcours liés au numérique."],
      ["Effets directs", "Compétences numériques de base acquises ; confiance et curiosité renforcées ; orientation progressive vers des filières ou centres d'intérêt liés au numérique."],
      ["Effets indirects", "Davantage de jeunes poursuivent des études ou des filières liées au numérique en connaissance de cause ; certains envisagent une trajectoire professionnelle ou entrepreneuriale numérique."],
    ],
  },
  {
    name: "Volet 2 (18-35 ans)",
    steps: [
      ["Problème central", "Les jeunes de cette tranche manquent de compétences spécialisées, de réseaux et d'opportunités concrètes d'insertion professionnelle ou entrepreneuriale."],
      ["Changement visé", "Les jeunes de 18-35 ans transforment leurs compétences numériques en emploi, en revenu ou en activité entrepreneuriale."],
      ["Effets directs", "Compétences numériques spécialisées acquises ; accompagnement vers l'insertion professionnelle ou entrepreneuriale ; accès à des réseaux et partenaires."],
      ["Effets indirects", "Des jeunes obtiennent un emploi lié au numérique, génèrent un revenu ou développent une activité entrepreneuriale active ; certains créent des solutions répondant à des besoins réels de leur communauté."],
    ],
  },
];

const hypotheses = [
  "Les jeunes sont capables de transformer des compétences numériques en opportunités s'ils disposent d'un environnement favorable.",
  "Les compétences pratiques sont plus susceptibles d'être utilisées lorsqu'elles sont accompagnées de possibilités de mise en pratique.",
  "L'accompagnement et les réseaux augmentent la capacité des jeunes à passer de l'apprentissage à l'action.",
];

const TheoryOfChange = () => {
  const { lang } = useLanguage();
  const l = (o: Record<string, string>) => o[lang] || o.fr;
  useEffect(() => { window.scrollTo(0, 0); document.title = "Théorie du Changement | Free Tech Institute"; }, []);

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto space-y-16">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-cyan text-sm font-semibold uppercase tracking-widest">{l(T.period)}</p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mt-3">{l(T.title)}</h1>
      </motion.header>

      <section className="grid md:grid-cols-2 gap-6">
        {[[Eye, "Vision", "Un Burundi où chaque jeune transforme le numérique en revenu, en emploi et en pouvoir d'agir sur l'avenir de sa communauté."],
          [Target, "Mission", "Free Tech Institute donne aux jeunes Burundais l'accès aux compétences numériques, aux espaces d'apprentissage et aux opportunités dont ils ont besoin à chaque étape de leur parcours : la confiance et l'orientation pour les plus jeunes, l'emploi et l'entrepreneuriat pour les plus engagés dans la vie active."]]
          .map(([Icon, title, text]: any) => (
          <div key={title} className="p-6 rounded-2xl border border-border bg-card">
            <Icon className="w-7 h-7 text-cyan mb-3" />
            <h2 className="font-heading font-bold text-xl text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground leading-relaxed">{text}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">{l(T.axes)}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {axes.map(([type, name, obj], i) => (
            <div key={name} className="p-5 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-full bg-cyan/15 text-cyan font-bold flex items-center justify-center text-sm">{i + 1}</span>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">{type}</span>
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">{name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{obj}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">{l(T.logic)}</h2>
        <div className="space-y-8">
          {volets.map((v) => (
            <div key={v.name}>
              <h3 className="font-heading font-bold text-cyan mb-3">{v.name}</h3>
              <div className="grid md:grid-cols-4 gap-3">
                {v.steps.map(([h, t], i) => (
                  <div key={h} className="relative p-4 rounded-xl border border-border bg-card">
                    <p className="text-xs font-semibold uppercase text-cyan mb-2">{h}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t}</p>
                    {i < 3 && <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan bg-background rounded-full" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2"><Check className="text-cyan" />Ce que nous faisons</h3>
          <p className="text-muted-foreground leading-relaxed">Formations numériques pratiques différenciées par âge ; mise à disposition d'espaces d'apprentissage accessibles (Gitega Study Space, American Corner) ; accompagnement vers l'emploi et l'entrepreneuriat ; mise en relation avec des partenaires et des opportunités.</p>
        </div>
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2"><X className="text-destructive" />Ce que nous ne faisons pas</h3>
          <p className="text-muted-foreground leading-relaxed">Nous ne cherchons pas à former le plus grand nombre pour le nombre, le succès ne se mesure pas au nombre de formations ou de certificats ; nous ne nous limitons pas à fournir du matériel ou un accès à Internet, la technologie est un moyen et non une fin ; nous ne remplaçons pas les écoles classiques, nos formations sont orientées impact plutôt qu'académiques.</p>
        </div>
      </section>

      <section className="p-6 md:p-8 rounded-2xl bg-cyan/10 border border-cyan/30">
        <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2"><Lightbulb className="text-cyan" />Hypothèses clés</h3>
        <ol className="space-y-3">
          {hypotheses.map((h, i) => (
            <li key={i} className="flex gap-3 text-muted-foreground"><span className="font-bold text-cyan">{i + 1}.</span>{h}</li>
          ))}
        </ol>
        <p className="text-xs text-muted-foreground mt-6">Validé le 12-10-2026 · Prochaine révision : 2027</p>
      </section>
    </div>
  );
};

export default TheoryOfChange;
