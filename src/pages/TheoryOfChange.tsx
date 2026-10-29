import { useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Eye, Check, X, Lightbulb, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type L = Record<string, string>;
type L3 = [L, L, L];

const T = {
  title: { fr: "Théorie du Changement", en: "Theory of Change", sw: "Nadharia ya Mabadiliko" },
  period: { fr: "Plan stratégique 2026 - 2031", en: "Strategic plan 2026 - 2031", sw: "Mpango mkakati 2026 - 2031" },
  axes: { fr: "Axes stratégiques", en: "Strategic axes", sw: "Nguzo za kimkakati" },
  logic: { fr: "Logique de changement", en: "Change logic", sw: "Mantiki ya mabadiliko" },
  vision: { fr: "Vision", en: "Vision", sw: "Dira" },
  mission: { fr: "Mission", en: "Mission", sw: "Dhamira" },
  visionText: {
    fr: "Un Burundi où chaque jeune transforme le numérique en revenu, en emploi et en pouvoir d'agir sur l'avenir de sa communauté.",
    en: "A Burundi where every young person turns digital skills into income, employment and the power to shape their community's future.",
    sw: "Burundi ambapo kila kijana hubadilisha ujuzi wa kidijitali kuwa kipato, ajira na uwezo wa kuunda mustakabali wa jamii yake.",
  },
  missionText: {
    fr: "Free Tech Institute donne aux jeunes Burundais l'accès aux compétences numériques, aux espaces d'apprentissage et aux opportunités dont ils ont besoin à chaque étape de leur parcours : la confiance et l'orientation pour les plus jeunes, l'emploi et l'entrepreneuriat pour les plus engagés dans la vie active.",
    en: "Free Tech Institute gives Burundian youth access to the digital skills, learning spaces and opportunities they need at every step of their journey: confidence and guidance for the youngest, employment and entrepreneurship for those entering working life.",
    sw: "Free Tech Institute inawapa vijana wa Burundi ujuzi wa kidijitali, nafasi za kujifunzia na fursa wanazohitaji katika kila hatua ya safari yao: ujasiri na uongozi kwa vijana mdogo, ajira na ujasiriamali kwa wanaoingia maisha ya kazi.",
  },
  missionTag: { fr: "Mission", en: "Mission", sw: "Dhamira" },
  internalTag: { fr: "Interne", en: "Internal", sw: "Ndani" },
  weDo: { fr: "Ce que nous faisons", en: "What we do", sw: "Tunachofanya" },
  weDont: { fr: "Ce que nous ne faisons pas", en: "What we don't do", sw: "Tusichofanya" },
  weDoText: {
    fr: "Formations numériques pratiques différenciées par âge ; mise à disposition d'espaces d'apprentissage accessibles (Gitega Study Space, American Corner) ; accompagnement vers l'emploi et l'entrepreneuriat ; mise en relation avec des partenaires et des opportunités.",
    en: "Practical digital training tailored by age; access to open learning spaces (Gitega Study Space, American Corner); support towards employment and entrepreneurship; connections with partners and opportunities.",
    sw: "Mafunzo ya vitendo ya kidijitali kulingana na umri; kutoa nafasi za kujifunzia zinazopatikana (Gitega Study Space, American Corner); uongozi kuelekea ajira na ujasiriamali; kuunganisha na washirika na fursa.",
  },
  weDontText: {
    fr: "Nous ne cherchons pas à former le plus grand nombre pour le nombre, le succès ne se mesure pas au nombre de formations ou de certificats ; nous ne nous limitons pas à fournir du matériel ou un accès à Internet, la technologie est un moyen et non une fin ; nous ne remplaçons pas les écoles classiques, nos formations sont orientées impact plutôt qu'académiques.",
    en: "We do not train the largest numbers for numbers' sake — success is not measured by the number of courses or certificates; we do not limit ourselves to providing equipment or Internet access — technology is a means, not an end; we do not replace traditional schools — our training is impact-oriented rather than academic.",
    sw: "Hatulengi kufundisha idadi kubwa kwa ajili ya idadi — mafanikio hayapimwi kwa idadi ya mafunzo au vyeti; hatujikiti katika kutoa vifaa au mtandao — teknolojia ni njia, si lengo; hatuchukui nafasi ya shule za kawaida — mafunzo yetu yanalenga athari badala ya masomo ya kitaaluma.",
  },
  hypothesesTitle: { fr: "Hypothèses clés", en: "Key assumptions", sw: "Mawazo muhimu" },
  validated: {
    fr: "Validé le 12-10-2026 · Prochaine révision : 2027",
    en: "Validated on 12-10-2026 · Next review: 2027",
    sw: "Imethibitishwa tarehe 12-10-2026 · Mapitio yajayo: 2027",
  },
};

const axes: L3[] = [
  [
    { fr: "Pédagogie et accès", en: "Pedagogy and access", sw: "Ufundishaji na upatikanaji" },
    { fr: "Garantir à chaque jeune, quel que soit son point de départ, un accès réel à des compétences numériques pratiques et à des espaces d'apprentissage adaptés à son âge.", en: "Guarantee every young person, whatever their starting point, real access to practical digital skills and learning spaces suited to their age.", sw: "Kuhakikisha kila kijana, hata awe ameanza wapi, anapata ujuzi wa vitendo wa kidijitali na nafasi za kujifunzia zinazofaa umri wake." },
    T.missionTag,
  ],
  [
    { fr: "Insertion économique et entrepreneuriat", en: "Economic integration and entrepreneurship", sw: "Uingizaji kiuchumi na ujasiriamali" },
    { fr: "Structurer, au-delà de la formation, un accompagnement qui transforme concrètement les compétences numériques en emploi, en revenu ou en activité entrepreneuriale.", en: "Beyond training, structure support that concretely turns digital skills into employment, income or entrepreneurial activity.", sw: "Zaidi ya mafunzo, kuandaa uongozi unaobadilisha ujuzi wa kidijitali kuwa ajira, kipato au shughuli za ujasiriamali." },
    T.missionTag,
  ],
  [
    { fr: "Système de pilotage par les résultats (MEL)", en: "Results-based management system (MEL)", sw: "Mfumo wa uongozi kwa matokeo (MEL)" },
    { fr: "Passer d'un suivi des activités et du nombre de participants à un système de suivi-évaluation capable de démontrer les changements produits chez les jeunes.", en: "Move from tracking activities and participant numbers to a monitoring and evaluation system able to demonstrate the changes produced in young people.", sw: "Kuondoka katika kufuatilia shughuli na idadi ya washiriki hadi mfumo wa ufuatiliaji na tathmini unaoweza kuonyesha mabadiliko kwa vijana." },
    T.internalTag,
  ],
  [
    { fr: "Gouvernance, leadership et capacité opérationnelle", en: "Governance, leadership and operational capacity", sw: "Utawala, uongozi na uwezo wa kazi" },
    { fr: "Réduire la dépendance envers le Directeur exécutif fondateur et sécuriser la capacité de l'organisation à absorber sa propre croissance.", en: "Reduce dependence on the founding Executive Director and secure the organisation's capacity to absorb its own growth.", sw: "Kupunguza utegemezi kwa Mkurugenzi Mtendaji mwanzilishi na kuhakikisha uwezo wa shirika kustahimili ukuaji wake." },
    T.internalTag,
  ],
  [
    { fr: "Modèle économique et gestion financière", en: "Economic model and financial management", sw: "Muundo wa kiuchumi na usimamizi wa fedha" },
    { fr: "Diversifier durablement les revenus sans fragiliser la qualité de gestion financière déjà acquise.", en: "Sustainably diversify revenue without weakening the financial management quality already achieved.", sw: "Kutafuta vyanzo mbalimbali vya mapato kwa kudumu bila kudhoofisha ubora wa usimamizi wa fedha uliopatikana." },
    T.internalTag,
  ],
  [
    { fr: "Consolider les acquis (communication, conformité, partenariats)", en: "Consolidate achievements (communication, compliance, partnerships)", sw: "Kuimarisha mafanikio (mawasiliano, uzingatiaji, ushirikiano)" },
    { fr: "Donner un espace explicite, avec des objectifs de maintien vérifiables, aux domaines déjà solides mais qui ne se maintiennent pas seuls dans un contexte de croissance.", en: "Give explicit space, with verifiable maintenance objectives, to areas that are already strong but do not sustain themselves in a growth context.", sw: "Kutoa nafasi wazi, yenye malengo yanayothibitishwa, kwa nyanja zenye nguvu lakini zisizojitegemea katika mazingira ya ukuaji." },
    T.internalTag,
  ],
];

const stepLabels = {
  problem: { fr: "Problème central", en: "Core problem", sw: "Tatizo kuu" },
  change: { fr: "Changement visé", en: "Intended change", sw: "Mabadiliko yanayolengwa" },
  direct: { fr: "Effets directs", en: "Direct effects", sw: "Athari za moja kwa moja" },
  indirect: { fr: "Effets indirects", en: "Indirect effects", sw: "Athari zisizo za moja kwa moja" },
};

const volets = [
  {
    name: { fr: "Volet 1 (12-18 ans)", en: "Component 1 (ages 12-18)", sw: "Sehemu ya 1 (umri 12-18)" },
    steps: [
      [stepLabels.problem, { fr: "Les jeunes de cette tranche manquent de compétences de base, de confiance et d'orientation face au numérique.", en: "Young people in this age group lack basic skills, confidence and guidance when it comes to digital technology.", sw: "Vijana wa kikundi hiki hawana ujuzi wa msingi, ujasiri na uongozi kuhusu teknolojia ya kidijitali." }],
      [stepLabels.change, { fr: "Les jeunes de 12-18 ans développent des compétences numériques de base, la confiance et l'orientation nécessaires pour envisager des parcours liés au numérique.", en: "Young people aged 12-18 develop basic digital skills, the confidence and the guidance needed to consider digital-related paths.", sw: "Vijana wa umri 12-18 hupata ujuzi wa msingi wa kidijitali, ujasiri na uongozi unaohitajika kufikiria njia za kidijitali." }],
      [stepLabels.direct, { fr: "Compétences numériques de base acquises ; confiance et curiosité renforcées ; orientation progressive vers des filières ou centres d'intérêt liés au numérique.", en: "Basic digital skills acquired; confidence and curiosity strengthened; gradual orientation towards digital-related fields or interests.", sw: "Ujuzi wa msingi wa kidijitali umepatikana; ujasiri na udadisi vimeimarishwa; uongozi wa hatua kwa hatua kuelekea nyanja za kidijitali." }],
      [stepLabels.indirect, { fr: "Davantage de jeunes poursuivent des études ou des filières liées au numérique en connaissance de cause ; certains envisagent une trajectoire professionnelle ou entrepreneuriale numérique.", en: "More young people knowingly pursue digital-related studies or fields; some consider a digital professional or entrepreneurial path.", sw: "Vijana wengi zaidi wanaendelea na masomo ya kidijitali kwa ufahamu; wengine wanafikiria njia ya kitaaluma au ujasiriamali wa kidijitali." }],
    ],
  },
  {
    name: { fr: "Volet 2 (18-35 ans)", en: "Component 2 (ages 18-35)", sw: "Sehemu ya 2 (umri 18-35)" },
    steps: [
      [stepLabels.problem, { fr: "Les jeunes de cette tranche manquent de compétences spécialisées, de réseaux et d'opportunités concrètes d'insertion professionnelle ou entrepreneuriale.", en: "Young people in this age group lack specialised skills, networks and concrete opportunities for professional or entrepreneurial integration.", sw: "Vijana wa kikundi hiki hawana ujuzi maalum, mitandao na fursa halisi za kuingia katika kazi au ujasiriamali." }],
      [stepLabels.change, { fr: "Les jeunes de 18-35 ans transforment leurs compétences numériques en emploi, en revenu ou en activité entrepreneuriale.", en: "Young people aged 18-35 turn their digital skills into employment, income or entrepreneurial activity.", sw: "Vijana wa umri 18-35 hubadilisha ujuzi wao wa kidijitali kuwa ajira, kipato au shughuli za ujasiriamali." }],
      [stepLabels.direct, { fr: "Compétences numériques spécialisées acquises ; accompagnement vers l'insertion professionnelle ou entrepreneuriale ; accès à des réseaux et partenaires.", en: "Specialised digital skills acquired; support towards professional or entrepreneurial integration; access to networks and partners.", sw: "Ujuzi maalum wa kidijitali umepatikana; uongozi kuelekea kazi au ujasiriamali; upatikanaji wa mitandao na washirika." }],
      [stepLabels.indirect, { fr: "Des jeunes obtiennent un emploi lié au numérique, génèrent un revenu ou développent une activité entrepreneuriale active ; certains créent des solutions répondant à des besoins réels de leur communauté.", en: "Young people obtain digital-related jobs, generate income or develop active entrepreneurial ventures; some create solutions addressing real needs of their community.", sw: "Vijana hupata ajira za kidijitali, hupata kipato au huendeleza shughuli za ujasiriamali; wengine huunda suluhisho zinazokidhi mahitaji halisi ya jamii yao." }],
    ],
  },
];

const hypotheses: L[] = [
  { fr: "Les jeunes sont capables de transformer des compétences numériques en opportunités s'ils disposent d'un environnement favorable.", en: "Young people are able to turn digital skills into opportunities when they have a supportive environment.", sw: "Vijana wanaweza kubadilisha ujuzi wa kidijitali kuwa fursa ikiwa wana mazingira yanayowezesha." },
  { fr: "Les compétences pratiques sont plus susceptibles d'être utilisées lorsqu'elles sont accompagnées de possibilités de mise en pratique.", en: "Practical skills are more likely to be used when they come with opportunities to put them into practice.", sw: "Ujuzi wa vitendo hutumika zaidi unapoambatana na fursa za kuutumia." },
  { fr: "L'accompagnement et les réseaux augmentent la capacité des jeunes à passer de l'apprentissage à l'action.", en: "Support and networks increase young people's capacity to move from learning to action.", sw: "Uongozi na mitandao huongeza uwezo wa vijana kuhamia kutoka kujifunza hadi kutenda." },
];

const TheoryOfChange = () => {
  const { lang } = useLanguage();
  const l = (o: L) => o[lang] || o.fr;
  useEffect(() => { window.scrollTo(0, 0); document.title = "Théorie du Changement | Free Tech Institute"; }, []);

  return (
    <div className="pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto space-y-16">
      <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <p className="text-cyan text-sm font-semibold uppercase tracking-widest">{l(T.period)}</p>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mt-3">{l(T.title)}</h1>
      </motion.header>

      <section className="grid md:grid-cols-2 gap-6">
        {[[Eye, T.vision, T.visionText], [Target, T.mission, T.missionText]].map(([Icon, title, text]: any) => (
          <div key={l(title)} className="p-6 rounded-2xl border border-border bg-card">
            <Icon className="w-7 h-7 text-cyan mb-3" />
            <h2 className="font-heading font-bold text-xl text-foreground mb-2">{l(title)}</h2>
            <p className="text-muted-foreground leading-relaxed">{l(text)}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">{l(T.axes)}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {axes.map(([name, obj, type], i) => (
            <div key={i} className="p-5 rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-full bg-cyan/15 text-cyan font-bold flex items-center justify-center text-sm">{i + 1}</span>
                <span className="text-xs uppercase tracking-wide text-muted-foreground">{l(type)}</span>
              </div>
              <h3 className="font-heading font-semibold text-foreground mb-2">{l(name)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{l(obj)}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-6">{l(T.logic)}</h2>
        <div className="space-y-8">
          {volets.map((v, vi) => (
            <div key={vi}>
              <h3 className="font-heading font-bold text-cyan mb-3">{l(v.name)}</h3>
              <div className="grid md:grid-cols-4 gap-3">
                {v.steps.map(([h, t], i) => (
                  <div key={i} className="relative p-4 rounded-xl border border-border bg-card">
                    <p className="text-xs font-semibold uppercase text-cyan mb-2">{l(h as L)}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{l(t as L)}</p>
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
          <h3 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2"><Check className="text-cyan" />{l(T.weDo)}</h3>
          <p className="text-muted-foreground leading-relaxed">{l(T.weDoText)}</p>
        </div>
        <div className="p-6 rounded-2xl border border-border bg-card">
          <h3 className="font-heading font-bold text-foreground mb-3 flex items-center gap-2"><X className="text-destructive" />{l(T.weDont)}</h3>
          <p className="text-muted-foreground leading-relaxed">{l(T.weDontText)}</p>
        </div>
      </section>

      <section className="p-6 md:p-8 rounded-2xl bg-cyan/10 border border-cyan/30">
        <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2"><Lightbulb className="text-cyan" />{l(T.hypothesesTitle)}</h3>
        <ol className="space-y-3">
          {hypotheses.map((h, i) => (
            <li key={i} className="flex gap-3 text-muted-foreground"><span className="font-bold text-cyan">{i + 1}.</span>{l(h)}</li>
          ))}
        </ol>
        <p className="text-xs text-muted-foreground mt-6">{l(T.validated)}</p>
      </section>
    </div>
  );
};

export default TheoryOfChange;
