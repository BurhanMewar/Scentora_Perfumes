"use client";

import React, { useState, useEffect } from "react";
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
  InputAdornment,
  FormControl,
  Alert,
} from "@mui/material";
import { CountryCodeSelect } from "@/components/Dropdown";
import { countryCodes } from "@/constants/ISDCode";
import { Close as CloseIcon } from "@mui/icons-material";
import { AppDispatch, RootState } from "@/store";
import { changePassword } from "@/slice/UserSlice";
import { User } from "@/slice/AuthSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// Local interface for the form data
interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  userId: number;
}
// import { fetchMerchants } from "@/slice/MerchantSlice";
import { SingleSelectDropdown } from "@/components/Dropdown";
import DynamicButton from "@/components/DynamicButton";
// import { fetchRoleDropdown, RoleDropdownFilters } from "@/slice/DropdownSlice";
interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onSuccess: (message: string) => void;
}

export default function ChangePasswordModal({
  open,
  onClose,
  onSuccess,
  user,
}: ChangePasswordProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // Form state
  const [formData, setFormData] = useState<ChangePasswordFormData>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    userId: user?.userId || 0,
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  // const { roleDropdown, isLoading } = useSelector(
  //   (state: RootState) => state.dropdown
  // );
  // Form validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch merchants when modal opens
  // useEffect(() => {
  //   if (open && merchants.length === 0) {
  //     dispatch(fetchMerchants());
  //   }
  // }, [open, dispatch, merchants.length]);

  const handleClose = () => {
    if (!loading) {
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        userId: 0,
      });
      setErrors({});
      setError(null);
      onClose();
    }
  };

  const handleInputChange =
    (field: keyof ChangePasswordFormData) => (eventOrValue: any) => {
      let value: string | boolean | number;

      if (
        typeof eventOrValue === "string" ||
        typeof eventOrValue === "number"
      ) {
        // Case: called directly with a value (Autocomplete)
        value = eventOrValue;
      } else {
        // Case: called from an event (TextField, Select, Checkbox)
        value = eventOrValue.target.value;
      }
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

  // useEffect(() => {
  //   if (open) {
  //     dispatch(fetchRoleDropdown(filters));
  //   }
  // }, [dispatch, open]);
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required";
    } else if (formData.oldPassword.length < 6) {
      newErrors.oldPassword = "Username must be at least 6 characters";
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const toggleShow = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Send the complete form data as expected by the API
      const Data = {
        userId: user?.userId,
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      };

      await dispatch(changePassword(Data)).unwrap();
      onSuccess(`Password has been changed successfully!`);
      handleClose();
    } catch (error: any) {
      console.error("Error creating user:", error);
      setError(error || "Failed. Please try again.");
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
                Change Password
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
        <form autoComplete="off">
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
              <TextField
                label="Old Password"
                type={showPassword.old ? "text" : "password"}
                value={formData.oldPassword}
                onChange={handleInputChange("oldPassword")}
                error={!!errors.oldPassword}
                helperText={errors.oldPassword}
                fullWidth
                required
                disabled={loading}
                autoComplete="off"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="secondary"
                        onClick={() => toggleShow("old")}
                      >
                        {showPassword.old ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, mb: 2 }}>
              <TextField
                label="New Password"
                type={showPassword.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleInputChange("newPassword")}
                error={!!errors.newPassword}
                helperText={errors.newPassword}
                fullWidth
                required
                disabled={loading}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="secondary"
                        onClick={() => toggleShow("new")}
                      >
                        {showPassword.new ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Confirm Password"
                value={formData.confirmPassword}
                type={showPassword.confirm ? "text" : "password"}
                onChange={handleInputChange("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth
                required
                disabled={loading}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="secondary"
                        onClick={() => toggleShow("confirm")}
                      >
                        {showPassword.confirm ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </form>
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

export type { ChangePasswordProps };

