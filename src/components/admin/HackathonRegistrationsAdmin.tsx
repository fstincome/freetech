import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Download, Mail, Phone, Trash2, Users, Bitcoin, Calendar } from "lucide-react";

const HackathonRegistrationsAdmin = () => {
  const [regs, setRegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("hackathon_registrations" as any)
      .select("*")
      .order("created_at", { ascending: false });
    setRegs((data as any[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette inscription ?")) return;
    const { error } = await supabase.from("hackathon_registrations" as any).delete().eq("id", id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Supprimé" });
    fetchAll();
  };

  const exportCSV = () => {
    if (regs.length === 0) return;
    const headers = ["full_name", "email", "phone", "profession", "bitcoin_level", "target_hackathon", "specialty", "languages", "motivation", "created_at"];
    const rows = regs.map(r =>
      headers.map(h => {
        const v = h === "languages" ? (r[h] || []).join("|") : (r[h] ?? "");
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hackathon-registrations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totals = {
    all: regs.length,
    day1: regs.filter(r => r.target_hackathon === "day1" || r.target_hackathon === "both").length,
    day2: regs.filter(r => r.target_hackathon === "day2" || r.target_hackathon === "both").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Bitcoin size={22} className="text-orange-500" /> Inscriptions Hackathon
        </h2>
        <Button onClick={exportCSV} disabled={regs.length === 0} className="bg-cyan text-navy hover:bg-cyan/90">
          <Download size={16} className="mr-1" /> Exporter CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Users size={16} /> Total inscriptions</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-heading font-bold text-orange-500">{totals.all}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Calendar size={16} /> Hackathon #1 (June 5)</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-heading font-bold text-cyan">{totals.day1}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Calendar size={16} /> Hackathon #2 (June 6)</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-heading font-bold text-cyan">{totals.day2}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Liste des inscriptions</CardTitle></CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Chargement...</p>
          ) : regs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Aucune inscription pour l'instant</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left">
                  <tr>
                    <th className="p-3 font-medium">Nom</th>
                    <th className="p-3 font-medium hidden md:table-cell">Email</th>
                    <th className="p-3 font-medium hidden md:table-cell">Niveau</th>
                    <th className="p-3 font-medium hidden lg:table-cell">Spécialité</th>
                    <th className="p-3 font-medium">Cible</th>
                    <th className="p-3 font-medium hidden lg:table-cell">Date</th>
                    <th className="p-3 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regs.map(r => (
                    <tr key={r.id} className="border-t border-border hover:bg-muted/50 cursor-pointer" onClick={() => setSelected(r)}>
                      <td className="p-3 font-medium">{r.full_name}</td>
                      <td className="p-3 hidden md:table-cell text-muted-foreground">{r.email}</td>
                      <td className="p-3 hidden md:table-cell">
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium">
                          {r.bitcoin_level}
                        </span>
                      </td>
                      <td className="p-3 hidden lg:table-cell">{r.specialty}</td>
                      <td className="p-3 text-xs">{r.target_hackathon === "both" ? "Both" : r.target_hackathon === "day1" ? "Day 1" : "Day 2"}</td>
                      <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                      <td className="p-3">
                        <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="text-destructive">
                          <Trash2 size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-heading font-bold mb-1">{selected.full_name}</h3>
            <p className="text-xs text-muted-foreground mb-4">{new Date(selected.created_at).toLocaleString()}</p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Mail size={14} className="text-muted-foreground" /> <a href={`mailto:${selected.email}`} className="text-cyan hover:underline">{selected.email}</a></p>
              {selected.phone && <p className="flex items-center gap-2"><Phone size={14} className="text-muted-foreground" /> {selected.phone}</p>}
              {selected.profession && <p><span className="text-muted-foreground">Profession:</span> {selected.profession}</p>}
              <p><span className="text-muted-foreground">Niveau:</span> {selected.bitcoin_level}</p>
              <p><span className="text-muted-foreground">Spécialité:</span> {selected.specialty}</p>
              <p><span className="text-muted-foreground">Cible:</span> {selected.target_hackathon}</p>
              {selected.languages?.length > 0 && (
                <div>
                  <span className="text-muted-foreground">Langages:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selected.languages.map((l: string) => (
                      <span key={l} className="px-2 py-0.5 rounded-full bg-muted text-xs">{l}</span>
                    ))}
                  </div>
                </div>
              )}
              {selected.motivation && (
                <div>
                  <p className="text-muted-foreground mt-3 mb-1">Motivation:</p>
                  <p className="whitespace-pre-wrap bg-muted/50 rounded-lg p-3">{selected.motivation}</p>
                </div>
              )}
            </div>
            <Button onClick={() => setSelected(null)} variant="outline" className="w-full mt-4">Fermer</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HackathonRegistrationsAdmin;
