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
  Divider,
} from "@mui/material";
import {
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
          icon: <DeleteIcon sx={{ fontSize: 30, color: "#a15d2d" }} />,
          confirmColor: "error" as const,
        };
      case "success":
        return {
          icon: (
            <CheckCircleIcon sx={{ fontSize: 36, color: "success.main" }} />
          ),
          confirmColor: "success" as const,
        };
      case "info":
        return {
          icon: <InfoIcon sx={{ fontSize: 36, color: "info.main" }} />,
          confirmColor: "info" as const,
        };
      default: // warning
        return {
          icon: <WarningIcon sx={{ fontSize: 30, color: "#a15d2d" }} />,
          confirmColor: "warning" as const,
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
          border: "1px solid rgba(161,93,45,0.2)",
          borderRadius: 3,
          background: "#fffaf0",
          color: "#211710",
          boxShadow: "0 18px 40px rgba(33,23,16,0.2)",
          maxWidth: { xs: "90vw", sm: 400 },
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 1.75, px: 2.5, background: "linear-gradient(105deg,#fffaf0,#f7ecd8)" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "#30251d", fontSize: "1rem" }}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <Divider sx={{ borderColor: "rgba(161,93,45,0.16)" }} />

      <DialogContent sx={{ pt: 2, pb: 1.5, px: 2.5 }}>
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
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "rgba(252,140,61,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
              border: "1px solid rgba(161,93,45,0.2)",
            }}
          >
            {displayIcon}
          </Box>

          {/* Message */}
          <Typography
            variant="body2"
            sx={{
              color: "#625548",
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
                backgroundColor: "rgba(252,140,61,0.12)",
                color: "#8c4d24",
                padding: 1.5,
                borderRadius: 2,
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

      <Divider sx={{ borderColor: "rgba(161,93,45,0.16)" }} />

      <DialogActions sx={{ p: 2, gap: 1, justifyContent: "flex-end", backgroundColor: "#fffdf8" }}>
        <DynamicButton
          onClick={handleClose}
          disabled={loading}
          variant="outlined"
          size="small"
          sx={{
            minWidth: 80,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.85rem",
            py: 0.6,
            borderColor: "rgba(161,93,45,0.35)",
            color: "#8c4d24",
            "&:hover": { borderColor: "#a15d2d", backgroundColor: "#fcf2e6" },
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
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.85rem",
            py: 0.6,
            backgroundColor: type === "danger" ? "#211710" : undefined,
            color: type === "danger" ? "#fffaf0" : undefined,
            boxShadow:
              type === "danger"
                ? "0 2px 8px rgba(161, 93, 45, 0.22)"
                : undefined,
            "&:hover": {
              backgroundColor: type === "danger" ? "#8c4d24" : undefined,
              boxShadow:
                type === "danger"
                  ? "0 4px 12px rgba(161, 93, 45, 0.3)"
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
