import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, Lang } from "@/contexts/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";

const langLabels: Record<Lang, string> = { en: "EN", fr: "FR", sw: "SW" };

interface MenuNode {
  key: string;
  labels: { fr: string; en: string; sw: string };
  link?: string;
  highlight?: boolean;
  children?: MenuNode[];
}

// Fallback menu shown when the editable menu in the admin is empty or unreachable.
const fallbackMenus: MenuNode[] = [
  { key: "home", labels: { fr: "Accueil", en: "Home", sw: "Nyumbani" }, link: "#hero" },
  {
    key: "aboutus",
    labels: { fr: "À Propos", en: "About Us", sw: "Kuhusu Sisi" },
    children: [
      { key: "approach", labels: { fr: "Notre Approche", en: "Our Approach", sw: "Mbinu Yetu" }, link: "#approach" },
      { key: "about", labels: { fr: "Qui Sommes-Nous", en: "Who We Are", sw: "Sisi Ni Nani" }, link: "#about" },
      { key: "team", labels: { fr: "Équipe", en: "Team", sw: "Timu" }, link: "/our-team" },
      { key: "partners", labels: { fr: "Partenaires", en: "Partners", sw: "Washirika" }, link: "#partners" },
      { key: "reports", labels: { fr: "Nos Derniers Rapports", en: "Our Latest Reports", sw: "Ripoti Zetu za Hivi Karibuni" }, link: "#reports" },
    ],
  },
  {
    key: "programs",
    labels: { fr: "Programmes", en: "Programs", sw: "Programu" },
    children: [
      { key: "ourprograms", labels: { fr: "Nos Programmes", en: "Our Programs", sw: "Programu Zetu" }, link: "#programs" },
      { key: "workshops", labels: { fr: "Ateliers", en: "Workshops", sw: "Warsha" }, link: "#workshops" },
      { key: "events", labels: { fr: "Événements", en: "Events", sw: "Matukio" }, link: "#events" },
      { key: "impact", labels: { fr: "Impact", en: "Impact", sw: "Athari" }, link: "#impact" },
      { key: "testimonials", labels: { fr: "Témoignages", en: "Testimonials", sw: "Ushuhuda" }, link: "#testimonials" },
      { key: "bujahackathon", labels: { fr: "Hackathon Buja", en: "Buja Hackathon", sw: "Hackathon Buja" }, link: "/buja-hackathon" },
    ],
  },
  { key: "hub", labels: { fr: "Notre Hub Digital", en: "Our Digital Hub", sw: "Kituo Chetu cha Dijitali" }, link: "/gitega-study-space", highlight: true },
];

interface DbRow {
  id: string;
  parent_id: string | null;
  label_fr: string;
  label_en: string;
  label_sw: string;
  link: string;
  highlight: boolean;
  visible: boolean;
  sort_order: number;
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [dbMenus, setDbMenus] = useState<MenuNode[] | null>(null);
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const isHome = location.pathname === "/";

  useEffect(() => {
    let active = true;
    supabase.from("site_menu_items").select("*").order("sort_order").then(({ data }) => {
      if (!active) return;
      const rows = (data || []) as DbRow[];
      if (!rows.length) { setDbMenus(null); return; }
      const visible = rows.filter(r => r.visible);
      const toNode = (r: DbRow): MenuNode => ({
        key: r.id,
        labels: { fr: r.label_fr, en: r.label_en, sw: r.label_sw },
        link: r.link || undefined,
        highlight: r.highlight,
      });
      const tops = visible.filter(r => !r.parent_id).sort((a, b) => a.sort_order - b.sort_order);
      setDbMenus(tops.map(top => {
        const children = visible.filter(r => r.parent_id === top.id).sort((a, b) => a.sort_order - b.sort_order).map(toNode);
        return { ...toNode(top), children: children.length ? children : undefined };
      }));
    });
    return () => { active = false; };
  }, []);

  const menus = useMemo(() => dbMenus ?? fallbackMenus, [dbMenus]);
  const label = (n: MenuNode) => n.labels[lang] || n.labels.en;

