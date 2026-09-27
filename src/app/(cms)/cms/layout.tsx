import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getPermissionsFromCookie } from "@/utils/cookieUtils";
import { COOKIE_NAMES, type PermissionItem } from "@/utils/cookieConstants";

function canViewCms(permissions: PermissionItem[]): boolean {
  return permissions.some((permission) => {
    const path = permission.path?.replace(/\/$/, "").toLowerCase();
    return (path === "/cms" && permission.canView) || canViewCms(permission.children ?? []);
  });
}

export default async function CmsLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get(COOKIE_NAMES.IS_AUTHENTICATED)?.value === "true";
  const hasAccessToken = Boolean(cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value);

  if (!isAuthenticated || !hasAccessToken) {
    redirect("/auth/login?returnTo=%2Fcms");
  }

  const permissions = await getPermissionsFromCookie();
  if (!canViewCms(permissions)) {
    redirect("/auth/login?returnTo=%2Fcms");
  }

  return children;
}

