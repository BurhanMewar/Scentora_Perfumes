"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import DynamicButton from "../DynamicButton";

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "danger" | "info" | "success";
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  loading = false,
  icon,
}: ConfirmationDialogProps) {
  // Get icon and colors based on type
  const getTypeConfig = () => {
    switch (type) {
      case "danger":
        return {
          icon: <DeleteIcon sx={{ fontSize: 36, color: "error.main" }} />,
          confirmColor: "error" as const,
          iconBgColor: "error.light",
        };
      case "success":
        return {
          icon: (
            <CheckCircleIcon sx={{ fontSize: 36, color: "success.main" }} />
          ),
          confirmColor: "success" as const,
          iconBgColor: "success.light",
        };
      case "info":
        return {
          icon: <InfoIcon sx={{ fontSize: 36, color: "info.main" }} />,
          confirmColor: "info" as const,
          iconBgColor: "info.light",
        };
      default: // warning
        return {
          icon: <WarningIcon sx={{ fontSize: 36, color: "warning.main" }} />,
          confirmColor: "warning" as const,
          iconBgColor: "warning.light",
        };
    }
  };

  const typeConfig = getTypeConfig();
  const displayIcon = icon || typeConfig.icon;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)",
          maxWidth: { xs: "90vw", sm: 400 },
        },
      }}
    >
      <DialogTitle sx={{ pb: 0.5, pt: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "text.primary", fontSize: "1.1rem" }}
          >
            {title}
          </Typography>
          {/* <IconButton
            onClick={handleClose}
            disabled={loading}
            sx={{
              color: 'grey.500',
              '&:hover': {
                backgroundColor: 'grey.100',
              },
            }}
          >
            <CloseIcon />
          </IconButton> */}
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2, pb: 1, px: 3 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: `${typeConfig.iconBgColor}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              border: `2px solid ${typeConfig.iconBgColor}40`,
            }}
          >
            {displayIcon}
          </Box>

          {/* Message */}
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.5,
              maxWidth: 320,
              mb: 1,
              fontSize: "0.9rem",
            }}
          >
            {message}
          </Typography>

          {/* Additional warning for danger type */}
          {type === "danger" && (
            <Box
              sx={{
                backgroundColor: "error.light",
                color: "error.contrastText",
                padding: 1.5,
                borderRadius: 1.5,
                width: "100%",
                mt: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, fontSize: "0.85rem" }}
              >
                ⚠️ This action cannot be undone
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, gap: 1.5, justifyContent: "center" }}>
        <DynamicButton
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          size="small"
          sx={{
            minWidth: 80,
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.85rem",
            py: 0.5,
          }}
        >
          {cancelText}
        </DynamicButton>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          variant="contained"
          color={typeConfig.confirmColor}
          size="small"
          sx={{
            minWidth: 80,
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.85rem",
            py: 0.5,
            boxShadow:
              type === "danger"
                ? "0 2px 8px rgba(211, 47, 47, 0.3)"
                : undefined,
            "&:hover": {
              boxShadow:
                type === "danger"
                  ? "0 4px 12px rgba(211, 47, 47, 0.4)"
                  : undefined,
            },
          }}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
