"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  alpha,
  useTheme,
  useMediaQuery,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  SuccessNotification,
  ErrorNotification,
} from "@/components/notifications";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ChevronLeft as ChevronLeftIcon,
  Help as HelpIcon,
  AccountBalanceWallet as WalletIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  DeleteOutline as DeleteIcon,
  Key as KeyIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import {
  selectBalance,
  logoutUser,
  selectIsWallet,
  selectUser,
} from "@/slice/AuthSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import DynamicButton from "../DynamicButton";
import { ChangePasswordModal } from "../ChangePassword";
import { usePermissions } from "@/constants/functions";
// Styled search component matching the image design

interface HeaderProps {
  onMenuClick: () => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  sidebarOpen?: boolean;
  onSidebarCollapse?: () => void;
  sidebarCollapsed?: boolean;
}

export default function Header({
  onMenuClick,
  onThemeToggle,
  isDarkMode = false,
  sidebarOpen = false,
  onSidebarCollapse,
  sidebarCollapsed = false,
}: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useAppDispatch();
  const { hasPermission, loading } = usePermissions();
  const router = useRouter();
  const [userData, setUserData] = useState<{
    userName?: string;
    fullName?: string;
    email?: string;
  } | null>(null);

  const [successNotification, setSuccessNotification] = useState({
    open: false,
    title: "",
    message: "",
  });
  const [errorNotification, setErrorNotification] = useState({
    open: false,
    title: "",
    message: "",
  });
  // State for user menu and logout confirmation
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const user = useSelector(selectUser);
  const isWallet = useSelector(selectIsWallet);
  const walletBalance = useSelector(selectBalance);
  // Get user initials for avatar
  const getUserInitials = () => {
    if (userData?.fullName) {
      return userData.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    if (userData?.userName) {
      return userData.userName.substring(0, 2).toUpperCase();
    }
    return "A";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("userName");
      const storedFullName = localStorage.getItem("fullName");
      const storedEmail = localStorage.getItem("email");

      setUserData({
        userName: storedUserName || "User",
        fullName: storedFullName || "",
        email: storedEmail || "user@example.com",
      });
    }
  }, []);

  // Handle user menu
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseErrorNotification = () => {
    setErrorNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };
  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };
  const handleChangePassword = () => {
    setChangePasswordModal(true);
  };
  // const handleClearCacheCLick = async () => {
  //   try {
  //     const responce = await dispatch(clearCache());

  //     if (responce.meta.requestStatus === "fulfilled") {
  //       setSuccessNotification({
  //         open: true,
  //         title: "Cache Cleared",
  //         message: ``,
  //       });
  //       setAnchorEl(null);
  //     } else {
  //       setErrorNotification({
  //         open: true,
  //         title: "Failed! Please try again.",
  //         message: "",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //   }
  // };
  // Handle logout
  const handleLogoutClick = () => {
    handleUserMenuClose();
    setLogoutDialogOpen(true);
  };
  const handleCloseSuccessNotification = () => {
    setSuccessNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };
  const handleLogoutConfirm = async () => {
    setLogoutDialogOpen(false);

    localStorage.clear();
    await dispatch(logoutUser());
    router.push("/");
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };
  const handleCreateSuccess = (message: string) => {
    setSuccessNotification({
      open: true,
      title: "Success!",
      message: message,
    });
  };

  // Fetch live wallet

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "background.paper",
          color: "text.primary",
          borderBottom: `1px solid ${theme.palette.divider}`,
          width: {
            xs: "100%",
            md: `calc(100% - ${
              sidebarOpen ? (sidebarCollapsed ? 80 : 280) : 0
            }px)`,
          },
          left: { xs: 0, md: sidebarOpen ? (sidebarCollapsed ? 80 : 280) : 0 },
          transition: theme.transitions.create(["width", "left"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 2, md: 3 } }}>
          {/* Mobile menu button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{
              mr: 2,
              display: { md: "none" },
              color: "primary.main",
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop sidebar collapse button */}
          {!isMobile && sidebarOpen && onSidebarCollapse && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="collapse sidebar"
              onClick={onSidebarCollapse}
              sx={{
                mr: 2,
                color: "primary.main",
              }}
            >
              {sidebarCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
            </IconButton>
          )}

          {/* Search Bar - Always visible like in the image */}
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Ctrl K Search anything..."
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Right side actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Wallet Display - Show when user has wallet */}

            {/* Theme toggle */}
            {onThemeToggle && (
              <IconButton
                color="inherit"
                onClick={onThemeToggle}
                sx={{
                  color: "text.secondary",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    color: "primary.main",
                  },
                }}
              >
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            )}

            {/* User Profile */}
            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.875rem",
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                {getUserInitials()}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: theme.shadows[8],
            borderRadius: 2,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* User Info */}
        {userData && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {userData.fullName || userData.userName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData.email}
            </Typography>
          </Box>
        )}

        {/* Menu Items */}
        {/* {hasPermission("Cache", "view") && (
           <MenuItem onClick={handleClearCacheCLick}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Clear Cache</ListItemText>
        </MenuItem>
        )} */}

        <MenuItem onClick={handleChangePassword}>
          <ListItemIcon>
            <KeyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Password</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogoutClick} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      <SuccessNotification
        open={successNotification.open}
        onClose={handleCloseSuccessNotification}
        title={successNotification.title}
        message={successNotification.message}
        duration={5000}
        action={{
          label: "View Users",

          onClick: () => {
            console.log("Navigate to all products");
          },
        }}
      />
      <ErrorNotification
        open={errorNotification.open}
        onClose={handleCloseErrorNotification}
        title={errorNotification.title}
        message={errorNotification.message}
        duration={6000}
      />
      <ChangePasswordModal
        open={changePasswordModal}
        onClose={() => setChangePasswordModal(false)}
        onSuccess={handleCreateSuccess}
        user={user as any}
      />
      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Confirm Logout</DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Typography variant="body1">
            Are you sure you want to logout?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <DynamicButton
            onClick={handleLogoutCancel}
            variant="outlined"
            sx={{ minWidth: 80 }}
          >
            Cancel
          </DynamicButton>
          <DynamicButton
            onClick={handleLogoutConfirm}
            variant="error"
            sx={{ minWidth: 80 }}
          >
            Logout
          </DynamicButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
