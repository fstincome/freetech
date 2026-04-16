import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone, Mail } from "lucide-react";


const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-navy text-white/70 w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <p className="text-sm leading-relaxed max-w-md">{t("footer.tagline")}</p>
            <div className="flex gap-3 mt-6">
              {[
                { href: "https://facebook.com/freetechinstitute", icon: "f" },
                { href: "https://twitter.com/freaborundi", icon: "𝕏" },
                { href: "https://instagram.com", icon: "◎" },
                { href: "https://linkedin.com/company/free-tech-institute", icon: "in" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-cyan hover:text-navy transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-4">{t("footer.quicklinks")}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm hover:text-cyan transition-colors">{t("nav.home")}</Link>
              <Link to="/gitega-study-space" className="text-sm hover:text-cyan transition-colors">{t("nav.hub")}</Link>
              <Link to="/our-team" className="text-sm hover:text-cyan transition-colors">{t("nav.team")}</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-4">{t("footer.contact")}</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="tel:+25769034965" className="flex items-center gap-2 hover:text-cyan transition-colors">
                <Phone size={16} />
                +257 69 03 49 65
              </a>
              <a href="mailto:info@freeti.org" className="flex items-center gap-2 hover:text-cyan transition-colors">
                <Mail size={16} />
                info@freeti.org
              </a>
              <div className="flex items-start gap-2 text-white/70">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Gitega, Quartier Musinzira, Avenue de la Culture, N°15</span>
              </div>
              <a 
                href="https://maps.app.goo.gl/RqERs6wXL2vHwrBK6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-cyan text-navy rounded-lg hover:bg-cyan/90 transition-colors font-medium"
              >
                <MapPin size={16} />
                Voir sur Google Maps
              </a>
            </div>
          </div>
        </div>


        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs">
          © 2026 Free Tech Institute, All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
