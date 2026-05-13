import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, CheckCircle2, Loader2 } from "lucide-react";
import { PageHeader, useClinic, IMG } from "@/components/clinic/site";
import { svcTitle } from "@/lib/clinic-types";
import { submitSmileCheck } from "@/lib/smile-check.functions";

export const Route = createFileRoute("/clinic/$slug/smile-check")({
  component: SmileCheckPage,
});

const CONCERN_OPTIONS = [
  "Stained / yellow teeth",
  "Crooked or crowded teeth",
  "Missing teeth",
  "Gum sensitivity",
  "Worn or chipped teeth",
  "Bad breath",
  "Tooth pain",
  "General check-up",
];

const AGE_RANGES = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+"];

function SmileCheckPage() {
  const clinic = useClinic();
  const submit = useServerFn(submitSmileCheck);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ summary: string; recommended: { title: string; reason: string }[] } | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    age_range: "",
    concerns: [] as string[],
    smile_goal: "",
    notes: "",
  });

  const toggleConcern = (c: string) => {
    setForm((f) => ({
      ...f,
      concerns: f.concerns.includes(c) ? f.concerns.filter((x) => x !== c) : [...f.concerns, c],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await submit({
        data: {
          clinic_slug: clinic.slug,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone || null,
          age_range: form.age_range || null,
          concerns: form.concerns,
          smile_goal: form.smile_goal || null,
          notes: form.notes || null,
        },
      });
      setResult(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <>
        <PageHeader
          eyebrow="Your smile assessment"
          title="A personalized plan, just for you."
          intro={`Thank you ${form.full_name.split(" ")[0]} — here's what we'd suggest based on what you told us.`}
          image={IMG.smile}
        />
        <section className="border-t border-black/[0.05]">
          <div className="mx-auto max-w-3xl px-6 py-20 lg:px-10">
            <div className="rounded-[1.75rem] border border-black/[0.06] bg-white p-10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.15)]">
              <Sparkles className="h-6 w-6" style={{ color: "var(--clinic-primary)" }} />
              <p className="mt-6 text-[16.5px] leading-relaxed text-neutral-800 whitespace-pre-line">
                {result.summary || `Thanks for reaching out to ${clinic.clinic_name}. A clinician will be in touch shortly to discuss your goals.`}
              </p>
              {result.recommended.length > 0 && (
                <div className="mt-10">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-neutral-500">Suggested treatments</p>
                  <ul className="mt-4 space-y-3">
                    {result.recommended.map((r) => (
                      <li key={r.title} className="rounded-2xl border border-black/[0.06] p-5">
                        <p className="font-display text-lg tracking-tight">{r.title}</p>
                        <p className="mt-1 text-[14px] text-neutral-600">{r.reason}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="mt-10 text-sm text-neutral-500">
                We've sent your details to the {clinic.clinic_name} team. Expect a follow-up within one business day.
              </p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Free AI smile assessment"
        title="Tell us about your smile."
        intro={`Answer a few quick questions and our team — supported by AI — will craft a personalized recommendation tailored to ${clinic.clinic_name}'s treatments.`}
        image={IMG.smile}
      />
      <section className="border-t border-black/[0.05]">
        <div className="mx-auto max-w-2xl px-6 py-20 lg:px-10">
          <div className="mb-8 flex items-center gap-3 text-[12px] uppercase tracking-[0.2em] text-neutral-500">
            <span className={step >= 1 ? "text-neutral-900" : ""}>1. About you</span>
            <span>·</span>
            <span className={step >= 2 ? "text-neutral-900" : ""}>2. Concerns</span>
            <span>·</span>
            <span className={step >= 3 ? "text-neutral-900" : ""}>3. Goal</span>
          </div>

          <div className="rounded-[1.75rem] border border-black/[0.06] bg-white p-8 md:p-10">
            {step === 1 && (
              <div className="space-y-5">
                <Field label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} required />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
                <Field label="Phone (optional)" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                <div>
                  <span className="text-[12px] uppercase tracking-[0.18em] text-neutral-500">Age range</span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {AGE_RANGES.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setForm({ ...form, age_range: a })}
                        className={`rounded-full border px-4 py-2 text-sm transition ${form.age_range === a ? "border-transparent text-white" : "border-black/10 text-neutral-700 hover:border-black/30"}`}
                        style={form.age_range === a ? { background: "var(--clinic-primary)" } : undefined}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!form.full_name || !form.email}
                  className="mt-4 inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-sm transition disabled:opacity-50"
                  style={{ background: "var(--clinic-primary)" }}
                >
                  Continue
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <p className="font-display text-2xl tracking-tight">What would you like to address?</p>
                <p className="text-sm text-neutral-500">Select any that apply.</p>
                <div className="flex flex-wrap gap-2">
                  {CONCERN_OPTIONS.map((c) => {
                    const active = form.concerns.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleConcern(c)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${active ? "border-transparent text-white" : "border-black/10 text-neutral-700 hover:border-black/30"}`}
                        style={active ? { background: "var(--clinic-primary)" } : undefined}
                      >
                        {active && <CheckCircle2 className="mr-1.5 inline h-3.5 w-3.5" />}
                        {c}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between pt-2">
                  <button type="button" onClick={() => setStep(1)} className="text-sm text-neutral-500 hover:text-neutral-900">← Back</button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-sm transition"
                    style={{ background: "var(--clinic-primary)" }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <p className="font-display text-2xl tracking-tight">What's your dream smile?</p>
                <label className="block">
                  <span className="text-[12px] uppercase tracking-[0.18em] text-neutral-500">Smile goal</span>
                  <textarea
                    rows={3}
                    value={form.smile_goal}
                    onChange={(e) => setForm({ ...form, smile_goal: e.target.value })}
                    placeholder="e.g. brighter, straighter, more confident smile for my wedding"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/40"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] uppercase tracking-[0.18em] text-neutral-500">Anything else?</span>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Optional"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/40"
                  />
                </label>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <p className="pt-1 text-xs text-neutral-500">
                  Treatments at {clinic.clinic_name}: {clinic.services.slice(0, 4).map(svcTitle).join(" · ")}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <button type="button" onClick={() => setStep(2)} className="text-sm text-neutral-500 hover:text-neutral-900">← Back</button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-sm transition disabled:opacity-60"
                    style={{ background: "var(--clinic-primary)" }}
                  >
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing…</> : <><Sparkles className="h-4 w-4" /> Get my smile plan</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-[12px] uppercase tracking-[0.18em] text-neutral-500">{label}{required ? " *" : ""}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/40"
      />
    </label>
  );
}