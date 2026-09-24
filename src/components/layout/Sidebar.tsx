"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Collapse,
  Tooltip,
  Divider,
  Skeleton,
} from "@mui/material";
import * as MuiIcons from "@mui/icons-material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon,
  ShoppingCart as OrdersIcon,
  Inventory as InventoryIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Home as HomeIcon,
  Photo as BannersIcon,
  SimCard as EsimsIcon,
  Security as SecurityIcon,
  Menu as MenuIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { selectPermissions, getPermissionsFromState } from "@/slice/AuthSlice";
interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  isChat?: boolean;
  variant?: "permanent" | "persistent" | "temporary";
  collapsed?: boolean;
}

export interface MenuItem {
  text: string;
  icon: keyof typeof MuiIcons;
  path?: string;
  children?: MenuItem[];
}

// Permission interface for API response
interface PermissionItem {
  permissionId: number;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  permissionTaskId: number;
  permissionTaskName: string;
  path: string | null;
  parentId: number;
  displayOrder: number;
  icon: string;
  children: PermissionItem[];
}

// Icon mapping from permission icon names to Material UI icon keys
const iconMapping: Record<string, string> = {
  Inventory: "Inventory",
  SimCard: "SimCard",
  ShoppingCart: "ShoppingCart",
  ViewList: "ViewList",
  Update: "Update",
  ManageAccounts: "ManageAccounts",
  Security: "Security",
  Person: "Person",
  Tune: "Tune",
  Menu: "Menu",
  AdminPanelSettings: "AdminPanelSettings",
  Business: "Business",
  Dashboard: "Dashboard",
  Group: "Group",
  Wallpaper: "Wallpaper",
  Store: "Store",
  Inventory2: "Inventory2",
  Key: "Key",
  AttachMoney: "AttachMoney",
  MonetizationOn: "MonetizationOn",
  ReceiptLong: "ReceiptLong",
  ShowChart: "ShowChart",
  Notifications: "Notifications",
  Assessment: "Assessment",
  Settings: "Settings",
  Android: "Android",
  Description: "Description",
  Storage: "Storage",
  TableChart: "TableChart",
  ViewColumn: "ViewColumn",
  Folder: "Folder",
  PersonAdd: "PersonAdd",
  TextFields: "TextFields",
  Star: "Star",
  Dataset: "Dataset",
};

// Function to convert permissions to sidebar menu items
const convertPermissionsToSidebarItems = (
  permissions: PermissionItem[]
): MenuItem[] => {
  // Add Dashboard as the first item
  const menuItems: MenuItem[] = [];

  // Filter permissions to only show items with canView = true
  const viewablePermissions = permissions.filter(
    (p) => p.canView || p.children.some((c) => c.canView)
  );

  // Sort permissions by displayOrder
  viewablePermissions.sort((a, b) => a.displayOrder - b.displayOrder);

  // Convert permissions to menu items
  viewablePermissions.forEach((permission) => {
    const menuItem: MenuItem = {
      text: permission.permissionTaskName,
      icon: (iconMapping[permission.icon] ||
        "Inventory") as keyof typeof import("@mui/icons-material"),
      path: permission.path || undefined,
    };

    // If permission has children, convert them too
    if (permission.children && permission.children.length > 0) {
      const viewableChildren = permission.children
        .filter((child) => child.canView)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((child) => ({
          text: child.permissionTaskName,
          icon: (iconMapping[child.icon] ||
            "Inventory") as keyof typeof import("@mui/icons-material"),
          path: child.path || undefined,
        }));

      if (viewableChildren.length > 0) {
        menuItem.children = viewableChildren;
      }
    }

    menuItems.push(menuItem);
  });

  return menuItems;
};

const drawerWidth = 280;
const collapsedWidth = 80;

