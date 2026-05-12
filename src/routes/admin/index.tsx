import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Inbox, Star, TrendingUp, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

function AdminOverview() {
  const [stats, setStats] = useState({ clinics: 0, claimed: 0, claims: 0, avgRating: 0 });
  const [recent, setRecent] = useState<Array<{ id: string; clinic_name: string; slug: string; city: string }>>([]);

  useEffect(() => {
    (async () => {
      const [{ count: clinics }, { count: claimed }, { count: claims }, { data: ratings }, { data: r }] =
        await Promise.all([
          supabase.from("clinics").select("*", { count: "exact", head: true }),
          supabase.from("clinics").select("*", { count: "exact", head: true }).eq("claimed", true),
          supabase.from("claims").select("*", { count: "exact", head: true }),
          supabase.from("clinics").select("rating"),
          supabase.from("clinics").select("id,clinic_name,slug,city").order("created_at", { ascending: false }).limit(5),
        ]);
      const avg = ratings?.length ? ratings.reduce((a, b) => a + Number(b.rating ?? 0), 0) / ratings.length : 0;
      setStats({ clinics: clinics ?? 0, claimed: claimed ?? 0, claims: claims ?? 0, avgRating: avg });
      setRecent((r as typeof recent) ?? []);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Overview</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Welcome back.</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Clinics", v: stats.clinics, i: Building2 },
          { l: "Claimed", v: stats.claimed, i: TrendingUp },
          { l: "Pending claims", v: stats.claims, i: Inbox },
          { l: "Avg rating", v: stats.avgRating.toFixed(1), i: Star },
        ].map(({ l, v, i: Icon }) => (
          <div key={l} className="rounded-2xl border border-border/70 bg-surface p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs uppercase tracking-widest">{l}</span>
              <Icon className="h-4 w-4" />
            </div>
            <p className="mt-3 font-display text-3xl">{v}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border/70 bg-surface">
        <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
          <p className="font-display text-lg">Recent clinics</p>
          <Link to="/admin/clinics" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            See all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <ul className="divide-y divide-border/60">
          {recent.map((c) => (
            <li key={c.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="font-medium">{c.clinic_name}</p>
                <p className="text-xs text-muted-foreground">{c.city}</p>
              </div>
              <Link to="/clinic/$slug" params={{ slug: c.slug }} className="text-xs text-muted-foreground hover:text-foreground">
                View →
              </Link>
            </li>
          ))}
          {recent.length === 0 && <li className="px-5 py-6 text-sm text-muted-foreground">No clinics yet.</li>}
        </ul>
      </div>
    </div>
  );
}
