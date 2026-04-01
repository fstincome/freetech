import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const testimonials = [
  { text: "As the Director of Lycée Technique New Generation, I would like to express my deep gratitude to the Free Tech Institute and its partner SkyNet Burundi for integrating our school into their digital training program. The relevance of the modules, especially those on research techniques and digital marketing, has been remarkable, offering a strong complement to our existing curriculum. I strongly encourage the continuation and expansion of this program.", name: "NIBAYEMERE Joseph", role: "Director of Lycée Technique New Generation", img: "https://freeti.org/img/directeur.jpg" },
  { text: "As someone passionate about marketing, I saw the opportunity offered by the Free Tech Institute and SkyNet Burundi as the perfect chance to deepen my knowledge in digital marketing. This experience truly inspired me. It led me to co-found the 'Vision Digital Club,' an initiative dedicated to promoting responsible and inclusive digital engagement, especially among young girls in Burundi.", name: "DUSHIME Delly Santiana", role: "Student at École Sociale de Gitega and Laureate of the Program", img: "https://freeti.org/img/santhiana.jpg" },
  { text: "As a university, we're proud to have contributed to organizing this event. We were truly impressed by the quality and creativity of our students' presentations—especially their innovative spirit and ability to address complex concepts rarely explored in our country. We strongly encourage them to keep innovating and working on ideas with global relevance.", name: "Senene François Xavier", role: "Directeur académique, UPG", img: "https://freeti.org/img/dac.jpg" },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  const next = useCallback(() => setCurrent((p) => (p + 1) % testimonials.length), []);
  const prev = useCallback(() => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="testimonials" className="section-padding bg-section-alt w-full">
      <div className="max-w-5xl mx-auto">
        <SectionHeading label={t("testimonials.label")} title={t("testimonials.title")} description={t("testimonials.desc")} />

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.5 }} className="glass-card p-8 md:p-12">
              <Quote className="w-10 h-10 text-cyan/30 mb-6" />
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 italic">
                "{testimonials[current].text}"
              </p>
              <div className="flex items-center gap-4">
                <img src={testimonials[current].img} alt={testimonials[current].name} className="w-14 h-14 rounded-full object-cover border-2 border-cyan/30" />
                <div>
                  <p className="font-heading font-bold text-foreground">{testimonials[current].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center hover:bg-cyan/20 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-cyan" : "w-2 bg-foreground/20"}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center hover:bg-cyan/20 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
