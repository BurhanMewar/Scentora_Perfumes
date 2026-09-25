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
  Switch,useMediaQuery,
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
import { updateAppsetting, Appsetting, UpdateAppsettingData } from "../../../slice/AppSettingSlice";
import DynamicButton from "../../../components/DynamicButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Loader from "@/components/Loader/loader";

export interface AppsettingDetailModalProps {
  open: boolean;
  onClose: () => void;
  appsetting: Appsetting | null;
  mode: "view" | "edit";
  onSuccess: (message: string) => void;
}

export default function AppsettingDetailModal({
  open,
  onClose,
  appsetting,
  mode,
  onSuccess,
}: AppsettingDetailModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const currentAppsetting = useSelector((state: RootState) => state.appsetting.currentAppsetting);
  const isLoading = useSelector((state: RootState) => state.appsetting.isCurrentAppsettingLoading);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [formData, setFormData] = useState<UpdateAppsettingData | null>(null);
  const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateAppsettingData, string>>
  >({});

  // Use currentAppsetting from Redux store if available, otherwise fall back to passed appsetting prop
  const displayAppsetting = currentAppsetting;

  // Initialize form data when appsetting changes
  useEffect(() => {
    if (displayAppsetting) {
      setFormData({
        appsettingId: displayAppsetting.appsettingId,
        merchantId: displayAppsetting.merchantId,
        appsettingName: displayAppsetting.appsettingName,
        isMerchant: displayAppsetting.isMerchant,
        updatedBy: 1, // This should come from auth context
      });
    }
  }, [displayAppsetting]);

  // Reset edit mode when modal opens/closes
  useEffect(() => {
    setIsEditMode(mode === "edit");
  }, [mode, open]);

  // Handle form field changes
  const handleChange =
    (field: keyof UpdateAppsettingData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!formData) return;
      
      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.type === "number"
          ? parseInt(event.target.value) || 0
          : event.target.value;

      setFormData((prev) =>
        prev
          ? {
              ...prev,
              [field]: value,
            }
          : null
      );

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  // Validate form
  const validateForm = (): boolean => {
    if (!formData) return false;

    const newErrors: Partial<Record<keyof UpdateAppsettingData, string>> = {};

    if (!formData.appsettingName.trim()) {
      newErrors.appsettingName = "Appsetting name is required";
    } else if (formData.appsettingName.length < 2) {
      newErrors.appsettingName = "Appsetting name must be at least 2 characters";
    }

    if (formData.merchantId <= 0) {
      newErrors.merchantId = "Please select a valid merchant";
    }

    if (formData.updatedBy <= 0) {
      newErrors.updatedBy = "Updated by user ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData || !appsetting) return;
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await dispatch(updateAppsetting(formData)).unwrap();
      onSuccess(`Appsetting "${formData.appsettingName}" has been updated successfully!`);
      handleClose();
    } catch (error: any) {
      console.error("Error updating appsetting:", error);
      // You can add error handling here
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
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Clean-up function to restore original styles
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
        document.body.style.position = originalBodyPosition;
        document.body.style.top = '';
        document.body.style.width = '';
        
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

  if (!displayAppsetting || !formData) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }
      }}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: isMobile ? "100%" : "75vh",
          maxWidth: isMobile ? "100%" : "800px",
          width: isMobile ? "100%" : "100%",
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
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
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {isEditMode ? "Edit Appsetting" : "Appsetting Details"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isLoading 
                  ? "Loading appsetting details..." 
                  : isEditMode
                  ? "Update appsetting information"
                  : "View appsetting information"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {!isEditMode && !isLoading && (
              <IconButton
                onClick={handleToggleEdit}
                size="small"
                sx={{ color: "primary.main" }}
              >
                <EditIcon />
              </IconButton>
            )}
            <IconButton onClick={handleClose} size="small" disabled={isLoading}>
              <CloseIcon color="primary" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {isLoading ? (
          <Loader fullscreen={false} text="Loading app settings..." />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Appsetting Information */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}
            >
              Appsetting Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Appsetting Name"
                value={formData.appsettingName}
                onChange={handleChange("appsettingName")}
                error={!!errors.appsettingName}
                helperText={errors.appsettingName}
                fullWidth
                required
                disabled={!isEditMode || loading}
              />
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isMerchant}
                  onChange={handleChange("isMerchant")}
                  disabled={!isEditMode || loading}
                />
              }
              label="Is Merchant"
            />
          </Box>

          {/* System Information */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}
            >
              System Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 120 }}
                >
                  Appsetting ID:
                </Typography>
                <Chip label={displayAppsetting.appsettingId} size="small" variant="outlined" />
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 120 }}
                >
                  Created:
                </Typography>
                <Typography variant="body2">
                  {formatDate(displayAppsetting.createdDate)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 120 }}
                >
                  Last Updated:
                </Typography>
                <Typography variant="body2">
                  {displayAppsetting.updatedDate ? formatDate(displayAppsetting.updatedDate) : "Never"}
                </Typography>
              </Box>
              
            </Box>
          </Box>
        </Box>
      )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        {isEditMode && (
          <>
            <DynamicButton
              onClick={handleSubmit}
              disabled={loading}
              variant="primary"
              size="medium"
              loading={loading}
              loadingText="Updating..."
            >
              Update
            </DynamicButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
