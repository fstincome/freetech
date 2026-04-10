import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/SectionHeading";
import { FileText, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface Report {
  id: string;
  title: string;
  year: number;
  description: string;
  drive_link: string;
  cover_image_url: string;
  sort_order: number;
}

const getGoogleDrivePreviewUrl = (link: string) => {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = link.match(pattern);
    if (match) return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return link;
};

// Generate a subtle page flip sound using Web Audio API
const playPageFlipSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const duration = 0.3;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Create a paper-like rustling sound
    for (let i = 0; i < bufferSize; i++) {
      const t = i / ctx.sampleRate;
      const envelope = Math.exp(-t * 12) * (1 - Math.exp(-t * 80));
      data[i] = (Math.random() * 2 - 1) * envelope * 0.15;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Add a bandpass filter for more realistic paper sound
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 3000;
    filter.Q.value = 0.8;

    source.connect(filter);
    filter.connect(ctx.destination);
    source.start();
    source.onended = () => ctx.close();
  } catch (e) {
    // Silently fail if audio isn't available
  }
};

const ReportsSection = () => {
  const { t } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);
  const [readingReport, setReadingReport] = useState<Report | null>(null);

  useEffect(() => {
    supabase
      .from("site_reports")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setReports(data);
      });
  }, []);

  const handleOpenReport = useCallback((report: Report) => {
    playPageFlipSound();
    setReadingReport(report);
  }, []);

  if (reports.length === 0) return null;

  return (
    <section id="reports" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading
          label={t("reports.label")}
          title={t("reports.title")}
          description={t("reports.desc")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {reports.map((report) => (
            <div
              key={report.id}
              onClick={() => handleOpenReport(report)}
              className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Cover Image */}
              {report.cover_image_url ? (
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={report.cover_image_url}
                    alt={report.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-cyan text-navy text-xs font-bold px-3 py-1 rounded-full">
                    {report.year}
                  </div>
                  {/* Read overlay on hover */}
                  <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <BookOpen size={24} />
                      <span>{t("reports.read")}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative h-56 bg-gradient-to-br from-navy to-cyan/30 flex items-center justify-center">
                  <FileText size={64} className="text-cyan/50" />
                  <div className="absolute top-3 right-3 bg-cyan text-navy text-xs font-bold px-3 py-1 rounded-full">
                    {report.year}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                  {report.title}
                </h3>
                {report.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {report.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reading Dialog - Book-style */}
      <Dialog open={readingReport !== null} onOpenChange={() => setReadingReport(null)}>
        <DialogContent className="max-w-5xl w-[96vw] h-[90vh] p-0 overflow-hidden rounded-xl border-2 border-border shadow-2xl">
          {readingReport && (
            <div className="flex flex-col h-full bg-[#f5f0e8] dark:bg-card">
              <DialogTitle className="sr-only">{readingReport.title}</DialogTitle>
              <DialogDescription className="sr-only">
                Lecture du rapport {readingReport.title}
              </DialogDescription>
              {/* Book header */}
              <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-navy to-navy/90 text-white">
                <div className="flex items-center gap-3">
                  <BookOpen size={20} className="text-cyan" />
                  <div>
                    <h3 className="font-heading font-bold text-sm">{readingReport.title}</h3>
                    <p className="text-xs text-white/60">{readingReport.year}</p>
                  </div>
                </div>
              </div>
              {/* Book content - Google Drive viewer */}
              <iframe
                src={getGoogleDrivePreviewUrl(readingReport.drive_link)}
                className="flex-1 w-full border-none"
                allow="autoplay"
                title={readingReport.title}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReportsSection;
