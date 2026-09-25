"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser, selectUser } from "@/slice/AuthSlice";
import { fetchBotDropdown } from "@/slice/DropdownSlice";
import { RootState } from "@/store";
import { SingleSelectDropdown } from "@/components";
import { useTranslation } from "@/components/Translate/TranslateWrapper";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  isChat?: boolean;
  variant?: "permanent" | "persistent" | "temporary";
  collapsed?: boolean;
  userChatList?: any[];
  handleFetchMessages?: (conversationId: number) => void;
  setActiveChat?: (conversationId: number) => void;
  setInput?: (input: string) => void;
  setSelectedBot?: (value: any) => void;
  selectedBot?: string | number | null;
  direction?: "ltr" | "rtl";
}

const drawerWidth = 280;
const collapsedWidth = 80;

export default function Sidebar({
  open,
  onClose,
  variant = "temporary",
  collapsed = false,
  isChat = false,
  userChatList,
  handleFetchMessages,
  setActiveChat,
  setInput,
  setSelectedBot,
  selectedBot,
  direction = "ltr",
}: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const { t } = useTranslation();
  const botDropdown = useSelector(
    (state: RootState) => state.dropdown.botDropdown
  );
  const [userData, setUserData] = useState<{
    userName?: string;
    fullName?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchBotDropdown());
  }, [dispatch]);

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
    return "U";
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("userName");
      const storedFullName = localStorage.getItem("fullName");
      const storedEmail = localStorage.getItem("email");

      setUserData({
        userName: storedUserName || "User",
        fullName: storedFullName || "",
        email: storedEmail || "",
      });
    }
  }, []);

  const handleLogout = async () => {
    localStorage.clear();
    await dispatch(logoutUser());
    router.push("/");
  };

  const isRTL = direction === "rtl";

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", direction: direction }}>
      {/* Header */}
      <Box
        sx={{
          p: collapsed ? 1 : 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: "background.paper",
          minHeight: collapsed ? 64 : 80,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : isRTL ? "flex-end" : "flex-start",
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

      {/* New Chat Button and Bot Selection */}
      {!collapsed && setActiveChat && setInput && setSelectedBot && (
        <Box
          sx={{
            flexShrink: 0,
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
          }}
        >
          <Button
            fullWidth
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => {
              setActiveChat(0);
              setInput("");
            }}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              py: 1.2,
              backgroundColor: "theme.palette.primary.main",
              color: "primary.contrastText",
              fontWeight: 600,
              fontSize: "0.875rem",
              boxShadow: theme.shadows[2],
              "&:hover": {
                backgroundColor: "theme.palette.primary.mai",
                boxShadow: theme.shadows[4],
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            {t.NewChat}
          </Button>

          <SingleSelectDropdown
            label={t?.SelectBot || "Select Bot"}
            options={botDropdown.map((bot: any) => ({
              label: bot.name,
              value: bot.id,
            }))}
            onChange={(value) => {
              if (setSelectedBot) {
                setSelectedBot(value);
              }
            }}
            value={selectedBot || null}
            required
          />
        </Box>
      )}

      {/* Chat Menu Items */}
      {userChatList && handleFetchMessages && (
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
          {userChatList.length > 0 ? (
            <List>
              {userChatList.map((chat) => (
                <ListItem key={chat.id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleFetchMessages(chat.id);
                      if (isMobile && onClose) {
                        onClose();
                      }
                    }}
                    sx={{
                      [isRTL ? "pr" : "pl"]: collapsed ? 2 : 2,
                      py: 1,
                      minHeight: collapsed ? 48 : 40,
                      justifyContent: collapsed ? "center" : isRTL ? "flex-end" : "flex-start",
                      borderRadius: 1,
                      mx: collapsed ? 1 : 1.5,
                      direction: direction,
                      "&:hover": {
                        backgroundColor: "theme.palette.primary.main",
                      },
                    }}
                  >
                    {!collapsed && (
                      <ListItemText
                        primary={chat.lastmessage || t?.Untitled || "Untitled"}
                        primaryTypographyProps={{
                          fontWeight: 500,
                          fontSize: "0.875rem",
                          color: "text.primary",
                          noWrap: true,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {t?.NoChatsAvailable || "No chats available"}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Footer */}
      {!collapsed && (
        <Box
          sx={{
            flexShrink: 0,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexDirection: isRTL ? "row-reverse" : "row" }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                fontSize: "0.875rem",
              }}
            >
              {getUserInitials()}
            </Avatar>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                lineHeight: 1.2,
                color: "text.primary",
              }}
            >
              {userData?.userName || "User"}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              borderRadius: "20px",
              fontSize: "0.7rem",
              px: 1.2,
              py: 0.25,
              minWidth: "auto",
            }}
          >
            {t?.Logout || "Logout"}
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      anchor={isRTL ? "right" : "left"}
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        direction: direction,
        "& .MuiDrawer-paper": {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "background.paper",
          [isRTL ? "borderLeft" : "borderRight"]: `1px solid ${theme.palette.divider}`,
          overflowX: "hidden",
          direction: direction,
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

