import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  light?: boolean;
}

const SectionHeading = ({ label, title, description, light }: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-3xl mx-auto mb-14"
    >
      {label && (
        <span className="text-cyan font-heading font-semibold text-sm tracking-widest uppercase mb-3 block">
          {label}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight ${light ? "text-white" : "text-foreground"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base md:text-lg leading-relaxed ${light ? "text-white/70" : "text-muted-foreground"}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
