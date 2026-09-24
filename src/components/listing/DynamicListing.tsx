"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  InputBase,
  alpha,
  CircularProgress,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
  FormControl,
  Select,
  SelectChangeEvent,
  MenuItem as SelectMenuItem,
  TextField,
  InputLabel,
  Button,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import DynamicButton from "../DynamicButton";

// Types for the dynamic listing
export interface ListingColumn<T = any> {
  key: string;
  label: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  type?: "text" | "avatar" | "chip" | "badge" | "custom";
}

export interface ListingAction<T = any> {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  onClick: (row: T, index: number) => void;
  show?: (row: T, index: number) => boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface ListingConfig<T = any> {
  title: string;
  description?: string;
  columns: ListingColumn<T>[];
  actions?: ListingAction<T>[];
  primaryAction?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
  secondaryActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  }>;
  searchable?: boolean;
  searchPlaceholder?: string;
  filterable?: boolean;
  showFilter?: boolean;
  filters?: FilterConfig[];
  refreshable?: boolean;
  stats?: Array<{
    label: string;
    value: number | string;
    color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
    icon?: React.ReactNode;
  }>;
  emptyState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
}

export interface DynamicListingProps<T = any> {
  config: ListingConfig<T>;
  data?: T[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onSearch?: (query: string) => void;
  onDropDownChange?: (value: string, key: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  initialFilters?: Record<string, any>;
  className?: string;
}

export default function DynamicListing<T = any>({
  config,
  data,
  loading = false,
  error = null,
  onRefresh,
  onSearch,
  onDropDownChange,
  onFilter,
  initialFilters = {},
  className,
}: DynamicListingProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rowMenuAnchor, setRowMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  // Filter state to collect values before applying, initialized with initialFilters
  const [filterValues, setFilterValues] =
    useState<Record<string, any>>(initialFilters);

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  // Handle row actions menu
  const handleRowMenuOpen = (event: React.MouseEvent<HTMLElement>, row: T) => {
    setRowMenuAnchor(event.currentTarget);
    setSelectedRow(row);
  };

  const handleRowMenuClose = () => {
    setRowMenuAnchor(null);
    setSelectedRow(null);
  };

  // Handle action click
  const handleActionClick = (action: ListingAction<T>) => {
    if (selectedRow && data) {
      action.onClick(selectedRow, data.indexOf(selectedRow));
    }
    handleRowMenuClose();
  };

  // Handle refresh
  const handleRefresh = () => {
    onRefresh?.();
  };

  // Handle filter value changes (local state only)
  const handleFilterValueChange = (key: string, value: any) => {
    if (onDropDownChange) {
      onDropDownChange(key, value);
    }
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle apply filters
  const handleApplyFilters = () => {
    if (onFilter) {
      onFilter(filterValues);
    }
    setAnchorEl(null);
  };

  // Handle clear all filters
  const handleClearFilters = () => {
    setFilterValues({});
    if (onFilter) {
      onFilter({});
    }
    setAnchorEl(null);
  };

  // Render cell content based on type
  const renderCellContent = (
    column: ListingColumn<T>,
    value: any,
    row: T,
    index: number
  ) => {
    if (column.render) {
      return column.render(value, row, index);
    }

    switch (column.type) {
      case "avatar":
        return (
          <Avatar sx={{ backgroundColor: "primary.main" }}>
            {typeof value === "string" ? value.charAt(0).toUpperCase() : "?"}
          </Avatar>
        );
      case "chip":
        return (
          <Chip
            label={value}
            size="small"
            color={
              value === "Active" || value === "Paid" || value === "Success"
                ? "success"
                : "default"
            }
          />
        );
      case "badge":
        return (
          <Badge
            badgeContent={value}
            color="primary"
            sx={{ "& .MuiBadge-badge": { fontSize: "0.75rem" } }}
          >
            <Box />
          </Badge>
        );
      default:
        return (
          <Typography
            variant="body2"
            sx={{ fontWeight: column.key === "name" ? 500 : 400, }}
          >
            {value}
          </Typography>
        );
    }
  };

  return (
    <Box className={className}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {config.title}
          </Typography>
          {config.primaryAction && (
            <DynamicButton
              variant="primary"
              startIcon={config.primaryAction.icon}
              onClick={config.primaryAction.onClick}
              size="small"
            >
              {config.primaryAction.label}
            </DynamicButton>
          )}
        </Box>
        {config.description && (
          <Typography variant="body1" color="text.secondary">
            {config.description}
          </Typography>
        )}
      </Box>

      {/* Stats Cards */}
      {config.stats && config.stats.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            mb: 4,
          }}
        >
          {config.stats.map((stat, index) => (
            <Card key={index}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {stat.icon && (
                    <Box sx={{ color: `${stat.color || "primary"}.main` }}>
                      {stat.icon}
                    </Box>
                  )}
                  <Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 600,
                        color: `${stat.color || "primary"}.main`,
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Action Bar */}
      <Box sx={{ mb: 3 }}>
        {/* Top row: filters, refresh, etc. */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {config.filterable && config.showFilter && (
              <DynamicButton
                variant="outlined"
                startIcon={<FilterIcon />}
                size="small"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                Filters
              </DynamicButton>
            )}
            {config.refreshable && onRefresh && (
              <DynamicButton
                variant="outlined"
                startIcon={<RefreshIcon />}
                size="small"
                onClick={onRefresh}
                disabled={loading}
              >
                Refresh
              </DynamicButton>
            )}
          </Box>
        </Box>

        {/* Secondary actions below header, aligned left/start */}
        {config.secondaryActions && config.secondaryActions.length > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "flex-start", // left/start alignment
              mt: 1, // margin-top to separate from top row
            }}
          >
            {config.secondaryActions.map((action, index) => (
              <DynamicButton
                key={index}
                variant="outlined"
                startIcon={action.icon}
                size="small"
                onClick={action.onClick}
              >
                {action.label}
              </DynamicButton>
            ))}
          </Box>
        )}
      </Box>

      {/* Search Bar */}
      {config.searchable && (
        <Box sx={{ mb: 3 }}>
          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: { xs: "100%", sm: 400 },
              border: "1px solid",
              borderColor: "grey.200",
              borderRadius: 2,
              "&:focus-within": {
                borderColor: "primary.main",
                boxShadow: (theme) =>
                  `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
              },
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, fontSize: "0.875rem" }}
              placeholder={
                config.searchPlaceholder ||
                `Search ${config.title.toLowerCase()}...`
              }
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              inputProps={{
                "aria-label": `search ${config.title.toLowerCase()}`,
              }}
            />
            <IconButton sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Data Table */}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ border: "none" }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {config.columns.map((column) => (
                    <TableCell
                      key={column.key}
                      align={column.align || "left"}
                      sx={{
                        width: column.width,
                        fontWeight: 600,
                        fontSize: "0.875rem",
                        backgroundColor: "grey.50",
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  {config.actions && config.actions.length > 0 && (
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 600, backgroundColor: "grey.50", fontSize: "0.875rem", }}
                    >
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  // Skeleton rows for loading state
                  Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={`skeleton-${index}`}>
                      {config.columns.map((column) => (
                        <TableCell
                          key={column.key}
                          align={column.align || "left"}
                          sx={{ width: column.width, whiteSpace: "nowrap" }}
                        >
                          <Box
                            sx={{
                              height: 20,
                              backgroundColor: "grey.200",
                              borderRadius: 1,
                              animation: "pulse 1.5s ease-in-out infinite",
                              "@keyframes pulse": {
                                "0%": { opacity: 1 },
                                "50%": { opacity: 0.4 },
                                "100%": { opacity: 1 },
                              },
                            }}
                          />
                        </TableCell>
                      ))}
                      {config.actions && config.actions?.length > 0 && (
                        <TableCell align="right">
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              backgroundColor: "grey.200",
                              borderRadius: 1,
                              animation: "pulse 1.5s ease-in-out infinite",
                            }}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : !data || data.length === 0 ? (
                  // Empty state
                  <TableRow>
                    <TableCell
                      colSpan={
                        config.columns.length + (config.actions?.length || 0)
                      }
                    >
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <Box sx={{ mb: 3 }}>
                          <img
                            src="/Asset/hand-drawn-no-data-concept_52683-127823-removebg-preview.png"
                            alt="No data found"
                            style={{
                              width: "200px",
                              height: "auto",
                              maxWidth: "100%",
                              opacity: 0.7,
                            }}
                          />
                        </Box>
                        {config.emptyState ? (
                          <>
                            {config.emptyState.title && (
                              <Typography variant="h6" sx={{ mb: 1 }}>
                                {config.emptyState.title}
                              </Typography>
                            )}
                            {config.emptyState.description && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                              >
                                {config.emptyState.description}
                              </Typography>
                            )}
                            {config.emptyState.action?.onClick && (
                              <DynamicButton
                                variant="primary"
                                onClick={config.emptyState.action.onClick}
                              >
                                {config.emptyState.action.label || "Action"}
                              </DynamicButton>
                            )}
                          </>
                        ) : (
                          <Typography variant="body1" color="text.secondary">
                            No data available
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Data rows
                  data
                    .filter((row) => row) // skip null/undefined rows
                    .map((row, index) => (
                      <TableRow key={index} hover>
                        {config.columns.map((column) => {
                          const cellValue =
                            row && typeof row === "object" && column.key in row
                              ? (row as any)[column.key]
                              : "-";

                          return (
                            <TableCell
                              key={column.key}
                              align={column.align || "left"}
                              sx={{ width: column.width }}
                            >
                              {renderCellContent(column, cellValue, row, index)}
                            </TableCell>
                          );
                        })}
                        {config.actions && config.actions?.length > 0 && (
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleRowMenuOpen(e, row)}
                              sx={{
                                color: "text.secondary",
                                "&:hover": {
                                  backgroundColor: "action.hover",
                                  color: "text.primary",
                                  fontSize: "0.875rem",
                                },
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={rowMenuAnchor}
        open={Boolean(rowMenuAnchor)}
        onClose={handleRowMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {config.actions?.map((action) => {
          const safeData = data ?? [];
          const shouldShow = action.show
            ? action.show(selectedRow!, safeData.indexOf(selectedRow!))
            : true;
          if (!shouldShow) return null;

          return (
            <MenuItem
              key={action.key}
              onClick={() => handleActionClick(action)}
              sx={{ color: action.color ? `${action.color}.main` : "inherit" }}
            >
              <ListItemIcon
                sx={{
                  color: action.color ? `${action.color}.main` : "inherit",
                }}
              >
                {action.icon}
              </ListItemIcon>
              <ListItemText>{action.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>

      {/* Filter Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 600,
            p: 2,
          },
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Advanced Filters
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {config.filters && config.filters.length > 0 ? (
              config.filters.map((filter) => (
                <Box key={filter.key} sx={{ position: "relative" }}>
                  {filter.type === "text" && (
                    <TextField
                      fullWidth
                      label={filter.label}
                      autoComplete="off"
                      size="small"
                      placeholder={
                        filter.placeholder ||
                        `Enter ${filter.label.toLowerCase()}`
                      }
                      value={filterValues[filter.key] || ""}
                      onChange={(e) =>
                        handleFilterValueChange(filter.key, e.target.value)
                      }
                    />
                  )}
                  {filter.type === "select" && (
                    <FormControl fullWidth size="small">
                      <InputLabel>{filter.label}</InputLabel>
                      <Select
                        label={filter.label}
                        value={filterValues[filter.key] || ""}
                        onChange={(e) =>
                          handleFilterValueChange(filter.key, e.target.value)
                        }
                      >
                        <MenuItem value="">All {filter.label}</MenuItem>
                        {filter.options?.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {filter.type === "date" && (
                    <TextField
                      fullWidth
                      label={filter.label}
                      autoComplete="off"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      value={filterValues[filter.key] || ""}
                      onChange={(e) =>
                        handleFilterValueChange(filter.key, e.target.value)
                      }
                    />
                  )}
                  {filter.type === "number" && (
                    <TextField
                      fullWidth
                      label={filter.label}
                      autoComplete="off"
                      type="number"
                      size="small"
                      placeholder={
                        filter.placeholder ||
                        `Enter ${filter.label.toLowerCase()}`
                      }
                      value={filterValues[filter.key] || ""}
                      onChange={(e) =>
                        handleFilterValueChange(filter.key, e.target.value)
                      }
                    />
                  )}
                  {filterValues[filter.key] && (
                    <IconButton
                      size="small"
                      onClick={() => handleFilterValueChange(filter.key, "")}
                      sx={{
                        position: "absolute",
                        right: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "text.secondary",
                      }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 2 }}
              >
                No filters configured for this listing.
              </Typography>
            )}

            {/* Active Filters Summary */}
            {Object.keys(filterValues).some(
              (key) => filterValues[key] && filterValues[key] !== ""
            ) && (
              <Box
                sx={{
                  mt: 1,
                  p: 1,
                  backgroundColor: "grey.50",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", mb: 1 }}
                >
                  Active Filters:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {config.filters?.map((filter) => {
                    const value = filterValues[filter.key];
                    if (!value || value === "") return null;

                    let displayValue = value;
                    if (filter.type === "select" && filter.options) {
                      const option = filter.options.find(
                        (opt) => opt.value === value
                      );
                      displayValue = option ? option.label : value;
                    }

                    return (
                      <Chip
                        key={filter.key}
                        label={`${filter.label}: ${displayValue}`}
                        size="small"
                        variant="outlined"
                      />
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Filter Actions */}
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <DynamicButton
                variant="outlined"
                size="small"
                onClick={handleClearFilters}
                fullWidth
              >
                Clear All
              </DynamicButton>
              <DynamicButton
                variant="primary"
                size="small"
                onClick={handleApplyFilters}
                fullWidth
                disabled={
                  !Object.keys(filterValues).some(
                    (key) => filterValues[key] && filterValues[key] !== ""
                  )
                }
              >
                Apply Filters
              </DynamicButton>
            </Box>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
}
