import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Monitor, Palette, Send, Loader2, RotateCw, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trainingApplicationSchema, trainingContentSchema, TRAINING_CONTENT_KEY, type TrainingApplicationInput, type TrainingFormContent } from "@/lib/trainingApplication";

export default function TrainingApplication() {
  const { lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState(false);
  const { data: content, isPending, error, refetch } = useQuery({ queryKey: ["training-content"], queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("value").eq("key", TRAINING_CONTENT_KEY).single();
    if (error) throw error;
    return trainingContentSchema.parse(JSON.parse(data.value)) as TrainingFormContent;
  }});
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<TrainingApplicationInput>({
    resolver: zodResolver(trainingApplicationSchema),
    defaultValues: { full_name: "", email: "", phone: "", city: "", occupation: "", education: "", modules: [], availability: "", motivation: "", accessibility_needs: "", language: lang },
  });
  const text = (key: string) => content?.[key]?.[lang] || content?.[key]?.fr || key;
  const submit = async (values: TrainingApplicationInput) => {
    setSendError(false);
    try {
      const { data, error } = await supabase.functions.invoke("submit-training-application", { body: { ...values, language: lang } });
      if (error || !data?.id) throw new Error("submission_failed");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch { setSendError(true); }
  };
  if (isPending) return <div className="min-h-96 flex items-center justify-center" role="status"><Loader2 className="animate-spin" /></div>;
  if (error || !content) return <div className="min-h-96 flex items-center justify-center"><Button aria-label="Réessayer" variant="outline" onClick={() => refetch()}><RotateCw /></Button></div>;
  const fieldError = (name: keyof TrainingApplicationInput) => errors[name] && <p id={`${name}-error`} className="mt-1 text-sm text-destructive" role="alert">{text(name === "modules" ? "module_error" : name === "consent" ? "consent_error" : "required_error")}</p>;
  const input = (name: "full_name" | "email" | "phone" | "age" | "city" | "occupation" | "education", type = "text", maxLength = 120) => <div><label htmlFor={name} className="block text-sm font-medium mb-2">{text(name)} <span aria-hidden="true">*</span></label><Input id={name} type={type} maxLength={maxLength} min={name === "age" ? 1 : undefined} max={name === "age" ? 120 : undefined} autoComplete={name === "full_name" ? "name" : name === "email" ? "email" : name === "phone" ? "tel" : undefined} aria-required="true" aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? `${name}-error` : undefined} {...register(name)} />{fieldError(name)}</div>;
  const select = (name: "computer_level" | "design_level" | "computer_access", options: string[]) => <div><label htmlFor={name} className="block text-sm font-medium mb-2">{text(name)} *</label><Controller name={name} control={control} render={({ field }) => <Select value={field.value} onValueChange={field.onChange}><SelectTrigger id={name} ref={field.ref} onBlur={field.onBlur} aria-required="true" aria-invalid={Boolean(errors[name])}><SelectValue placeholder={text("choose")} /></SelectTrigger><SelectContent>{options.map(value => <SelectItem key={value} value={value}>{text(value)}</SelectItem>)}</SelectContent></Select>} />{fieldError(name)}</div>;
  const area = (name: "availability" | "motivation" | "accessibility_needs", maxLength: number) => <div><label htmlFor={name} className="block text-sm font-medium mb-2">{text(name)}{name !== "accessibility_needs" && " *"}</label><Textarea id={name} rows={name === "motivation" ? 5 : 3} maxLength={maxLength} aria-required={name !== "accessibility_needs"} aria-invalid={Boolean(errors[name])} {...register(name)} />{fieldError(name)}</div>;
  return <div>
    <header className="relative overflow-hidden bg-navy px-4 py-14 md:py-20"><div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyan/20 blur-3xl" /><div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" /><div className="relative max-w-4xl mx-auto"><p className="text-cyan font-semibold text-sm tracking-wide uppercase mb-4">Free Tech Institute · {text("period")}</p><h1 className="text-3xl md:text-5xl font-heading font-bold text-white mb-5">{text("title")}</h1><p className="max-w-2xl text-white/70 leading-relaxed">{text("intro")}</p><div className="mt-8 h-1 w-24 rounded-full bg-cyan" /></div></header>
    {submitted ? <section className="max-w-4xl mx-auto px-4 py-16" role="status"><CheckCircle2 className="text-primary h-12 w-12 mb-5" /><h2 className="text-2xl font-semibold mb-4">{text("success_title")}</h2><p className="text-muted-foreground max-w-2xl">{text("success_text")}</p></section> : <form noValidate onSubmit={handleSubmit(submit)} className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <fieldset disabled={isSubmitting} className="space-y-10 min-w-0">
        <section><h2 className="font-heading font-bold text-xl mb-2"><span className="text-cyan">01</span> · {text("module_section")}</h2><p className="text-muted-foreground text-sm mb-5">{text("module_hint")}</p><Controller name="modules" control={control} render={({ field }) => <div className="grid sm:grid-cols-2 gap-4">{([{ value: "basic_computing", Icon: Monitor }, { value: "graphic_design", Icon: Palette }] as const).map(({ value, Icon }) => <label key={value} className={`cursor-pointer flex gap-4 items-center p-5 rounded-xl border-2 transition-colors ${field.value.includes(value) ? "border-cyan bg-cyan/10 shadow-sm" : "border-border bg-card hover:border-cyan/50"}`}><Checkbox checked={field.value.includes(value)} onCheckedChange={checked => field.onChange(checked ? [...field.value, value] : field.value.filter(v => v !== value))} aria-label={text(value)} /><Icon className="h-7 w-7 shrink-0 text-cyan" /><span className="font-semibold">{text(value)}</span></label>)}</div>} />{fieldError("modules")}</section>
        <section className="border-t border-border pt-8"><h2 className="font-heading font-bold text-xl mb-6"><span className="text-cyan">02</span> · {text("personal_section")}</h2><div className="grid sm:grid-cols-2 gap-5">{input("full_name")}{input("email", "email", 255)}{input("phone", "tel", 30)}{input("age", "number")}{input("city")}</div></section>
        <section className="border-t border-border pt-8"><h2 className="font-heading font-bold text-xl mb-6"><span className="text-cyan">03</span> · {text("background_section")}</h2><div className="grid sm:grid-cols-2 gap-5">{input("occupation")}{input("education")}{select("computer_level", ["beginner", "some", "independent"])}{select("design_level", ["beginner", "some", "independent"])}{select("computer_access", ["yes", "shared", "no"])}</div></section>
        <section className="border-t border-border pt-8 space-y-5"><h2 className="font-heading font-bold text-xl mb-6"><span className="text-cyan">04</span> · {text("goals_section")}</h2>{area("availability", 500)}{area("motivation", 1500)}{area("accessibility_needs", 500)}</section>
        <section className="border-t border-border pt-8"><label className="flex gap-3 items-start text-sm leading-relaxed"><Controller name="consent" control={control} render={({ field }) => <Checkbox className="mt-1" checked={field.value === true} onCheckedChange={value => field.onChange(value === true)} aria-label={text("consent")} />} /><span>{text("consent")}</span></label>{fieldError("consent")}<p className="flex gap-2 items-start text-xs text-muted-foreground mt-4 leading-relaxed"><ShieldCheck className="w-4 h-4 shrink-0" />{text("privacy")}</p></section>
      </fieldset>
      {sendError && <p role="alert" className="text-destructive text-sm">{text("submit_error")}</p>}
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-12 px-10 rounded-full bg-cyan text-navy font-heading font-bold hover:bg-cyan/90">{isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}{text(isSubmitting ? "submitting" : "submit")}</Button>
    </form>}
  </div>;
}