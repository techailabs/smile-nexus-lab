import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, Monitor, Smartphone, Tablet, SlidersHorizontal } from "lucide-react";
import { THEME_PRESETS } from "@/lib/clinic-types";

export type ClinicTheme = {
  primary: string;
  secondary: string;
  radius: number;
  vibe: string;
  mode: "light" | "dark";
  device: "desktop" | "tablet" | "mobile";
};

type Props = {
  theme: ClinicTheme;
  onChange: (t: ClinicTheme) => void;
};

export function CustomizerPanel({ theme, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Bottom-center preview controls — professional, framed as a review tool */}
      <div className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open preview controls"
          className="group inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-white/95 px-5 py-2.5 text-[13px] font-medium text-neutral-800 shadow-[0_18px_50px_-15px_rgba(0,0,0,0.35)] backdrop-blur-md transition hover:border-black/25 hover:shadow-[0_22px_60px_-15px_rgba(0,0,0,0.45)]"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-neutral-900 text-white">
            <SlidersHorizontal className="h-3 w-3" />
          </span>
          Preview controls
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-neutral-400 sm:inline">Demo</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[400px] flex-col border-l border-black/10 bg-white text-neutral-900"
            >
              <div className="flex items-center justify-between border-b border-black/[0.06] px-6 py-4">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <p className="font-display text-lg">Personalise</p>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-8 overflow-y-auto p-6 text-sm">
                <section>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Style</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {THEME_PRESETS.map((t) => (
                      <button
                        key={t.key}
                        onClick={() =>
                          onChange({ ...theme, vibe: t.key, primary: t.primary, secondary: t.secondary })
                        }
                        className={`rounded-xl border p-3 text-left transition ${
                          theme.vibe === t.key ? "border-neutral-900" : "border-black/10 hover:border-black/30"
                        }`}
                      >
                        <div className="flex gap-1.5">
                          <span className="h-5 w-5 rounded-full" style={{ background: t.primary }} />
                          <span className="h-5 w-5 rounded-full" style={{ background: t.secondary }} />
                        </div>
                        <p className="mt-2 text-[13px] font-medium">{t.name}</p>
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Brand color</p>
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-black/10 p-3">
                    <input
                      type="color"
                      value={theme.primary}
                      onChange={(e) => onChange({ ...theme, primary: e.target.value })}
                      className="h-9 w-12 cursor-pointer rounded border-none bg-transparent p-0"
                    />
                    <span className="font-mono text-xs text-neutral-600">{theme.primary}</span>
                  </div>
                </section>

                <section>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500">Preview device</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {([
                      ["desktop", Monitor],
                      ["tablet", Tablet],
                      ["mobile", Smartphone],
                    ] as const).map(([d, Icon]) => (
                      <button
                        key={d}
                        onClick={() => onChange({ ...theme, device: d })}
                        className={`inline-flex flex-col items-center gap-1 rounded-xl border py-3 text-xs capitalize ${
                          theme.device === d ? "border-neutral-900" : "border-black/10"
                        }`}
                      >
                        <Icon className="h-4 w-4" /> {d}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
