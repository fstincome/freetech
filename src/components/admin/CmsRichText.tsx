import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, List, ListOrdered, Link2, Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CmsRichText({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editor = useEditor({ extensions: [StarterKit, Link.configure({openOnClick:false})], content:value,
    onUpdate: ({editor}) => onChange(editor.getHTML()), editorProps:{attributes:{class:"cms-rich-text min-h-40 p-4 outline-none", "aria-label":"Texte du bloc"}} });
  useEffect(()=> { if(editor && editor.getHTML() !== value) editor.commands.setContent(value || "", false); },[value,editor]);
  if(!editor) return null;
  return <div className="border border-border rounded-md overflow-hidden bg-background">
    <div className="flex flex-wrap gap-1 p-1 border-b border-border bg-muted">
      {[{Icon:Bold,label:"Gras",run:()=>editor.chain().focus().toggleBold().run()},
        {Icon:Italic,label:"Italique",run:()=>editor.chain().focus().toggleItalic().run()},
        {Icon:List,label:"Liste",run:()=>editor.chain().focus().toggleBulletList().run()},
        {Icon:ListOrdered,label:"Liste numérotée",run:()=>editor.chain().focus().toggleOrderedList().run()},
        {Icon:Link2,label:"Lien",run:()=>{const url=window.prompt("Adresse du lien",editor.getAttributes("link").href || "https://"); if(url===null)return; if(!url)editor.chain().focus().unsetLink().run(); else if(/^https?:\/\//.test(url))editor.chain().focus().setLink({href:url}).run();}},
        {Icon:Undo2,label:"Annuler",run:()=>editor.chain().focus().undo().run()},
        {Icon:Redo2,label:"Rétablir",run:()=>editor.chain().focus().redo().run()}].map(({Icon,label,run})=><Button key={label} type="button" size="icon" variant="ghost" title={label} aria-label={label} onClick={run}><Icon /></Button>)}
    </div><EditorContent editor={editor} />
  </div>;
}