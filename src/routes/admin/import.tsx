import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import Papa from "papaparse";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { slugify, THEME_PRESETS, TEMPLATE_REGISTRY, templatePreset } from "@/lib/clinic-types";

export const Route = createFileRoute("/admin/import")({
  component: AdminImport,
});

type Row = Record<string, string>;

function AdminImport() {
  const [rows, setRows] = useState<Row[]>([]);
  const [file, setFile] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ ok: number; failed: number } | null>(null);

  const onFile = (f: File) => {
    setFile(f.name);
    setResult(null);
    Papa.parse<Row>(f, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => setRows(res.data.filter((r) => r.clinic_name || r["Clinic Name"])),
    });
  };

  const normalize = (r: Row) => {
    const k = (a: string, b?: string) => r[a] ?? (b ? r[b] : "") ?? "";
    const name = k("clinic_name", "Clinic Name");
    const city = k("city", "City");
    const country = k("country", "Country") || "United States";
    const rawCountryCode = (k("country_code") || "").toUpperCase();
    const country_code = ["US", "UK", "AU"].includes(rawCountryCode)
      ? rawCountryCode
      : (/united kingdom|^uk$|britain|england/i.test(country) ? "UK"
        : /australia|^au$/i.test(country) ? "AU" : "US");
    const vertical = k("vertical") || "dental";
    const templateKey = k("template_key") || k("template") || "";
    const tpl = templatePreset(templateKey);
    const themeKey = k("theme") || "modern-minimal";
    const themePreset = THEME_PRESETS.find((t) => t.key === themeKey) ?? THEME_PRESETS[0];
    const services = k("services")
      ? k("services").split("|").map((s) => {
          const title = s.trim();
          return { title, slug: slugify(title), short_description: "" };
        })
      : [];
    const faqs = k("faqs")
      ? k("faqs").split("|").map((p) => {
          const [q, a = ""] = p.split("::");
          return { question: (q || "").trim(), answer: a.trim() };
        })
      : [];
    const keywords = k("meta_keywords") ? k("meta_keywords").split("|").map((s) => s.trim()).filter(Boolean) : [];
    return {
      clinic_name: name,
      slug: slugify(`${city}-${name}`),
      city,
      country,
      country_code,
      vertical,
      template_key: tpl.key,
      status: k("status") || "preview",
      state: k("state") || null,
      zip_code: k("zip_code") || null,
      address: k("address") || null,
      phone: k("phone") || null,
      email: k("email") || null,
      website: k("website") || null,
      tagline: k("tagline") || null,
      about: k("about") || null,
      services,
      faqs,
      reviews: [],
      meta_title: k("meta_title") || null,
      meta_description: k("meta_description") || null,
      meta_keywords: keywords,
      whatsapp_number: k("whatsapp_number") || null,
      booking_link: k("booking_link") || null,
      google_maps_embed: k("google_maps_embed") || null,
      theme: themeKey,
      primary_color: k("primary_color") || tpl.primary || themePreset.primary,
      secondary_color: k("secondary_color") || tpl.secondary || themePreset.secondary,
      rating: Number(k("rating")) || 4.8,
      review_count: Number(k("reviews")) || 0,
    };
  };

  const runImport = async () => {
    setImporting(true);
    let ok = 0, failed = 0;
    // Chunked insert for scale
    const batches: ReturnType<typeof normalize>[][] = [];
    const normalized = rows.map(normalize).filter((r) => r.clinic_name && r.city);
    const SIZE = 500;
    for (let i = 0; i < normalized.length; i += SIZE) batches.push(normalized.slice(i, i + SIZE));
    for (const batch of batches) {
      const { error } = await supabase.from("clinics").upsert(batch as never, { onConflict: "slug" });
      if (error) failed += batch.length;
      else ok += batch.length;
    }
    setImporting(false);
    setResult({ ok, failed });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Bulk import</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">CSV import</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Required: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">clinic_name, city</code>.
          Recommended: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">vertical, template_key, country_code (US/UK/AU), country, state, zip_code, address, phone, email, website, tagline, about, services, faqs, meta_title, meta_description, meta_keywords, whatsapp_number, booking_link, google_maps_embed, primary_color, secondary_color</code>.
          Services and meta_keywords use <code className="rounded bg-muted px-1.5 py-0.5 text-xs">|</code> separators. FAQs use <code className="rounded bg-muted px-1.5 py-0.5 text-xs">question::answer|question::answer</code>.
          Verticals: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">dental, orthodontics, cosmetic-dentistry, pediatric-dentistry, dermatology, medspa, lawyer, plumber, electrician, hvac, roofer</code>.
          Templates: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{TEMPLATE_REGISTRY.map(t => t.key).join(", ")}</code>.
        </p>
      </div>

      <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 bg-surface px-6 py-14 text-center transition hover:border-foreground/40">
        <Upload className="h-6 w-6 text-muted-foreground" />
        <div>
          <p className="font-medium">Drop CSV or click to upload</p>
          <p className="text-xs text-muted-foreground">Scales to 10,000+ rows. Duplicate slugs are upserted.</p>
        </div>
        <input
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        />
      </label>

      {file && (
        <div className="rounded-2xl border border-border/70 bg-surface">
          <div className="flex items-center justify-between border-b border-border/60 px-5 py-3 text-sm">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span className="font-medium">{file}</span>
              <span className="text-muted-foreground">· {rows.length} rows</span>
            </div>
            <button
              onClick={runImport}
              disabled={importing || rows.length === 0}
              className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background disabled:opacity-60"
            >
              {importing ? "Importing…" : `Import ${rows.length}`}
            </button>
          </div>
          <div className="max-h-[400px] overflow-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-surface-2 text-muted-foreground">
                <tr>
                  {["clinic_name", "city", "country", "phone", "theme"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {rows.slice(0, 50).map((r, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">{r.clinic_name ?? r["Clinic Name"]}</td>
                    <td className="px-3 py-2">{r.city ?? r["City"]}</td>
                    <td className="px-3 py-2">{r.country ?? r["Country"]}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.phone}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.theme || "modern-minimal"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length > 50 && <p className="border-t border-border/60 px-3 py-2 text-xs text-muted-foreground">+ {rows.length - 50} more rows…</p>}
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-border/70 bg-surface p-5">
          <div className="flex items-center gap-2">
            {result.failed === 0 ? (
              <CheckCircle2 className="h-5 w-5 text-[oklch(0.7_0.17_150)]" />
            ) : (
              <AlertCircle className="h-5 w-5 text-[oklch(0.82_0.15_85)]" />
            )}
            <p className="font-display text-xl">Import complete</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {result.ok} clinics created/updated · {result.failed} failed
          </p>
        </div>
      )}
    </div>
  );
}
