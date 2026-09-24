"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function BannerSettingsPage() {
  const [token, setToken] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/banner")
      .then(async (response) => {
        const body = (await response.json()) as { text?: string; error?: string };
        if (!response.ok) throw new Error(body.error || "Unable to load banner");
        setText(body.text || "");
      })
      .catch((error: unknown) => {
        setStatus(error instanceof Error ? error.message : "Unable to load banner");
      })
      .finally(() => setLoading(false));
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    try {
      const response = await fetch("/api/banner", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });
      const body = (await response.json()) as { text?: string; error?: string };
      if (!response.ok) throw new Error(body.error || "Unable to save banner");
      setText(body.text || text);
      setStatus("Banner updated successfully.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save banner");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-pageBg px-4 py-10 sm:px-6 lg:py-16">
      <section className="mx-auto max-w-2xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-textSecondary hover:text-textPrimary">
          <ArrowLeft className="h-4 w-4" /> Back to storefront
        </Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-textSecondary">
          Storefront settings
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold">Promo banner</h1>
        <p className="mt-3 text-textSecondary">
          Update the announcement shown across the storefront without changing the Scentora theme.
        </p>

        <form onSubmit={save} className="mt-8 space-y-5 rounded-2xl border border-black/10 bg-white p-5 shadow-card sm:p-8">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Admin token</span>
            <input
              type="password"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              required
              autoComplete="current-password"
              className="min-h-12 w-full rounded-xl border border-black/15 bg-pageBg px-4 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>
          <label className="block">
            <span className="mb-2 flex items-center justify-between text-sm font-semibold">
              Banner text <span className="font-normal text-textSecondary">{text.length}/180</span>
            </span>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              maxLength={180}
              required
              rows={3}
              disabled={loading}
              className="w-full rounded-xl border border-black/15 bg-pageBg px-4 py-3 outline-none focus:border-black focus:ring-2 focus:ring-black/10"
            />
          </label>
          {status ? (
            <p className="flex items-center gap-2 rounded-xl border border-black/10 bg-pageBg px-4 py-3 text-sm">
              {status === "Banner updated successfully." ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : null}
              {status}
            </p>
          ) : null}
          <button type="submit" disabled={loading || saving} className="min-h-12 w-full rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80 disabled:opacity-50">
            {saving ? "Saving..." : "Save banner"}
          </button>
        </form>
      </section>
    </main>
  );
}
