import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Download, FileSpreadsheet, FileText, Mail, Phone, Trash2, Users, Bitcoin, Calendar, CheckCircle2,
  XCircle, Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";

type SortKey = "full_name" | "email" | "bitcoin_level" | "specialty" | "target_hackathon" | "status" | "created_at";
type SortDir = "asc" | "desc";

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  accepted: "bg-green-500/15 text-green-600 dark:text-green-400",
  rejected: "bg-red-500/15 text-red-600 dark:text-red-400",
};

const PAGE_SIZE = 10;

const HackathonRegistrationsAdmin = () => {
  const [regs, setRegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  const updateStatus = async (id: string, status: "accepted" | "rejected" | "pending") => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("hackathon_registrations" as any)
      .update({ status } as any)
      .eq("id", id);
    setUpdatingId(null);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: status === "accepted" ? "Accepté ✓" : status === "rejected" ? "Refusé" : "Remis en attente" });
    setRegs((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    if (selected?.id === id) setSelected({ ...selected, status });
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return regs.filter((r) => {
      if (statusFilter !== "all" && (r.status || "pending") !== statusFilter) return false;
      if (!q) return true;
      return [r.full_name, r.email, r.phone, r.profession, r.specialty, r.bitcoin_level, r.motivation]
        .some((v) => String(v || "").toLowerCase().includes(q));
    });
  }, [regs, search, statusFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, statusFilter, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir("asc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey !== k ? <ChevronDown size={12} className="opacity-30" /> :
    sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />;

  const exportHeaders = ["full_name", "email", "phone", "profession", "bitcoin_level", "target_hackathon", "specialty", "languages", "motivation", "status", "created_at"];
  const today = () => new Date().toISOString().split("T")[0];

  const exportCSV = () => {
    if (regs.length === 0) return;
    const rows = regs.map(r =>
      exportHeaders.map(h => {
        const v = h === "languages" ? (r[h] || []).join("|") : (r[h] ?? "");
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(",")
    );
    const csv = [exportHeaders.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hackathon-registrations-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportXLSX = () => {
    if (regs.length === 0) return;
    const rows = regs.map(r => exportHeaders.map(h => h === "languages" ? (r[h] || []).join(", ") : (h === "created_at" ? new Date(r[h]).toLocaleString() : (r[h] ?? ""))));
    const ws = XLSX.utils.aoa_to_sheet([exportHeaders, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Registrations");
    XLSX.writeFile(wb, `hackathon-registrations-${today()}.xlsx`);
  };

  const exportPDF = () => {
    if (regs.length === 0) return;
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(14);
    doc.text("Hackathon Buja — Registrations", 14, 14);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleString()} — Total: ${regs.length}`, 14, 20);
    const cols = ["Name", "Email", "Phone", "Level", "Target", "Specialty", "Status", "Date"];
    const body = regs.map(r => [
      r.full_name, r.email, r.phone || "", r.bitcoin_level, r.target_hackathon,
      r.specialty, r.status || "pending", new Date(r.created_at).toLocaleDateString(),
    ]);
    autoTable(doc, { head: [cols], body, startY: 25, styles: { fontSize: 8 }, headStyles: { fillColor: [251, 146, 60] } });
    doc.save(`hackathon-registrations-${today()}.pdf`);
  };

  const totals = {
    all: regs.length,
    accepted: regs.filter((r) => r.status === "accepted").length,
    pending: regs.filter((r) => !r.status || r.status === "pending").length,
    rejected: regs.filter((r) => r.status === "rejected").length,
    day1: regs.filter(r => r.target_hackathon === "day1" || r.target_hackathon === "both").length,
    day2: regs.filter(r => r.target_hackathon === "day2" || r.target_hackathon === "both").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-heading font-bold flex items-center gap-2">
          <Bitcoin size={22} className="text-orange-500" /> Inscriptions Hackathon
        </h2>
        <div className="flex gap-2 flex-wrap">
          <Button onClick={exportCSV} disabled={regs.length === 0} variant="outline" size="sm">
            <Download size={14} className="mr-1" /> CSV
          </Button>
          <Button onClick={exportXLSX} disabled={regs.length === 0} variant="outline" size="sm" className="text-green-600 border-green-600/40 hover:bg-green-500/10">
            <FileSpreadsheet size={14} className="mr-1" /> Excel
          </Button>
          <Button onClick={exportPDF} disabled={regs.length === 0} variant="outline" size="sm" className="text-red-600 border-red-600/40 hover:bg-red-500/10">
            <FileText size={14} className="mr-1" /> PDF
          </Button>
        </div>
      </div>


      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground flex items-center gap-2"><Users size={14} /> Total</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-heading font-bold text-orange-500">{totals.all}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground flex items-center gap-2"><CheckCircle2 size={14} /> Acceptés</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-heading font-bold text-green-600 dark:text-green-400">{totals.accepted} / 30</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground flex items-center gap-2"><Calendar size={14} /> En attente</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-heading font-bold">{totals.pending}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground flex items-center gap-2"><XCircle size={14} /> Refusés</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-heading font-bold text-red-500">{totals.rejected}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <CardTitle>Liste des inscriptions</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher (nom, email, profession...)"
                  className="pl-8 h-9 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="all">Tous statuts</option>
                <option value="pending">En attente</option>
                <option value="accepted">Acceptés</option>
                <option value="rejected">Refusés</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Chargement...</p>
          ) : sorted.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Aucune inscription</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted text-left">
                    <tr>
                      <th className="p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("full_name")}>
                        <span className="inline-flex items-center gap-1">Nom <SortIcon k="full_name" /></span>
                      </th>
                      <th className="p-3 font-medium hidden md:table-cell cursor-pointer select-none" onClick={() => toggleSort("email")}>
                        <span className="inline-flex items-center gap-1">Email <SortIcon k="email" /></span>
                      </th>
                      <th className="p-3 font-medium hidden md:table-cell cursor-pointer select-none" onClick={() => toggleSort("bitcoin_level")}>
                        <span className="inline-flex items-center gap-1">Niveau <SortIcon k="bitcoin_level" /></span>
                      </th>
                      <th className="p-3 font-medium hidden lg:table-cell cursor-pointer select-none" onClick={() => toggleSort("specialty")}>
                        <span className="inline-flex items-center gap-1">Spécialité <SortIcon k="specialty" /></span>
                      </th>
                      <th className="p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("target_hackathon")}>
                        <span className="inline-flex items-center gap-1">Présence <SortIcon k="target_hackathon" /></span>
                      </th>
                      <th className="p-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("status")}>
                        <span className="inline-flex items-center gap-1">Statut <SortIcon k="status" /></span>
                      </th>
                      <th className="p-3 font-medium hidden lg:table-cell cursor-pointer select-none" onClick={() => toggleSort("created_at")}>
                        <span className="inline-flex items-center gap-1">Date <SortIcon k="created_at" /></span>
                      </th>
                      <th className="p-3 w-44">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((r) => {
                      const status = r.status || "pending";
                      return (
                        <tr key={r.id} className="border-t border-border hover:bg-muted/50">
                          <td className="p-3 font-medium cursor-pointer" onClick={() => setSelected(r)}>{r.full_name}</td>
                          <td className="p-3 hidden md:table-cell text-muted-foreground">{r.email}</td>
                          <td className="p-3 hidden md:table-cell">
                            <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-medium">
                              {r.bitcoin_level}
                            </span>
                          </td>
                          <td className="p-3 hidden lg:table-cell">{r.specialty}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[status]}`}>
                              {status}
                            </span>
                          </td>
                          <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              {status !== "accepted" && (
                                <Button
                                  size="sm" variant="ghost" title="Accepter"
                                  disabled={updatingId === r.id}
                                  onClick={(e) => { e.stopPropagation(); updateStatus(r.id, "accepted"); }}
                                  className="text-green-600 dark:text-green-400 hover:bg-green-500/10"
                                >
                                  {updatingId === r.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                </Button>
                              )}
                              {status !== "rejected" && (
                                <Button
                                  size="sm" variant="ghost" title="Refuser"
                                  disabled={updatingId === r.id}
                                  onClick={(e) => { e.stopPropagation(); updateStatus(r.id, "rejected"); }}
                                  className="text-red-500 hover:bg-red-500/10"
                                >
                                  <XCircle size={14} />
                                </Button>
                              )}
                              {status !== "pending" && (
                                <Button
                                  size="sm" variant="ghost" title="Remettre en attente"
                                  disabled={updatingId === r.id}
                                  onClick={(e) => { e.stopPropagation(); updateStatus(r.id, "pending"); }}
                                >
                                  ↺
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="text-destructive">
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-muted-foreground">
                  {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, sorted.length)} sur {sorted.length}
                </span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>
                    <ChevronLeft size={14} />
                  </Button>
                  <span className="text-xs font-mono">Page {currentPage} / {totalPages}</span>
                  <Button size="sm" variant="outline" disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-2 mb-1">
              <h3 className="text-xl font-heading font-bold">{selected.full_name}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[selected.status || "pending"]}`}>
                {selected.status || "pending"}
              </span>
            </div>
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
            <div className="flex flex-wrap gap-2 mt-5">
              <Button
                onClick={() => updateStatus(selected.id, "accepted")}
                disabled={updatingId === selected.id || selected.status === "accepted"}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                <CheckCircle2 size={14} className="mr-1" /> Accepter
              </Button>
              <Button
                onClick={() => updateStatus(selected.id, "rejected")}
                disabled={updatingId === selected.id || selected.status === "rejected"}
                variant="outline"
                className="border-red-500/40 text-red-500 hover:bg-red-500/10 flex-1"
              >
                <XCircle size={14} className="mr-1" /> Refuser
              </Button>
              <Button onClick={() => setSelected(null)} variant="ghost" className="flex-1">Fermer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HackathonRegistrationsAdmin;
