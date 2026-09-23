"use client";

import {
  cmsNavigation,
  cmsRolePermissions,
  cmsSectionPermissions,
  type CmsRole,
  type CmsSection,
} from "./cms-config";

export default function CmsSidebar({
  open,
  role,
  activeSection,
  onToggle,
  onSelect,
}: {
  open: boolean;
  role: CmsRole;
  activeSection: CmsSection;
  onToggle: () => void;
  onSelect: (section: CmsSection) => void;
}) {
  const permissions = cmsRolePermissions[role];
  const items = cmsNavigation.filter((item) =>
    permissions.includes(cmsSectionPermissions[item.id]),
  );

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onToggle}
          className="fixed inset-0 z-30 bg-black/35 sm:hidden"
        />
      ) : null}
      <aside className={`${open ? "fixed inset-y-0 left-0 z-40 w-72 sm:relative sm:inset-auto sm:z-auto sm:w-64" : "relative w-16"} shrink-0 overflow-y-auto bg-[#20150f] text-white sm:sticky sm:top-0 sm:h-screen`}>
      <div className={open ? "flex items-center justify-between px-5 py-5 sm:block sm:px-6 sm:py-7" : "flex h-16 items-center justify-center border-b border-white/10 px-2"}>
        {open ? (
          <>
            <div className="border-b border-white/15 pb-5">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#f9a826] font-heading text-xl font-bold text-[#20150f]">S</div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ffcc70]">Scentora</p>
              </div>
            </div>
          </>
        ) : (
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#f9a826] font-heading text-xl font-bold text-[#20150f]">S</div>
        )}
      </div>
      <nav className={open ? "space-y-1 px-3 py-4" : "space-y-2 px-2 py-4"}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item.id);
                if (window.innerWidth < 640) onToggle();
              }}
              aria-label={open ? undefined : item.label}
              title={open ? undefined : item.label}
              className={`flex items-center gap-3 rounded-xl py-3 text-left text-sm font-semibold transition ${open ? "w-full px-3" : "w-full justify-center px-0"} ${activeSection === item.id ? "bg-[#f9a826] text-black" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {open ? item.label : null}
            </button>
          );
        })}
      </nav>
      {open ? <CmsSidebarFooter /> : null}
      </aside>
    </>
  );
}

function CmsSidebarFooter() {
  return (
    <div className="hidden border-t border-white/10 px-7 py-6 text-xs text-white/50 lg:block">
      <p>API-ready CMS frontend</p>
      <p className="mt-1">Content publishes through NestJS.</p>
    </div>
  );
}
