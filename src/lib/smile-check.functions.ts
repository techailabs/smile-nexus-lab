import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const InputSchema = z.object({
  clinic_slug: z.string().min(1).max(120),
  full_name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(40).optional().nullable(),
  age_range: z.string().max(40).optional().nullable(),
  concerns: z.array(z.string().min(1).max(60)).max(20),
  smile_goal: z.string().max(400).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export const submitSmileCheck = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Look up clinic for personalized AI context.
    const { data: clinic } = await supabase
      .from("clinics")
      .select("id, clinic_name, city, services, tagline")
      .eq("slug", data.clinic_slug)
      .maybeSingle();

    const apiKey = process.env.LOVABLE_API_KEY;
    let aiSummary = "";
    let recommended: { title: string; reason: string }[] = [];

    if (apiKey && clinic) {
      const services = (clinic.services as Array<{ title?: string; name?: string; short_description?: string; desc?: string }> | null) ?? [];
      const svcList = services
        .map((s) => `- ${s.title || s.name}: ${s.short_description || s.desc || ""}`)
        .join("\n");

      const prompt = `You are a friendly dental concierge for ${clinic.clinic_name} in ${clinic.city}.
A potential patient submitted a smile assessment.

Patient: ${data.full_name}, age range: ${data.age_range || "n/a"}
Main concerns: ${data.concerns.join(", ") || "none specified"}
Smile goal: ${data.smile_goal || "not stated"}
Additional notes: ${data.notes || "none"}

Available treatments at this clinic:
${svcList || "(general dentistry)"}

Write a warm, 120-word personalized summary addressed to the patient. Then list up to 3 recommended services from the list above as JSON.

Return ONLY JSON in this exact shape:
{ "summary": "...", "recommended": [{ "title": "...", "reason": "..." }] }`;

      try {
        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "You are a helpful dental concierge. Always respond with valid JSON only." },
              { role: "user", content: prompt },
            ],
          }),
        });
        if (res.ok) {
          const json = await res.json();
          const content = json?.choices?.[0]?.message?.content ?? "";
          const cleaned = content.replace(/```json|```/g, "").trim();
          try {
            const parsed = JSON.parse(cleaned);
            aiSummary = String(parsed.summary || "");
            recommended = Array.isArray(parsed.recommended) ? parsed.recommended.slice(0, 3) : [];
          } catch {
            aiSummary = cleaned;
          }
        }
      } catch (e) {
        console.error("AI smile assessment failed", e);
      }
    }

    const { error } = await supabase.from("smile_assessments").insert({
      clinic_id: clinic?.id ?? null,
      clinic_slug: data.clinic_slug,
      full_name: data.full_name,
      email: data.email,
      phone: data.phone ?? null,
      age_range: data.age_range ?? null,
      concerns: data.concerns,
      smile_goal: data.smile_goal ?? null,
      notes: data.notes ?? null,
      ai_summary: aiSummary || null,
      recommended_services: recommended,
    });
    if (error) throw new Error(error.message);

    return { summary: aiSummary, recommended };
  });