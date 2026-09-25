import React, { useState, useRef, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  FormHelperText,
  Box,
  Chip,
} from "@mui/material";
import { DropdownOption } from "./MultiSelectDropdown";

interface SingleSelectDropdownProps {
  id?: string;
  shape?: "default" | "pill";
  options: DropdownOption[];
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
  maxHeight?: number;
  variant?: "outlined" | "filled" | "standard";
  sx?: any;
  emptyOption?: boolean;
  emptyOptionLabel?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  id,
  shape = "default",
  options,
  value,
  onChange,
  label,
  placeholder,
  error = false,
  helperText,
  disabled = false,
  required = false,
  size = "medium",
  fullWidth = true,
  maxHeight = 300,
  variant = "outlined",
  sx = {},
  emptyOption = false,
  emptyOptionLabel = "Select an option",
  searchable = true,
  searchPlaceholder = "Search options...",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Prepare options with empty option if needed
  const allOptions = emptyOption
    ? [{ value: "", label: emptyOptionLabel }, ...options]
    : options;

  // Find the selected option
  const selectedOption =
    allOptions.find((option) => option.value == value) || null;

  const handleChange = (event: any, newValue: DropdownOption | null) => {
    if (newValue === null) {
      onChange(null);
    } else {
      onChange(newValue.value);
    }
  };

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Autocomplete
        options={allOptions}
        value={selectedOption}
        onChange={handleChange}
        disabled={disabled}
        disableClearable={!emptyOption}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => (
          <TextField
            {...params}
            id={id}
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            required={required}
            size={size}
            variant={variant}
            fullWidth={fullWidth}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: shape === "pill" ? "999px" : 1,
                fontSize: size === "small" ? "0.875rem" : "0.9rem",
                backgroundColor: theme.palette.background.paper,
                "& fieldset": {
                  borderColor: error
                    ? theme.palette.error.main
                    : theme.palette.divider,
                  borderWidth: "1px",
                },
                "&:hover fieldset": {
                  borderColor: error
                    ? theme.palette.error.main
                    : theme.palette.primary.main,
                },
                "&.Mui-focused fieldset": {
                  borderColor: error
                    ? theme.palette.error.main
                    : theme.palette.primary.main,
                  borderWidth: "2px",
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: size === "small" ? "0.875rem" : "0.875rem",
                color: error
                  ? theme.palette.error.main
                  : theme.palette.text.secondary,
              },
              "& .MuiFormHelperText-root": {
                fontSize: size === "small" ? "0.75rem" : "0.875rem",
                color: error
                  ? theme.palette.error.main
                  : theme.palette.text.secondary,
                    
              },
            }}
          />
        )}
        renderOption={(props, option, index) => (
          <Box
            component="li"
            {...props}
            sx={{
              py: size === "small" ? 0.75 : 1,
              px: size === "small" ? 1.5 : 2,
              borderRadius: 1,
              margin: "2px 8px",
              minHeight: size === "small" ? "36px" : "40px",
              backgroundColor: theme.palette.background.paper,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              "&.Mui-focused": {
                backgroundColor: theme.palette.action.selected,
              },
              "&.Mui-selected": {
                backgroundColor: theme.palette.primary.light,
                color: theme.palette.primary.contrastText,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                },
              },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: size === "small" ? "0.875rem" : "0.875rem",
                  fontWeight: value === option.value ? 600 : 400,
                  color: option.disabled
                    ? theme.palette.text.disabled
                    : "inherit",
                }}
              >
                {option.label}
              </Typography>

              {option.secondaryLabel && (
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontSize: size === "small" ? "0.75rem" : "0.8125rem",
                    lineHeight: 1.1,
                    mt: 0.25, // small vertical gap below main label
                  }}
                >
                  {option.secondaryLabel}
                </Typography>
              )}
            </Box>
          </Box>
        )}
        ListboxProps={{
          style: {
            maxHeight: maxHeight,
            borderRadius: 8,
            boxShadow: theme.shadows[8],
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
        PaperComponent={({ children, ...other }) => (
          <Box
            {...other}
            sx={{
              borderRadius: 2,
              boxShadow: theme.shadows[8],
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              overflow: "hidden",
              "& .MuiAutocomplete-listbox": {
                padding: 0,
                backgroundColor: theme.palette.background.paper,
                "& .MuiAutocomplete-option": {
                  borderRadius: 1,
                  margin: "2px 8px",
                  minHeight: size === "small" ? "36px" : "40px",
                  backgroundColor: theme.palette.background.paper,
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  "&.Mui-focused": {
                    backgroundColor: theme.palette.action.selected,
                  },
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                },
              },
            }}
          >
            {children}
          </Box>
        )}
        sx={{
          "& .MuiAutocomplete-inputRoot": {
            borderRadius: shape === "pill" ? "999px" : 1,
            backgroundColor: theme.palette.background.paper,
            "&:hover": {
              backgroundColor: theme.palette.background.paper,
            },
            "&.Mui-focused": {
              backgroundColor: theme.palette.background.paper,
            },
          },
          "& .MuiAutocomplete-clearIndicator": {
            color: theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.text.primary,
            },
          },
          "& .MuiAutocomplete-popupIndicator": {
            color: theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.text.primary,
            },
          },
        }}
      />
    </Box>
  );
};

export default SingleSelectDropdown;

