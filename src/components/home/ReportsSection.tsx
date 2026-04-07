import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import SectionHeading from "@/components/SectionHeading";
import { FileText, Download, Eye } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
  // Extract file ID from various Google Drive URL formats
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

const getGoogleDriveDownloadUrl = (link: string) => {
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of patterns) {
    const match = link.match(pattern);
    if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return link;
};

const ReportsSection = () => {
  const { t } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  useEffect(() => {
    supabase
      .from("site_reports")
      .select("*")
      .order("sort_order")
      .then(({ data }) => {
        if (data) setReports(data);
      });
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
              className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {report.description}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setPreviewReport(report)}
                    className="flex-1 flex items-center justify-center gap-2 bg-cyan/10 text-cyan hover:bg-cyan/20 font-medium text-sm py-2.5 rounded-xl transition-colors"
                  >
                    <Eye size={16} />
                    {t("reports.preview")}
                  </button>
                  <a
                    href={getGoogleDriveDownloadUrl(report.drive_link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-cyan text-navy hover:bg-cyan/90 font-medium text-sm py-2.5 rounded-xl transition-colors"
                  >
                    <Download size={16} />
                    {t("reports.download")}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewReport !== null} onOpenChange={() => setPreviewReport(null)}>
        <DialogContent className="max-w-4xl w-[95vw] h-[85vh] p-0 overflow-hidden">
          {previewReport && (
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border bg-card">
                <div>
                  <h3 className="font-heading font-bold text-foreground">{previewReport.title}</h3>
                  <p className="text-xs text-muted-foreground">{previewReport.year}</p>
                </div>
                <a
                  href={getGoogleDriveDownloadUrl(previewReport.drive_link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-cyan text-navy hover:bg-cyan/90 font-medium text-sm px-4 py-2 rounded-xl transition-colors"
                >
                  <Download size={16} />
                  {t("reports.download")}
                </a>
              </div>
              <iframe
                src={getGoogleDrivePreviewUrl(previewReport.drive_link)}
                className="flex-1 w-full"
                allow="autoplay"
                title={previewReport.title}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ReportsSection;
