"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, KeyRound, LogOut, Menu, UserRound } from "lucide-react";
import { logoutUser, clearAuth } from "@/slice/AuthSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function CmsHeader({
  sidebarOpen,
  onToggleSidebar,
  onOpenSidebar,
}: {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSidebar: () => void;
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const userName = user?.fullname || user?.username || "Scentora Admin";
  const userEmail = user?.email || "";
  const userInitial = userName.trim().charAt(0).toUpperCase();

  async function handleLogout() {
    setProfileOpen(false);
    try {
      await dispatch(logoutUser()).unwrap();
    } catch {
      // Clear the local session and leave CMS even if the cookie endpoint fails.
    } finally {
      dispatch(clearAuth());
      router.replace("/auth/login");
      router.refresh();
    }
  }

  return (
    <header className="relative flex min-h-16 items-center justify-between border-b border-black/10 bg-[#fef8e8] px-3 sm:px-2 lg:px-4">
      <div className="flex items-center">
        <button
          type="button"
          onClick={sidebarOpen ? onToggleSidebar : onOpenSidebar}
          aria-label={sidebarOpen ? "Collapse CMS sidebar" : "Open CMS sidebar"}
          className="grid h-8 w-8 place-items-center rounded-full text-textPrimary transition-colors hover:bg-black/5 hover:text-textPrimary"
        >
          {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      <div className="flex items-center gap-2 pr-0 sm:gap-3 sm:pr-2">
        <Link href="/" className="rounded-full border border-black/15 bg-white px-2.5 py-2 text-[11px] font-semibold text-textPrimary hover:bg-black/5 sm:px-3 sm:text-xs">
          <span className="sm:hidden">Storefront</span><span className="hidden sm:inline">View storefront</span>
        </Link>
        <button
          type="button"
          aria-label="Open account menu"
          aria-expanded={profileOpen}
          onClick={() => setProfileOpen((open) => !open)}
          className="grid h-8 w-8 place-items-center rounded-full border border-[#a15d2d]/20 bg-[#f9a826] font-heading text-base font-bold leading-none text-[#20150f] shadow-sm transition-colors hover:bg-[#e99a18]"
        >
          {userInitial}
        </button>
        {profileOpen ? (
          <div className="absolute right-3 top-14 z-50 w-[calc(100vw-1.5rem)] max-w-60 overflow-hidden rounded-xl border border-[#a15d2d]/20 bg-[#fffaf0] text-[13px] shadow-[0_14px_34px_rgba(33,23,16,0.18)] sm:right-0 sm:top-11">
            <div className="border-b border-[#ffcc70]/20 bg-[#211710] px-3.5 py-2.5">
              <p className="font-semibold text-[#fffaf0]">{userName}</p>
              <p className="mt-0.5 truncate text-[11px] text-[#ffcc70]/75">{userEmail}</p>
            </div>
            <div className="space-y-0.5 p-1.5">
              <button type="button" onClick={() => setProfileOpen(false)} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[#39291e] transition-colors hover:bg-[#fc8c3d]/12 hover:text-[#8c4d24]">
                <KeyRound className="h-3.5 w-3.5 text-[#a15d2d]" />
                Change password
              </button>
              <div className="mx-2 border-t border-[#a15d2d]/15" />
              <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[#8c4d24] transition-colors hover:bg-[#fc8c3d]/12 hover:text-[#211710]">
                <LogOut className="h-3.5 w-3.5 text-[#a15d2d]" />
                Logout
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
