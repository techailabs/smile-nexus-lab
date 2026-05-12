import { createFileRoute } from "@tanstack/react-router";
import { THEME_PRESETS } from "@/lib/clinic-types";

export const Route = createFileRoute("/admin/themes")({
  component: AdminThemes,
});

function AdminThemes() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Design</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Themes</h1>
        <p className="mt-2 text-sm text-muted-foreground">Five reusable clinic vibes. Every clinic inherits one — and can be overridden per-record.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {THEME_PRESETS.map((t) => (
          <div key={t.key} className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
            <div className="h-32 relative" style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}>
              <div className="absolute inset-0 bg-grid opacity-30" />
            </div>
            <div className="p-5">
              <p className="font-display text-xl">{t.name}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{t.key}</p>
              <div className="mt-4 flex gap-2">
                <span className="flex-1 rounded-md border border-border/70 px-2 py-1 text-xs">{t.primary}</span>
                <span className="flex-1 rounded-md border border-border/70 px-2 py-1 text-xs">{t.secondary}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
