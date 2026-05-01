import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, Upload, Loader2, Crown, UserMinus } from "lucide-react";

interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "url" | "number" | "array" | "boolean";
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
  const [uploading, setUploading] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const openNew = () => {
    const empty: Record<string, any> = {};
    fields.forEach(f => {
      empty[f.key] = f.type === "number" ? (f.key === "year" ? new Date().getFullYear() : 0)
        : f.type === "array" ? ""
        : f.type === "boolean" ? false
        : "";
    });
    setFormData(empty);
    setIsNew(true);
    setEditItem({});
  };

  const openEdit = (item: any) => {
    const d: Record<string, any> = {};
    fields.forEach(f => {
      d[f.key] = f.type === "array" ? (item[f.key] || []).join(", ")
        : f.type === "boolean" ? !!item[f.key]
        : item[f.key] ?? "";
    });
    setFormData(d);
    setIsNew(false);
    setEditItem(item);
  };

  const [togglingId, setTogglingId] = useState<string | null>(null);
  const toggleBoard = async (item: any, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setTogglingId(item.id);
    const newVal = !item.is_board;
    const { data: updated, error } = await supabase
      .from(tableName as any)
      .update({ is_board: newVal } as any)
      .eq("id", item.id)
      .select()
      .maybeSingle();
    setTogglingId(null);
    if (error || !updated) {
      toast({ title: "Erreur", description: error?.message || "Mise à jour impossible (droits admin requis)", variant: "destructive" });
      return;
    }
    toast({ title: newVal ? "Envoyé au Board ✓" : "Retourné dans l'équipe ✓" });
    await onRefresh();
  };

  const handleUpload = async (fieldKey: string, file: File) => {
    setUploading(fieldKey);
    const ext = file.name.split(".").pop();
    const path = `${tableName}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    
    const { error } = await supabase.storage.from("site-images").upload(path, file, { upsert: true });
    if (error) {
      toast({ title: "Erreur upload", description: error.message, variant: "destructive" });
      setUploading(null);
      return;
    }
    
    const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(path);
    setFormData(p => ({ ...p, [fieldKey]: urlData.publicUrl }));
    setUploading(null);
    toast({ title: "Photo uploadée ✓" });
  };

  const handleSave = async () => {
    const payload: Record<string, any> = {};
    fields.forEach(f => {
      if (f.type === "array") {
        payload[f.key] = formData[f.key].split(",").map((s: string) => s.trim()).filter(Boolean);
      } else if (f.type === "number") {
        payload[f.key] = Number(formData[f.key]) || 0;
      } else if (f.type === "boolean") {
        payload[f.key] = !!formData[f.key];
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
            {data.map((item) => {
              const hasBoardField = fields.some(f => f.key === "is_board");
              return (
              <tr key={item.id} className="border-t border-border hover:bg-muted/50">
                {fields.filter(f => f.type !== "array" && f.type !== "textarea").slice(0, 4).map(f => (
                  <td key={f.key} className="p-3 max-w-[200px] truncate">
                    {f.type === "url" && item[f.key] ? (
                      <img src={item[f.key]} alt="" className="h-10 w-16 object-cover rounded" />
                    ) : f.type === "boolean" ? (
                      item[f.key] ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan/20 text-cyan text-xs font-semibold"><Crown size={12} /> Board</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Équipe</span>
                      )
                    ) : String(item[f.key] ?? "")}
                  </td>
                ))}
                <td className="p-3">
                  <div className="flex gap-1">
                    {hasBoardField && (
                      <Button
                        size="sm"
                        variant={item.is_board ? "secondary" : "outline"}
                        type="button"
                        disabled={togglingId === item.id}
                        onClick={(e) => toggleBoard(item, e)}
                        title={item.is_board ? "Retirer du Board" : "Envoyer au Board"}
                        className={item.is_board ? "text-cyan border-cyan/40" : ""}
                      >
                        {togglingId === item.id ? <Loader2 size={14} className="animate-spin" /> : item.is_board ? <UserMinus size={14} /> : <Crown size={14} />}
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => openEdit(item)}><Pencil size={14} /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id)} className="text-destructive"><Trash2 size={14} /></Button>
                  </div>
                </td>
              </tr>
              );
            })}
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
            <DialogDescription className="text-sm text-muted-foreground">
              {isNew ? "Remplissez les champs pour créer un nouvel élément." : "Modifiez les champs ci-dessous."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="text-sm font-medium text-foreground mb-1 block">{f.label}</label>
                {f.type === "textarea" ? (
                  <Textarea value={formData[f.key] || ""} onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))} rows={3} />
                ) : f.type === "url" ? (
                  <div className="space-y-2">
                    {formData[f.key] && (
                      <img src={formData[f.key]} alt="Preview" className="h-24 w-full object-cover rounded-lg border border-border" />
                    )}
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={formData[f.key] ?? ""}
                        onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder="URL ou uploader une photo"
                        className="flex-1"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={el => { fileRefs.current[f.key] = el; }}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(f.key, file);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={uploading === f.key}
                        onClick={() => fileRefs.current[f.key]?.click()}
                      >
                        {uploading === f.key ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                      </Button>
                    </div>
                  </div>
                ) : f.type === "boolean" ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData[f.key]}
                      onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.checked }))}
                      className="h-4 w-4 accent-cyan"
                    />
                    <span className="text-sm text-muted-foreground">Membre du Board</span>
                  </label>
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
