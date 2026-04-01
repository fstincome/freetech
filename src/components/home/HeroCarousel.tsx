import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    img: "https://freeti.org/images/diapos/TECH1.jpg",
    label: "Digital inclusion",
    title: "Empowering Burundi's youth through digital inclusion",
    subtitle: "Discover the Power of Open Technology",
    desc: "Free Tech Institute is building a generation that is aware, skilled, and ready to harness decentralized technologies like Bitcoin, blockchain, and open finance.",
  },
  {
    img: "https://freeti.org/images/frb/ZZY_7754.jpg",
    label: "Decentralized technologies",
    title: "Bridging the digital divide and preparing tomorrow's innovators",
    subtitle: "Practical knowledge to transform local reality",
    desc: "With hands-on trainings, workshops, and accessible content, Free Tech Institute makes technology easy to understand and use for everyone.",
  },
  {
    img: "https://freeti.org/images/diapos/INST.jpg",
    label: "Open Finance",
    title: "Building digital independence for every Burundian",
    subtitle: "Freedom through technology and knowledge",
    desc: "From creating secure Bitcoin wallets to learning about online privacy, we guide every Burundian toward greater control of their digital future.",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].img}
            alt={slides[current].label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/15 text-cyan text-xs font-heading font-semibold tracking-widest uppercase mb-4 border border-cyan/25">
                {slides[current].label}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.1] mb-4">
                {slides[current].title}
              </h1>
              <p className="text-cyan font-heading font-medium text-lg md:text-xl mb-4">
                {slides[current].subtitle}
              </p>
              <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
                {slides[current].desc}
              </p>
              <div className="flex gap-4">
                <a href="#programs" className="px-7 py-3 rounded-full bg-cyan text-navy font-heading font-semibold text-sm hover:bg-cyan/90 transition-all shadow-lg shadow-cyan/25">
                  Read more
                </a>
                <a href="#about" className="px-7 py-3 rounded-full border border-white/25 text-white font-heading font-semibold text-sm hover:bg-white/10 transition-all">
                  Our Packages
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Nav arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-cyan/30 transition-colors">
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-cyan/30 transition-colors">
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-cyan" : "w-2 bg-white/40"}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 rounded-full bg-cyan" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroCarousel;
