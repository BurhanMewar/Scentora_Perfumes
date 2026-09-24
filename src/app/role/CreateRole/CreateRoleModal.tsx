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
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Switch,
  IconButton,
  Divider,
} from "@mui/material";
import { fetchBotDropdown } from "@/slice/DropdownSlice";
import { Close as CloseIcon } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { createRole, CreateRoleData } from "../../../slice/RoleSlice";
import DynamicButton from "../../../components/DynamicButton";
import { MultiSelectDropdown } from "@/components";
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
  const botDropdown = useSelector(
    (state: RootState) => state.dropdown.botDropdown
  );
  // Form validation state
  const [errors, setErrors] = useState<{
    botsId?: string;
    rolename?: string;
    createdBy?: string;
    status?: number;
  }>({});

  const handleClose = () => {
    if (!loading) {
      setFormData({
        rolename: "",
        createdBy: "", // This should come from the logged-in user
        botsId: "",
        status: 1,
      });
      setErrors({
        rolename: undefined,
        createdBy: undefined, // This should come from the logged-in user
        botsId: undefined,
        status: undefined,
      });
      onClose();
    }
  };
  useEffect(() => {
    if(open){
       dispatch(fetchBotDropdown());
    }
   
  }, [open,dispatch]);
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
      botsId?: string;
      masterRole?: number;
    } = {};

    if (!formData?.rolename.trim()) {
      newErrors.rolename = "Role name is required";
    } 
    if( formData.botsId.length === 0){
      newErrors.botsId = "Please select a valid bot";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Ensure botsId is a comma-separated string
    const botsId =
      Array.isArray(formData.botsId) && formData.botsId.length > 0
        ? formData.botsId.join(",")
        : "";
    const status = Number(formData.status);
    const roleData = {
      rolename: formData.rolename,
      createdBy: formData.createdBy, // Logged-in user ID
      botsId,
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
      maxWidth="md"
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
          maxWidth: isMobile ? "100%" : "800px",
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
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Create New Role
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon color="primary" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2, // spacing between dropdowns
            marginBottom: 2,
            mt: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <MultiSelectDropdown
              label="Select Bot"
              options={botDropdown.map((bot) => ({
                label: bot.name,
                value: bot.id,
              }))}
              onChange={(newValues) => handleInputChange("botsId")(newValues)} // pass array
              value={formData.botsId || []} // must be array
              error={!!errors.botsId}
              helperText={errors.botsId ? String(errors.botsId) : ""}
              disabled={loading}
              required
            />
          </Box>
        </Box>
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

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <DynamicButton
          onClick={handleSubmit}
          disabled={loading}
          variant="primary"
          size="medium"
          loading={loading}
          loadingText="Saving..."
        >
          Save
        </DynamicButton>
      </DialogActions>
    </Dialog>
  );
}
