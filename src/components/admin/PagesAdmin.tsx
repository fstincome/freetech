import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowUp, ArrowDown, Copy, Eye, EyeOff, FileText, Image, Images, Plus, Save, Trash2, Upload, Send, Search, LayoutTemplate, GripVertical } from "lucide-react";
import { collectionNames, localized, newBlock, normalizeSlug, reorderBlocks, reservedSlug, type BlockType, type CmsBlock, type CmsPageRecord } from "@/lib/cms";
import type { Lang } from "@/lib/i18n";
import type { Json } from "@/integrations/supabase/types";
import CmsRichText from "./CmsRichText";
import CmsRenderer, { CmsBlockView } from "@/components/cms/CmsRenderer";

const languages: {key:Lang;label:string}[]=[{key:"fr",label:"Français"},{key:"en",label:"English"},{key:"sw",label:"Kiswahili"}];
const blockTypes: {type:BlockType;label:string;Icon:typeof FileText}[]=[{type:"heading",label:"Titre",Icon:FileText},{type:"text",label:"Texte",Icon:FileText},{type:"textImage",label:"Texte et image",Icon:LayoutTemplate},{type:"image",label:"Image",Icon:Image},{type:"gallery",label:"Galerie",Icon:Images}];
export default function PagesAdmin({onCollection}:{onCollection:(source:string)=>void}) {
 const [pages,setPages]=useState<CmsPageRecord[]>([]); const [page,setPage]=useState<CmsPageRecord|null>(null);
 const [lang,setLang]=useState<Lang>("fr"); const [selected,setSelected]=useState<string|null>(null);
 const [search,setSearch]=useState(""); const [preview,setPreview]=useState(false); const [busy,setBusy]=useState(false);
 const [dirty,setDirty]=useState(false); const [error,setError]=useState(""); const [loading,setLoading]=useState(true);
 const [creating,setCreating]=useState(false); const [name,setName]=useState(""); const [slug,setSlug]=useState("");
 const [drag,setDrag]=useState<number|null>(null); const queryClient=useQueryClient();
 const load=async()=>{setLoading(true);const {data,error}=await supabase.from("cms_pages").select("*").order("name");setLoading(false);if(error)setError(error.message);else{setError("");setPages(data as unknown as CmsPageRecord[]);}};
 useEffect(()=>{load();},[]);
 useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();e.returnValue="";}};window.addEventListener("beforeunload",warn);return()=>window.removeEventListener("beforeunload",warn);},[dirty]);
 const block=page?.draft_blocks.find(b=>b.id===selected);
 const update=(next:CmsPageRecord)=>{setPage(next);setDirty(true);};
 const changeBlock=(patch:Partial<CmsBlock>)=>{if(page && block)update({...page,draft_blocks:page.draft_blocks.map(b=>b.id===block.id?{...b,...patch}:b)});};
 const save=async(publish=false)=>{
  if(!page)return;setBusy(true);
  if(publish){for(const b of page.draft_blocks.filter(b=>b.theoryId)){
    const translations=Object.fromEntries(languages.map(l=>[l.key,{title:b.type==="heading"?b.content[l.key]||"":b.title?.[l.key]||"",description:b.type==="heading"?"":b.content[l.key]||""}]));
    const {error}=await supabase.from("site_theory_sections").update({title:localized(b.type==="heading"?b.content:b.title,"en"),description:b.type==="heading"?"":localized(b.content,"en"),translations,image_url:b.images?.[0]||"",image_url_2:b.images?.[1]||""}).eq("id",b.theoryId || "");
    if(error){setBusy(false);toast({title:"Publication impossible",description:error.message,variant:"destructive"});return;}
  }}
  const published=page.draft_blocks.map(b=>b.theoryId?{...b,content:{},title:undefined,images:undefined}:b);
  const payload={name:page.name,titles:page.titles as Json,draft_blocks:page.draft_blocks as unknown as Json,...(publish?{published_titles:page.titles as Json,published_blocks:published as unknown as Json}:{})};
  const {data,error}=await supabase.from("cms_pages").update(payload).eq("id",page.id).select("*").single();setBusy(false);
  if(error){toast({title:"Enregistrement impossible",description:error.message,variant:"destructive"});return;}
  setPage(data as unknown as CmsPageRecord);setDirty(false);await load();queryClient.invalidateQueries({queryKey:["cms-page"]});queryClient.invalidateQueries({queryKey:["cms-theory-record"]});
  toast({title:publish?"Page publiée":"Brouillon enregistré"});
 };
 const upload=async(files:FileList|null)=>{
  if(!files || !block || !page)return;setBusy(true);
  const urls:string[]=[];
  try{for(const file of Array.from(files)){
    if(!file.type.startsWith("image/"))throw new Error("Choisissez une image.");
    const path=`cms/${page.id}/${crypto.randomUUID()}.${file.name.split(".").pop()}`;
    const {error}=await supabase.storage.from("site-images").upload(path,file);if(error)throw error;
    urls.push(supabase.storage.from("site-images").getPublicUrl(path).data.publicUrl);
  }changeBlock({images:block.type==="gallery"?[...(block.images||[]),...urls]:urls});}
  catch(e){toast({title:"Image non envoyée",description:e instanceof Error?e.message:"Réessayez",variant:"destructive"});}
  finally{setBusy(false);}
 };
 const create=async()=>{
  const path=normalizeSlug(slug);if(!name.trim()||!path||reservedSlug(path)){toast({title:"Nom ou adresse de page invalide",variant:"destructive"});return;}
  setBusy(true);const initial=newBlock("heading");initial.content={fr:name,en:name,sw:name};
  const {data,error}=await supabase.from("cms_pages").insert({slug:path,name,titles:{fr:name,en:name,sw:name},draft_blocks:[initial] as unknown as Json}).select("*").single();setBusy(false);
  if(error){toast({title:"Création impossible",description:error.message,variant:"destructive"});return;}
  setCreating(false);setName("");setSlug("");await load();setPage(data as unknown as CmsPageRecord);setSelected(initial.id);setDirty(false);
 };
 const removePage=async(p:CmsPageRecord)=>{
  if(["","gitega-study-space","our-team","our-team/:slug","job-opportunities","theorie-du-changement"].includes(p.slug))return;
  if(!confirm(`Supprimer la page « ${p.name} » ?`))return;
  const {error}=await supabase.from("cms_pages").delete().eq("id",p.id);if(error)toast({title:"Suppression impossible",description:error.message,variant:"destructive"});else{await load();queryClient.invalidateQueries({queryKey:["cms-page"]});}
 };
 if(!page)return <div className="space-y-8">
  <div className="flex justify-between items-center gap-4"><div><p className="text-xs uppercase text-muted-foreground mb-2">Site web</p><h1 className="text-3xl font-heading font-bold">Pages</h1></div><Button onClick={()=>setCreating(true)}><Plus /> Nouvelle page</Button></div>
  <div className="relative max-w-sm"><Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground"/><Input aria-label="Rechercher une page" placeholder="Rechercher une page…" className="pl-9" value={search} onChange={e=>setSearch(e.target.value)}/></div>
  {error && <div role="alert">{error}<Button variant="outline" onClick={load}>Réessayer</Button></div>}
  {loading ? <p role="status">Chargement…</p> : <div className="grid xl:grid-cols-3 sm:grid-cols-2 gap-4">{pages.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())).map(p=><article key={p.id} className="border border-border rounded-lg bg-card overflow-hidden">
    <div className="h-24 bg-secondary p-6 flex items-center justify-between"><LayoutTemplate className="w-9 h-9 text-primary"/><span className="text-xs text-muted-foreground">{p.published_blocks!==null?"Publié":"Brouillon"}</span></div>
    <div className="p-5"><h2 className="text-lg font-semibold">{p.name}</h2><p className="text-xs text-muted-foreground mt-1 break-all">/{p.slug}</p><div className="flex gap-2 mt-5"><Button variant="outline" onClick={()=>{setPage(p);setSelected(p.draft_blocks[0]?.id||null);setDirty(false);}}>Modifier la page</Button>{!["","gitega-study-space","our-team","our-team/:slug","job-opportunities","theorie-du-changement"].includes(p.slug)&&<Button variant="ghost" size="icon" aria-label={`Supprimer ${p.name}`} onClick={()=>removePage(p)}><Trash2/></Button>}</div></div>
  </article>)}</div>}
  <Dialog open={creating} onOpenChange={setCreating}><DialogContent><DialogHeader><DialogTitle>Nouvelle page</DialogTitle></DialogHeader><label>Nom<Input value={name} onChange={e=>setName(e.target.value)}/></label><label>Adresse<Input value={slug} placeholder="nouvelle-page" onChange={e=>setSlug(e.target.value)}/></label><Button disabled={busy} onClick={create}>Créer la page</Button></DialogContent></Dialog>
 </div>;
 return <div className="space-y-5">
  <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Button variant="ghost" size="icon" title="Retour aux pages" aria-label="Retour aux pages" onClick={()=>{if(!dirty||confirm("Quitter sans enregistrer ?")){setPage(null);setSelected(null);setDirty(false);}}}><ArrowLeft/></Button><div><h1 className="text-xl font-heading font-bold">{page.name}</h1><p className="text-xs text-muted-foreground">{dirty?"Modifications non enregistrées":"Enregistré"} · /{page.slug}</p></div></div><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={()=>setPreview(true)}><Eye/>Aperçu</Button><Button variant="outline" disabled={busy} onClick={()=>save()}><Save/>Enregistrer</Button><Button disabled={busy} onClick={()=>save(true)}><Send/>Publier</Button></div></div>
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4"><div className="flex gap-1">{languages.map(l=><Button key={l.key} size="sm" variant={lang===l.key?"secondary":"ghost"} onClick={()=>setLang(l.key)}>{l.label}</Button>)}</div><Input className="max-w-sm" aria-label="Titre de la page" placeholder="Titre de la page" value={page.titles[lang]||""} onChange={e=>update({...page,titles:{...page.titles,[lang]:e.target.value}})}/></div>
  <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-5 items-start">
   <div className="min-w-0 space-y-3">
    <div className="flex flex-wrap gap-2">{blockTypes.map(({type,label,Icon})=><Button key={type} variant="outline" size="sm" onClick={()=>{const b=newBlock(type);update({...page,draft_blocks:[...page.draft_blocks,b]});setSelected(b.id);}}><Icon/>{label}</Button>)}<select aria-label="Ajouter une collection" className="h-9 max-w-full rounded-md border border-input bg-background px-2 text-sm" value="" onChange={e=>{if(!e.target.value)return;const b={...newBlock("collection"),source:e.target.value};update({...page,draft_blocks:[...page.draft_blocks,b]});setSelected(b.id);}}><option value="">Ajouter des contenus…</option>{Object.entries(collectionNames).filter(([key])=>key!=="biography"&&key!=="events").map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></div>
    {page.draft_blocks.map((b,index)=><article key={b.id} draggable onDragStart={()=>setDrag(index)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(drag!==null)update({...page,draft_blocks:reorderBlocks(page.draft_blocks,drag,index)});setDrag(null);}} className={`border rounded-lg overflow-hidden bg-card ${selected===b.id?"border-primary ring-1 ring-ring":"border-border"} ${b.hidden?"opacity-60":""}`}>
      <div className="flex items-center justify-between gap-1 bg-muted px-2 py-1"><Button variant="ghost" size="sm" onClick={()=>setSelected(b.id)} className="min-w-0 justify-start"><GripVertical/><span className="truncate">{b.type==="collection"?collectionNames[b.source||""]:blockTypes.find(t=>t.type===b.type)?.label}</span></Button><div className="flex shrink-0">{[{Icon:ArrowUp,label:"Monter",run:()=>update({...page,draft_blocks:reorderBlocks(page.draft_blocks,index,index-1)})},{Icon:ArrowDown,label:"Descendre",run:()=>update({...page,draft_blocks:reorderBlocks(page.draft_blocks,index,index+1)})},{Icon:b.hidden?Eye:EyeOff,label:b.hidden?"Afficher":"Masquer",run:()=>update({...page,draft_blocks:page.draft_blocks.map(x=>x.id===b.id?{...x,hidden:!x.hidden}:x)})},{Icon:Copy,label:"Dupliquer",run:()=>{const copy={...b,id:crypto.randomUUID()};const next=[...page.draft_blocks];next.splice(index+1,0,copy);update({...page,draft_blocks:next});setSelected(copy.id);}},{Icon:Trash2,label:"Supprimer le bloc",run:()=>{if(confirm("Supprimer ce bloc ?")){update({...page,draft_blocks:page.draft_blocks.filter(x=>x.id!==b.id)});if(selected===b.id)setSelected(null);}}}].map(({Icon,label,run})=><Button key={label} variant="ghost" size="icon" className="h-8 w-8" aria-label={label} title={label} onClick={run}><Icon/></Button>)}</div></div>
      <div onClick={()=>setSelected(b.id)} className="cursor-pointer">{b.type==="collection"?<div className="px-5 py-7 flex items-center justify-between gap-3"><span className="font-medium">{collectionNames[b.source||""]}</span><Button variant="outline" size="sm" onClick={()=>onCollection(b.source||"")}>Modifier les contenus</Button></div>:<CmsBlockView block={b} lang={lang}/>}</div>
    </article>)}
   </div>
   <aside className="border border-border rounded-lg bg-card p-4 space-y-4 lg:sticky lg:top-24">
    <h2 className="font-semibold">{block?"Réglages du bloc":"Sélectionnez un bloc"}</h2>
    {block?.type==="collection"?<Button variant="outline" onClick={()=>onCollection(block.source||"")}>Modifier les contenus</Button>:block && <>
     <label className="block text-sm">Repère de lien<Input value={block.anchor||""} onChange={e=>changeBlock({anchor:e.target.value})}/></label>
     {(block.type==="text"||block.type==="textImage")&&<><label className="block text-sm">Titre<Input value={block.title?.[lang]||""} onChange={e=>changeBlock({title:{...block.title,[lang]:e.target.value}})}/></label><CmsRichText key={`${block.id}-${lang}`} value={block.content[lang]||""} onChange={value=>changeBlock({content:{...block.content,[lang]:value}})}/></>}
     {(block.type==="heading"||block.type==="image"||block.type==="gallery")&&<label className="block text-sm">{block.type==="heading"?"Titre":"Légende"}<Input value={block.content[lang]||""} onChange={e=>changeBlock({content:{...block.content,[lang]:e.target.value}})}/></label>}
     {["image","gallery","textImage"].includes(block.type)&&<><label className="flex items-center gap-2 text-sm border border-border rounded-md p-3 cursor-pointer"><Upload className="w-4 h-4"/>Ajouter des images<input aria-label="Ajouter des images" className="sr-only" type="file" accept="image/*" multiple={block.type==="gallery"} disabled={busy} onChange={e=>upload(e.target.files)}/></label>{(block.images||[]).map((url,i)=><div key={`${url}-${i}`} className="flex items-center gap-2"><img src={url} alt="" className="h-12 w-16 object-contain"/><Button variant="ghost" size="icon" aria-label={`Retirer l’image ${i+1}`} onClick={()=>changeBlock({images:block.images?.filter((_,n)=>n!==i)})}><Trash2/></Button></div>)}</>}
    </>}
   </aside>
  </div>
  <Dialog open={preview} onOpenChange={setPreview}><DialogContent className="max-w-6xl h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle>Aperçu — {localized(page.titles,lang)}</DialogTitle></DialogHeader><CmsRenderer blocks={page.draft_blocks} lang={lang} preview/></DialogContent></Dialog>
 </div>;
}