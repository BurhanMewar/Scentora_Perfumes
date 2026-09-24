"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Switch,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  updatePermissionTask,
  PermissionTask,
  UpdatePermissionTaskData,
} from "../../../slice/PermissionTaskSlice";
import DynamicButton from "../../../components/DynamicButton";
import SingleSelectDropdown from "../../../components/Dropdown/SingleSelectDropdown";
import { fetchPermissionTasksDropdown } from "@/slice/DropdownSlice";
export interface PermissionTaskDetailModalProps {
  open: boolean;
  onClose: () => void;
  permissionTask: PermissionTask | null;
  permissionTaskData: PermissionTask[] | [];
  mode: "view" | "edit";
  onSuccess: (message: string) => void;
  onFailure: (message: string) => void;
}

export default function PermissionTaskDetailModal({
  open,
  onClose,
  permissionTask,
  permissionTaskData,
  mode,
  onSuccess,
  onFailure,
}: PermissionTaskDetailModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const permissionTaskDropdown = useSelector(
    (state: RootState) => state.dropdown.permissionTaskDropdown
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState<UpdatePermissionTaskData | null>(
    null
  );
  const currentMenu = useSelector(
    (state: RootState) => state.permissionTask.selectedPermissionTask
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdatePermissionTaskData, string>>
  >({});
  const displayCurrentMenu = currentMenu || permissionTask;
  // Initialize form data when permissionTask changes
  useEffect(() => {
    if (displayCurrentMenu) {
      ;
      setFormData({
        icon: displayCurrentMenu.icon,
        path: displayCurrentMenu.path,
        permissionTaskName: displayCurrentMenu.permissiontaskname,
        parentId: displayCurrentMenu.parentid,
        id: displayCurrentMenu.id,
        isActive: displayCurrentMenu.isactive,
        displayOrder: displayCurrentMenu.displayorder,
        updatedBy: displayCurrentMenu.updatedby ?? "",
      });
    }
  }, [displayCurrentMenu]);

  // Reset edit mode when modal opens/closes
  useEffect(() => {
    setIsEditMode(mode === "edit");
  }, [mode, open]);

  // Handle form field changes
  const handleChange =
    (field: keyof UpdatePermissionTaskData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!formData) return;

      const value =
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value;

      setFormData((prev) =>
        prev
          ? {
              ...prev,
              [field]: value,
            }
          : null
      );

      // Clear error when permissionTask starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };

  // Handle numeric field changes
  useEffect(() => {
    if(open){
       dispatch(fetchPermissionTasksDropdown());
    }
   
  }, [dispatch, open]);
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
  // Validate form
  const validateForm = (): boolean => {
    if (!formData) return false;

    const newErrors: Partial<Record<keyof UpdatePermissionTaskData, string>> =
      {};

    if (!formData.permissionTaskName.trim()) {
      newErrors.permissionTaskName = "menu is required";
    } else if (formData.permissionTaskName.length < 3) {
      newErrors.permissionTaskName = "menu must be at least 3 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData || !displayCurrentMenu) return;

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        updatePermissionTask({ permissionTaskData: formData })
      ).unwrap();

      onSuccess(
        `Menu "${formData.permissionTaskName}" has been updated successfully!`
      );
      handleClose();
    } catch (error: any) {
      console.error("Error updating menu:", error);
      onFailure(error || "Failed to update menu. Please try again.");
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
  const handleParentMenuChange = (permissionTaskId: string | number | null) => {
    const numericId = permissionTaskId ? Number(permissionTaskId) : 0;
    setFormData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        parentId: numericId,
      };
    });
  };
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

  if (!displayCurrentMenu || !formData) {
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
                {isEditMode ? "Edit Menu" : "Menu Details"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isEditMode
                  ? "Update menu information"
                  : "View menu information"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* PermissionTask Information */}
          <Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
              <SingleSelectDropdown
                label="Parent Menu"
                options={permissionTaskDropdown.map((menu) => ({
                  value: menu.id,
                  label: menu.name,
                }))}
                onChange={handleParentMenuChange}
                value={formData.parentId}
                error={!!errors.parentId}
                helperText={errors.parentId ? String(errors.parentId) : ""}
                disabled={loading || !isEditMode}
                required
                emptyOption
                emptyOptionLabel="None"
              />
              <TextField
                label="Menu"
                value={formData.permissionTaskName}
                onChange={handleChange("permissionTaskName")}
                error={!!errors.permissionTaskName}
                helperText={errors.permissionTaskName}
                fullWidth
                required
                disabled={!isEditMode || loading}
              />
              <TextField
                label="Menu Path"
                value={formData.path}
                onChange={handleChange("path")}
                error={!!errors.path}
                helperText={errors.path}
                fullWidth
                disabled={!isEditMode || loading}
              />
              <TextField
                label="Menu Icon"
                value={formData.icon}
                onChange={handleChange("icon")}
                error={!!errors.icon}
                helperText={errors.icon}
                fullWidth
                required
                disabled={!isEditMode || loading}
              />
              <TextField
                label="Display Order"
                type="number"
                value={formData.displayOrder}
                onChange={handleChange("displayOrder")}
                error={!!errors.displayOrder}
                helperText={errors.displayOrder}
                fullWidth
                required
                disabled={loading || !isEditMode}
                sx={{ width: "20%" }}
              />
            </Box>
          </Box>
        </Box>
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

export type { PermissionTaskDetailModal };
