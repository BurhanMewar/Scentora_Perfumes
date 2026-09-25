import React, { useState, useRef } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  createFilterOptions,
  useTheme,
  InputAdornment,
  Chip,
  Typography,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

interface CountryCode {
  code: string;
  flag: string;
}

interface CountryCodeSelectProps<T = any> {
  value: string; // selected ISD code
  disabled?: boolean;
  onChange: (value: string) => void; // callback when selection changes
  options: T[]; // array of country codes
  placeholder?: string;
  sx?: any;
  key?: string;
  getOptionLabel?: (option: T) => string;
  renderOptionContent?: (option: T) => React.ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  size?: "small" | "medium";
  error?: boolean;
  helperText?: string;
  label?: string;
}

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = "Select code",
  sx,
  getOptionLabel,
  renderOptionContent,
  searchable = true,
  searchPlaceholder = "Search options...",
  size = "medium",
  error = false,
  helperText,
  label,
}) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const filterOptions = createFilterOptions({
    stringify: (option: (typeof options)[0]) => {
      if (getOptionLabel) {
        return getOptionLabel(option).toLowerCase();
      }
      return `${option.code} ${option.country} ${option.currency}`.toLowerCase();
    },
    limit: 50,
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Autocomplete
        options={options}
        disabled={disabled}
        disableClearable
        filterOptions={filterOptions}
        getOptionLabel={(option) =>
          getOptionLabel ? getOptionLabel(option) : ""
        }
        value={
          options.find(
            (c) => (getOptionLabel ? getOptionLabel(c) : "") === value
          ) || null
        }
        onChange={(_, newValue) => {
          onChange(
            newValue ? (getOptionLabel ? getOptionLabel(newValue) : "") : ""
          );
        }}
        renderOption={(props, option, { index }) => (
          <Box
            component="li"
            {...props}
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              fontSize: size === "small" ? "0.875rem" : "1rem",
              py: size === "small" ? 0.75 : 1,
              px: size === "small" ? 1.5 : 2,
              borderRadius: 1,
              margin: "2px 8px",
              minHeight: size === "small" ? "36px" : "40px",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
              "&.Mui-focused": {
                backgroundColor: theme.palette.action.selected,
              },
            }}
            key={index}
          >
            {renderOptionContent?.(option)}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            size={size}
            error={error}
            helperText={helperText}
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                fontSize: size === "small" ? "0.875rem" : "0.8rem",
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
            InputProps={{
              ...params.InputProps,
              endAdornment:
                searchable && searchTerm ? (
                  <InputAdornment position="end">
                    <ClearIcon
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: 18,
                        cursor: "pointer",
                        "&:hover": { color: theme.palette.text.primary },
                      }}
                      onClick={clearSearch}
                    />
                  </InputAdornment>
                ) : (
                  params.InputProps.endAdornment
                ),
            }}
            onKeyDown={(event) => {
              if (event.key === "Tab" || event.key === "Enter") {
                const inputValue = (event.target as HTMLInputElement).value;
                let match = null;
                if (getOptionLabel) {
                  const inputLower = String(inputValue).toLowerCase();

                  match = options.find((o) => {
                    const optionLabel = getOptionLabel(o);
                    if (typeof optionLabel === "string") {
                      return optionLabel.toLowerCase().includes(inputLower);
                    }
                    return false;
                  });
                }

                // Apply the match if found
                if (match) {
                  onChange(getOptionLabel ? getOptionLabel(match) : "");
                }
              }
            }}
          />
        )}
        ListboxProps={{
          style: {
            maxHeight: 300,
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
              overflow: "hidden",
              backgroundColor: theme.palette.background.paper,
              "& .MuiAutocomplete-listbox": {
                padding: 0,
                backgroundColor: theme.palette.background.paper,
                scrollbarWidth: "none", // Firefox
                "&::-webkit-scrollbar": {
                  display: "none", // Chrome, Safari
                },
                "& .MuiAutocomplete-option": {
                  borderRadius: 1,
                  minHeight: size === "small" ? "36px" : "40px",
                  fontSize: "11px",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  "&.Mui-focused": {
                    backgroundColor: theme.palette.action.selected,
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
            fontSize: "11px",
            minHeight: size === "small" ? "53px" : "53px",
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

export default CountryCodeSelect;

