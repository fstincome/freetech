import { createContext, useContext, useState, ReactNode } from "react";

export type Lang = "en" | "fr" | "sw";

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { en: "Home", fr: "Accueil", sw: "Nyumbani" },
  "nav.approach": { en: "Our Approach", fr: "Notre Approche", sw: "Mbinu Yetu" },
  "nav.about": { en: "Who We Are", fr: "Qui Sommes-Nous", sw: "Sisi Ni Nani" },
  "nav.programs": { en: "Programs", fr: "Programmes", sw: "Programu" },
  "nav.workshops": { en: "Workshops", fr: "Ateliers", sw: "Warsha" },
  "nav.events": { en: "Events", fr: "Événements", sw: "Matukio" },
  "nav.partners": { en: "Partners", fr: "Partenaires", sw: "Washirika" },
  "nav.impact": { en: "Impact", fr: "Impact", sw: "Athari" },
  "nav.testimonials": { en: "Testimonials", fr: "Témoignages", sw: "Ushuhuda" },
  "nav.hub": { en: "Our Digital Hub", fr: "Notre Hub Digital", sw: "Kituo Chetu cha Dijitali" },
  "nav.team": { en: "Team", fr: "Équipe", sw: "Timu" },
  "nav.blog": { en: "Read our blog", fr: "Lire notre blog", sw: "Soma blogu yetu" },

  // Hero
  "hero.cta1": { en: "Read more", fr: "En savoir plus", sw: "Soma zaidi" },
  "hero.cta2": { en: "Our Packages", fr: "Nos Offres", sw: "Vifurushi Vyetu" },
  "hero.slide1.label": { en: "Digital inclusion", fr: "Inclusion numérique", sw: "Ujumuishaji wa dijitali" },
  "hero.slide1.title": { en: "Empowering Burundi's youth through digital inclusion", fr: "Autonomiser la jeunesse burundaise par l'inclusion numérique", sw: "Kuwawezesha vijana wa Burundi kupitia ujumuishaji wa dijitali" },
  "hero.slide1.subtitle": { en: "Discover the Power of Open Technology", fr: "Découvrez la puissance de la technologie ouverte", sw: "Gundua nguvu ya teknolojia huria" },
  "hero.slide1.desc": { en: "Free Tech Institute is building a generation that is aware, skilled, and ready to harness decentralized technologies like Bitcoin, blockchain, and open finance.", fr: "Free Tech Institute construit une génération consciente, qualifiée et prête à exploiter les technologies décentralisées comme Bitcoin, blockchain et la finance ouverte.", sw: "Free Tech Institute inajenga kizazi kinachojua, chenye ujuzi, na kilicho tayari kutumia teknolojia za ugatuzi kama Bitcoin, blockchain, na fedha huria." },
  "hero.slide2.label": { en: "Decentralized technologies", fr: "Technologies décentralisées", sw: "Teknolojia za ugatuzi" },
  "hero.slide2.title": { en: "Bridging the digital divide and preparing tomorrow's innovators", fr: "Combler le fossé numérique et préparer les innovateurs de demain", sw: "Kuziba pengo la dijitali na kuandaa wabunifu wa kesho" },
  "hero.slide2.subtitle": { en: "Practical knowledge to transform local reality", fr: "Des connaissances pratiques pour transformer la réalité locale", sw: "Maarifa ya vitendo kubadilisha hali halisi ya ndani" },
  "hero.slide2.desc": { en: "With hands-on trainings, workshops, and accessible content, Free Tech Institute makes technology easy to understand and use for everyone.", fr: "Avec des formations pratiques, des ateliers et du contenu accessible, Free Tech Institute rend la technologie facile à comprendre et à utiliser pour tous.", sw: "Kwa mafunzo ya vitendo, warsha, na maudhui yanayopatikana, Free Tech Institute inafanya teknolojia iwe rahisi kueleweka na kutumiwa na kila mtu." },
  "hero.slide3.label": { en: "Open Finance", fr: "Finance Ouverte", sw: "Fedha Huria" },
  "hero.slide3.title": { en: "Building digital independence for every Burundian", fr: "Construire l'indépendance numérique pour chaque Burundais", sw: "Kujenga uhuru wa dijitali kwa kila Mburundi" },
  "hero.slide3.subtitle": { en: "Freedom through technology and knowledge", fr: "La liberté par la technologie et le savoir", sw: "Uhuru kupitia teknolojia na maarifa" },
  "hero.slide3.desc": { en: "From creating secure Bitcoin wallets to learning about online privacy, we guide every Burundian toward greater control of their digital future.", fr: "De la création de portefeuilles Bitcoin sécurisés à l'apprentissage de la confidentialité en ligne, nous guidons chaque Burundais vers un meilleur contrôle de son avenir numérique.", sw: "Kutoka kuunda pochi salama za Bitcoin hadi kujifunza kuhusu faragha mtandaoni, tunaongoza kila Mburundi kuelekea udhibiti mkubwa zaidi wa mustakabali wao wa dijitali." },

  // Approach
  "approach.label": { en: "Our Approach", fr: "Notre Approche", sw: "Mbinu Yetu" },
  "approach.title": { en: "Progressive & Human-Centered", fr: "Progressive et Centrée sur l'Humain", sw: "Hatua kwa Hatua na Inayozingatia Binadamu" },
  "approach.desc": { en: "At FREETI, we believe that transformation happens through a progressive and human-centered approach:", fr: "Chez FREETI, nous croyons que la transformation passe par une approche progressive et centrée sur l'humain :", sw: "Katika FREETI, tunaamini kuwa mabadiliko hutokea kupitia mbinu ya hatua kwa hatua inayozingatia binadamu:" },
  "approach.detect": { en: "Detect", fr: "Détecter", sw: "Gundua" },
  "approach.detect.short": { en: "How we do it", fr: "Comment nous le faisons", sw: "Jinsi tunavyofanya" },
  "approach.detect.detail": { en: "We identify promising youth across Burundi's provinces by partnering with schools, community centers, and local leaders. Through outreach programs and assessments, we evaluate their digital needs, potential, and readiness to engage with technology. This step ensures our resources reach those who need them most.", fr: "Nous identifions les jeunes prometteurs à travers les provinces du Burundi en collaborant avec les écoles, les centres communautaires et les leaders locaux. Grâce à des programmes de sensibilisation et des évaluations, nous évaluons leurs besoins numériques, leur potentiel et leur préparation à s'engager dans la technologie.", sw: "Tunatambua vijana wenye ahadi katika mikoa ya Burundi kwa kushirikiana na shule, vituo vya jamii, na viongozi wa ndani. Kupitia programu za kufikia na tathmini, tunatathmini mahitaji yao ya dijitali, uwezo, na utayari wa kushiriki na teknolojia." },
  "approach.instill": { en: "Instill", fr: "Inculquer", sw: "Kuingiza" },
  "approach.instill.short": { en: "Our process", fr: "Notre processus", sw: "Mchakato wetu" },
  "approach.instill.detail": { en: "Through hands-on training sessions, workshops, and bootcamps, we provide practical skills in digital literacy, blockchain technology, Bitcoin, cybersecurity, and open-source development. Our curriculum is designed to be accessible, engaging, and relevant to the Burundian context.", fr: "À travers des sessions de formation pratiques, des ateliers et des bootcamps, nous fournissons des compétences pratiques en littératie numérique, technologie blockchain, Bitcoin, cybersécurité et développement open-source. Notre programme est conçu pour être accessible, engageant et pertinent dans le contexte burundais.", sw: "Kupitia vikao vya mafunzo ya vitendo, warsha, na bootcamp, tunatoa ujuzi wa vitendo katika ujuzi wa dijitali, teknolojia ya blockchain, Bitcoin, usalama wa mtandao, na maendeleo ya chanzo huria." },
  "approach.guide": { en: "Guide", fr: "Guider", sw: "Ongoza" },
  "approach.guide.short": { en: "How it works", fr: "Comment ça marche", sw: "Jinsi inavyofanya kazi" },
  "approach.guide.detail": { en: "We mentor and support learners as they build real projects, launch initiatives, and enter the workforce. From co-founding digital clubs to creating innovative solutions, our graduates are empowered to become leaders in their communities and champions of digital inclusion.", fr: "Nous mentorons et soutenons les apprenants alors qu'ils construisent de vrais projets, lancent des initiatives et entrent sur le marché du travail. De la co-fondation de clubs numériques à la création de solutions innovantes, nos diplômés sont habilités à devenir des leaders dans leurs communautés.", sw: "Tunawaongoza na kuwasaidia wanafunzi wanapokuwa wanajenga miradi halisi, kuzindua mipango, na kuingia katika nguvu kazi. Kutoka kuanzisha klabu za dijitali hadi kuunda suluhisho za ubunifu, wahitimu wetu wanawezeshwa kuwa viongozi katika jamii zao." },

  // Who We Are
  "about.label": { en: "Who We Are", fr: "Qui Sommes-Nous", sw: "Sisi Ni Nani" },
  "about.title": { en: "Free Tech Institute", fr: "Free Tech Institute", sw: "Free Tech Institute" },
  "about.p1": { en: "Free Tech Institute (FREETI) is a non-profit organization promoting digital inclusion and technological freedom in Burundi.", fr: "Free Tech Institute (FREETI) est une organisation à but non lucratif qui promeut l'inclusion numérique et la liberté technologique au Burundi.", sw: "Free Tech Institute (FREETI) ni shirika lisilo la faida linalohamasisha ujumuishaji wa dijitali na uhuru wa kiteknolojia nchini Burundi." },
  "about.p2": { en: "We train and inspire young people to use technology as a tool for innovation, entrepreneurship, and community development.", fr: "Nous formons et inspirons les jeunes à utiliser la technologie comme outil d'innovation, d'entrepreneuriat et de développement communautaire.", sw: "Tunafundisha na kuhamasisha vijana kutumia teknolojia kama chombo cha uvumbuzi, ujasiriamali, na maendeleo ya jamii." },
  "about.p3": { en: "Through workshops, hackathons, bootcamps, and conferences, we aim to bridge the digital divide, enhance creativity, and foster innovation so that technology becomes a driver of social and economic progress.", fr: "À travers des ateliers, hackathons, bootcamps et conférences, nous visons à combler le fossé numérique, stimuler la créativité et favoriser l'innovation afin que la technologie devienne un moteur de progrès social et économique.", sw: "Kupitia warsha, hackathon, bootcamp, na mikutano, tunalenga kuziba pengo la dijitali, kuimarisha ubunifu, na kukuza uvumbuzi ili teknolojia iwe chachu ya maendeleo ya kijamii na kiuchumi." },
  "about.vision": { en: "Vision", fr: "Vision", sw: "Maono" },
  "about.vision.desc": { en: "To build an inclusive and digitally empowered Burundi where every individual has equal access to opportunities, embraces innovation, and contributes to a free, connected, and prosperous society.", fr: "Construire un Burundi inclusif et numériquement autonome où chaque individu a un accès égal aux opportunités, embrasse l'innovation et contribue à une société libre, connectée et prospère.", sw: "Kujenga Burundi jumuishi na yenye uwezo wa dijitali ambapo kila mtu ana ufikiaji sawa wa fursa, anakumbatia uvumbuzi, na kuchangia katika jamii huru, iliyounganishwa, na yenye mafanikio." },
  "about.mission": { en: "Mission", fr: "Mission", sw: "Dhamira" },
  "about.mission.desc": { en: "To reduce the digital divide and promote innovation by empowering Burundian youth with practical skills and digital literacy. Through hands-on training and open collaboration, we foster understanding of decentralized technologies, privacy, and responsible internet use.", fr: "Réduire le fossé numérique et promouvoir l'innovation en autonomisant la jeunesse burundaise avec des compétences pratiques et une littératie numérique. À travers des formations pratiques et une collaboration ouverte, nous favorisons la compréhension des technologies décentralisées, la confidentialité et l'utilisation responsable d'Internet.", sw: "Kupunguza pengo la dijitali na kukuza uvumbuzi kwa kuwawezesha vijana wa Burundi na ujuzi wa vitendo na ujuzi wa dijitali." },
  "about.values": { en: "Our Core Values", fr: "Nos Valeurs Fondamentales", sw: "Thamani Zetu Kuu" },
  "about.values.desc": { en: "At Free Tech Institute, our core values shape everything we do: from the way we teach, to the technologies we promote.", fr: "Chez Free Tech Institute, nos valeurs fondamentales façonnent tout ce que nous faisons : de notre façon d'enseigner aux technologies que nous promouvons.", sw: "Katika Free Tech Institute, thamani zetu kuu zinaunda kila tunachofanya: kutoka jinsi tunavyofundisha, hadi teknolojia tunazokuza." },
  "about.accessibility": { en: "Accessibility", fr: "Accessibilité", sw: "Upatikanaji" },
  "about.accessibility.desc": { en: "We believe knowledge and tools should be available to all, not just a few.", fr: "Nous croyons que les connaissances et les outils doivent être accessibles à tous, pas seulement à quelques-uns.", sw: "Tunaamini maarifa na zana zinapaswa kupatikana kwa wote, si kwa wachache tu." },
  "about.integrity": { en: "Integrity", fr: "Intégrité", sw: "Uadilifu" },
  "about.integrity.desc": { en: "We promote ethical technology use that respects people and their data.", fr: "Nous promouvons une utilisation éthique de la technologie qui respecte les personnes et leurs données.", sw: "Tunakuza matumizi ya maadili ya teknolojia ambayo yanaheshimu watu na data zao." },
  "about.empowerment": { en: "Empowerment", fr: "Autonomisation", sw: "Uwezeshaji" },
  "about.empowerment.desc": { en: "We focus on practical learning that enables action and independence.", fr: "Nous nous concentrons sur l'apprentissage pratique qui permet l'action et l'indépendance.", sw: "Tunazingatia ujifunzaji wa vitendo unaosababisha hatua na uhuru." },
  "about.autonomy": { en: "Autonomy", fr: "Autonomie", sw: "Uhuru" },
  "about.autonomy.desc": { en: "We value individual autonomy and digital self-sovereignty.", fr: "Nous valorisons l'autonomie individuelle et la souveraineté numérique.", sw: "Tunathamini uhuru wa mtu binafsi na enzi kuu ya dijitali." },

  // Programs
  "programs.label": { en: "Explore Our Programs", fr: "Découvrez Nos Programmes", sw: "Gundua Programu Zetu" },
  "programs.title": { en: "Empowering Minds Through Digital Literacy", fr: "Autonomiser les Esprits par la Littératie Numérique", sw: "Kuwawezesha Akili Kupitia Ujuzi wa Dijitali" },
  "programs.desc": { en: "Our programs are designed to inspire creativity, innovation, and inclusion. Each activity brings young minds closer to real solutions for Burundi's future.", fr: "Nos programmes sont conçus pour inspirer la créativité, l'innovation et l'inclusion. Chaque activité rapproche les jeunes esprits des solutions réelles pour l'avenir du Burundi.", sw: "Programu zetu zimeundwa kuhamasisha ubunifu, uvumbuzi, na ujumuishaji. Kila shughuli inaleta akili za vijana karibu na suluhisho halisi za mustakabali wa Burundi." },
  "programs.learnmore": { en: "Click to learn more →", fr: "Cliquez pour en savoir plus →", sw: "Bonyeza kujifunza zaidi →" },

  // Workshops
  "workshops.label": { en: "Workshops, Bootcamps & Hackathons", fr: "Ateliers, Bootcamps & Hackathons", sw: "Warsha, Bootcamp na Hackathon" },
  "workshops.title": { en: "Real learning happens in real spaces.", fr: "Le vrai apprentissage se fait dans de vrais espaces.", sw: "Kujifunza kweli hutokea katika nafasi halisi." },
  "workshops.desc": { en: "Join our in-person and online sessions to gain hands-on experience, collaborate with peers, and bring your ideas to life. Our programs focus on practical skills, teamwork, and problem-solving.", fr: "Rejoignez nos sessions en présentiel et en ligne pour acquérir une expérience pratique, collaborer avec vos pairs et donner vie à vos idées.", sw: "Jiunge na vikao vyetu vya ana kwa ana na mtandaoni kupata uzoefu wa vitendo, kushirikiana na wenzako, na kuleta mawazo yako kuwa hai." },

  // Events
  "events.label": { en: "Latest and Upcoming Events", fr: "Derniers et Prochains Événements", sw: "Matukio ya Hivi Karibuni na Yajayo" },
  "events.title": { en: "Stay Updated", fr: "Restez Informé", sw: "Endelea Kusasishwa" },
  "events.desc": { en: "Stay updated on our upcoming events designed to empower youth through digital literacy and inclusion.", fr: "Restez informé de nos événements à venir conçus pour autonomiser les jeunes grâce à la littératie numérique et l'inclusion.", sw: "Endelea kusasishwa kuhusu matukio yetu yajayo yaliyoundwa kuwawezesha vijana kupitia ujuzi wa dijitali na ujumuishaji." },
  "events.readmore": { en: "Read More →", fr: "En savoir plus →", sw: "Soma Zaidi →" },

  // Partners
  "partners.label": { en: "Our Partners", fr: "Nos Partenaires", sw: "Washirika Wetu" },
  "partners.title": { en: "Building Together", fr: "Construire Ensemble", sw: "Kujenga Pamoja" },
  "partners.desc": { en: "We proudly collaborate with institutions and organizations that share our vision for a digitally inclusive Burundi.", fr: "Nous collaborons fièrement avec des institutions et organisations qui partagent notre vision d'un Burundi numériquement inclusif.", sw: "Tunashirikiana kwa kiburi na taasisi na mashirika yanayoshiriki maono yetu ya Burundi jumuishi ya dijitali." },

  // Impact
  "impact.label": { en: "Our Impact", fr: "Notre Impact", sw: "Athari Yetu" },
  "impact.title": { en: "Our Impact in Numbers", fr: "Notre Impact en Chiffres", sw: "Athari Yetu kwa Nambari" },
  "impact.youth": { en: "Youth Trained", fr: "Jeunes Formés", sw: "Vijana Waliofunzwa" },
  "impact.certified": { en: "Certified Graduates", fr: "Diplômés Certifiés", sw: "Wahitimu Waliothibitishwa" },
  "impact.initiatives": { en: "Initiatives Launched", fr: "Initiatives Lancées", sw: "Mipango Iliyozinduliwa" },
  "impact.provinces": { en: "Provinces Reached", fr: "Provinces Atteintes", sw: "Mikoa Iliyofikiwa" },

  // Testimonials
  "testimonials.label": { en: "Testimonials", fr: "Témoignages", sw: "Ushuhuda" },
  "testimonials.title": { en: "Real Stories. Real Impact.", fr: "Histoires Réelles. Impact Réel.", sw: "Hadithi Halisi. Athari Halisi." },
  "testimonials.desc": { en: "Hear from learners, educators, and partners about how Free Tech Institute has inspired them.", fr: "Écoutez les apprenants, éducateurs et partenaires sur la façon dont Free Tech Institute les a inspirés.", sw: "Sikia kutoka kwa wanafunzi, waelimishaji, na washirika kuhusu jinsi Free Tech Institute imewahamasisha." },

  // Footer
  "footer.tagline": { en: "Secure data for a free and prosperous society. Free Tech Institute promotes digital inclusion and technological freedom in Burundi.", fr: "Des données sécurisées pour une société libre et prospère. Free Tech Institute promeut l'inclusion numérique et la liberté technologique au Burundi.", sw: "Data salama kwa jamii huru na yenye mafanikio. Free Tech Institute inakuza ujumuishaji wa dijitali na uhuru wa kiteknolojia nchini Burundi." },
  "footer.quicklinks": { en: "Quick Links", fr: "Liens Rapides", sw: "Viungo vya Haraka" },
  "footer.contact": { en: "Contact", fr: "Contact", sw: "Wasiliana" },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: string): string => {
    return translations[key]?.[lang] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
