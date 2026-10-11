import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Plus, ExternalLink, Search, Trash2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { clinicHealth } from "@/lib/clinic-health";
import type { Clinic } from "@/lib/clinic-types";
import { Button } from "@/components/ui/button";
import { slugify, THEME_PRESETS, TEMPLATE_REGISTRY } from "@/lib/clinic-types";
import { generateClinicContent } from "@/lib/clinic-content.functions";

type ContentDraft = Awaited<ReturnType<ReturnType<typeof useServerFn<typeof generateClinicContent>>>>;

export const Route = createFileRoute("/admin/clinics")({
  head: () => ({ meta: [{title:"Clinics | Smile Nexus Lab"},{name:"description",content:"Manage dental clinic websites."},{property:"og:title",content:"Clinics | Smile Nexus Lab"},{property:"og:description",content:"Manage dental clinic websites."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}] }),
  component: AdminClinics,
});

type Row = Clinic;

function AdminClinics() {
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [draftClinic, setDraftClinic] = useState<Row | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("clinics")
      .select("*")
      .order("created_at", { ascending: false })
      .range(page*50,(page+1)*50-1);
    setRows((data as unknown as Row[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [page]);

  const remove = async (id: string) => {
    if (!confirm("Delete this clinic?")) return;
    await supabase.from("clinics").delete().eq("id", id);
    load();
  };

  const filtered = rows.filter((r) => !q || r.clinic_name.toLowerCase().includes(q.toLowerCase()) || r.city.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Database</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">Clinics</h1>
        </div>
        <Button onClick={() => setAddOpen(true)} className="inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add clinic
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-surface px-3 py-2 text-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clinics" className="w-full bg-transparent outline-none" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-left">Theme</th>
              <th className="px-4 py-3 text-left">Site health</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">Loading…</td></tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">No clinics found.</td></tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-surface-2/60">
                <td className="px-4 py-3 font-medium">{r.clinic_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.city}, {r.country}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.theme}</td>
                <td className="px-4 py-3"><span title={clinicHealth(r).missing.join(", ") || "All checks complete"}>{clinicHealth(r).score}%</span><p className="max-w-52 text-xs text-muted-foreground">{clinicHealth(r).missing.slice(0,2).join(" · ")}</p></td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${r.claimed ? "bg-[oklch(0.7_0.17_150)]/15 text-[oklch(0.85_0.13_150)]" : "bg-muted text-muted-foreground"}`}>
                    {r.claimed ? "Claimed" : "Demo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2 text-muted-foreground">
                    <Button title="Generate clinic content" aria-label={`Generate content for ${r.clinic_name}`} variant="ghost" size="icon" onClick={() => setDraftClinic(r)}><Sparkles className="h-4 w-4" /></Button>
                    <Button title="Open clinic preview" aria-label={`Open ${r.clinic_name} preview`} variant="ghost" size="icon" asChild><Link to="/clinic/$slug" params={{ slug: r.slug }}><ExternalLink className="h-4 w-4" /></Link></Button>
                    <Button title="Delete clinic" aria-label={`Delete ${r.clinic_name}`} variant="ghost" size="icon" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-3 text-sm"><Button variant="outline" disabled={!page} onClick={() => setPage(p => p-1)}>Previous</Button><span>Page {page+1}</span><Button variant="outline" disabled={rows.length<50} onClick={() => setPage(p => p+1)}>Next</Button></div>
      {addOpen && <AddClinicModal onClose={() => setAddOpen(false)} onSaved={() => { setAddOpen(false); load(); }} />}
      {draftClinic && <ClinicContentModal clinic={draftClinic} onClose={() => setDraftClinic(null)} onSaved={() => { setDraftClinic(null); load(); }} />}
    </div>
  );
}

function AddClinicModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    clinic_name: "", city: "", country: "", country_code: "US", phone: "", email: "", website: "", theme: "modern-minimal", template_key: "dental-modern-minimal", status: "preview", tagline: "", primary_color: "", secondary_color: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const preset = THEME_PRESETS.find((t) => t.key === form.theme) ?? THEME_PRESETS[0];
    if (!preset) { setBusy(false); setErr("No clinic theme is available."); return; }
    const slug = slugify(`${form.city}-${form.clinic_name}`);
    const { error } = await supabase.from("clinics").insert({
      clinic_name: form.clinic_name,
      slug,
      city: form.city,
      country: form.country,
      phone: form.phone || null,
      email: form.email || null,
      website: form.website || null,
      tagline: form.tagline || null,
      theme: form.theme,
      template_key: form.template_key,
      country_code: form.country_code,
      status: form.status,
      primary_color: form.primary_color || preset.primary,
      secondary_color: form.secondary_color || preset.secondary,
    });
    setBusy(false);
    if (error) setErr(error.message);
    else onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-[92vw] max-w-lg rounded-2xl border border-border/70 bg-background p-6">
        <p className="font-display text-2xl">Add clinic</p>
        <p className="mt-1 text-xs text-muted-foreground">Slug, scoring, and theme colors fill in automatically.</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          {[
            ["clinic_name", "Clinic name", true],
            ["city", "City", true],
            ["country", "Country", true],
            ["phone", "Phone", false],
            ["email", "Email", false],
            ["website", "Website", false],
          ].map(([k, label, req]) => (
            <label key={k as string} className="col-span-1">
              <span className="text-xs text-muted-foreground">{label as string}{req ? " *" : ""}</span>
              <input
                required={req as boolean}
                value={form[k as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [k as string]: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border/70 bg-surface px-3 py-2 outline-none focus:border-foreground/40"
              />
            </label>
          ))}
          <label className="col-span-2">
            <span className="text-xs text-muted-foreground">Tagline</span>
            <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="mt-1 w-full rounded-lg border border-border/70 bg-surface px-3 py-2 outline-none" />
          </label>
          <label><span className="text-xs text-muted-foreground">Country code</span><select value={form.country_code} onChange={(e) => setForm({ ...form, country_code: e.target.value })} className="mt-1 w-full rounded-lg border border-border/70 bg-surface px-3 py-2"><option>US</option><option>UK</option><option>AU</option></select></label>
          <label><span className="text-xs text-muted-foreground">Status</span><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full rounded-lg border border-border/70 bg-surface px-3 py-2"><option value="draft">Draft</option><option value="preview">Preview</option><option value="claimed">Claimed</option><option value="live">Live</option><option value="archived">Archived</option></select></label>
          <label className="col-span-2">
            <span className="text-xs text-muted-foreground">Theme</span>
            <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} className="mt-1 w-full rounded-lg border border-border/70 bg-surface px-3 py-2">
              {THEME_PRESETS.map((t) => <option key={t.key} value={t.key}>{t.name}</option>)}
            </select>
          </label>
          <label className="col-span-2"><span className="text-xs text-muted-foreground">Website template</span><select value={form.template_key} onChange={(e) => setForm({ ...form, template_key: e.target.value })} className="mt-1 w-full rounded-lg border border-border/70 bg-surface px-3 py-2">{TEMPLATE_REGISTRY.map((t) => <option key={t.key} value={t.key}>{t.name}</option>)}</select></label>
          <label><span className="text-xs text-muted-foreground">Primary color</span><input type="color" value={form.primary_color || "#0b6cf2"} onChange={(e) => setForm({ ...form, primary_color: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-border/70 bg-surface p-1" /></label>
          <label><span className="text-xs text-muted-foreground">Secondary color</span><input type="color" value={form.secondary_color || "#0e1a33"} onChange={(e) => setForm({ ...form, secondary_color: e.target.value })} className="mt-1 h-10 w-full rounded-lg border border-border/70 bg-surface p-1" /></label>
        </div>
        {err && <p className="mt-3 text-xs text-[oklch(0.7_0.19_25)]">{err}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={busy}>
            {busy ? "Saving…" : "Create clinic"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ClinicContentModal({ clinic, onClose, onSaved }: { clinic: Row; onClose: () => void; onSaved: () => void }) {
  const generate = useServerFn(generateClinicContent);
  const [draft, setDraft] = useState<ContentDraft | null>(null);
  const [services, setServices] = useState("");
  const [faqs, setFaqs] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeDraft = async () => {
    setBusy(true); setError(null);
    try {
      const next = await generate({ data: { clinicId: clinic.id } });
      setDraft(next); setServices(JSON.stringify(next.services, null, 2)); setFaqs(JSON.stringify(next.faqs, null, 2));
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Content could not be generated."); }
    finally { setBusy(false); }
  };
  const save = async () => {
    if (!draft) return;
    setBusy(true); setError(null);
    try {
      const parsedServices = JSON.parse(services) as unknown;
      const parsedFaqs = JSON.parse(faqs) as unknown;
      if (!Array.isArray(parsedServices) || !Array.isArray(parsedFaqs)) throw new Error("Services and FAQs must remain lists.");
      const { error: saveError } = await supabase.from("clinics").update({ ...draft, services: parsedServices, faqs: parsedFaqs }).eq("id", clinic.id);
      if (saveError) throw saveError;
      onSaved();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Draft could not be saved."); setBusy(false); }
  };
  const update = (key: keyof ContentDraft, value: string) => setDraft((current) => current ? { ...current, [key]: value } : current);
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4 backdrop-blur-sm" onClick={onClose}><div role="dialog" aria-modal="true" aria-label={`Content draft for ${clinic.clinic_name}`} onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-border bg-background p-6"><div className="flex items-start justify-between gap-4"><div><p className="font-display text-2xl">Generate clinic content</p><p className="mt-1 text-sm text-muted-foreground">{clinic.clinic_name} · Review and edit every field before saving.</p></div><Button variant="ghost" onClick={onClose}>Close</Button></div>{!draft ? <div className="py-16 text-center"><Sparkles className="mx-auto size-8 text-muted-foreground"/><p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">Creates a factual draft from this clinic record without adding unsupported doctors, reviews, insurance, prices, or credentials.</p><Button className="mt-6" disabled={busy} onClick={makeDraft}>{busy ? "Generating…" : "Generate editable draft"}</Button></div> : <div className="mt-6 grid gap-4 sm:grid-cols-2">{([['short_description','Homepage summary'],['long_description','Homepage detail'],['about_us','About copy'],['consultation_cta','Call to action'],['meta_title','SEO title'],['meta_description','SEO description']] as Array<[keyof ContentDraft,string]>).map(([key,label])=><label key={key} className={key === 'meta_title' || key === 'consultation_cta' ? '' : 'sm:col-span-2'}><span className="text-xs font-medium text-muted-foreground">{label}</span><textarea rows={key === 'long_description' || key === 'about_us' ? 5 : 2} value={String(draft[key])} onChange={(e)=>update(key,e.target.value)} className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"/></label>)}<label className="sm:col-span-2"><span className="text-xs font-medium text-muted-foreground">Services JSON</span><textarea rows={10} value={services} onChange={(e)=>setServices(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs"/></label><label className="sm:col-span-2"><span className="text-xs font-medium text-muted-foreground">FAQs JSON</span><textarea rows={10} value={faqs} onChange={(e)=>setFaqs(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs"/></label></div>}{error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}{draft && <div className="mt-6 flex justify-end gap-2"><Button variant="outline" disabled={busy} onClick={makeDraft}>Regenerate</Button><Button disabled={busy} onClick={save}>{busy ? "Saving…" : "Save approved draft"}</Button></div>}</div></div>;
}
