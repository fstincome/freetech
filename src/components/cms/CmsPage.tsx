import { useEffect, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import CmsRenderer from "./CmsRenderer";
import { localized, type CmsBlock, type LocalizedText } from "@/lib/cms";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

export default function CmsPage({slug,fallback}:{slug?:string;fallback:ReactNode}) {
 const location=useLocation(); const path=slug ?? location.pathname.replace(/^\/|\/$/g,"");
 const {lang}=useLanguage();
 const {data,isPending,error,refetch}=useQuery({queryKey:["cms-page",path],queryFn:async()=>{
   const {data,error}=await supabase.rpc("read_published_cms_page",{page_slug:path}).maybeSingle();
   if(error) throw error; return data;
 }});
 useEffect(()=>{if(data)document.title=`${localized(data.published_titles as LocalizedText,lang)} | Free Tech Institute`;},[data,lang]);
 if(isPending)return <div role="status" className="min-h-96 pt-32 text-center">…</div>;
 if(error)return <div className="pt-32 text-center min-h-96"><Button variant="outline" aria-label="Réessayer" onClick={()=>refetch()}><RotateCw /></Button></div>;
 if(!data) return <>{fallback}</>;
 return <CmsRenderer blocks={data.published_blocks as unknown as CmsBlock[]} lang={lang} />;
}