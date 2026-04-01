import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useVisitorTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const track = async () => {
      try {
        // Get country from free API
        let country = "";
        let city = "";
        try {
          const res = await fetch("https://ipapi.co/json/");
          if (res.ok) {
            const geo = await res.json();
            country = geo.country_name || "";
            city = geo.city || "";
          }
        } catch {}

        await supabase.from("visitor_logs").insert({
          page_path: location.pathname,
          country,
          city,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
        });
      } catch {}
    };
    track();
  }, [location.pathname]);
};
