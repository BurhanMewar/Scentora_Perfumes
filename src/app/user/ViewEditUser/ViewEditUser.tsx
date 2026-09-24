"use client";

import React, { useState, useEffect, use } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
  Divider,
  FormControl,
  Avatar,
  useMediaQuery,
  useTheme,
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
import { updateUser, User, UpdateUserData } from "../../../slice/UserSlice";
import DynamicButton from "../../../components/DynamicButton";
import { CountryCodeSelect } from "@/components/Dropdown";
import { countryCodes } from "@/constants/ISDCode";
import { MultiSelectDropdown } from "@/components/Dropdown";
import { fetchRoleDropdown } from "@/slice/DropdownSlice";
export interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  mode: "view" | "edit";
  onSuccess: (message: string) => void;
}

export default function UserDetailModal({
  open,
  onClose,
  mode,
  user,
  onSuccess,
}: UserDetailModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const currentUser = useSelector(
    (state: RootState) => state.user.selectedUser
  );
  const roleDropdown = useSelector(
    (state: RootState) => state.dropdown.roleDropdown
  );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState<UpdateUserData | null>(null);
  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateUserData, string>>
  >({});
  const displayUser = currentUser || user;
  // Initialize form data when user changes
  useEffect(() => {
    if (displayUser) {
      // Convert comma-separated string to array of strings
      let rolesArray: string[] = [];
      if (
        typeof displayUser.rolesId === "string" &&
        displayUser.rolesId.length > 0
      ) {
        rolesArray = displayUser.rolesId.split(",").map((id) => id.trim());
      }

      // Map to dropdown values (numbers if your dropdown values are numbers)
      const rolesValue = rolesArray.map((id) => Number(id));

      setFormData({
        username: displayUser.username,
        userId: displayUser.id,
        rolesId: rolesValue, // this is now an array of numbers
        status: 1,
        email: displayUser.email ?? "",
        phone: displayUser.phone ?? "",
        fullname: displayUser.fullname ?? "",
        updatedBy: displayUser.updatedBy ?? "",
        countryCode: displayUser.countryCode ?? "",
      });
    }
  }, [displayUser]);

  useEffect(() => {
    setIsEditMode(mode === "edit");
  }, [mode, open]);
  useEffect(() => {
    if (open) {
      dispatch(fetchRoleDropdown());
    }
  }, [dispatch, open]);
  // Handle form field changes
  const handleChange = (field: keyof UpdateUserData) => (eventOrValue: any) => {
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

    const newErrors: Partial<Record<keyof UpdateUserData, string>> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }
    if (!formData.countryCode.trim()) {
      newErrors.countryCode = "Country code is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }
    if (!formData.rolesId || formData.rolesId.length === 0) {
      newErrors.rolesId = "Role is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!formData || !displayUser) return;

    if (!validateForm()) {
      return;
    }
    const rolesId =
      Array.isArray(formData.rolesId) && formData.rolesId.length > 0
        ? formData.rolesId.join(",")
        : "";
    const userData = {
      username: formData.username,
      userId: formData.userId,
      rolesId: rolesId,
      status: 1,
      email: formData.email,
      phone: formData.phone,
      fullname: formData.fullname,
      updatedBy: formData.updatedBy,
      countryCode: formData.countryCode,
    };
    setLoading(true);
    try {
      await dispatch(
        updateUser({
          userData,
        })
      ).unwrap();
      onSuccess(`User "${formData.username}" has been updated successfully!`);
      handleClose();
    } catch (error: any) {
      console.error("Error updating user:", error);
      // You can add error handling here
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

  //     const filteredCountry = countries.find(
  //       (country) => country.id === Number(countryId)
  //     );
  //     if (filteredCountry) {
  //       setFormData((prev) => {
  //         if (!prev) return null;
  //         return {
  //           ...prev,
  //           countryCode: filteredCountry.isdcode,
  //         };
  //       });
  //     }
  //     const numericId = countryId ? Number(countryId) : 0;

  //     if (numericId) {
  //       setFormData((prev) => {
  //         if (!prev) return null;
  //         return {
  //           ...prev,
  //           countryId: numericId,
  //         };
  //       });
  //     }
  //
  //   };

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

  if (!displayUser || !formData) {
    return null;
  }
  const clientOptions = [
    { value: "1", label: "Merchant 1" },
    { value: "2", label: "Merchant 2" },
    { value: "3", label: "Merchant 3" },
  ];
  const rolesOptions = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
    { value: "bot", label: "Bot" },
  ];
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
            <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                {isEditMode ? "Edit User" : "User Details"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isEditMode
                  ? "Update user information"
                  : "View user information"}
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
          {/* User Information */}
          <Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 2,
                mb: 2,
                mt: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <MultiSelectDropdown
                  label="Select Roles"
                  options={roleDropdown.map((role) => ({
                    label: role.name,
                    value: role.id,
                  }))}
                  onChange={(newValues) => handleChange("rolesId")(newValues)} // pass array
                  value={formData.rolesId || []} // must be array
                  error={!!errors.rolesId}
                  helperText={errors.rolesId ? String(errors.rolesId) : ""}
                  disabled={loading}
                  required
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <TextField
                label="User Name"
                value={formData.username}
                onChange={handleChange("username")}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
                required
                disabled={!isEditMode || loading}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
                mt: 2, // keeps layout responsive
              }}
            >
              {/* Email Field */}
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <TextField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  required
                  disabled={loading}
                />
              </Box>

              {/* ISD Code + Phone */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flex: 1,
                  minWidth: "250px",
                }}
              >
                <FormControl sx={{ width: "35%" }}>
                  <CountryCodeSelect
                    value={formData?.countryCode ?? ""}
                    onChange={handleChange("countryCode")}
                    options={countryCodes}
                    key="isdcode"
                    error={!!errors.countryCode}
                    helperText={errors.countryCode}
                    getOptionLabel={(option) => option.code}
                    renderOptionContent={(option) => <span>{option.code}</span>}
                    placeholder={countryCodes[0].code}
                  />
                </FormControl>

                <TextField
                  label="Phone Number"
                  value={formData.phone}
                  required
                  error={!!errors.phone}
                  helperText={errors.phone}
                  onChange={handleChange("phone")}
                  fullWidth
                  size="medium"
                  disabled={loading}
                />
              </Box>
              <TextField
                label="Full Name"
                value={formData.fullname}
                required
                error={!!errors.fullname}
                helperText={errors.fullname}
                onChange={handleChange("fullname")}
                fullWidth
                size="medium"
                disabled={loading}
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
