import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Upload, Inbox, Palette, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin · TechAI Labs" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/clinics", label: "Clinics", icon: Building2 },
    { to: "/admin/import", label: "CSV import", icon: Upload },
    { to: "/admin/claims", label: "Claims", icon: Inbox },
    { to: "/admin/themes", label: "Themes", icon: Palette },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1500px] gap-6 px-6 py-6">
        <aside className="hidden w-60 shrink-0 md:block">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[oklch(0.72_0.18_255)] to-[oklch(0.78_0.18_290)]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg">TechAI Labs</span>
          </Link>
          <nav className="mt-8 space-y-1 text-sm">
            {nav.map((n) => {
              const active = path === n.to || (n.to !== "/admin" && path.startsWith(n.to));
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition ${
                    active ? "bg-surface text-foreground" : "text-muted-foreground hover:bg-surface/60 hover:text-foreground"
                  }`}
                >
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
