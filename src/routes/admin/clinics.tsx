import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, ExternalLink, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { clinicHealth } from "@/lib/clinic-health";
import type { Clinic } from "@/lib/clinic-types";
import { Button } from "@/components/ui/button";
import { slugify, THEME_PRESETS } from "@/lib/clinic-types";

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
                    <Link to="/clinic/$slug" params={{ slug: r.slug }} className="hover:text-foreground"><ExternalLink className="h-4 w-4" /></Link>
                    <button onClick={() => remove(r.id)} className="hover:text-[oklch(0.7_0.19_25)]"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-3 text-sm"><Button variant="outline" disabled={!page} onClick={() => setPage(p => p-1)}>Previous</Button><span>Page {page+1}</span><Button variant="outline" disabled={rows.length<50} onClick={() => setPage(p => p+1)}>Next</Button></div>
      {addOpen && <AddClinicModal onClose={() => setAddOpen(false)} onSaved={() => { setAddOpen(false); load(); }} />}
    </div>
  );
}

function AddClinicModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    clinic_name: "", city: "", country: "", phone: "", email: "", website: "", theme: "modern-minimal", tagline: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const preset = THEME_PRESETS.find((t) => t.key === form.theme)!;
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
      primary_color: preset.primary,
      secondary_color: preset.secondary,
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
          <label className="col-span-2">
            <span className="text-xs text-muted-foreground">Theme</span>
            <select value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })} className="mt-1 w-full rounded-lg border border-border/70 bg-surface px-3 py-2">
              {THEME_PRESETS.map((t) => <option key={t.key} value={t.key}>{t.name}</option>)}
            </select>
          </label>
        </div>
        {err && <p className="mt-3 text-xs text-[oklch(0.7_0.19_25)]">{err}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full border border-border/70 px-4 py-2 text-sm">Cancel</button>
          <button disabled={busy} className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-60">
            {busy ? "Saving…" : "Create clinic"}
          </button>
        </div>
      </form>
    </div>
  );
}
