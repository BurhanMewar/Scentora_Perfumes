"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  alpha,
  useTheme,
  useMediaQuery,
  Popover,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Help as HelpIcon,
  AccountBalanceWallet as WalletIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  DeleteOutline as DeleteIcon,
  Key as KeyIcon,
  Language as LanguageIcon,
  Audiotrack as AudiotrackIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "@/components/Translate/TranslateWrapper";
// Styled search component matching the image design

interface HeaderProps {
  onMenuClick: () => void;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  sidebarOpen?: boolean;
  onSidebarCollapse?: () => void;
  handleToggleListening: () => void;
  sidebarCollapsed?: boolean;
  selectedBot: any;
  languageLabel?: string;
  language?: number;
  onLanguageSelect?: (lang: number, text: string, label: "EN" | "AR") => void;
  direction?: "ltr" | "rtl";
}

export default function Header({
  onMenuClick,
  onThemeToggle,
  isDarkMode = false,
  sidebarOpen = false,
  selectedBot,
  onSidebarCollapse,
  sidebarCollapsed = false,
  languageLabel = "EN",
  language = 1,
  onLanguageSelect,
  handleToggleListening,
  direction = "ltr",
}: HeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { t } = useTranslation();
  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const isRTL = direction === "rtl";

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageSelect = (lang: number, text: string, label: "EN" | "AR") => {
    if (onLanguageSelect) {
      onLanguageSelect(lang, text, label);
    }
    handleLanguageClose();
  };

  const languageMenuOpen = Boolean(languageAnchorEl);

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
          [isRTL ? "right" : "left"]: { 
            xs: 0, 
            md: sidebarOpen ? (sidebarCollapsed ? 80 : 280) : 0 
          },
          [isRTL ? "left" : "right"]: "auto",
          direction: direction,
          transition: theme.transitions.create(["width", "left", "right"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: 64, px: { xs: 2, md: 3 } }}>
          {/* Mobile menu button */}
          <IconButton
            edge={isRTL ? "end" : "start"}
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{
              [isRTL ? "ml" : "mr"]: 2,
              display: { md: "none" },
              color: "primary.main",
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Desktop sidebar collapse button */}
          {!isMobile && sidebarOpen && onSidebarCollapse && (
            <IconButton
              edge={isRTL ? "end" : "start"}
              color="inherit"
              aria-label="collapse sidebar"
              onClick={onSidebarCollapse}
              sx={{
                [isRTL ? "ml" : "mr"]: 2,
                color: "primary.main",
              }}
            >
              {sidebarCollapsed ? (
                <MenuIcon />
              ) : isRTL ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
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
             {selectedBot > 0 && (
          <Button
            sx={{
              color: "#2a2a2a",
              mr: 0.5,
              textTransform: "none",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              "& .MuiButton-endIcon": {
                ml: 0.8, // ✅ Adds a small gap between text and icon
                mr: 0.8,
              },
            }}
            onClick={handleToggleListening}
            startIcon={<AudiotrackIcon />}
          >
            Audio
          </Button>
        )}


            {/* Language Selection */}
            <IconButton
              color="inherit"
              onClick={handleLanguageClick}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  color: "primary.main",
                },
              }}
            >
              <LanguageIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Language Selection Menu */}
      <Popover
        open={languageMenuOpen}
        anchorEl={languageAnchorEl}
        onClose={handleLanguageClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: isRTL ? "left" : "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: isRTL ? "left" : "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 140,
            boxShadow: theme.shadows[8],
            borderRadius: 2,
            p: 1,
          },
        }}
      >
        <Box>
          <Typography
            onClick={() => handleLanguageSelect(1, "en-US", "EN")}
            sx={{
              p: 1.5,
              borderRadius: 1,
              mb: 0.5,
              cursor: "pointer",
              fontSize: "0.875rem",
              textAlign: "center",
              bgcolor: language === 1 ? alpha(theme.palette.primary.main, 0.1) : "transparent",
              color: language === 1 ? "primary.main" : "text.primary",
              fontWeight: language === 1 ? 600 : 400,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
              transition: "all 0.2s ease",
            }}
          >
            {t?.English || "English"}
          </Typography>
          <Typography
            onClick={() => handleLanguageSelect(2, "ar-KW", "AR")}
            sx={{
              p: 1.5,
              borderRadius: 1,
              cursor: "pointer",
              fontSize: "0.875rem",
              textAlign: "center",
              bgcolor: language === 2 ? alpha(theme.palette.primary.main, 0.1) : "transparent",
              color: language === 2 ? "primary.main" : "text.primary",
              fontWeight: language === 2 ? 600 : 400,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.08),
              },
              transition: "all 0.2s ease",
            }}
          >
            {t?.Arabic || "Arabic"}
          </Typography>
        </Box>
      </Popover>
    </>
  );
}
