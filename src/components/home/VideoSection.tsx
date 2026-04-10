import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";

const VideoSection = () => {
  const { t } = useLanguage();

  return (
    <section id="video" className="w-full bg-navy">
      <div className="max-w-full">
        <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
          <SectionHeading label={t("workshops.label")} title={t("workshops.title")} description={t("workshops.desc")} light />
        </div>
        <div className="w-full aspect-video">
          <iframe
            src="https://www.youtube.com/embed/av7KgNM5PhA?autoplay=1&mute=1&loop=1&playlist=av7KgNM5PhA"
            title="Campus Tech Hackathon"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
