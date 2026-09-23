"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, KeyRound, LogOut, Menu, RefreshCw } from "lucide-react";

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
  const userName = "Scentora Admin";
  const userInitial = userName.trim().charAt(0).toUpperCase();

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
          className="grid h-8 w-8 place-items-center rounded-full bg-[#f9a826] text-sm font-semibold text-[#20150f] hover:bg-[#e99a18]"
        >
          {userInitial}
        </button>
        {profileOpen ? (
          <div className="absolute right-3 top-14 z-50 w-[calc(100vw-1.5rem)] max-w-64 overflow-hidden rounded-xl border border-black/10 bg-white text-sm shadow-xl sm:right-0 sm:top-11">
            <div className="border-b border-black/10 px-4 py-3">
              <p className="font-semibold text-textPrimary">{userName}</p>
              <p className="mt-1 truncate text-xs text-textSecondary">admin@scentora.com</p>
            </div>
            <div className="p-1.5">
              <button type="button" onClick={() => setProfileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-textPrimary hover:bg-black/5">
                <RefreshCw className="h-4 w-4 text-textSecondary" />
                Clear cache
              </button>
              <button type="button" onClick={() => setProfileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-textPrimary hover:bg-black/5">
                <KeyRound className="h-4 w-4 text-textSecondary" />
                Change password
              </button>
              <div className="my-1 border-t border-black/10" />
              <button type="button" onClick={() => setProfileOpen(false)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
