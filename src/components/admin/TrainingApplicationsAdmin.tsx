import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Download, ExternalLink, Mail, Search, Trash2, RefreshCw, Settings2, Save, ChevronLeft, ChevronRight, ArrowDownUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { csvCell, TRAINING_CONTENT_KEY, trainingContentSchema, type TrainingFormContent } from "@/lib/trainingApplication";

type Application = Tables<"training_applications">;
const statuses: Record<string, string> = { pending: "À examiner", reviewed: "Examinée", accepted: "Retenue", rejected: "Non retenue" };
const modules: Record<string, string> = { basic_computing: "Informatique de Base", graphic_design: "Design Graphique" };
const detailFields = ["full_name", "email", "phone", "age", "province", "commune", "quartier", "occupation", "education", "computer_level", "design_level", "computer_access", "contact_owner", "availability", "motivation", "accessibility_needs", "language"] as const;
const languageNames: Record<string, string> = { fr: "Français", en: "English", sw: "Kiswahili" };

export default function TrainingApplicationsAdmin() {
  const [rows, setRows] = useState<Application[]>([]);
  const [content, setContent] = useState<TrainingFormContent>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [module, setModule] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Application | null>(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  const [lang, setLang] = useState<"fr" | "en" | "sw">("fr");
  const [sort, setSort] = useState<"latest" | "oldest" | "name">("latest");
  const queryClient = useQueryClient();
  const load = async () => {
    setLoading(true); setError(false);
    try {
      const [applications, settings] = await Promise.all([
        supabase.from("training_applications").select("*").order("created_at", { ascending: false }),
        supabase.from("site_settings").select("value").eq("key", TRAINING_CONTENT_KEY).single(),
      ]);
      if (applications.error || settings.error) throw new Error("load_failed");
      setRows(applications.data || []);
      setContent(trainingContentSchema.parse(JSON.parse(settings.data.value)) as TrainingFormContent);
    } catch { setError(true); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => { setPage(1); }, [search, status, module, sort]);
  const filtered = useMemo(() => rows.filter(row => (status === "all" || row.status === status) && (module === "all" || row.modules.includes(module)) && [row.full_name, row.email, row.phone, row.city, row.occupation].some(value => value.toLowerCase().includes(search.trim().toLowerCase()))).sort((a, b) => sort === "name" ? a.full_name.localeCompare(b.full_name) : sort === "latest" ? b.created_at.localeCompare(a.created_at) : a.created_at.localeCompare(b.created_at)), [rows, search, status, module, sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, totalPages);
  const updateStatus = async (id: string, next: string) => {
    setBusy(true);
    const { error } = await supabase.from("training_applications").update({ status: next }).eq("id", id);
    setBusy(false);
    if (error) { toast({ title: "Modification impossible", variant: "destructive" }); return; }
    setRows(previous => previous.map(row => row.id === id ? { ...row, status: next } : row));
    setSelected(previous => previous?.id === id ? { ...previous, status: next } : previous);
    toast({ title: "Statut enregistré" });
  };
  const remove = async (row: Application) => {
    if (!confirm(`Supprimer la candidature de ${row.full_name} ?`)) return;
    setBusy(true);
    const { error } = await supabase.from("training_applications").delete().eq("id", row.id);
    setBusy(false);
    if (error) { toast({ title: "Suppression impossible", variant: "destructive" }); return; }
    setRows(previous => previous.filter(item => item.id !== row.id)); setSelected(null);
  };
  const saveContent = async () => {
    const validated = trainingContentSchema.safeParse(content);
    if (!validated.success) { toast({ title: "Complétez tous les textes dans les trois langues", variant: "destructive" }); return; }
    setBusy(true);
    const { error } = await supabase.from("site_settings").update({ value: JSON.stringify(validated.data) }).eq("key", TRAINING_CONTENT_KEY);
    setBusy(false);
    if (error) { toast({ title: "Enregistrement impossible", variant: "destructive" }); return; }
    queryClient.invalidateQueries({ queryKey: ["training-content"] });
    toast({ title: "Formulaire mis à jour" });
  };
  const fieldLabel = (field: string) => content[field]?.fr || (field === "language" ? "Langue du formulaire" : field);
  const fieldValue = (field: (typeof detailFields)[number], row: Application) => {
    const value = row[field];
    if (field === "contact_owner") return content[`owner_${value}`]?.fr || String(value);
    if (field === "language") return languageNames[String(value)] || String(value);
    return content[String(value)]?.fr || String(value || "—");
  };
  const exportCsv = () => {
    const headers = ["Date", "Statut", "Modules", ...detailFields.map(fieldLabel)];
    const lines = filtered.map(row => [row.created_at, statuses[row.status], row.modules.map(m => modules[m]).join(" / "), ...detailFields.map(field => fieldValue(field, row))]);
    const csv = "\uFEFF" + [headers, ...lines].map(line => line.map(csvCell).join(";")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "candidatures-formations.csv"; a.click(); URL.revokeObjectURL(url);
  };
  const statusSelect = (row: Application) => <Select value={row.status} disabled={busy} onValueChange={value => updateStatus(row.id, value)}><SelectTrigger aria-label={`Statut de ${row.full_name}`} className="w-40"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(statuses).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select>;
  if (loading) return <p role="status">Chargement des candidatures…</p>;
  if (error) return <div role="alert" className="space-y-4"><p>Les candidatures n’ont pas pu être chargées.</p><Button variant="outline" onClick={load}><RefreshCw />Réessayer</Button></div>;
  return <div className="space-y-6">
    <header className="flex flex-wrap justify-between gap-4"><div><h1 className="text-2xl md:text-3xl font-bold">Candidatures aux formations</h1><p className="text-muted-foreground mt-2">{content.period?.fr}</p></div><div className="flex flex-wrap gap-2"><Button asChild variant="outline"><a href="/formations" target="_blank" rel="noreferrer"><ExternalLink />Voir le formulaire</a></Button><Button variant="outline" onClick={() => setEditing(value => !value)}><Settings2 />{editing ? "Fermer les textes" : "Modifier le formulaire"}</Button></div></header>
    {editing && <section className="border-y border-border py-6 space-y-5"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex gap-1">{([{ key: "fr", label: "Français" }, { key: "en", label: "English" }, { key: "sw", label: "Kiswahili" }] as const).map(l => <Button key={l.key} variant={lang === l.key ? "secondary" : "ghost"} onClick={() => setLang(l.key)}>{l.label}</Button>)}</div><Button disabled={busy} onClick={saveContent}><Save />Enregistrer les textes</Button></div><div className="grid lg:grid-cols-2 gap-5">{Object.entries(content).map(([key, value]) => <label key={key} className="block text-sm"><span className="block mb-2 font-medium">{value.fr}</span><Textarea aria-label={`Texte ${key}`} maxLength={3000} value={value[lang]} onChange={e => setContent(previous => ({ ...previous, [key]: { ...previous[key], [lang]: e.target.value } }))} /></label>)}</div></section>}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Object.entries(statuses).map(([key, label]) => <div key={key} className="border-l-2 border-primary pl-4 py-2"><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{rows.filter(row => row.status === key).length}</p></div>)}</div>
    <div className="flex flex-wrap gap-3"><div className="relative flex-1 min-w-48"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Rechercher une candidature" placeholder="Nom, email, téléphone, ville…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} /></div><Select value={module} onValueChange={setModule}><SelectTrigger className="w-52" aria-label="Filtrer par module"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous les modules</SelectItem>{Object.entries(modules).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-44" aria-label="Filtrer par statut"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Tous les statuts</SelectItem>{Object.entries(statuses).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}</SelectContent></Select><Select value={sort} onValueChange={value => { if (value === "latest" || value === "oldest" || value === "name") setSort(value); }}><SelectTrigger className="w-44" aria-label="Trier les candidatures"><ArrowDownUp className="w-4 h-4" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="latest">Plus récentes</SelectItem><SelectItem value="oldest">Plus anciennes</SelectItem><SelectItem value="name">Nom A–Z</SelectItem></SelectContent></Select><Button variant="outline" onClick={exportCsv} disabled={!filtered.length}><Download />CSV</Button><Button variant="outline" size="icon" title="Actualiser" aria-label="Actualiser" onClick={load}><RefreshCw /></Button></div>
    <div className="overflow-x-auto border-y border-border"><table className="w-full text-sm text-left"><thead className="bg-muted"><tr>{["Candidat", "Contact", "Modules", "Reçue le", "Statut", ""].map((label, i) => <th key={i} className="px-4 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{filtered.slice((currentPage - 1) * 10, currentPage * 10).map(row => <tr key={row.id} className="border-t border-border"><td className="px-4 py-4"><Button variant="link" className="p-0 h-auto text-left whitespace-normal" onClick={() => setSelected(row)}>{row.full_name}</Button><p className="text-xs text-muted-foreground mt-1">{row.city} · {row.age} ans</p></td><td className="px-4 py-4"><a className="text-primary break-all" href={`mailto:${encodeURIComponent(row.email)}`}>{row.email}</a><p className="text-xs text-muted-foreground mt-1">{row.phone}</p></td><td className="px-4 py-4">{row.modules.map(value => <p key={value}>{modules[value]}</p>)}</td><td className="px-4 py-4 whitespace-nowrap">{new Date(row.created_at).toLocaleDateString("fr-FR")}</td><td className="px-4 py-4">{statusSelect(row)}</td><td className="px-4 py-4"><Button variant="ghost" size="icon" title="Supprimer la candidature" aria-label={`Supprimer ${row.full_name}`} disabled={busy} onClick={() => remove(row)}><Trash2 className="text-destructive" /></Button></td></tr>)}{!filtered.length && <tr><td colSpan={6} className="text-center text-muted-foreground py-12">Aucune candidature{search || status !== "all" || module !== "all" ? " correspondant à ces filtres" : " pour le moment"}.</td></tr>}</tbody></table></div>
    <div className="flex justify-between items-center text-sm gap-3"><span>{filtered.length} candidature(s) · Page {currentPage} / {totalPages}</span><div className="flex gap-2"><Button size="icon" variant="outline" aria-label="Page précédente" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft /></Button><Button size="icon" variant="outline" aria-label="Page suivante" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}><ChevronRight /></Button></div></div>
    <Dialog open={Boolean(selected)} onOpenChange={open => { if (!open) setSelected(null); }}><DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>{selected?.full_name}</DialogTitle></DialogHeader>{selected && <><div className="flex flex-wrap items-center justify-between gap-3">{statusSelect(selected)}<Button asChild variant="outline"><a href={`mailto:${encodeURIComponent(selected.email)}`}><Mail />Répondre par email</a></Button></div><p className="font-medium">{selected.modules.map(value => modules[value]).join(" · ")}</p><dl className="space-y-4">{detailFields.map(field => <div key={field}><dt className="text-xs text-muted-foreground mb-1">{fieldLabel(field)}</dt><dd className="text-sm whitespace-pre-wrap break-words">{fieldValue(field, selected)}</dd></div>)}<div><dt className="text-xs text-muted-foreground">Accord sur l’utilisation des informations</dt><dd className="text-sm">{selected.consent ? "Oui" : "Non"} · {new Date(selected.created_at).toLocaleString("fr-FR")}</dd></div></dl></>}</DialogContent></Dialog>
  </div>;
}