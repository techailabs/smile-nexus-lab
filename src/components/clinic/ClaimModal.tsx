import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Props = {
  open: boolean;
  onClose: () => void;
  clinicId: string;
  clinicSlug: string;
  clinicName: string;
};

export function ClaimModal({ open, onClose, clinicId, clinicSlug, clinicName }: Props) {
  const [form, setForm] = useState({ owner_name: "", email: "", phone: "", website: "", interest_level: "high" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    setErr(null);
    if (!form.owner_name.trim() || !form.email.trim()) {
      setErr("Name and email are required.");
      setState("error");
      return;
    }
    const { error } = await supabase.from("claims").insert({
      clinic_id: clinicId,
      clinic_slug: clinicSlug,
      ...form,
    });
    if (error) {
      setErr(error.message);
      setState("error");
    } else {
      setState("done");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-border/70 bg-background p-0 shadow-2xl"
          >
            {state === "done" ? (
              <div className="p-8 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[oklch(0.7_0.17_150)]/15">
                  <CheckCircle2 className="h-7 w-7 text-[oklch(0.7_0.17_150)]" />
                </div>
                <h3 className="mt-5 font-display text-2xl">Thanks — we'll be in touch.</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  TechAI Labs can fully customize and launch <span className="text-foreground">{clinicName}</span> as your clinic experience.
                </p>
                <button onClick={onClose} className="mt-6 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="flex items-start justify-between border-b border-border/60 p-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">Claim website</p>
                    <h3 className="mt-1 font-display text-2xl">{clinicName}</h3>
                  </div>
                  <button type="button" onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-3 p-6 text-sm">
                  {[
                    ["owner_name", "Owner name", "text", true],
                    ["email", "Clinic email", "email", true],
                    ["phone", "Phone", "tel", false],
                    ["website", "Current website", "url", false],
                  ].map(([k, label, type, req]) => (
                    <label key={k as string} className="block">
                      <span className="text-xs text-muted-foreground">{label as string}{req ? " *" : ""}</span>
                      <input
                        type={type as string}
                        required={req as boolean}
                        value={form[k as keyof typeof form]}
                        onChange={(e) => setForm({ ...form, [k as string]: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-border/70 bg-surface px-3 py-2.5 outline-none focus:border-foreground/40"
                      />
                    </label>
                  ))}
                  <label className="block">
                    <span className="text-xs text-muted-foreground">Interest level</span>
                    <select
                      value={form.interest_level}
                      onChange={(e) => setForm({ ...form, interest_level: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border/70 bg-surface px-3 py-2.5 outline-none"
                    >
                      <option value="high">Ready to launch</option>
                      <option value="medium">Exploring options</option>
                      <option value="low">Just curious</option>
                    </select>
                  </label>
                  {err && <p className="text-xs text-[oklch(0.7_0.19_25)]">{err}</p>}
                </div>
                <div className="border-t border-border/60 p-6 pt-4">
                  <button
                    disabled={state === "loading"}
                    className="w-full rounded-xl bg-foreground py-3 text-sm font-medium text-background transition disabled:opacity-60"
                  >
                    {state === "loading" ? "Submitting…" : "Submit claim"}
                  </button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    TechAI Labs can fully customize and launch this clinic experience.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
