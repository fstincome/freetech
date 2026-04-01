import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const partners = [
  "https://freeti.org/images/parterners/atlas.png",
  "https://freeti.org/images/parterners/hrf.png",
  "https://freeti.org/images/parterners/kbf.webp",
  "https://freeti.org/images/parterners/trezorac.webp",
  "https://freeti.org/images/parterners/thewhy.webp",
  "https://freeti.org/images/parterners/sfl.png",
  "https://freeti.org/images/parterners/isoc.png",
  "https://freeti.org/images/parterners/btrust.png",
  "https://freeti.org/images/parterners/atassi.png",
];

const supportingPartners = [
  "https://freeti.org/images/parterners/333.jpg",
  "https://freeti.org/images/parterners/111.jpg",
  "https://freeti.org/images/parterners/444.jpg",
  "https://freeti.org/images/parterners/666.jpg",
  "https://freeti.org/images/parterners/777.jpg",
  "https://freeti.org/images/parterners/222.jpg",
  "https://freeti.org/images/parterners/555.jpg",
  "https://freeti.org/img/isoc.jpg",
  "https://freeti.org/images/parterners/bitnob.jpg",
  "https://freeti.org/images/parterners/ged.jpg",
  "https://freeti.org/images/parterners/sky.jpg",
  "https://freeti.org/images/parterners/arct.jpg",
  "https://freeti.org/images/parterners/UPG.jpg",
];

const PartnersSection = () => (
  <section className="section-padding">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        label="Our Partners"
        title="Building Together"
        description="We proudly collaborate with institutions and organizations that share our vision for a digitally inclusive Burundi."
      />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-wrap justify-center items-center gap-8 md:gap-12 mb-16"
      >
        {partners.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Partner ${i + 1}`}
            className="h-12 md:h-16 object-contain opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
          />
        ))}
      </motion.div>

      {/* Supporting partners marquee */}
      <div className="overflow-hidden py-8">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex gap-10 items-center w-max"
        >
          {[...supportingPartners, ...supportingPartners].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Supporting Partner`}
              className="h-16 md:h-20 object-contain rounded-lg"
            />
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default PartnersSection;
