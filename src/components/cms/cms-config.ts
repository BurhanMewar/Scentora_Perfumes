import {
  ImagePlus,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Package,
  PanelTop,
  Settings2,
  ShieldCheck,
  Tags,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type CmsSection = "overview" | "homepage" | "products" | "categories" | "collections" | "orders" | "navigation" | "media" | "settings" | "roles" | "permissions";
export type CmsRole = "super_admin" | "admin" | "editor" | "catalog_manager";
export type CmsPermission = "view_overview" | "edit_homepage" | "manage_products" | "manage_categories" | "manage_collections" | "view_order_reporting" | "manage_navigation" | "manage_media" | "edit_settings" | "manage_roles" | "manage_permissions";

export type CmsNavItem = {
  id: CmsSection;
  label: string;
  icon: LucideIcon;
};

export const cmsNavigation: CmsNavItem[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "homepage", label: "Homepage", icon: PanelTop },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "collections", label: "Collections", icon: Tags },
  { id: "orders", label: "Order reporting", icon: ReceiptText },
  { id: "navigation", label: "Menu", icon: Menu },
  { id: "media", label: "Media library", icon: ImagePlus },
  { id: "settings", label: "Site settings", icon: Settings2 },
  { id: "roles", label: "Roles", icon: UsersRound },
  { id: "permissions", label: "Permissions", icon: ShieldCheck },
];

export const cmsRolePermissions: Record<CmsRole, CmsPermission[]> = {
  super_admin: ["view_overview", "edit_homepage", "manage_products", "manage_categories", "manage_collections", "view_order_reporting", "manage_navigation", "manage_media", "edit_settings", "manage_roles", "manage_permissions"],
  admin: ["view_overview", "edit_homepage", "manage_products", "manage_categories", "manage_collections", "view_order_reporting", "manage_navigation", "manage_media", "edit_settings", "manage_roles", "manage_permissions"],
  editor: ["view_overview", "edit_homepage", "manage_media"],
  catalog_manager: ["view_overview", "manage_products", "manage_categories", "manage_collections", "manage_navigation"],
};

export const cmsSectionPermissions: Record<CmsSection, CmsPermission> = {
  overview: "view_overview",
  homepage: "edit_homepage",
  products: "manage_products",
  categories: "manage_categories",
  collections: "manage_collections",
  orders: "view_order_reporting",
  navigation: "manage_navigation",
  media: "manage_media",
  settings: "edit_settings",
  roles: "manage_roles",
  permissions: "manage_permissions",
};

export function cmsTitle(section: CmsSection) {
  return cmsNavigation.find((item) => item.id === section)?.label ?? "Overview";
}

