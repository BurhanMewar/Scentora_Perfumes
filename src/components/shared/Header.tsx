"use client";

import AdminHeader from "@/components/layout/Header";
import CmsHeader from "@/components/storefront/cms/CmsHeader";
import StorefrontHeader from "@/components/storefront/common/Navbar";

type SharedHeaderProps =
  | {
      variant: "admin";
      onMenuClick: () => void;
      onThemeToggle?: () => void;
      isDarkMode?: boolean;
      sidebarOpen?: boolean;
      onSidebarCollapse?: () => void;
      sidebarCollapsed?: boolean;
    }
  | {
      variant: "cms";
      sidebarOpen: boolean;
      onToggleSidebar: () => void;
      onOpenSidebar: () => void;
    }
  | { variant: "storefront" };

export default function Header(props: SharedHeaderProps) {
  if (props.variant === "admin") {
    const { variant: _variant, ...adminProps } = props;
    return <AdminHeader {...adminProps} />;
  }

  if (props.variant === "cms") {
    const { variant: _variant, ...cmsProps } = props;
    return <CmsHeader {...cmsProps} />;
  }

  return <StorefrontHeader />;
}
