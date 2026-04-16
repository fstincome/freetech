import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";


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
            <div className="flex flex-col gap-2 text-sm">
              <a href="https://freeti.org" className="hover:text-cyan transition-colors">freeti.org</a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8">
          <h4 className="text-white font-heading font-semibold text-sm mb-3">📍 {t("footer.location") || "Notre adresse"}</h4>
          <p className="text-sm leading-relaxed">Gitega, Quartier Musinzira, Avenue de la Culture, Numéro 15</p>
          <a
            href="https://www.google.com/maps/dir//Study+Space+de+Gitega,+HWGG%2BG6P,+Gitega/@-3.4313155,29.916227,15z/data=!4m8!4m7!1m0!1m5!1m1!1s0x19c145002134af6b:0x8699dd911d059c90!2m2!1d29.9256132!2d-3.4236658"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-3 text-sm text-cyan hover:underline transition-colors"
          >
            Voir sur Google Maps →
          </a>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs">
          © 2026 Free Tech Institute, All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
