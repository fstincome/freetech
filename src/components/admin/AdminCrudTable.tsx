import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "number" | "array";
}

interface AdminCrudTableProps {
  title: string;
  tableName: string;
  fields: FieldConfig[];
  data: any[];
  onRefresh: () => void;
}

const AdminCrudTable = ({ title, tableName, fields, data, onRefresh }: AdminCrudTableProps) => {
  const [editItem, setEditItem] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const openNew = () => {
    const empty: Record<string, any> = {};
    fields.forEach(f => { empty[f.key] = f.type === "number" ? 0 : f.type === "array" ? "" : ""; });
    setFormData(empty);
    setIsNew(true);
    setEditItem({});
  };

  const openEdit = (item: any) => {
    const d: Record<string, any> = {};
    fields.forEach(f => {
      d[f.key] = f.type === "array" ? (item[f.key] || []).join(", ") : item[f.key] ?? "";
    });
    setFormData(d);
    setIsNew(false);
    setEditItem(item);
  };

  const handleSave = async () => {
    const payload: Record<string, any> = {};
    fields.forEach(f => {
      if (f.type === "array") {
        payload[f.key] = formData[f.key].split(",").map((s: string) => s.trim()).filter(Boolean);
      } else if (f.type === "number") {
        payload[f.key] = Number(formData[f.key]) || 0;
      } else {
        payload[f.key] = formData[f.key];
      }
    });

    if (isNew) {
      const { error } = await supabase.from(tableName as any).insert(payload as any);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Créé avec succès" });
    } else {
      const { error } = await supabase.from(tableName as any).update(payload as any).eq("id", editItem.id);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Mis à jour" });
    }
    setEditItem(null);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet élément ?")) return;
    const { error } = await supabase.from(tableName as any).delete().eq("id", id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Supprimé" });
    onRefresh();
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-bold text-foreground">{title}</h3>
        <Button onClick={openNew} size="sm" className="bg-cyan text-navy hover:bg-cyan/90">
          <Plus size={16} className="mr-1" /> Ajouter
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
          <thead className="bg-muted">
            <tr>
              {fields.filter(f => f.type !== "array" && f.type !== "textarea").slice(0, 4).map(f => (
                <th key={f.key} className="text-left p-3 font-medium">{f.label}</th>
              ))}
              <th className="p-3 w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t border-border hover:bg-muted/50">
                {fields.filter(f => f.type !== "array" && f.type !== "textarea").slice(0, 4).map(f => (
                  <td key={f.key} className="p-3 max-w-[200px] truncate">
                    {f.type === "url" && item[f.key] ? (
                      <img src={item[f.key]} alt="" className="h-10 w-16 object-cover rounded" />
                    ) : String(item[f.key] ?? "")}
                  </td>
                ))}
                <td className="p-3">
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Pencil size={14} /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="text-destructive"><Trash2 size={14} /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Aucun élément</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={editItem !== null} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{isNew ? "Ajouter" : "Modifier"} — {title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-sm font-medium text-foreground mb-1 block">{f.label}</label>
                {f.type === "textarea" ? (
                  <Textarea value={formData[f.key] || ""} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))} rows={3} />
                ) : (
                  <Input
                    type={f.type === "number" ? "number" : "text"}
                    value={formData[f.key] ?? ""}
                    onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.type === "array" ? "URL1, URL2, URL3" : ""}
                  />
                )}
              </div>
            ))}
            <Button onClick={handleSave} className="w-full bg-cyan text-navy hover:bg-cyan/90 font-heading font-semibold">
              {isNew ? "Créer" : "Sauvegarder"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCrudTable;
