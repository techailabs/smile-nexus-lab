import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, HoursCard, MapSection, useClinic, IMG } from "@/components/clinic/site";
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/clinic/$slug/contact")({
  component: ContactPage,
});

function ContactPage() {
  const clinic = useClinic();
  const [done, setDone] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow="Book a visit"
        title={`Let's get you in.`}
        intro={`Tell us a little about what you're looking for, and we'll find a quiet time that works.`}
        image={IMG.family}
      />
      <section className="border-t border-black/[0.05]">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:px-10">
          <div className="rounded-[1.75rem] border border-black/[0.06] bg-white p-8 md:p-10">
            {done ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10" style={{ color: "var(--clinic-primary)" }} />
                <p className="mt-6 font-display text-3xl tracking-tight">We'll be in touch soon.</p>
                <p className="mt-3 text-neutral-600">Thanks for reaching out to {clinic.clinic_name}.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDone(true);
                }}
                className="space-y-5"
              >
                <p className="font-display text-3xl tracking-tight">Request an appointment</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" name="name" required />
                  <Field label="Phone" name="phone" type="tel" required />
                </div>
                <Field label="Email" name="email" type="email" required />
                <Field label="What can we help with?" name="topic" placeholder="e.g. check-up, whitening, Invisalign" />
                <label className="block">
                  <span className="text-[12px] uppercase tracking-[0.18em] text-neutral-500">Anything else?</span>
                  <textarea
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/40"
                    rows={4}
                  />
                </label>
                <button
                  className="inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-medium text-white shadow-sm transition hover:opacity-95"
                  style={{ background: "var(--clinic-primary)" }}
                >
                  Request appointment
                </button>
              </form>
            )}
          </div>
          <div className="space-y-6">
            <div className="rounded-[1.5rem] border border-black/[0.06] bg-white p-8">
              <p className="font-display text-2xl tracking-tight">Visit us</p>
              <ul className="mt-6 space-y-4 text-sm text-neutral-700">
                {clinic.address && <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4" /> {clinic.address}</li>}
                {clinic.phone && <li className="flex items-center gap-3"><Phone className="h-4 w-4" /> <a href={`tel:${clinic.phone}`}>{clinic.phone}</a></li>}
                {clinic.email && <li className="flex items-center gap-3"><Mail className="h-4 w-4" /> <a href={`mailto:${clinic.email}`}>{clinic.email}</a></li>}
              </ul>
            </div>
            <HoursCard />
          </div>
        </div>
      </section>
      <MapSection />
    </>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[12px] uppercase tracking-[0.18em] text-neutral-500">{label}{required ? " *" : ""}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/40"
      />
    </label>
  );
}
