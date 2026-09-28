import { supabase } from '@/integrations/supabase/client';
const allowed = new Set(['preview_viewed','service_clicked','AI_opened','AI_conversation_started','appointment_started','appointment_requested','claim_clicked']);
export function trackClinicEvent(clinicId: string, eventName: string) {
  if (!allowed.has(eventName)) return;
  void supabase.from('clinic_events').insert({ clinic_id: clinicId, event_name: eventName, page_path: typeof window === 'undefined' ? null : window.location.pathname });
}
