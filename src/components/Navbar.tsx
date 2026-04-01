import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, Lang } from "@/contexts/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

const sectionLinks = [
  { labelKey: "nav.approach", hash: "#approach" },
  { labelKey: "nav.about", hash: "#about" },
  { labelKey: "nav.programs", hash: "#programs" },
  { labelKey: "nav.workshops", hash: "#workshops" },
  { labelKey: "nav.events", hash: "#events" },
  { labelKey: "nav.partners", hash: "#partners" },
  { labelKey: "nav.impact", hash: "#impact" },
  { labelKey: "nav.testimonials", hash: "#testimonials" },
];

const pageLinks = [
  { labelKey: "nav.hub", path: "/gitega-study-space" },
  { labelKey: "nav.team", path: "/our-team" },
];

const langLabels: Record<Lang, string> = { en: "EN", fr: "FR", sw: "SW" };

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const location = useLocation();
  const { t, lang, setLang } = useLanguage();
  const isHome = location.pathname === "/";

  const handleSectionClick = (hash: string) => {
    setIsOpen(false);
    if (isHome) {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.href = "/" + hash;
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur-xl border-b border-cyan/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Free Tech Institute" className="h-10 md:h-12" />
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-5">
          {sectionLinks.map((link) => (
            <button
              key={link.hash}
              onClick={() => handleSectionClick(link.hash)}
              className="text-xs font-medium transition-colors hover:text-cyan text-white/80"
            >
              {t(link.labelKey)}
            </button>
          ))}
          {pageLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs font-medium transition-colors hover:text-cyan ${location.pathname === link.path ? "text-cyan" : "text-white/80"}`}
            >
              {t(link.labelKey)}
            </Link>
          ))}

          {/* Language Switcher */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 text-white/80 hover:text-cyan transition-colors text-xs font-medium">
              <Globe size={14} />
              {langLabels[lang]}
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-2 bg-navy border border-cyan/20 rounded-lg overflow-hidden shadow-xl">
                {(["en", "fr", "sw"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={`block w-full px-4 py-2 text-xs text-left hover:bg-cyan/10 transition-colors ${lang === l ? "text-cyan" : "text-white/70"}`}
                  >
                    {l === "en" ? "English" : l === "fr" ? "Français" : "Kiswahili"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ThemeToggle className="text-white/80" />

          <a
            href="https://freeti.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full bg-cyan text-navy text-xs font-semibold hover:bg-cyan/90 transition-colors"
          >
            {t("nav.blog")}
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white/80 hover:text-cyan transition-colors">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-navy/95 backdrop-blur-xl border-t border-cyan/10 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex flex-col px-4 py-4 gap-2">
              {sectionLinks.map((link) => (
                <button
                  key={link.hash}
                  onClick={() => handleSectionClick(link.hash)}
                  className="py-2 text-sm font-medium text-white/70 hover:text-cyan text-left"
                >
                  {t(link.labelKey)}
                </button>
              ))}
              {pageLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`py-2 text-sm font-medium ${location.pathname === link.path ? "text-cyan" : "text-white/70 hover:text-cyan"}`}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <div className="flex gap-2 pt-2 items-center">
                {(["en", "fr", "sw"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${lang === l ? "bg-cyan text-navy" : "bg-white/10 text-white/70"}`}
                  >
                    {langLabels[l]}
                  </button>
                ))}
                <ThemeToggle className="text-white/80 ml-2" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
