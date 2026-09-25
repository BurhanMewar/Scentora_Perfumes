"use client";

import React, { useState, useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Switch,
  IconButton,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Typography,
  FormControl,
  Alert,
} from "@mui/material";
import { CountryCodeSelect } from "@/components/Dropdown";
import { countryCodes } from "@/constants/ISDCode";
import { Close as CloseIcon } from "@mui/icons-material";
import { AppDispatch, RootState } from "../../../store";
import { createUser } from "../../../slice/UserSlice";
import { fetchRoleDropdown } from "@/slice/DropdownSlice";
import { MultiSelectDropdown } from "@/components/Dropdown";
// Local interface for the form data
export interface CreateUserFormData {
  username: string;
  password: string;
  email: string;
  phone: string;
  status: number;
  fullname: string;
  rolesId: (string | number)[];
  countryCode: string;
}

import { SingleSelectDropdown } from "../../../components/Dropdown";
import DynamicButton from "../../../components/DynamicButton";
interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export default function CreateUserModal({
  open,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const roleDropdown = useSelector(
    (state: RootState) => state.dropdown.roleDropdown
  );
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Form state
  const [formData, setFormData] = useState<CreateUserFormData>({
    username: "",
    password: "",
    rolesId: [],
    status: 1,
    phone: "",
    countryCode: "",
    fullname: "",
    email: "",
  });

  // Form validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch merchants when modal opens

  const handleClose = () => {
    if (!loading) {
      setFormData({
        username: "",
        password: "",
        rolesId: [],
        status: 1,
        phone: "",
        countryCode: "",
        fullname: "",
        email: "",
      });
      setErrors({});
      setError(null);
      onClose();
    }
  };
  useEffect(() => {
    if (open) {
      dispatch(fetchRoleDropdown());
    }
  }, [dispatch, open]);
  const handleInputChange =
    (field: keyof CreateUserFormData) => (eventOrValue: any) => {
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
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = "User Name is required";
    }
    
    if (formData.password === null || !formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if(!formData.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    }
    if (!formData.countryCode.trim()) {
      newErrors.countryCode = "Country code is required";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    ;
    if (formData.rolesId.length == 0) {
      newErrors.rolesId = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    let comaseperatedRoles;
    setLoading(true);
    setError(null);
    if (Array.isArray(formData.rolesId)) {
      comaseperatedRoles = formData.rolesId.join(",");
    }
    try {
      // Send the complete form data as expected by the API
      const userData = {
        username: formData.username,
        password: formData.password,
        rolesId: comaseperatedRoles,
        status: formData.status,
        phone: formData.phone,
        countryCode: formData.countryCode,
        fullname: formData.fullname,
        email: formData.email,
      };

      await dispatch(createUser(userData)).unwrap();
      onSuccess(`User "${formData.username}" has been created successfully!`);
      handleClose();
    } catch (error: any) {
      console.error("Error creating user:", error);
      setError(error || "Failed to create user. Please try again.");
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
                Create New User
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon color="primary" />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* User Information */}

          {/* Contact Information */}
          <Box>
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
                  label="Select Role"
                  options={roleDropdown.map((role) => ({
                    label: role.name,
                    value: role.id,
                  }))}
                  onChange={(newValues) =>
                    handleInputChange("rolesId")(newValues)
                  } // pass array
                  value={formData.rolesId || []} // must be array
                  error={!!errors.rolesId}
                  helperText={errors.rolesId ? String(errors.rolesId) : ""}
                  disabled={loading}
                  required
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 2 }}>
              <TextField
                label="User Name"
                value={formData.username}
                onChange={handleInputChange("username")}
                error={!!errors.username}
                helperText={errors.username}
                fullWidth
                required
                disabled={loading}
              />

              <TextField
                label="Password"
                value={formData.password}
                onChange={handleInputChange("password")}
                error={!!errors.password}
                helperText={errors.password}
                fullWidth
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap", // keeps layout responsive
              }}
            >
              {/* Email Field */}
              <Box sx={{ flex: 1, minWidth: "250px" }}>
                <TextField
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
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
                    onChange={handleInputChange("countryCode")}
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
                  onChange={handleInputChange("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone}
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
                onChange={handleInputChange("fullname")}
                fullWidth
                size="medium"
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

export type { CreateUserModalProps };

