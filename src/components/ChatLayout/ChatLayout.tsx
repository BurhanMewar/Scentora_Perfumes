'use client';

import {
  Box,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Toolbar,
  IconButton,
  TextField,
} from '@mui/material';
import { ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import Header from './ChatHeader';
import Sidebar from './ChatSidebar';
import { useTranslation } from '@/components/Translate/TranslateWrapper';

interface AppLayoutProps {
  children: React.ReactNode;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
  // Sidebar props
  userChatList?: any[];
  handleFetchMessages?: (conversationId: number) => void;
  setActiveChat?: (conversationId: number) => void;
  
  handleToggleListening: () => void;
  setInput?: (input: string) => void;
  setSelectedBot?: (value: any) => void;
  selectedBot?: string | number | null;
  // Input props
  input?: string;
  handleSend?: () => void;
  resetTranscript?: () => void;
  isloading?: boolean;
  chatMessages?: any[];
  activechat?: number;
}

const drawerWidth = 280;

export default function AppLayout({ 
  children, 
  onThemeToggle, 
  isDarkMode = false,
  userChatList,
  handleFetchMessages,
  setActiveChat,
  setInput,
  setSelectedBot,
  selectedBot,
  handleToggleListening,
  input = "",
  handleSend,
  resetTranscript,
  isloading = false,
  chatMessages = [],
  activechat = 0
}: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState<number>(1);
  const [languageLabel, setLanguageLabel] = useState<'EN' | 'AR'>('EN');
  const [languageText, setLanguageText] = useState('en-US');
  const { changeLanguage, t } = useTranslation();

  // Initialize language from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedLanguage = localStorage.getItem('language');
      const storedLanguageLabel = localStorage.getItem('languageLabel');
      const storedLanguageText = localStorage.getItem('languageText');
      
      if (storedLanguage && storedLanguageLabel && storedLanguageText) {
        setLanguage(Number(storedLanguage));
        setLanguageLabel(storedLanguageLabel as 'EN' | 'AR');
        setLanguageText(storedLanguageText);
        changeLanguage(storedLanguageLabel as 'EN' | 'AR');
      }
    }
  }, [changeLanguage]);

  const handleLanguageSelect = (lang: number, text: string, label: 'EN' | 'AR') => {
    setLanguage(lang);
    setLanguageLabel(label);
    setLanguageText(text);
    changeLanguage(label);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang.toString());
      localStorage.setItem('languageLabel', label);
      localStorage.setItem('languageText', text);
    }
  };

  const direction = languageLabel === 'AR' ? 'rtl' : 'ltr';

  // Handle responsive behavior
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const currentDrawerWidth = sidebarCollapsed ? 80 : drawerWidth;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        direction: direction,
      }}
    >
      <CssBaseline />
      
      {/* Header */}
      <Header 
        onMenuClick={handleSidebarToggle}
        onThemeToggle={onThemeToggle}
        isDarkMode={isDarkMode}
        sidebarOpen={sidebarOpen}
        onSidebarCollapse={handleSidebarCollapse}
        sidebarCollapsed={sidebarCollapsed}
        languageLabel={languageLabel}
        language={language}
        handleToggleListening={handleToggleListening}
        selectedBot={selectedBot}
        onLanguageSelect={handleLanguageSelect}
        direction={direction}
      />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        variant={isMobile ? 'temporary' : 'permanent'}
        collapsed={sidebarCollapsed}
        userChatList={userChatList}
        handleFetchMessages={handleFetchMessages}
        setActiveChat={setActiveChat}
        setInput={setInput}
        setSelectedBot={setSelectedBot}
        selectedBot={selectedBot}
        direction={direction}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: { 
            xs: '100%', 
            md: `calc(100% - ${currentDrawerWidth}px)` 
          },
          direction: direction,
          position: 'relative',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Toolbar to push content below fixed header */}
        <Toolbar />
        
        {/* Content Area */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 0, // Important for proper flex behavior
          direction: direction,
          position: 'relative',
        }}>
          {/* Page Content */}
          <Box sx={{ 
            flex: 1,
            p: 0,
            backgroundColor: 'background.default',
            minHeight: 0, // Important for proper flex behavior
            direction: direction,
            overflow: 'hidden',
            position: 'relative',
            pb: (activechat && chatMessages.length > 0) ? 10 : 0,
          }}>
            {children}
          </Box>
          
          {/* Input Bar - Fixed at bottom or centered when no messages */}
          {(activechat || selectedBot) && handleSend && setInput && (
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                bgcolor: theme.palette.grey[200],
                borderRadius: "30px",
                px: 1,
                py: 1,
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                width: "100%",
                maxWidth: 800,
                mb: (!activechat || chatMessages.length === 0) ? 0 : 2,
                position: "absolute",
                bottom: (!activechat || chatMessages.length === 0) ? "50%" : 16,
                left: "50%",
                transform: (!activechat || chatMessages.length === 0) ? "translate(-50%, 50%)" : "translateX(-50%)",
                zIndex: 1000,
                boxShadow:
                  "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
              }}
            >
              <TextField
                placeholder={t?.placeholder}
                fullWidth
                multiline
                minRows={1}
                maxRows={15}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                    setInput("");
                    if (resetTranscript) resetTranscript();
                  }
                }}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    color: "black",
                    fontSize: "0.95rem",
                    "& textarea": {
                      overflowY: "auto",
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": { display: "none" },
                      resize: "none",
                      padding: "6px 0",
                    },
                  },
                }}
                sx={{
                  flex: 1,
                  marginLeft: 2,
                  mx: 2,
                }}
              />

              <IconButton
                onClick={handleSend}
                disabled={isloading}
                sx={{
                  bgcolor: theme.palette.grey[300],
                  color: theme.palette.text.primary,
                  "&:hover": { bgcolor: theme.palette.grey[400] },
                  width: 36,
                  height: 36,
                }}
              >
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              </Box>
            )}
          </Box>
          
          {/* Footer */}
          {/* <Footer /> */}
        </Box>
      </Box>
  );
}
