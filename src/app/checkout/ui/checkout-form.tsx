"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function CheckoutForm() {
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-textSecondary">Almost yours</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl lg:text-5xl">Complete your order</h1>
      <p className="mt-4 max-w-xl text-textSecondary">
        This frontend preview is ready for a checkout provider. For now, share your order with our team and we&apos;ll confirm delivery and payment details with you.
      </p>
      {submitted ? (
        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
          <h2 className="font-heading text-2xl font-semibold">Thanks, your request is saved.</h2>
          <p className="mt-2">Our team will contact you shortly to confirm your fragrance selection.</p>
          <Link href="/shop/all" className="mt-5 inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
            Continue browsing
          </Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-2xl border border-black/10 bg-white p-5 shadow-card sm:p-8">
          <Field label="Full name" name="name" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" type="tel" required />
          </div>
          <Field label="Delivery address" name="address" required />
          <button type="submit" className="mt-3 min-h-12 w-full rounded-full bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/80">
            Request order confirmation
          </button>
        </form>
      )}
    </main>
  );
}

function Field({ label, name, type = "text", required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input name={name} type={type} required={required} className="min-h-12 w-full rounded-xl border border-black/15 bg-pageBg px-4 outline-none transition focus:border-black focus:ring-2 focus:ring-black/10" />
    </label>
  );
}
