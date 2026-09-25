"use client";

import {
  cmsNavigation,
  cmsRolePermissions,
  cmsSectionPermissions,
  type CmsRole,
  type CmsSection,
} from "./cms-config";

import ScentoraBrand from "@/components/shared/ScentoraBrand";

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
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}
      {open ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onToggle}
          className="fixed inset-0 z-30 bg-black/45 backdrop-blur-[2px] sm:hidden"
        />
      ) : null}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      <aside
        className={`
          relative
          box-border
          shrink-0
          h-screen
          overflow-hidden
          border-r
          border-[#c89561]/20
          text-white

          ${
            open
              ? "fixed inset-y-0 left-0 z-40 w-[270px] min-w-[270px] max-w-[270px] sm:relative sm:inset-auto sm:z-auto"
              : "relative w-[68px] min-w-[68px] max-w-[68px]"
          }

          sm:sticky
          sm:top-0
        `}
        style={{
          background: `
            radial-gradient(
              circle at 15% 5%,
              rgba(218, 151, 76, 0.13),
              transparent 28%
            ),
            radial-gradient(
              circle at 90% 72%,
              rgba(184, 110, 43, 0.08),
              transparent 32%
            ),
            linear-gradient(
              180deg,
              #211711 0%,
              #18110d 52%,
              #110c09 100%
            )
          `,
        }}
      >
        {/* =====================================================
            SUBTLE PERFUME / FRAGRANCE EFFECT
        ====================================================== */}

        {open ? (
          <>
            {/* Main soft fragrance glow */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -left-32
                top-[250px]
                h-[280px]
                w-[430px]
                rotate-[-18deg]
                rounded-[50%]
                bg-[#d99b4b]/[0.035]
                blur-3xl
              "
            />

            {/* Secondary fragrance glow */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-32
                bottom-[100px]
                h-[300px]
                w-[400px]
                rotate-[20deg]
                rounded-[50%]
                bg-[#d99b4b]/[0.035]
                blur-3xl
              "
            />

            {/* Fragrance particles */}
            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                left-[82px]
                top-[275px]
                h-[3px]
                w-[3px]
                rounded-full
                bg-[#e4b978]/25
              "
            />

            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                left-[120px]
                top-[330px]
                h-[2px]
                w-[2px]
                rounded-full
                bg-[#e4b978]/20
              "
            />

            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                left-[65px]
                top-[395px]
                h-[3px]
                w-[3px]
                rounded-full
                bg-[#d9a15b]/20
              "
            />

            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                left-[145px]
                top-[435px]
                h-[2px]
                w-[2px]
                rounded-full
                bg-[#e4b978]/20
              "
            />
          </>
        ) : null}

        {/* =====================================================
            BRAND
        ====================================================== */}

        <div
          className={
            open
              ? "relative px-5 pb-5 pt-6 sm:px-6 sm:pt-7"
              : "relative flex h-[68px] items-center justify-center border-b border-white/[0.07] px-2"
          }
        >
          {open ? (
            <div className="border-b border-[#c89561]/20 pb-5">
              {/* Existing logo - NOT CHANGED */}
              <ScentoraBrand />

              {/* Small luxury divider */}
              <div className="mt-4 flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-[#c89561]/35 to-transparent" />

                <span className="text-[8px] text-[#d8b995]/35">
                  ✦
                </span>

                <span className="h-px flex-1 bg-gradient-to-l from-[#c89561]/35 to-transparent" />
              </div>

              <p className="mt-3 text-[9px] font-medium uppercase tracking-[0.26em] text-[#d8b995]/40">
                Content Studio
              </p>
            </div>
          ) : (
            /* Existing collapsed logo - NOT CHANGED */
            <ScentoraBrand showName={false} />
          )}
        </div>

        {/* =====================================================
            NAVIGATION
        ====================================================== */}

        <nav
          aria-label="CMS navigation"
          className={`
            relative
            z-10
            ${
              open
                ? "px-3 py-5"
                : "space-y-2 px-2 py-4"
            }
          `}
        >
          {open ? (
            <p className="mb-3 px-3 text-[8px] font-semibold uppercase tracking-[0.25em] text-white/30">
              Workspace
            </p>
          ) : null}

          <div className={open ? "space-y-1" : "space-y-2"}>
            {items.map((item) => {
              const Icon = item.icon;
              const active = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect(item.id);

                    if (window.innerWidth < 640) {
                      onToggle();
                    }
                  }}
                  aria-current={active ? "page" : undefined}
                  aria-label={open ? undefined : item.label}
                  title={open ? undefined : item.label}
                  className={`
                    group
                    relative
                    flex
                    h-[44px]
                    items-center
                    gap-3
                    rounded-[9px]
                    text-left
                    text-[12px]
                    font-medium
                    transition-all
                    duration-200

                    ${
                      open
                        ? "w-full px-3"
                        : "w-full justify-center px-0"
                    }

                    ${
                      active
                        ? `
                          bg-gradient-to-r
                          from-[#c89561]/30
                          via-[#c89561]/14
                          to-transparent
                          text-[#f4c779]
                          shadow-[inset_0_0_22px_rgba(201,149,97,0.04)]
                        `
                        : `
                          text-[#eee2d5]/65
                          hover:bg-white/[0.04]
                          hover:text-[#f4d8b2]
                        `
                    }
                  `}
                >
                  {/* Active gold indicator */}
                  {active ? (
                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        bottom-[9px]
                        left-0
                        top-[9px]
                        w-[3px]
                        rounded-r-full
                        bg-gradient-to-b
                        from-[#f3ca7b]
                        via-[#d99b4b]
                        to-[#9c5e29]
                        shadow-[0_0_9px_rgba(230,170,90,0.5)]
                      "
                    />
                  ) : null}

                  {/* Icon container */}
                  <span
                    className={`
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      transition-all
                      duration-200

                      ${
                        active
                          ? "bg-[#f0b45d]/10"
                          : "bg-transparent group-hover:bg-white/[0.035]"
                      }
                    `}
                  >
                    <Icon
                      className={`
                        h-[16px]
                        w-[16px]
                        shrink-0
                        transition-colors
                        duration-200

                        ${
                          active
                            ? "text-[#e7ad5b]"
                            : "text-[#c7ad91]/60 group-hover:text-[#e7ad5b]"
                        }
                      `}
                    />
                  </span>

                  {/* Label */}
                  {open ? (
                    <span className="truncate">
                      {item.label}
                    </span>
                  ) : null}

                  {/* Active arrow */}
                  {open && active ? (
                    <span className="ml-auto text-[13px] text-[#d99b4b]/60">
                      ›
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </nav>

        {/* =====================================================
            BOTTOM FRAGRANCE DESIGN
        ====================================================== */}

        {open ? (
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              right-0
              h-[190px]
              overflow-hidden
            "
          >
            {/* Large elegant scent curve */}
            <div
              className="
                absolute
                bottom-[10px]
                left-[-115px]
                h-[140px]
                w-[370px]
                rotate-[-15deg]
                rounded-[50%]
                border
                border-[#d19a55]/10
              "
            />

            {/* Second scent curve */}
            <div
              className="
                absolute
                bottom-[35px]
                left-[-90px]
                h-[105px]
                w-[320px]
                rotate-[-18deg]
                rounded-[50%]
                border
                border-[#d19a55]/[0.055]
              "
            />

            {/* Soft perfume mist */}
            <div
              className="
                absolute
                bottom-[65px]
                left-[-40px]
                h-[55px]
                w-[300px]
                rotate-[-14deg]
                rounded-full
                bg-[#d9a15b]/[0.045]
                blur-2xl
              "
            />

            {/* Small scent particles */}
            <span
              className="
                absolute
                bottom-[112px]
                left-[70px]
                h-[3px]
                w-[3px]
                rounded-full
                bg-[#e5b66e]/25
              "
            />

            <span
              className="
                absolute
                bottom-[92px]
                left-[115px]
                h-[2px]
                w-[2px]
                rounded-full
                bg-[#e5b66e]/30
              "
            />

            <span
              className="
                absolute
                bottom-[128px]
                left-[145px]
                h-[2px]
                w-[2px]
                rounded-full
                bg-[#e5b66e]/20
              "
            />

            {/* Bottom brand message */}
            <div className="absolute bottom-7 right-5 text-right">
              <p className="text-[8px] font-medium uppercase tracking-[0.3em] text-[#d8b995]/30">
                Scents create
              </p>

              <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.3em] text-[#d8b995]/30">
                memories
              </p>

              <div className="ml-auto mt-2 h-px w-7 bg-[#d99b4b]/30" />
            </div>
          </div>
        ) : null}

        {/* Bottom border */}
        <div
          aria-hidden="true"
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-[#c89561]/20
            to-transparent
          "
        />
      </aside>
    </>
  );
}
