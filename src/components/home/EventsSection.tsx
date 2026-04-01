import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const events = [
  {
    title: "Basic Computer Training",
    location: "Gitega Study Space",
    date: "April 22, 2025",
    desc: "The one-month certified Basic Computer Training in Gitega has successfully trained and certified 40 participants. The program, supported by the State of Israel, strengthened participants' digital skills, introduced AI fundamentals, and explored emerging technologies.",
    img: "https://freeti.org/images/events/bcbc.jpg",
    link: "https://www.facebook.com/100076093980845/posts/733607229185737/",
  },
  {
    title: "Open Source Bootcamp",
    location: "Polytechnic University of Gitega",
    date: "October 10, 2025",
    desc: "The Open Source Bootcamp brought participants an exciting opportunity to dive into open-source software development, collaboration tools, and community-driven innovation. Perfect for students and developers eager to make an impact.",
    img: "https://freeti.org/images/events/bitnob.jpg",
    link: "https://www.facebook.com/reel/803189009016613/",
  },
  {
    title: "SecureNet Summit 2025",
    location: "Martha Hotel",
    date: "October 17, 2025",
    desc: "Explore how AI shapes information, challenges disinformation, and impacts digital security. In partnership with the Internet Society Foundation and the Global Encryption Coalition, this event brings experts together for a safer digital future.",
    img: "https://freeti.org/images/events/ged.jpg",
    link: "https://www.linkedin.com/posts/free-tech-institute_freetiabrcon-securenetsummit2025-ai-activity-7386100358172901376-z2-q",
  },
];

const EventsSection = () => (
  <section className="section-padding bg-section-alt">
    <div className="max-w-7xl mx-auto">
      <SectionHeading
        label="Latest and Upcoming Events"
        title="Stay Updated"
        description="Stay updated on our upcoming events designed to empower youth through digital literacy and inclusion."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {events.map((e, i) => (
          <motion.div
            key={e.title}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass-card overflow-hidden group"
          >
            <div className="h-52 overflow-hidden">
              <img src={e.img} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span>{e.location}</span>
                <span>•</span>
                <span>{e.date}</span>
              </div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">{e.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{e.desc}</p>
              <a
                href={e.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan text-sm font-heading font-semibold hover:underline"
              >
                Read More →
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default EventsSection;
