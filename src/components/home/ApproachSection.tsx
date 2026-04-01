import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5 } }),
};

const approachSteps = [
  {
    title: "Detect",
    img: "https://freeti.org/images/diapos/INST.jpg",
    short: "How we do it",
    detail: "We identify promising youth across Burundi's provinces by partnering with schools, community centers, and local leaders. Through outreach programs and assessments, we evaluate their digital needs, potential, and readiness to engage with technology. This step ensures our resources reach those who need them most.",
  },
  {
    title: "Instill",
    img: "https://freeti.org/images/diapos/DET.jpg",
    short: "Our process",
    detail: "Through hands-on training sessions, workshops, and bootcamps, we provide practical skills in digital literacy, blockchain technology, Bitcoin, cybersecurity, and open-source development. Our curriculum is designed to be accessible, engaging, and relevant to the Burundian context.",
  },
  {
    title: "Guide",
    img: "https://freeti.org/images/diapos/GRAD.jpg",
    short: "How it works",
    detail: "We mentor and support learners as they build real projects, launch initiatives, and enter the workforce. From co-founding digital clubs to creating innovative solutions, our graduates are empowered to become leaders in their communities and champions of digital inclusion.",
  },
];

const ApproachSection = () => {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section className="section-padding bg-section-alt">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          label="Our Approach"
          title="Progressive & Human-Centered"
          description="At FREETI, we believe that transformation happens through a progressive and human-centered approach:"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {approachSteps.map((step, i) => (
            <motion.div
              key={step.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              onClick={() => setSelected(i)}
              className="glass-card overflow-hidden group cursor-pointer hover:border-cyan/30 transition-colors"
            >
              <div className="h-52 overflow-hidden">
                <img src={step.img} alt={step.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-heading font-bold text-foreground">{step.title}</h3>
                <p className="text-cyan text-sm font-medium mt-1">{step.short}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={selected !== null} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg">
          {selected !== null && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">{approachSteps[selected].title}</DialogTitle>
                <DialogDescription className="text-cyan font-medium">{approachSteps[selected].short}</DialogDescription>
              </DialogHeader>
              <img src={approachSteps[selected].img} alt={approachSteps[selected].title} className="w-full h-48 object-cover rounded-lg" />
              <p className="text-muted-foreground text-sm leading-relaxed">{approachSteps[selected].detail}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ApproachSection;
