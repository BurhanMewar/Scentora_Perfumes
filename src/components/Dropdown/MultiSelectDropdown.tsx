"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Chip,
  Autocomplete,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Checkbox,
  FormHelperText,
} from "@mui/material";

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  secondaryLabel?: string;
}

interface MultiSelectDropdownProps {
  options: DropdownOption[];
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  size?: "small" | "medium";
  fullWidth?: boolean;
  maxHeight?: number;
  showCheckbox?: boolean;
  variant?: "outlined" | "filled" | "standard";
  sx?: any;
  searchable?: boolean;
  searchPlaceholder?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
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
  showCheckbox = true,
  variant = "outlined",
  sx = {},
  searchable = true,
  searchPlaceholder = "Search options...",
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Find selected options
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  const handleChange = (event: any, newValue: DropdownOption[]) => {
    const selectedValues = newValue.map((option) => option.value);
    onChange(selectedValues);
  };
  const sortedOptions = React.useMemo(() => {
    // Move selected options to the top
    return [...options].sort((a, b) => {
      const aSelected = value.includes(a.value);
      const bSelected = value.includes(b.value);
      if (aSelected === bSelected) return 0;
      return aSelected ? -1 : 1;
    });
  }, [options, value]);
  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Autocomplete
        multiple
        options={sortedOptions}
        value={selectedOptions}
        onChange={handleChange}
        disabled={disabled}
        disableCloseOnSelect
        disableListWrap
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            required={required}
            autoComplete="off"
            size={size}
            variant={variant}
            fullWidth={fullWidth}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                fontSize: size === "small" ? "0.875rem" : "1rem",
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
                fontSize: size === "small" ? "0.875rem" : "1rem",
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
        renderOption={(props, option, { selected }) => (
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
            {showCheckbox && (
              <Checkbox
                checked={selected}
                size={size === "small" ? "small" : "medium"}
                sx={{
                  color: selected
                    ? theme.palette.primary.dark
                    : theme.palette.text.secondary,
                  "&.Mui-checked": {
                    color: selected
                      ? theme.palette.primary.dark
                      : theme.palette.primary.main,
                  },
                }}
              />
            )}
            <Typography
              variant="body2"
              sx={{
                fontSize: size === "small" ? "0.875rem" : "1rem",
                fontWeight: selected ? 600 : 400,
                color: option.disabled
                  ? theme.palette.text.disabled
                  : "inherit",
                ml: showCheckbox ? 1 : 0,
              }}
            >
              {option.label}
            </Typography>
          </Box>
        )}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.value}
              label={option.label}
              size="small"
              sx={{
                height: size === "small" ? 20 : 24,
                fontSize: size === "small" ? "0.7rem" : "0.75rem",
                "& .MuiChip-label": {
                  px: size === "small" ? 0.5 : 0.75,
                },
              }}
            />
          ))
        }
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
            borderRadius: 1,
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

export default MultiSelectDropdown;