export default function Sidebar({
  open,
  onClose,
  variant = "temporary",
  collapsed = false,
  isChat = false,
}: SidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [sidebarItems, setSidebarItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const reduxPermissions = useSelector(selectPermissions);

  useEffect(() => {
    if (reduxPermissions.length > 0) {
      // Use permissions from Redux state
      const items = convertPermissionsToSidebarItems(reduxPermissions);
      setSidebarItems(items);
      setIsLoading(false);
      setHasInitialLoad(true);
    } else if (hasInitialLoad) {
      // If we had items before but now permissions are empty, keep the previous items
      // This prevents clearing items when permissions are being refreshed
      setIsLoading(false);
    }
  }, [reduxPermissions, hasInitialLoad]);

  // Fallback: Fetch from API only if Redux permissions are empty
  useEffect(() => {
    // Only fetch from API if no permissions in Redux and we haven't loaded initial data
    if (reduxPermissions.length === 0 && !hasInitialLoad) {
      const fetchSidebarItems = async () => {
        try {
          // Don't set loading to true if we already have items to prevent blinking
          if (sidebarItems.length === 0) {
            setIsLoading(true);
          }

          const response = await fetch("/api/auth/get-permissions", {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.error("Failed to fetch permissions:", response.statusText);
            // Only clear items if we don't have any previous items
            if (sidebarItems.length === 0) {
              setSidebarItems([]);
            }
            return;
          }

          const data = await response.json();

          if (data.success && data.permissions) {
            const items = convertPermissionsToSidebarItems(data.permissions);
            setSidebarItems(items);
          } else {
            // Only clear items if we don't have any previous items
            if (sidebarItems.length === 0) {
              setSidebarItems([]);
            }
          }
        } catch (error) {
          console.error("Error fetching permissions:", error);
          // Only clear items if we don't have any previous items
          if (sidebarItems.length === 0) {
            setSidebarItems([]);
          }
        } finally {
          setIsLoading(false);
          setHasInitialLoad(true);
        }
      };

      fetchSidebarItems();
    }
  }, [reduxPermissions.length, hasInitialLoad, sidebarItems.length]);

  useEffect(() => {
    if (!sidebarItems || sidebarItems.length === 0) return;
    // Find parents that have a child matching the current pathname.
    // Use startsWith to handle routes with params (e.g. /products/123)
    const matchingParents = sidebarItems.filter(
      (item) =>
        item.children &&
        item.children.some(
          (child) =>
            child.path &&
            (pathname === child.path || pathname.startsWith(child.path))
        )
    );

    if (matchingParents.length > 0) {
      setExpandedItems((prev) => {
        const newSet = new Set(prev);
        matchingParents.forEach((p) => newSet.add(p.text));
        return newSet;
      });
    }
  }, [pathname, sidebarItems]);

  // Render skeleton menu item for loading state
  const renderSkeletonMenuItem = (index: number) => {
    return (
      <ListItem disablePadding key={`skeleton-${index}`}>
        <ListItemButton disabled>
          <ListItemIcon>
            <Skeleton
              variant="circular"
              width={24}
              height={24}
              sx={{
                backgroundColor: "grey.300",
                "&::after": {
                  background:
                    "linear-gradient(90deg, transparent, grey.400, transparent)",
                },
              }}
            />
          </ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary={
                <Skeleton
                  variant="text"
                  width="80%"
                  sx={{
                    backgroundColor: "grey.300",
                    "&::after": {
                      background:
                        "linear-gradient(90deg, transparent, grey.400, transparent)",
                    },
                  }}
                />
              }
              sx={{ ml: 1 }}
            />
          )}
        </ListItemButton>
      </ListItem>
    );
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      setExpandedItems((prev) => {
        if (prev.has(item.text)) {
          return new Set();
        }
        return new Set([item.text]);
      });
    } else if (item.path) {
      const currenPath = window.location.pathname;
      if (item.path === currenPath) {
        window.location.reload();
      } else {
        router.push(item.path);
      }
      if (isMobile) {
        if (onClose) {
          onClose();
        }
      }
    }
  };

  const CurrentYear = new Date().getFullYear();
  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.text);
    const isActive = item.path ? pathname === item.path : false;
    if (item.text === "Cache") {
      return;
    }
    // Check if any child item is active (for parent items)
    const hasActiveChild =
      hasChildren &&
      item.children!.some((child) => child.path && pathname === child.path);
    const Icon = MuiIcons[item.icon];
    return (
      <Box key={item.text}>
        <ListItem disablePadding>
          <Tooltip
            title={collapsed ? item.text : ""}
            placement="right"
            disableHoverListener={!collapsed}
          >
            <ListItemButton
              onClick={() => handleItemClick(item)}
              selected={isActive || hasActiveChild}
              sx={{
                pl: collapsed ? 2 : 2 + level * 2,
                py: 1,
                minHeight: collapsed ? 48 : 40,
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 1,
                mx: collapsed ? 1 : 1.5,
                bgcolor: level > 0 ? "action.selected" : "transparent",
                "&:hover": {
                  backgroundColor: "#2663eb33",
                },
                "&.Mui-selected": {
                  backgroundColor: "#2663eb26",
                  "&:hover": {
                    backgroundColor: "action.active",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed ? 0 : 40,
                  color:
                    isActive || hasActiveChild
                      ? "primary.main"
                      : "text.secondary",
                }}
              >
                {Icon && <Icon style={{ marginRight: 8 }} />}
              </ListItemIcon>
              {!collapsed && (
                <>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive || hasActiveChild ? 600 : 500,
                      fontSize: "0.875rem",
                      color:
                        isActive || hasActiveChild
                          ? "primary.main"
                          : "text.primary",
                    }}
                  />
                  {hasChildren &&
                    (isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
                </>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Render children if expanded and not collapsed */}
        {hasChildren && !collapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box
        sx={{
          p: collapsed ? 1 : 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: "background.paper",
          minHeight: collapsed ? 64 : 80,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        {collapsed ? (
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="/Logo/empowerkwt.png"
              alt="Tellgo Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </Box>
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: "100%",
                height: 61,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img
                src="/Logo/Empowertechnology.png"
                alt="Tellgo Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Navigation Menu */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          py: 1,

          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {sidebarItems.length > 0 ? (
          <List>{sidebarItems.map((item) => renderMenuItem(item))}</List>
        ) : isLoading ? (
          <List>
            {Array.from({ length: 6 }).map((_, index) =>
              renderSkeletonMenuItem(index)
            )}
          </List>
        ) : (
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              No menu items available
            </Typography>
          </Box>
        )}
      </Box>

      {/* Footer */}
      {/* {!collapsed && (
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: "background.default",
          }}
        >
          <Typography variant="caption" color="text.secondary" align="center">
            © {CurrentYear} Empower Technology
          </Typography>
        </Box>
      )} */}
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "background.paper",
          borderRight: `1px solid ${theme.palette.divider}`,
          overflowX: "hidden",
          transition: theme.transitions.create(["width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
