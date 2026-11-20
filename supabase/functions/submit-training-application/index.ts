import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.25.76";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const schema = z.object({
  full_name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(255).transform(v => v.toLowerCase()),
  phone: z.string().trim().min(6).max(30).regex(/^[+0-9() .-]+$/), age: z.coerce.number().int().min(1).max(120),
  city: z.string().trim().max(120).default(""), province: z.string().trim().min(2).max(120), commune: z.string().trim().min(2).max(120), quartier: z.string().trim().min(2).max(120), occupation: z.string().trim().min(2).max(120), education: z.string().trim().min(2).max(120),
  modules: z.array(z.enum(["basic_computing", "graphic_design"])).length(1).refine(v => new Set(v).size === v.length),
  computer_level: z.enum(["beginner", "some", "independent"]), design_level: z.enum(["beginner", "some", "independent"]), computer_access: z.enum(["yes", "shared", "no"]),
  availability: z.string().trim().max(500).default(""), contact_owner: z.enum(["self", "parent", "relative", "other"]).default("self"), motivation: z.string().trim().min(2).max(1500), accessibility_needs: z.string().trim().max(500).default(""), consent: z.literal(true), language: z.enum(["fr", "en", "sw"]),
}).strict();
const response = (body: object, status: number) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return response({ error: "method_not_allowed" }, 405);
  try {
    const raw = await req.text();
    if (raw.length > 12000) return response({ error: "invalid_input" }, 400);
    const parsed = schema.safeParse(JSON.parse(raw));
    if (!parsed.success) return response({ error: "invalid_input" }, 400);
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return response({ error: "temporarily_unavailable" }, 503);
    const client = createClient(url, key);
    const { data, error } = await client.from("training_applications").insert({ ...parsed.data, city: [parsed.data.quartier, parsed.data.commune, parsed.data.province].join(", ") }).select("id").single();
    if (error || !data) return response({ error: "submission_failed" }, 500);
    return response({ id: data.id }, 201);
  } catch {
    return response({ error: "invalid_request" }, 400);
  }
});