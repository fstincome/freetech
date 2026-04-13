import { useState, useEffect } from "react";
import SectionHeading from "@/components/SectionHeading";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const VideoSection = () => {
  const { t } = useLanguage();
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "about_bg_video").single()
      .then(({ data }) => { if (data) setVideoUrl(data.value); });
  }, []);

  return (
    <section id="video" className="w-full bg-navy">
      <div className="max-w-full">
        <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
          <SectionHeading label={t("workshops.label")} title={t("workshops.title")} description={t("workshops.desc")} light />
        </div>
        <div className="w-full aspect-video">
          {videoUrl && (
            <iframe
              src={videoUrl}
              title="Campus Tech Hackathon"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
