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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { createRole, CreateRoleData } from "../../../slice/RoleSlice";
import DynamicButton from "../../../components/DynamicButton";
export interface CreateRoleModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  OnFailure: (message: string) => void;
}

export default function CreateRoleModal({
  open,
  onClose,
  onSuccess,
  OnFailure,
}: CreateRoleModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState<CreateRoleData>({
    rolename: "",
    createdBy: "", // This should come from the logged-in user
    botsId: [],
    status: 1,
  });
  // Form validation state
  const [errors, setErrors] = useState<{
    rolename?: string;
    createdBy?: string;
    status?: number;
  }>({});

  const handleClose = () => {
    if (!loading) {
      setFormData({
        rolename: "",
        createdBy: "", // This should come from the logged-in user
        botsId: [],
        status: 1,
      });
      setErrors({
        rolename: undefined,
        createdBy: undefined, // This should come from the logged-in user
        status: undefined,
      });
      onClose();
    }
  };
  const handleInputChange =
    (field: keyof CreateRoleData) => (eventOrValue: any) => {
      let value: string | boolean | number;

      // 🔹 Case 1: Direct value (Autocomplete or custom component)
      if (
        typeof eventOrValue === "string" ||
        typeof eventOrValue === "number" ||
        typeof eventOrValue === "boolean"
      ) {
        value = eventOrValue;
      }
      // 🔹 Case 2: Event from input/select/checkbox
      else if (eventOrValue?.target) {
        const target = eventOrValue.target;

        if (target.type === "checkbox") {
          value = target.checked;
        } else {
          // Handles both TextField and Select (dropdown)
          value = target.value;
        }
      }
      // 🔹 Case 3: Fallback for components like MUI Autocomplete (value object)
      else if (eventOrValue && eventOrValue.value !== undefined) {
        value = eventOrValue.value;
      } else {
        value = eventOrValue ?? "";
      }

      // ✅ Update form state
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // ✅ Clear field-specific error
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

  const validateForm = (): boolean => {
    const newErrors: {
      rolename?: string;
      isMerchant?: boolean;
      createdBy?: string;
      masterRole?: number;
    } = {};

    if (!formData?.rolename.trim()) {
      newErrors.rolename = "Role name is required";
    } 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Ensure botsId is a comma-separated string
    const status = Number(formData.status);
    const roleData = {
      rolename: formData.rolename,
      createdBy: formData.createdBy, // Logged-in user ID
      botsId: "",
      status,
    };

    setLoading(true);
    try {
      await dispatch(createRole(roleData)).unwrap();
      onSuccess(`Role "${formData.rolename}" has been created successfully!`);
      handleClose();
    } catch (error: any) {
      OnFailure(error || "Failed to create role. Please try again.");
    } finally {
      setLoading(false);
    }
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
                Add role
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: "#796b5c" }}>
                Create a role to manage CMS access.
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ display: "grid", gap: 2, px: 3, pt: "36px !important", pb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Role Information */}
          <Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Role Name"
                value={formData?.rolename}
                onChange={handleInputChange("rolename")}
                error={!!errors?.rolename}
                helperText={errors?.rolename ? String(errors?.rolename) : ""}
                fullWidth
                required
                disabled={loading}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1, borderTop: "1px solid rgba(161,93,45,0.14)", backgroundColor: "#fffdf8" }}>
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
          loadingText="Saving..."
          sx={{ minHeight: 40, minWidth: 120, borderRadius: 2, backgroundColor: "#211710", color: "#fffaf0", "&:hover": { backgroundColor: "#8c4d24" } }}
        >
          Save
        </DynamicButton>
      </DialogActions>
    </Dialog>
  );
}