  const handleNavigate = (item: MenuNode) => {
    setIsOpen(false);
    setOpenDropdown(null);
    setMobileExpanded(null);
    const link = item.link;
    if (link?.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }
    if (!link) return;
    if (link === "#hero") {
      if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
      else window.location.href = "/";
      return;
    }
    if (link.startsWith("#")) {
      if (isHome) document.querySelector(link)?.scrollIntoView({ behavior: "smooth" });
      else window.location.href = "/" + link;
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

  const renderDesktopChild = (item: MenuNode) => {
    if (item.link?.startsWith("http")) {
      return (
        <a
          key={item.key}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-4 py-2.5 text-sm hover:bg-accent transition-colors text-foreground/70 hover:text-foreground"
        >
          {label(item)}
        </a>
      );
    }
    if (item.link?.startsWith("/")) {
      return (
        <Link
          key={item.key}
          to={item.link}
          onClick={() => setOpenDropdown(null)}
          className={`block px-4 py-2.5 text-sm hover:bg-accent transition-colors ${location.pathname === item.link ? "text-cyan" : "text-foreground/70 hover:text-foreground"}`}
        >
          {label(item)}
        </Link>
      );
    }
    return (
      <button
        key={item.key}
        onClick={() => handleNavigate(item)}
        className="block w-full text-left px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
      >
        {label(item)}
      </button>
    );
  };

  const renderDesktopItem = (menu: MenuNode) => {
    if (menu.children) {
      return (
        <div
          key={menu.key}
          className="relative"
          onMouseEnter={() => handleDropdownEnter(menu.key)}
          onMouseLeave={handleDropdownLeave}
        >
          <button className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-cyan text-foreground/80">
            {label(menu)}
            <ChevronDown size={14} className={`transition-transform ${openDropdown === menu.key ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {openDropdown === menu.key && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 min-w-[200px] bg-popover border border-border rounded-xl overflow-hidden shadow-2xl"
              >
                {menu.children.map(renderDesktopChild)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    if (menu.link?.startsWith("http")) {
      return (
        <a
          key={menu.key}
          href={menu.link}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2 rounded-full bg-cyan text-primary-foreground text-xs font-semibold hover:bg-cyan/90 transition-colors"
        >
          {label(menu)}
        </a>
      );
    }

    if (menu.link?.startsWith("/")) {
      return (
        <Link
          key={menu.key}
          to={menu.link}
          className={`text-sm font-semibold transition-colors hover:text-cyan ${menu.highlight ? "text-cyan" : location.pathname === menu.link ? "text-cyan" : "text-foreground/80"}`}
        >
          {label(menu)}
        </Link>
      );
    }

    return (
      <button
        key={menu.key}
        onClick={() => handleNavigate(menu)}
        className="text-sm font-medium transition-colors hover:text-cyan text-foreground/80"
      >
        {label(menu)}
      </button>
    );
  };

  const renderMobileChild = (item: MenuNode) => {
    if (item.link?.startsWith("http")) {
      return (
        <a
          key={item.key}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsOpen(false)}
          className="block py-2 text-sm text-foreground/60 hover:text-cyan"
        >
          {label(item)}
        </a>
      );
    }
    if (item.link?.startsWith("/")) {
      return (
        <Link
          key={item.key}
          to={item.link}
          onClick={() => setIsOpen(false)}
          className={`block py-2 text-sm ${location.pathname === item.link ? "text-cyan" : "text-foreground/60 hover:text-cyan"}`}
        >
          {label(item)}
        </Link>
      );
    }
    return (
      <button
        key={item.key}
        onClick={() => handleNavigate(item)}
        className="block w-full text-left py-2 text-sm text-foreground/60 hover:text-cyan"
      >
        {label(item)}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Free Tech Institute" className="h-10 md:h-12" />
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-6">
          {menus.map(renderDesktopItem)}

          {/* Language Switcher */}
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1 text-foreground/80 hover:text-cyan transition-colors text-xs font-medium">
              <Globe size={14} />
              {langLabels[lang]}
            </button>
            {langOpen && (
              <div className="absolute top-full right-0 mt-2 bg-popover border border-border rounded-lg overflow-hidden shadow-xl">
                {(["en", "fr", "sw"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={`block w-full px-4 py-2 text-xs text-left hover:bg-accent transition-colors ${lang === l ? "text-cyan" : "text-foreground/70"}`}
                  >
                    {l === "en" ? "English" : l === "fr" ? "Français" : "Kiswahili"}
                  </button>
                ))}
              </div>
            )}
          </div>

          <ThemeToggle className="text-foreground/80" />
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-foreground/80 hover:text-cyan transition-colors">
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
            className="lg:hidden bg-background/95 backdrop-blur-xl border-t border-border max-h-[70vh] overflow-y-auto"
          >
            <div className="flex flex-col px-4 py-4 gap-1">
              {menus.map((menu) => {
                if (menu.children) {
                  const isExpanded = mobileExpanded === menu.key;
                  return (
                    <div key={menu.key}>
                      <button
                        onClick={() => setMobileExpanded(isExpanded ? null : menu.key)}
                        className="w-full flex items-center justify-between py-2.5 text-sm font-medium text-foreground/70 hover:text-cyan"
                      >
                        {label(menu)}
                        <ChevronDown size={16} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 border-l border-border ml-2"
                          >
                            {menu.children.map(renderMobileChild)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                if (menu.link?.startsWith("http")) {
                  return (
                    <a
                      key={menu.key}
                      href={menu.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="py-2.5 text-sm font-semibold text-cyan"
                    >
                      {label(menu)}
                    </a>
                  );
                }

                if (menu.link?.startsWith("/")) {
                  return (
                    <Link
                      key={menu.key}
                      to={menu.link}
                      onClick={() => setIsOpen(false)}
                      className={`py-2.5 text-sm font-semibold ${menu.highlight ? "text-cyan" : location.pathname === menu.link ? "text-cyan" : "text-foreground/70 hover:text-cyan"}`}
                    >
                      {label(menu)}
                    </Link>
                  );
                }

                return (
                  <button
                    key={menu.key}
                    onClick={() => handleNavigate(menu)}
                    className="py-2.5 text-sm font-medium text-foreground/70 hover:text-cyan text-left"
                  >
                    {label(menu)}
                  </button>
                );
              })}

              <div className="flex gap-2 pt-3 items-center border-t border-border mt-2">
                {(["en", "fr", "sw"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${lang === l ? "bg-cyan text-primary-foreground" : "bg-muted text-foreground/70"}`}
                  >
                    {langLabels[l]}
                  </button>
                ))}
                <ThemeToggle className="text-foreground/80 ml-2" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
