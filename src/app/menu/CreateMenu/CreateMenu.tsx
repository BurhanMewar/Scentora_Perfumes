"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Switch,
  FormControlLabel,
  Typography,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AppDispatch, RootState } from "../../../store";
import {
  createPermissionTask,
  CreatePermissionTaskData,
} from "../../../slice/PermissionTaskSlice";
import { fetchPermissionTasksDropdown } from "@/slice/DropdownSlice";
import DynamicButton from "../../../components/DynamicButton";
import { SingleSelectDropdown } from "@/components/Dropdown";

interface CreatePermissionTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onFailure: (message: string) => void;
}

export default function CreatePermissionTaskModal({
  open,
  onClose,
  onSuccess,
  onFailure,
}: CreatePermissionTaskModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { permissionTasks } = useSelector(
    (state: RootState) => state.permissionTask
  );
  const { permissionTaskDropdown } = useSelector(
    (state: RootState) => state.dropdown
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [parentMenuData, setParentMenuData] = useState<any[]>([]);
  // Form state
  const [formData, setFormData] = useState<CreatePermissionTaskData>({
    icon: "",
    path: "",
    permissiontaskname: "",
    displayorder: 0,
    parentid: 0,
    isactive: true,
  });
  useEffect(() => {
    if(open){
      dispatch(fetchPermissionTasksDropdown());
    }
  }, [dispatch, open]);
  // Form validation state
  const [errors, setErrors] = useState<Partial<CreatePermissionTaskData>>({});
  const handleClose = () => {
    if (!loading) {
      setFormData({
       icon: "",
    path: "",
    permissiontaskname: "",
    displayorder: 0,
    parentid: 0,
    isactive: true,
      });
      setErrors({});
      setError(null);
      onClose();
    }
  };

 const handleInputChange =
     (field: keyof CreatePermissionTaskData) => (eventOrValue: any) => {
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
    const newErrors: Partial<CreatePermissionTaskData> = {};

    if (!formData.permissiontaskname.trim()) {
      newErrors.permissiontaskname = "Menu name is required";
    } else if (formData.permissiontaskname.length < 3) {
      newErrors.permissiontaskname = "Menu name must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
  useEffect(() => {
    if (permissionTasks.length > 0) {
      const filteredParentMenu = permissionTasks.filter(
        (menu) => menu.parentid === 0
      );
      setParentMenuData(filteredParentMenu);
    }
  }, [permissionTasks]);
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await dispatch(createPermissionTask(formData)).unwrap();
      onSuccess(
        `Menu "${formData.permissiontaskname}" has been created successfully!`
      );
      handleClose();
    } catch (error: any) {
      console.error("Error creating menu:", error);
      onFailure(error || "Failed to create menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                Create New Menu Item
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon color="primary" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}>
          {/* permissionTask Information */}
          <Box>
            <Box>
              <SingleSelectDropdown
                label="Parent Menu"
                options={permissionTaskDropdown.map((menu) => ({
                  value: menu.id,
                  label: menu.name,
                }))}
                onChange={handleInputChange("parentid")}
                value={formData.parentid}
                error={!!errors.parentid}
                helperText={errors.parentid ? String(errors.parentid) : ""}
                disabled={loading}
                required
                emptyOption
                emptyOptionLabel="None"
              />
            </Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                label="Menu Name"
                value={formData.permissiontaskname}
                onChange={handleInputChange("permissiontaskname")}
                error={!!errors.permissiontaskname}
                helperText={errors.permissiontaskname}
                fullWidth
                required
                disabled={loading}
              />
            </Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                label="Menu Path"
                value={formData.path}
                onChange={handleInputChange("path")}
                error={!!errors.path}
                helperText={errors.path}
                fullWidth
                disabled={loading}
              />
            </Box>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                label="Menu Icon"
                value={formData.icon}
                onChange={handleInputChange("icon")}
                error={!!errors.icon}
                helperText={errors.icon}
                fullWidth
                required
                disabled={loading}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3, // vertical spacing between elements
            }}
          >
            {/* Display Order Field */}
            <TextField
              label="Display Order"
              type="number"
              value={formData.displayorder}
              onChange={handleInputChange("displayorder")}
              error={!!errors.displayorder}
              helperText={errors.displayorder}
              fullWidth
              required
              disabled={loading}
              sx={{ width: "20%" }}
            />
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
          loadingText="Creating..."
        >
          Save
        </DynamicButton>
      </DialogActions>
    </Dialog>
  );
}

export type { CreatePermissionTaskModalProps };

