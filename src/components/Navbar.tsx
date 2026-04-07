import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, Lang } from "@/contexts/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

const langLabels: Record<Lang, string> = { en: "EN", fr: "FR", sw: "SW" };

interface DropdownItem {
  labelKey: string;
  hash?: string;
  path?: string;
}

interface NavMenu {
  labelKey: string;
  items?: DropdownItem[];
  hash?: string;
  path?: string;
  highlight?: boolean;
}

const navMenus: NavMenu[] = [
  { labelKey: "nav.home", hash: "#hero" },
  {
    labelKey: "nav.aboutus",
    items: [
      { labelKey: "nav.approach", hash: "#approach" },
      { labelKey: "nav.about", hash: "#about" },
      { labelKey: "nav.team", path: "/our-team" },
      { labelKey: "nav.partners", hash: "#partners" },
      { labelKey: "nav.reports", hash: "#reports" },
    ],
  },
  {
    labelKey: "nav.programs",
    items: [
      { labelKey: "nav.ourprograms", hash: "#programs" },
      { labelKey: "nav.workshops", hash: "#workshops" },
      { labelKey: "nav.events", hash: "#events" },
      { labelKey: "nav.impact", hash: "#impact" },
      { labelKey: "nav.testimonials", hash: "#testimonials" },
    ],
  },
  { labelKey: "nav.hub", path: "/gitega-study-space", highlight: true },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const { t, lang, setLang } = useLanguage();
  const isHome = location.pathname === "/";

  const handleNavigate = (item: DropdownItem | NavMenu) => {
    setIsOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
    if (item.path) return; // Link handles it
    if (item.hash) {
      if (item.hash === "#hero") {
        if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
        else window.location.href = "/";
      } else if (isHome) {
        document.querySelector(item.hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = "/" + item.hash;
      }
    }
  };

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setOpenDropdown(key);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  useEffect(() => {
    return () => { if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current); };
  }, []);

  const renderDesktopItem = (menu: NavMenu) => {
    if (menu.items) {
      return (
        <div
          key={menu.labelKey}
          className="relative"
          onMouseEnter={() => handleDropdownEnter(menu.labelKey)}
          onMouseLeave={handleDropdownLeave}
        >
          <button className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-cyan text-white/80">
            {t(menu.labelKey)}
            <ChevronDown size={14} className={`transition-transform ${openDropdown === menu.labelKey ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {openDropdown === menu.labelKey && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 min-w-[200px] bg-navy border border-cyan/20 rounded-xl overflow-hidden shadow-2xl"
              >
                {menu.items.map((item) =>
                  item.path ? (
                    <Link
                      key={item.labelKey}
                      to={item.path}
                      onClick={() => setOpenDropdown(null)}
                      className={`block px-4 py-2.5 text-sm hover:bg-cyan/10 transition-colors ${location.pathname === item.path ? "text-cyan" : "text-white/70 hover:text-white"}`}
                    >
                      {t(item.labelKey)}
                    </Link>
                  ) : (
                    <button
                      key={item.labelKey}
                      onClick={() => handleNavigate(item)}
                      className="block w-full text-left px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-cyan/10 transition-colors"
                    >
                      {t(item.labelKey)}
                    </button>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (menu.path) {
      return (
        <Link
          key={menu.labelKey}
          to={menu.path}
          className={`text-sm font-semibold transition-colors hover:text-cyan ${menu.highlight ? "text-cyan" : location.pathname === menu.path ? "text-cyan" : "text-white/80"}`}
        >
          {t(menu.labelKey)}
        </Link>
      );
    }

    return (
      <button
        key={menu.labelKey}
        onClick={() => handleNavigate(menu)}
        className="text-sm font-medium transition-colors hover:text-cyan text-white/80"
      >
        {t(menu.labelKey)}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/90 backdrop-blur-xl border-b border-cyan/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Free Tech Institute" className="h-10 md:h-12" />
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {navMenus.map(renderDesktopItem)}

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
            <div className="flex flex-col px-4 py-4 gap-1">
              {navMenus.map((menu) => {
                if (menu.items) {
                  const isExpanded = mobileExpanded === menu.labelKey;
                  return (
                    <div key={menu.labelKey}>
                      <button
                        onClick={() => setMobileExpanded(isExpanded ? null : menu.labelKey)}
                        className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-white/70 hover:text-cyan"
                      >
                        {t(menu.labelKey)}
                        <ChevronDown size={16} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 border-l border-cyan/10 ml-2"
                          >
                            {menu.items.map((item) =>
                              item.path ? (
                                <Link
                                  key={item.labelKey}
                                  to={item.path}
                                  onClick={() => setIsOpen(false)}
                                  className={`block py-2 text-sm ${location.pathname === item.path ? "text-cyan" : "text-white/60 hover:text-cyan"}`}
                                >
                                  {t(item.labelKey)}
                                </Link>
                              ) : (
                                <button
                                  key={item.labelKey}
                                  onClick={() => handleNavigate(item)}
                                  className="block w-full text-left py-2 text-sm text-white/60 hover:text-cyan"
                                >
                                  {t(item.labelKey)}
                                </button>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                if (menu.path) {
                  return (
                    <Link
                      key={menu.labelKey}
                      to={menu.path}
                      onClick={() => setIsOpen(false)}
                      className={`py-2.5 text-sm font-semibold ${menu.highlight ? "text-cyan" : location.pathname === menu.path ? "text-cyan" : "text-white/70 hover:text-cyan"}`}
                    >
                      {t(menu.labelKey)}
                    </Link>
                  );
                }

                return (
                  <button
                    key={menu.labelKey}
                    onClick={() => handleNavigate(menu)}
                    className="py-2.5 text-sm font-medium text-white/70 hover:text-cyan text-left"
                  >
                    {t(menu.labelKey)}
                  </button>
                );
              })}

              <div className="flex gap-2 pt-3 items-center border-t border-cyan/10 mt-2">
                {(["en", "fr", "sw"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
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
