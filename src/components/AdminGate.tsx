import { LockKeyhole } from "lucide-react";
import type React from "react";

type Props = {
  children: React.ReactNode;
};

export function AdminGate({ children }: Props) {
  const allowed = new URLSearchParams(window.location.search).get("admin") === "demo";
  if (!allowed) {
    return (
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-10 md:px-8">
        <div className="rounded-[2rem] border border-amber/30 bg-soft-amber p-6">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber">
            <LockKeyhole size={18} /> Internal dashboard protected in production
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink">Admin access required</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Add <code className="rounded bg-white px-1 py-0.5">?admin=demo</code> for local demo access. This is only a client-side demo gate, not production security.
          </p>
        </div>
      </main>
    );
  }
  return (
    <>
      <div className="mx-auto mt-4 max-w-6xl px-4 md:px-8">
        <div className="rounded-2xl border border-amber/30 bg-soft-amber px-4 py-3 text-sm font-semibold text-amber">
          Internal Demo Mode
        </div>
      </div>
      {children}
    </>
  );
}
