"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError, loginUser } from "@/slice/AuthSlice";
import ScentoraBrand from "@/components/shared/ScentoraBrand";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser({ Username: username.trim(), Password: password }));
    if (!loginUser.fulfilled.match(result)) return;

    const signedInUser = result.payload;
    localStorage.setItem("userName", signedInUser.username);
    localStorage.setItem("fullName", signedInUser.fullname);
    localStorage.setItem("email", signedInUser.email);
    router.replace("/cms");
  }

  return (
    <main className="grid min-h-screen min-h-[100dvh] place-items-center bg-[#f8f1df] px-4 py-8 text-[#211710]">
      <section className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-black/10 bg-[#fffdf8] shadow-[0_24px_80px_rgba(45,30,16,0.14)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative flex min-h-48 flex-col justify-between overflow-hidden bg-[radial-gradient(ellipse_at_78%_78%,rgba(252,140,61,0.18),transparent_42%),linear-gradient(145deg,#2b1c13,#17110d)] p-6 text-[#fffaf0] sm:p-9 md:min-h-[520px]">
          <div aria-hidden="true" className="login-scent-haze login-scent-haze--one" />
          <div aria-hidden="true" className="login-scent-haze login-scent-haze--two" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#fc8c3d]/30" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-14 h-52 w-52 rounded-full border border-[#ffcc70]/25" />
          <div aria-hidden="true" className="login-scent-bottle"><span /></div>
          <div role="img" aria-label="Scentora" className="relative z-10 flex w-fit">
            <ScentoraBrand />
          </div>
          <div className="relative z-10 mt-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#ffcc70]">Store management</p>
            <h1 className="mt-2 max-w-sm font-serif text-3xl leading-tight sm:text-4xl">Welcome back to your workspace.</h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">Sign in with your authorized account to manage Scentora.</p>
          </div>
          <p className="relative z-10 mt-8 text-[10px] tracking-wide text-white/45">SCENTORA · ADMINISTRATION</p>
        </div>

        <div className="flex items-center p-5 sm:p-9 md:p-12">
          <div className="mx-auto w-full max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a15d2d]">Admin portal</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">Sign in</h2>
            <p className="mt-2 text-sm leading-6 text-[#71675e]">Enter your username and password to continue.</p>

            {error ? (
              <div role="alert" className="mt-5 flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800">
                <span>{typeof error === "string" ? error : "We couldn’t sign you in. Check your details and try again."}</span>
                <button type="button" onClick={() => dispatch(clearError())} className="font-semibold" aria-label="Dismiss error">×</button>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#39312a]">Username</span>
                <span className="flex min-h-11 items-center gap-2.5 rounded-xl border border-[#ded4c7] bg-white px-3.5 transition focus-within:border-[#a15d2d] focus-within:ring-2 focus-within:ring-[#a15d2d]/15">
                  <UserRound className="h-4 w-4 shrink-0 text-[#a15d2d]" aria-hidden="true" />
                  <input name="Username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" autoFocus required placeholder="Your username" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9a9188]" />
                </span>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#39312a]">Password</span>
                <span className="flex min-h-11 items-center gap-2.5 rounded-xl border border-[#ded4c7] bg-white px-3.5 transition focus-within:border-[#a15d2d] focus-within:ring-2 focus-within:ring-[#a15d2d]/15">
                  <LockKeyhole className="h-4 w-4 shrink-0 text-[#a15d2d]" aria-hidden="true" />
                  <input name="Password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required placeholder="Your password" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#9a9188]" />
                  <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Hide password" : "Show password"} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[#71675e] hover:bg-[#f8f1df]">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </label>

              <button type="submit" disabled={isLoading} className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#211710] px-5 text-sm font-semibold text-white transition hover:bg-[#3a281b] disabled:cursor-wait disabled:opacity-60">
                {isLoading ? "Signing in…" : "Sign in to CMS"}<ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <p className="mt-6 text-center text-xs text-[#71675e]">Need customer access? <Link href="/account" className="font-semibold text-[#a15d2d] hover:underline">Go to your account</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
}
