import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/useAdmin";
import AdminCrudTable from "@/components/admin/AdminCrudTable";
import HackathonRegistrationsAdmin from "@/components/admin/HackathonRegistrationsAdmin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogOut, BarChart3, Globe, Eye, Calendar } from "lucide-react";
import logo from "@/assets/logo.png";

type Tab = "stats" | "hero" | "about" | "programs" | "workshops" | "events" | "partners" | "testimonials" | "impact" | "reports" | "team" | "settings" | "hackathon_regs" | "hackathon_trainers";

const tabs: { key: Tab; label: string }[] = [
  { key: "stats", label: "📊 Statistiques" },
  { key: "hero", label: "🎠 Hero Slides" },
  { key: "about", label: "🧭 Qui sommes-nous" },
  { key: "programs", label: "📚 Programmes" },
  { key: "workshops", label: "🔧 Workshops" },
  { key: "events", label: "📅 Événements" },
  { key: "partners", label: "🤝 Partenaires" },
  { key: "testimonials", label: "💬 Témoignages" },
  { key: "impact", label: "📈 Impact" },
  { key: "reports", label: "📄 Rapports" },
  { key: "team", label: "👥 Équipe" },
  { key: "hackathon_trainers", label: "₿ Formateurs Hackathon" },
  { key: "hackathon_regs", label: "📝 Inscriptions Hackathon" },
  { key: "settings", label: "⚙️ Paramètres" },
];

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [data, setData] = useState<Record<string, any[]>>({});
  const [visitorStats, setVisitorStats] = useState<{ byCountry: any[]; byDate: any[]; total: number }>({ byCountry: [], byDate: [], total: 0 });
  const [statsPeriod, setStatsPeriod] = useState("30");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login", { replace: true });
  }, [user, isAdmin, loading, navigate]);
  const fetchAll = async () => {
    const [hero, programs, workshops, events, partners, testimonials, impact, reports, team, settings, hackTrainers, about] = await Promise.all([
      supabase.from("site_hero_slides").select("*").order("sort_order"),
      supabase.from("site_programs").select("*").order("sort_order"),
      supabase.from("site_workshops").select("*").order("sort_order"),
      supabase.from("site_events").select("*").order("sort_order"),
      supabase.from("site_partners").select("*").order("sort_order"),
      supabase.from("site_testimonials").select("*").order("sort_order"),
      supabase.from("site_impact_stats").select("*").order("sort_order"),
      supabase.from("site_reports").select("*").order("sort_order"),
      supabase.from("site_team_members" as any).select("*").order("sort_order"),
      supabase.from("site_settings").select("*"),
      supabase.from("hackathon_trainers" as any).select("*").order("sort_order"),
      supabase.from("site_about" as any).select("*").order("sort_order"),
    ]);
    setData({
      hero: hero.data || [], programs: programs.data || [], workshops: workshops.data || [],
      events: events.data || [], partners: partners.data || [], testimonials: testimonials.data || [],
      impact: impact.data || [], reports: reports.data || [], team: team.data || [], settings: settings.data || [],
      hackathon_trainers: (hackTrainers as any).data || [],
      about: (about as any).data || [],
    });
  };

  const fetchStats = async () => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(statsPeriod));
    const { data: logs } = await supabase.from("visitor_logs").select("*").gte("visited_at", daysAgo.toISOString()).order("visited_at", { ascending: false });
    if (!logs) return;

    const byCountry: Record<string, number> = {};
    const byDate: Record<string, number> = {};
    logs.forEach(l => {
      const c = l.country || "Unknown";
      byCountry[c] = (byCountry[c] || 0) + 1;
      const d = l.visited_at.split("T")[0];
      byDate[d] = (byDate[d] || 0) + 1;
    });

    setVisitorStats({
      total: logs.length,
      byCountry: Object.entries(byCountry).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      byDate: Object.entries(byDate).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
    });
  };

  useEffect(() => { if (isAdmin) { fetchAll(); fetchStats(); } }, [isAdmin]);
  useEffect(() => { if (isAdmin) fetchStats(); }, [statsPeriod]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p>Chargement...</p></div>;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy text-white px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={logo} alt="FREETI" className="h-10" />
          <span className="font-heading font-bold text-lg hidden md:block">Admin Dashboard</span>
        </div>
        <Button onClick={handleLogout} variant="ghost" className="text-white hover:text-cyan">
          <LogOut size={18} className="mr-2" /> Déconnexion
        </Button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-64px)] bg-card border-r border-border p-4 hidden md:block">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${activeTab === t.key ? "bg-cyan/15 text-cyan" : "text-muted-foreground hover:bg-muted"}`}
            >
              {t.label}
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden w-full overflow-x-auto border-b border-border bg-card px-2 py-2 flex gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium ${activeTab === t.key ? "bg-cyan/15 text-cyan" : "text-muted-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
          {activeTab === "stats" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-heading font-bold">Statistiques Visiteurs</h2>
                <Select value={statsPeriod} onValueChange={setStatsPeriod}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 derniers jours</SelectItem>
                    <SelectItem value="30">30 derniers jours</SelectItem>
                    <SelectItem value="90">3 derniers mois</SelectItem>
                    <SelectItem value="365">12 derniers mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Eye size={16} /> Total Visites</CardTitle></CardHeader>
                  <CardContent><p className="text-3xl font-heading font-bold text-cyan">{visitorStats.total}</p></CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Globe size={16} /> Pays</CardTitle></CardHeader>
                  <CardContent><p className="text-3xl font-heading font-bold text-cyan">{visitorStats.byCountry.length}</p></CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Calendar size={16} /> Moy/Jour</CardTitle></CardHeader>
                  <CardContent><p className="text-3xl font-heading font-bold text-cyan">{visitorStats.byDate.length > 0 ? Math.round(visitorStats.total / visitorStats.byDate.length) : 0}</p></CardContent>
                </Card>
              </div>

              {/* By Country */}
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 size={18} /> Visites par Pays</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {visitorStats.byCountry.map(c => (
                      <div key={c.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm font-medium">{c.name}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-cyan rounded-full" style={{ width: `${(c.count / visitorStats.total) * 100}%` }} />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{c.count}</span>
                        </div>
                      </div>
                    ))}
                    {visitorStats.byCountry.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">Aucune donnée pour cette période</p>}
                  </div>
                </CardContent>
              </Card>

              {/* By Date */}
              <Card>
                <CardHeader><CardTitle>Visites par Jour</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {visitorStats.byDate.map(d => (
                      <div key={d.date} className="flex items-center justify-between py-1.5">
                        <span className="text-xs text-muted-foreground">{d.date}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-40 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-cyan rounded-full" style={{ width: `${Math.min((d.count / Math.max(...visitorStats.byDate.map(x => x.count))) * 100, 100)}%` }} />
                          </div>
                          <span className="text-xs w-8 text-right">{d.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "hero" && (
            <AdminCrudTable
              title="Hero Slides"
              tableName="site_hero_slides"
              fields={[
                { key: "label", label: "Label", type: "text" },
                { key: "title", label: "Titre", type: "text" },
                { key: "subtitle", label: "Sous-titre", type: "text" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "image_url", label: "Image URL", type: "url" },
                { key: "sort_order", label: "Ordre", type: "number" },
              ]}
              data={data.hero || []}
              onRefresh={fetchAll}
            />
          )}

          {activeTab === "about" && (
            <AdminCrudTable
              title="Section « Qui sommes-nous » (multilingue)"
              tableName="site_about"
              fields={[
                { key: "section_key", label: "Clé (ne pas modifier)", type: "text" },
                { key: "label", label: "Libellé", type: "text" },
                { key: "fr", label: "Français", type: "textarea" },
                { key: "en", label: "English", type: "textarea" },
                { key: "sw", label: "Kiswahili", type: "textarea" },
                { key: "sort_order", label: "Ordre", type: "number" },
              ]}
              data={data.about || []}
              onRefresh={fetchAll}
            />
          )}



          {activeTab === "programs" && (
            <AdminCrudTable
              title="Programmes"
              tableName="site_programs"
              fields={[
                { key: "name", label: "Nom", type: "text" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "image_url", label: "Image URL", type: "url" },
                { key: "sort_order", label: "Ordre", type: "number" },
              ]}
              data={data.programs || []}
              onRefresh={fetchAll}
            />
          )}

          {activeTab === "workshops" && (
            <AdminCrudTable
              title="Workshops"
              tableName="site_workshops"
              fields={[
                { key: "title", label: "Titre", type: "text" },
                { key: "image_url", label: "Image URL", type: "url" },
                { key: "gallery", label: "Galerie (URLs séparées par des virgules)", type: "array" },
                { key: "sort_order", label: "Ordre", type: "number" },
              ]}
              data={data.workshops || []}
              onRefresh={fetchAll}
            />
          )}

          {activeTab === "events" && (
            <AdminCrudTable
              title="Événements"
              tableName="site_events"
              fields={[
                { key: "title", label: "Titre", type: "text" },
                { key: "location", label: "Lieu", type: "text" },
                { key: "event_date", label: "Date", type: "text" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "image_url", label: "Image URL", type: "url" },
                { key: "link", label: "Lien", type: "text" },
                { key: "sort_order", label: "Ordre", type: "number" },
              ]}
              data={data.events || []}
              onRefresh={fetchAll}
            />
          )}

          {activeTab === "partners" && (
            <AdminCrudTable
              title="Partenaires"
              tableName="site_partners"
              fields={[
                { key: "name", label: "Nom", type: "text" },
                { key: "logo_url", label: "Logo URL", type: "url" },
                { key: "partner_type", label: "Type (main/supporting)", type: "text" },
                { key: "sort_order", label: "Ordre", type: "number" },
              ]}
              data={data.partners || []}
              onRefresh={fetchAll}
            />
          )}

          {activeTab === "testimonials" && (
            <AdminCrudTable
              title="Témoignages"
              tableName="site_testimonials"
              fields={[
                { key: "author_name", label: "Nom", type: "text" },
                { key: "author_role", label: "Rôle", type: "text" },
                { key: "text", label: "Témoignage", type: "textarea" },
                { key: "author_image_url", label: "Photo URL", type: "url" },
                { key: "sort_order", label: "Ordre", type: "number" },
              ]}
              data={data.testimonials || []}
              onRefresh={fetchAll}
            />
          )}

          {activeTab === "impact" && (
            <AdminCrudTable
              title="Impact Stats"
              tableName="site_impact_stats"
              fields={[
                { key: "value", label: "Valeur", type: "text" },
                { key: "label", label: "Label (défaut)", type: "text" },
                { key: "label_fr", label: "Label FR", type: "text" },
                { key: "label_en", label: "Label EN", type: "text" },
                { key: "label_sw", label: "Label SW", type: "text" },
                { key: "sort_order", label: "Ordre", type: "number" },
              ]}

              data={data.impact || []}
              onRefresh={fetchAll}
            />
          )}

          {activeTab === "reports" && (
            <AdminCrudTable
              title="Rapports Annuels"
              tableName="site_reports"
              fields={[
                { key: "title", label: "Titre", type: "text" },
                { key: "year", label: "Année", type: "number" },
                { key: "description", label: "Description", type: "textarea" },
                { key: "drive_link", label: "Lien Google Drive", type: "text" },
                { key: "cover_image_url", label: "Image de couverture URL", type: "url" },
                { key: "sort_order", label: "Ordre", type: "number" },
              ]}
              data={data.reports || []}
              onRefresh={fetchAll}
            />
          )}

          {activeTab === "team" && (
            <AdminCrudTable
              title="Équipe"
              tableName="site_team_members"
              fields={[
                { key: "name", label: "Nom", type: "text" },
                { key: "role", label: "Rôle", type: "text" },
                { key: "is_board", label: "Board", type: "boolean" },
                { key: "image_url", label: "Photo URL", type: "url" },
                { key: "bio", label: "Bio", type: "textarea" },
                { key: "linkedin_url", label: "LinkedIn URL", type: "text" },
                { key: "twitter_url", label: "Twitter / X URL", type: "text" },
                { key: "sort_order", label: "Ordre", type: "number" },
              ]}
              data={data.team || []}
              onRefresh={fetchAll}
            />
          )}

          {activeTab === "hackathon_trainers" && (
            <AdminCrudTable
              title="Formateurs Hackathon Buja"
              tableName="hackathon_trainers"
              fields={[
                { key: "name", label: "Nom", type: "text" },
                { key: "role", label: "Rôle", type: "text" },
                { key: "image_url", label: "Photo URL", type: "url" },
                { key: "bio", label: "Bio", type: "textarea" },
                { key: "twitter_url", label: "Twitter / X URL", type: "text" },
                { key: "linkedin_url", label: "LinkedIn URL", type: "text" },
                { key: "sort_order", label: "Ordre", type: "number" },
              ]}
              data={data.hackathon_trainers || []}
              onRefresh={fetchAll}
            />
          )}

          {activeTab === "hackathon_regs" && <HackathonRegistrationsAdmin />}

          {activeTab === "settings" && (
            <AdminCrudTable
              title="Paramètres du Site"
              tableName="site_settings"
              fields={[
                { key: "key", label: "Clé", type: "text" },
                { key: "value", label: "Valeur", type: "text" },
              ]}
              data={data.settings || []}
              onRefresh={fetchAll}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
