import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const PartnersSection = () => {
  const { t } = useLanguage();
  const [mainPartners, setMainPartners] = useState<any[]>([]);
  const [supportingPartners, setSupportingPartners] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("site_partners").select("*").order("sort_order").then(({ data }) => {
      if (data) {
        setMainPartners(data.filter(p => p.partner_type === "main"));
        setSupportingPartners(data.filter(p => p.partner_type === "supporting"));
      }
    });
  }, []);

  return (
    <section id="partners" className="section-padding w-full">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label={t("partners.label")} title={t("partners.title")} description={t("partners.desc")} />
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-16">
          {mainPartners.map((p) => (
            <img key={p.id} src={p.logo_url} alt={p.name} className="h-12 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" />
          ))}
        </motion.div>
        {supportingPartners.length > 0 && (
          <div className="overflow-hidden py-8">
            <motion.div animate={{ x: [0, -1200] }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="flex gap-10 items-center w-max">
              {[...supportingPartners, ...supportingPartners].map((p, i) => (
                <img key={`${p.id}-${i}`} src={p.logo_url} alt={p.name} className="h-16 md:h-20 object-contain rounded-lg" />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PartnersSection;
