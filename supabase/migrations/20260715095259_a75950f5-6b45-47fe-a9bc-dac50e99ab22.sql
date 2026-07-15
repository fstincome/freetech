
CREATE TABLE public.site_about (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  label text NOT NULL,
  fr text DEFAULT '',
  en text DEFAULT '',
  sw text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_about TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_about TO authenticated;
GRANT ALL ON public.site_about TO service_role;

ALTER TABLE public.site_about ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site_about" ON public.site_about FOR SELECT USING (true);
CREATE POLICY "Admins can insert site_about" ON public.site_about FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site_about" ON public.site_about FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site_about" ON public.site_about FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_about_updated_at BEFORE UPDATE ON public.site_about FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_about (section_key, label, fr, en, sw, sort_order) VALUES
('about.label','Étiquette de section','Qui Sommes-Nous','Who We Are','Sisi Ni Nani',1),
('about.title','Titre de section','Free Tech Institute','Free Tech Institute','Free Tech Institute',2),
('about.p1','Paragraphe 1',
 'Free Tech Institute (FREETI) est une organisation à but non lucratif qui promeut l''inclusion numérique et la liberté technologique au Burundi.',
 'Free Tech Institute (FREETI) is a non-profit organization promoting digital inclusion and technological freedom in Burundi.',
 'Free Tech Institute (FREETI) ni shirika lisilo la faida linalohamasisha ujumuishaji wa dijitali na uhuru wa kiteknolojia nchini Burundi.',3),
('about.p2','Paragraphe 2',
 'Nous formons et inspirons les jeunes à utiliser la technologie comme outil d''innovation, d''entrepreneuriat et de développement communautaire.',
 'We train and inspire young people to use technology as a tool for innovation, entrepreneurship, and community development.',
 'Tunafundisha na kuhamasisha vijana kutumia teknolojia kama chombo cha uvumbuzi, ujasiriamali, na maendeleo ya jamii.',4),
('about.p3','Paragraphe 3',
 'À travers des ateliers, hackathons, bootcamps et conférences, nous visons à combler le fossé numérique, stimuler la créativité et favoriser l''innovation afin que la technologie devienne un moteur de progrès social et économique.',
 'Through workshops, hackathons, bootcamps, and conferences, we aim to bridge the digital divide, enhance creativity, and foster innovation so that technology becomes a driver of social and economic progress.',
 'Kupitia warsha, hackathon, bootcamp, na mikutano, tunalenga kuziba pengo la dijitali, kuimarisha ubunifu, na kukuza uvumbuzi ili teknolojia iwe chachu ya maendeleo ya kijamii na kiuchumi.',5),
('about.vision','Titre Vision','Vision','Vision','Maono',6),
('about.vision.desc','Description Vision',
 'Construire un Burundi inclusif et numériquement autonome où chaque individu a un accès égal aux opportunités, embrasse l''innovation et contribue à une société libre, connectée et prospère.',
 'To build an inclusive and digitally empowered Burundi where every individual has equal access to opportunities, embraces innovation, and contributes to a free, connected, and prosperous society.',
 'Kujenga Burundi jumuishi na yenye uwezo wa dijitali ambapo kila mtu ana ufikiaji sawa wa fursa, anakumbatia uvumbuzi, na kuchangia katika jamii huru, iliyounganishwa, na yenye mafanikio.',7),
('about.mission','Titre Mission','Mission','Mission','Dhamira',8),
('about.mission.desc','Description Mission',
 'Réduire le fossé numérique et promouvoir l''innovation en autonomisant la jeunesse burundaise avec des compétences pratiques et une littératie numérique. À travers des formations pratiques et une collaboration ouverte, nous favorisons la compréhension des technologies décentralisées, la confidentialité et l''utilisation responsable d''Internet.',
 'To reduce the digital divide and promote innovation by empowering Burundian youth with practical skills and digital literacy. Through hands-on training and open collaboration, we foster understanding of decentralized technologies, privacy, and responsible internet use.',
 'Kupunguza pengo la dijitali na kukuza uvumbuzi kwa kuwawezesha vijana wa Burundi na ujuzi wa vitendo na ujuzi wa dijitali.',9),
('about.values','Titre Valeurs','Nos Valeurs Fondamentales','Our Core Values','Thamani Zetu Kuu',10),
('about.values.desc','Sous-titre Valeurs',
 'Chez Free Tech Institute, nos valeurs fondamentales façonnent tout ce que nous faisons : de notre façon d''enseigner aux technologies que nous promouvons.',
 'At Free Tech Institute, our core values shape everything we do: from the way we teach, to the technologies we promote.',
 'Katika Free Tech Institute, thamani zetu kuu zinaunda kila tunachofanya: kutoka jinsi tunavyofundisha, hadi teknolojia tunazokuza.',11),
('about.accessibility','Valeur — Accessibilité (titre)','Accessibilité','Accessibility','Upatikanaji',12),
('about.accessibility.desc','Valeur — Accessibilité (description)',
 'Nous croyons que les connaissances et les outils doivent être accessibles à tous, pas seulement à quelques-uns.',
 'We believe knowledge and tools should be available to all, not just a few.',
 'Tunaamini maarifa na zana zinapaswa kupatikana kwa wote, si kwa wachache tu.',13),
('about.integrity','Valeur — Intégrité (titre)','Intégrité','Integrity','Uadilifu',14),
('about.integrity.desc','Valeur — Intégrité (description)',
 'Nous promouvons une utilisation éthique de la technologie qui respecte les personnes et leurs données.',
 'We promote ethical technology use that respects people and their data.',
 'Tunakuza matumizi ya maadili ya teknolojia ambayo yanaheshimu watu na data zao.',15),
('about.empowerment','Valeur — Autonomisation (titre)','Autonomisation','Empowerment','Uwezeshaji',16),
('about.empowerment.desc','Valeur — Autonomisation (description)',
 'Nous nous concentrons sur l''apprentissage pratique qui permet l''action et l''indépendance.',
 'We focus on practical learning that enables action and independence.',
 'Tunazingatia ujifunzaji wa vitendo unaosababisha hatua na uhuru.',17),
('about.autonomy','Valeur — Autonomie (titre)','Autonomie','Autonomy','Uhuru',18),
('about.autonomy.desc','Valeur — Autonomie (description)',
 'Nous valorisons l''autonomie individuelle et la souveraineté numérique.',
 'We value individual autonomy and digital self-sovereignty.',
 'Tunathamini uhuru wa mtu binafsi na enzi kuu ya dijitali.',19);
