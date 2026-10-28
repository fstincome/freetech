import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, ArrowUp, ArrowDown, Eye, EyeOff, Loader2, CornerDownRight } from "lucide-react";

interface MenuItem {
  id: string;
  parent_id: string | null;
  label_fr: string;
  label_en: string;
  label_sw: string;
  link: string;
  highlight: boolean;
  visible: boolean;
  sort_order: number;
}

const MenuAdmin = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Partial<MenuItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchItems = async () => {
    const { data, error } = await supabase.from("site_menu_items").select("*").order("sort_order");
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    setItems((data || []) as MenuItem[]);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const tops = items.filter(i => !i.parent_id).sort((a, b) => a.sort_order - b.sort_order);
  const childrenOf = (pid: string) => items.filter(i => i.parent_id === pid).sort((a, b) => a.sort_order - b.sort_order);

  const reorder = async (siblings: MenuItem[], from: number, to: number) => {
    if (to < 0 || to >= siblings.length) return;
    const arr = [...siblings];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setBusyId(moved.id);
    const results = await Promise.all(arr.map((s, i) => supabase.from("site_menu_items").update({ sort_order: i }).eq("id", s.id)));
    setBusyId(null);
    const err = results.find(r => r.error);
    if (err?.error) { toast({ title: "Erreur", description: err.error.message, variant: "destructive" }); return; }
    fetchItems();
  };

  const toggleVisible = async (item: MenuItem) => {
    setBusyId(item.id);
    const { error } = await supabase.from("site_menu_items").update({ visible: !item.visible }).eq("id", item.id);
    setBusyId(null);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: !item.visible ? "Élément affiché ✓" : "Élément masqué ✓" });
    fetchItems();
  };

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(item.parent_id ? "Supprimer ce sous-élément ?" : "Supprimer cet élément et tous ses sous-éléments ?")) return;
    setBusyId(item.id);
    const { error } = await supabase.from("site_menu_items").delete().eq("id", item.id);
    setBusyId(null);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Supprimé" });
    fetchItems();
  };

  const openNew = (parentId?: string) => {
    setIsNew(true);
    setEdit({ parent_id: parentId ?? null, label_fr: "", label_en: "", label_sw: "", link: "", highlight: false, visible: true, sort_order: 0 });
  };

  const openEdit = (item: MenuItem) => {
    setIsNew(false);
    setEdit({ ...item });
  };

  const handleSave = async () => {
    if (!edit) return;
    if (!edit.label_fr?.trim() && !edit.label_en?.trim()) {
      toast({ title: "Libellé requis", description: "Remplissez au moins le libellé français ou anglais.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const payload = {
      parent_id: edit.parent_id || null,
      label_fr: edit.label_fr || "",
      label_en: edit.label_en || "",
      label_sw: edit.label_sw || "",
      link: edit.link || "",
      highlight: !!edit.highlight,
      visible: edit.visible !== false,
      sort_order: Number(edit.sort_order) || 0,
    };
    const { error } = isNew
      ? await supabase.from("site_menu_items").insert(payload)
      : await supabase.from("site_menu_items").update(payload).eq("id", edit.id!);
    setSaving(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: isNew ? "Créé ✓" : "Mis à jour ✓" });
    setEdit(null);
    fetchItems();
  };

  const renderRow = (item: MenuItem, depth: number, siblings: MenuItem[], index: number) => (
    <tr key={item.id} className={`border-t border-border hover:bg-muted/50 ${!item.visible ? "opacity-60" : ""}`}>
      <td className="p-3">
        <div className={`flex items-center gap-2 ${depth > 0 ? "pl-6 text-muted-foreground" : "font-medium"}`}>
          {depth > 0 && <CornerDownRight size={14} className="shrink-0" />}
          <span>{item.label_fr || item.label_en}</span>
          {item.label_en && item.label_fr !== item.label_en && (
            <span className="text-xs text-muted-foreground">({item.label_en})</span>
          )}
          {item.highlight && <span className="px-2 py-0.5 rounded-full bg-cyan/20 text-cyan text-xs font-semibold">Cyan</span>}
        </div>
      </td>
      <td className="p-3 max-w-[220px] truncate text-muted-foreground">{item.link || "—"}</td>
      <td className="p-3">
        {item.visible ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan/20 text-cyan text-xs font-semibold"><Eye size={12} /> Affiché</span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-semibold"><EyeOff size={12} /> Masqué</span>
        )}
      </td>
      <td className="p-3">
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" disabled={index === 0 || busyId === item.id} onClick={() => reorder(siblings, index, index - 1)} title="Monter"><ArrowUp size={14} /></Button>
          <Button size="sm" variant="ghost" disabled={index === siblings.length - 1 || busyId === item.id} onClick={() => reorder(siblings, index, index + 1)} title="Descendre"><ArrowDown size={14} /></Button>
          <Button size="sm" variant="ghost" onClick={() => openEdit(item)} title="Modifier"><Pencil size={14} /></Button>
          <Button size="sm" variant="ghost" disabled={busyId === item.id} onClick={() => toggleVisible(item)} title={item.visible ? "Masquer" : "Afficher"}>
            {busyId === item.id ? <Loader2 size={14} className="animate-spin" /> : item.visible ? <EyeOff size={14} /> : <Eye size={14} />}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => handleDelete(item)} className="text-destructive" title="Supprimer"><Trash2 size={14} /></Button>
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return <div className="flex items-center justify-center py-12"><Loader2 className="animate-spin text-cyan" /></div>;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <h3 className="text-lg font-heading font-bold text-foreground">Menu du site (multilingue)</h3>
        <Button onClick={() => openNew()} size="sm" className="bg-cyan text-navy hover:bg-cyan/90">
          <Plus size={16} className="mr-1" /> Ajouter un élément
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Lien : « #section » pour une ancre de la page d'accueil, « /page » pour une page interne, « https://… » pour un site externe.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-3 font-medium">Libellé</th>
              <th className="text-left p-3 font-medium">Lien</th>
              <th className="text-left p-3 font-medium">Affichage</th>
              <th className="p-3 w-56">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tops.map((top, i) => (
              <>
                {renderRow(top, 0, tops, i)}
                {childrenOf(top.id).map((child, j) => renderRow(child, 1, childrenOf(top.id), j))}
                {!childrenOf(top.id).length && (
                  <tr key={`${top.id}-add`} className="border-t border-border">
                    <td colSpan={4} className="p-2">
                      <Button size="sm" variant="ghost" onClick={() => openNew(top.id)} className="text-muted-foreground hover:text-cyan">
                        <Plus size={14} className="mr-1" /> Ajouter un sous-élément à « {top.label_fr || top.label_en} »
                      </Button>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {tops.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">Aucun élément — le site utilise son menu par défaut.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={edit !== null} onOpenChange={() => setEdit(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{isNew ? "Ajouter" : "Modifier"} — Menu</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Remplissez le libellé dans chaque langue. Une langue vide utilisera l'anglais.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Libellé — Français <span className="text-cyan uppercase">fr</span></label>
              <Input value={edit?.label_fr ?? ""} onChange={e => setEdit(p => ({ ...p!, label_fr: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Label — English <span className="text-cyan uppercase">en</span></label>
              <Input value={edit?.label_en ?? ""} onChange={e => setEdit(p => ({ ...p!, label_en: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Label — Kiswahili <span className="text-cyan uppercase">sw</span></label>
              <Input value={edit?.label_sw ?? ""} onChange={e => setEdit(p => ({ ...p!, label_sw: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Lien</label>
              <Input value={edit?.link ?? ""} onChange={e => setEdit(p => ({ ...p!, link: e.target.value }))} placeholder="#hero, /our-team, https://…" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Emplacement</label>
              <Select value={edit?.parent_id ?? "none"} onValueChange={v => setEdit(p => ({ ...p!, parent_id: v === "none" ? null : v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Élément principal (racine)</SelectItem>
                  {tops.filter(t => t.id !== edit?.id).map(t => (
                    <SelectItem key={t.id} value={t.id}>Sous-élément de « {t.label_fr || t.label_en} »</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Ordre</label>
              <Input type="number" value={edit?.sort_order ?? 0} onChange={e => setEdit(p => ({ ...p!, sort_order: Number(e.target.value) }))} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!edit?.highlight} onChange={e => setEdit(p => ({ ...p!, highlight: e.target.checked }))} className="h-4 w-4 accent-cyan" />
              <span className="text-sm text-muted-foreground">Mise en avant (texte cyan)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={edit?.visible !== false} onChange={e => setEdit(p => ({ ...p!, visible: e.target.checked }))} className="h-4 w-4 accent-cyan" />
              <span className="text-sm text-muted-foreground">Affiché dans le menu</span>
            </label>
            <Button onClick={handleSave} disabled={saving} className="w-full bg-cyan text-navy hover:bg-cyan/90 font-heading font-semibold">
              {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
              {isNew ? "Créer" : "Sauvegarder"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuAdmin;
