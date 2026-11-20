import { z } from "zod";

export const trainingApplicationSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255).transform(v => v.toLowerCase()),
  phone: z.string().trim().min(6).max(30).regex(/^[+0-9() .-]+$/),
  age: z.coerce.number().int().min(1).max(120),
  city: z.string().trim().min(2).max(120),
  occupation: z.string().trim().min(2).max(120),
  education: z.string().trim().min(2).max(120),
  modules: z.array(z.enum(["basic_computing", "graphic_design"])).length(1).refine(v => new Set(v).size === v.length),
  computer_level: z.enum(["beginner", "some", "independent"]),
  design_level: z.enum(["beginner", "some", "independent"]),
  computer_access: z.enum(["yes", "shared", "no"]),
  availability: z.string().trim().max(500).default(""), contact_owner: z.enum(["self", "parent", "relative", "other"]).default("self"),
  motivation: z.string().trim().min(2).max(1500),
  accessibility_needs: z.string().trim().max(500).default(""),
  consent: z.literal(true),
  language: z.enum(["fr", "en", "sw"]),
}).strict();

export type TrainingApplicationInput = z.infer<typeof trainingApplicationSchema>;
export type TrainingFormContent = Record<string, Record<"fr" | "en" | "sw", string>>;
export const TRAINING_CONTENT_KEY = "training_form_content";
export const trainingContentSchema = z.record(z.object({ fr: z.string().trim().min(1).max(3000), en: z.string().trim().min(1).max(3000), sw: z.string().trim().min(1).max(3000) }));

export function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${(/^[\s]*[=+@-]/.test(text) ? "'" + text : text).replace(/"/g, '""')}"`;
}