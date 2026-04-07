import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const PartnersSection = () => {
  const { t } = useLanguage();
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("site_partners").select("*").order("sort_order").then(({ data }) => {
      if (data) setPartners(data);
    });
  }, []);

  if (partners.length === 0) return null;

  return (
    <section id="partners" className="section-padding w-full">
      <div className="max-w-7xl mx-auto">
        <SectionHeading label={t("partners.label")} title={t("partners.title")} description={t("partners.desc")} />
        <div className="overflow-hidden py-8">
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="flex gap-10 items-center w-max"
          >
            {[...partners, ...partners].map((p, i) => (
              <img
                key={`${p.id}-${i}`}
                src={p.logo_url}
                alt={p.name}
                className="h-16 md:h-20 object-contain rounded-lg opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
