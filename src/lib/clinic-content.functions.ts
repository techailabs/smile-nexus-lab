import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateClinicContentDraft } from "./clinic-content.server";

export const generateClinicContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ clinicId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: clinic, error } = await context.supabase
      .from("clinics")
      .select("clinic_name,city,state,country,address,phone,email,tagline,short_description,long_description,about_us,specialization,services,faqs,team,insurance,financing,technology,years_experience")
      .eq("id", data.clinicId)
      .single();
    if (error || !clinic) throw new Error("Clinic record could not be loaded.");
    return generateClinicContentDraft(clinic);
  });