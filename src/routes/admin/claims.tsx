import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/claims")({
  component: AdminClaims,
});

type Claim = {
  id: string; clinic_slug: string; owner_name: string; email: string;
  phone: string | null; interest_level: string | null; status: string; created_at: string;
};

function AdminClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  useEffect(() => {
    supabase.from("claims").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setClaims((data as Claim[]) ?? []);
    });
  }, []);

  const setStatus = async (id: string, status: string) => {
    await supabase.from("claims").update({ status }).eq("id", id);
    setClaims((cs) => cs.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Pipeline</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Claim submissions</h1>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Owner</th>
              <th className="px-4 py-3 text-left">Clinic</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Interest</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {claims.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">No claims yet.</td></tr>
            )}
            {claims.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.owner_name}</td>
                <td className="px-4 py-3">
                  <Link to="/clinic/$slug" params={{ slug: c.clinic_slug }} className="text-muted-foreground hover:text-foreground">
                    {c.clinic_slug}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3 capitalize">{c.interest_level}</td>
                <td className="px-4 py-3">
                  <select
                    value={c.status}
                    onChange={(e) => setStatus(c.id, e.target.value)}
                    className="rounded-md border border-border/70 bg-background px-2 py-1 text-xs"
                  >
                    {["new", "contacted", "qualified", "won", "lost"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
