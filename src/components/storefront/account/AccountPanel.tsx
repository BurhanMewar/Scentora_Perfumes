"use client";

import { useEffect, useState, type FormEvent } from "react";
import Loader from "@/components/Loader/loader";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuth, loginUser, logoutUser, restoreAuthSession, type User as AuthUser } from "@/slice/AuthSlice";
import { authService } from "@/services/authService";
import { CountryCodeSelect } from "@/components/Dropdown";
import { countryCodes } from "@/constants/ISDCode";
import { ArrowRight, Check, CircleUserRound, LogOut, ShieldCheck } from "lucide-react";

type AccountMode = "register" | "login";

export default function AccountPanel() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [mode, setMode] = useState<AccountMode>("register");
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(countryCodes[0]?.code ?? "+965");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let active = true;

    async function restoreCustomerSession() {
      try {
        const response = await fetch("/api/auth/get-user", { credentials: "include" });
        if (!response.ok) return;
        const data = await response.json();
        const stored = data?.user;
        if (!active || !data?.success || !stored?.accessToken || !stored?.userId) return;

        const restoredUser: AuthUser = {
          userId: Number(stored.userId),
          username: stored.username ?? stored.userName ?? "",
          email: stored.email ?? stored.emailAddress ?? "",
          phone: stored.phone ?? stored.phoneNumber ?? "",
          isdcode: stored.isdcode ?? stored.countryCode ?? "",
          fullname: stored.fullname ?? stored.fullName ?? "",
          isActive: stored.isActive ?? true,
          recordStatus: Number(stored.recordStatus ?? 1),
          accessToken: stored.accessToken,
          refreshToken: stored.refreshToken ?? "",
          refreshTokenExpiry: stored.refreshTokenExpiry ?? "",
          createdBy: Number(stored.createdBy ?? 0),
          createdDate: stored.createdDate ?? "",
          updatedBy: stored.updatedBy == null ? null : Number(stored.updatedBy),
          updatedDate: stored.updatedDate ?? null,
          balance: Number(stored.balance ?? 0),
          isWallet: Boolean(stored.isWallet),
          useridentifier: stored.useridentifier ?? "",
          roleId: stored.roleId == null && stored.rolesId == null ? null : Number(stored.roleId ?? stored.rolesId),
          roleName: stored.roleName ?? null,
          walletBalance: Number(stored.walletBalance ?? 0),
          currencyCode: stored.currencyCode ?? "KWD",
          permissions: Array.isArray(stored.permissions) ? stored.permissions : [],
        };
        dispatch(restoreAuthSession(restoredUser));
      } catch {
        // A missing or expired customer session should show the account form.
      } finally {
        if (active) setCheckingSession(false);
      }
    }

    void restoreCustomerSession();
    return () => { active = false; };
  }, [dispatch]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);
    let accountCreated = false;

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        await authService.register({
          userName: email.trim(),
          emailAddress: email.trim(),
          phoneNumber: phone.trim(),
          countryCode,
          fullName: `${firstName.trim()} ${lastName.trim()}`.trim(),
          password,
          confirmPassword,
        });

        accountCreated = true;
        setNotice("Your account was created. Signing you in...");
        await dispatch(loginUser({ Username: email.trim(), Password: password })).unwrap();
      } else {
        await dispatch(loginUser({ Username: email.trim(), Password: password })).unwrap();
      }
    } catch (submitError) {
      if (accountCreated) {
        setNotice("Your account was created. Sign in with your email and password to continue.");
        setMode("login");
      } else {
        setError(getErrorMessage(submitError));
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await dispatch(logoutUser());
    dispatch(clearAuth());
    setMode("login");
    setNotice("You have signed out.");
  }

  if (checkingSession) {
    return <main className="mx-auto min-h-[55vh] w-full max-w-3xl px-4 py-12"><Loader fullscreen={false} text="Loading your account..." /></main>;
  }

  if (isAuthenticated && user) {
    const nameParts = (user.fullname || "").trim().split(/\s+/).filter(Boolean);
    const fullPhone = [user.isdcode, user.phone].filter(Boolean).join(" ");
    return (
      <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-9">
        <section className="overflow-hidden rounded-2xl border border-black/10 bg-white/80 shadow-card">
          <div className="bg-[#211710] px-4 py-4 text-[#fffaf0] sm:px-6 sm:py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-textPrimary"><CircleUserRound className="h-5 w-5" /></span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffcc70]">Scentora account</p>
                  <h1 className="mt-0.5 break-words font-heading text-xl font-semibold sm:text-2xl">Welcome, {nameParts[0] || user.username}</h1>
                </div>
              </div>
              <button type="button" onClick={handleLogout} className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-white/25 px-3 text-xs font-semibold transition hover:bg-white/10"><LogOut className="h-3.5 w-3.5" /> Sign out</button>
            </div>
          </div>
          <div className="grid gap-2.5 p-3 sm:grid-cols-2 sm:p-5">
            <AccountDetail label="First name" value={nameParts[0] ?? "—"} />
            <AccountDetail label="Last name" value={nameParts.slice(1).join(" ") || "—"} />
            <AccountDetail label="Email address" value={user.email || "—"} />
            <AccountDetail label="Phone number" value={fullPhone || "—"} />
            <div className="flex items-start gap-2 rounded-xl bg-[#f6f0e5] p-3 text-xs leading-5 text-textSecondary sm:col-span-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> Your profile details are linked to your signed-in account.</div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6 sm:py-9">
      <section className="rounded-2xl border border-black/10 bg-white/85 p-4 shadow-card sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Your Scentora account</p>
          <h1 className="mt-2 font-heading text-2xl font-semibold sm:text-3xl">{mode === "register" ? "Create your account" : "Welcome back"}</h1>
          <p className="mt-2 text-sm leading-6 text-textSecondary">{mode === "register" ? "Save your details for a smoother fragrance shopping experience." : "Sign in to view your saved account details."}</p>
        </div>

        {notice ? <p role="status" className="mb-4 flex items-start gap-2 rounded-xl border border-accent/20 bg-accent/10 p-3 text-sm text-textPrimary"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{notice}</p> : null}
        {error ? <p role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}

        <form onSubmit={handleSubmit} className="grid gap-2.5 sm:grid-cols-2">
          {mode === "register" ? <>
            <Field label="First name" autoComplete="given-name" value={firstName} onChange={setFirstName} required />
            <Field label="Last name" autoComplete="family-name" value={lastName} onChange={setLastName} required />
          </> : null}
          <Field label="Email address" type="email" autoComplete="email" value={email} onChange={setEmail} required className="sm:col-span-2" />
          {mode === "register" ? <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold" htmlFor="account-phone">Phone number</label>
            <div className="grid grid-cols-[minmax(104px,0.7fr)_minmax(0,1.6fr)] gap-2">
              <CountryCodeSelect
                value={countryCode}
                onChange={setCountryCode}
                options={countryCodes}
                getOptionLabel={(option) => option.code}
                renderOptionContent={(option) => <span>{option.country} ({option.code})</span>}
                placeholder="ISD code"
                size="small"
              />
              <input id="account-phone" type="tel" autoComplete="tel-national" value={phone} onChange={(event) => setPhone(event.target.value)} required className="min-h-9 min-w-0 rounded-xl border border-black/15 bg-pageBg px-3 text-sm outline-none transition placeholder:text-textSecondary focus:border-accent focus:ring-2 focus:ring-accent/20 sm:px-4" placeholder="Phone number" />
            </div>
          </div> : null}
          <Field label="Password" type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={setPassword} required minLength={8} className={mode === "register" ? "" : "sm:col-span-2"} />
          {mode === "register" ? <Field label="Confirm password" type="password" autoComplete="new-password" value={confirmPassword} onChange={setConfirmPassword} required minLength={8} /> : null}
          <button type="submit" disabled={submitting} className="mt-1 inline-flex min-h-9 items-center justify-center gap-2 rounded-full bg-textPrimary px-5 text-sm font-semibold text-white transition hover:bg-textPrimary/85 disabled:cursor-wait disabled:opacity-60 sm:col-span-2">
            {submitting ? "Please wait..." : mode === "register" ? "Create account" : "Sign in"}<ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-textSecondary">
          {mode === "register" ? "Already have an account?" : "New to Scentora?"}{" "}
          <button type="button" onClick={() => { setError(""); setNotice(""); setMode(mode === "register" ? "login" : "register"); }} className="font-semibold text-accent underline-offset-4 hover:underline">
            {mode === "register" ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}

function Field({
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  required = false,
  minLength,
  className = "",
}: {
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  minLength?: number;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      <input type={type} autoComplete={autoComplete} value={value} onChange={(event) => onChange(event.target.value)} required={required} minLength={minLength} className="min-h-9 w-full rounded-xl border border-black/15 bg-pageBg px-3 text-sm outline-none transition placeholder:text-textSecondary focus:border-accent focus:ring-2 focus:ring-accent/20 sm:px-4" />
    </label>
  );
}

function AccountDetail({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-xl border border-black/10 bg-pageBg px-3 py-2.5"><p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-textSecondary">{label}</p><p className="mt-0.5 break-words text-sm font-semibold text-textPrimary">{value}</p></div>;
}

function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "We could not complete that request. Please check your details and try again.";
}

