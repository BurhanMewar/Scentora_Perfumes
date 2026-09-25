"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  IconButton,
  FormControlLabel,
  Switch,
  useMediaQuery,
  useTheme,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { updateRole, Role, UpdateRoleData } from "../../../slice/RoleSlice";
import DynamicButton from "../../../components/DynamicButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Loader from "@/components/Loader/loader";
export interface RoleDetailModalProps {
  open: boolean;
  onClose: () => void;
  role: Role | null;
  mode: "view" | "edit";
  onSuccess: (message: string) => void;
  OnFailure: (message: string) => void;
}

export default function RoleDetailModal({
  open,
  onClose,
  role,
  mode,
  onSuccess,
  OnFailure,
}: RoleDetailModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentRole = useSelector((state: RootState) => state.role.currentRole);
  const isLoading = useSelector(
    (state: RootState) => state.role.isCurrentRoleLoading
  );
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [formData, setFormData] = useState<UpdateRoleData | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateRoleData, string>>
  >({});
  // Use currentRole from Redux store if available, otherwise fall back to passed role prop
  const displayRole = currentRole;
  // Initialize form data when role changes
  useEffect(() => {
    if (!displayRole) return;

    let botArray: number[] = [];

    if (displayRole.botsId && typeof displayRole.botsId === "string") {
      botArray = displayRole.botsId
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => !isNaN(id)); // ensure only valid numbers
    }

    setFormData({
      id: displayRole.id,
      rolename: displayRole.rolename,
      status: 1,
      botsId: botArray,
    });
  }, [displayRole]);

  // Reset edit mode when modal opens/closes
  useEffect(() => {
    setIsEditMode(mode === "edit");
  }, [mode, open]);

  // Handle form field changes
  const handleChange = (field: keyof UpdateRoleData) => (eventOrValue: any) => {
    if (!formData) return;
    let value: string | number | boolean | File | null | (string | number)[];

    if (
      Array.isArray(eventOrValue) ||
      typeof eventOrValue === "string" ||
      typeof eventOrValue === "number" ||
      typeof eventOrValue === "boolean"
    ) {
      value = eventOrValue;
    } else if (eventOrValue?.target) {
      const target = eventOrValue.target as HTMLInputElement;

      if (target.type === "checkbox") {
        value = target.checked;
      } else if (target.type === "file") {
        value = target.files?.[0] || null;
      } else {
        value = target.value;
      }
    }

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [field]: value,
          }
        : prev
    );

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData) return false;

    const newErrors: Partial<Record<keyof UpdateRoleData, string>> = {};

    if (!formData.rolename.trim()) {
      newErrors.rolename = "Role name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData) return;

    if (!validateForm()) {
      return;
    }
    const botsId =
      Array.isArray(formData.botsId) && formData.botsId.length > 0
        ? formData.botsId.join(",")
        : "";
    const status = Number(formData.status);
    const roleData = {
      id: formData.id,
      rolename: formData.rolename, // Logged-in user ID
      botsId,
      status,
    };
    setLoading(true);
    try {
      await dispatch(updateRole(roleData)).unwrap();
      onSuccess(`Role "${formData.rolename}" has been updated successfully!`);
      handleClose();
    } catch (error: any) {
      console.error("Error updating role:", error);
      OnFailure(error || "Failed to update role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!loading) {
      setIsEditMode(mode === "edit");
      setErrors({});
      onClose();
    }
  };

  // Toggle edit mode
  const handleToggleEdit = () => {
    setIsEditMode(!isEditMode);
    setErrors({});
  };
  useEffect(() => {
    if (open) {
      // Store original styles
      const bodyStyle = window.getComputedStyle(document.body);
      const htmlStyle = window.getComputedStyle(document.documentElement);

      const originalBodyOverflow = bodyStyle.overflow;
      const originalHtmlOverflow = htmlStyle.overflow;
      const originalBodyPosition = bodyStyle.position;

      // Store current scroll position
      const scrollY = window.scrollY;

      // Prevent scrolling
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Clean-up function to restore original styles
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.position = originalBodyPosition;
        document.body.style.top = "";
        document.body.style.width = "";

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [open]);
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: isMobile ? "100%" : "75vh",
          maxWidth: isMobile ? "100%" : "560px",
          width: isMobile ? "100%" : "100%",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, fontFamily: "Georgia, serif", color: "#30251d" }}>
                {isEditMode ? "Edit role" : "Role details"}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: "#796b5c" }}>
                {isLoading
                  ? "Loading role details..."
                  : isEditMode
                  ? "Update the role information used by your CMS."
                  : "View role information"}
              </Typography>
            </Box>
          </Box>
          {!isEditMode && !isLoading ? <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isEditMode && (
              <IconButton
                onClick={handleToggleEdit}
                size="small"
                sx={{ color: "primary.main" }}
              >
                <EditIcon />
              </IconButton>
            )}
            <IconButton onClick={handleClose} size="small">
              <CloseIcon color="primary" />
            </IconButton>
          </Box> : null}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ display: "grid", gap: 2, px: 3, pt: "36px !important", pb: 3 }}>
        {isLoading ? (
          <Loader fullscreen={false} text="Loading role details..." />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Role Information */}
            <Box>
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}
              >
                <TextField
                  label="Role Name"
                  value={formData?.rolename}
                  onChange={handleChange("rolename")}
                  error={!!errors.rolename}
                  helperText={errors.rolename}
                  fullWidth
                  required
                  disabled={!isEditMode || loading}
                />
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1, borderTop: "1px solid rgba(161,93,45,0.14)", backgroundColor: "#fffdf8" }}>
        {isEditMode && (
          <>
            <DynamicButton
              onClick={handleClose}
              disabled={loading}
              variant="outlined"
              size="small"
              sx={{ minHeight: 40, minWidth: 96, borderRadius: 2, borderColor: "rgba(161,93,45,0.35)", color: "#8c4d24", "&:hover": { borderColor: "#a15d2d", backgroundColor: "#fcf2e6" } }}
            >
              Cancel
            </DynamicButton>
            <DynamicButton
              onClick={handleSubmit}
              disabled={loading}
              variant="primary"
              size="medium"
              loading={loading}
              loadingText="Updating..."
              sx={{ minHeight: 40, minWidth: 120, borderRadius: 2, backgroundColor: "#211710", color: "#fffaf0", "&:hover": { backgroundColor: "#8c4d24" } }}
            >
              Update
            </DynamicButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

