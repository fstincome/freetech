import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy text-white/70">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <img
              src="https://freeti.org/images/logo-header.png"
              alt="Free Tech Institute"
              className="h-12 mb-4"
            />
            <p className="text-sm leading-relaxed max-w-md">
              Secure data for a free and prosperous society. Free Tech Institute promotes digital inclusion and technological freedom in Burundi.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { href: "https://facebook.com", icon: "f" },
                { href: "https://twitter.com", icon: "𝕏" },
                { href: "https://instagram.com", icon: "◎" },
                { href: "https://linkedin.com", icon: "in" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold hover:bg-cyan hover:text-navy transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm hover:text-cyan transition-colors">Home</Link>
              <Link to="/gitega-study-space" className="text-sm hover:text-cyan transition-colors">Our Digital Hub</Link>
              <Link to="/our-team" className="text-sm hover:text-cyan transition-colors">Team</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-heading font-semibold text-sm mb-4">Contact</h4>
            <div className="flex flex-col gap-2 text-sm">
              <span>Bujumbura, Burundi</span>
              <a href="https://freeti.org" className="hover:text-cyan transition-colors">freeti.org</a>
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
