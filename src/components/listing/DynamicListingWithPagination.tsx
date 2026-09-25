"use client";

import React, { useState, useEffect, useRef } from "react";
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
  SxProps,
  Theme,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
  Pagination,
  FormControl,
  Select,
  SelectChangeEvent,
  MenuItem as SelectMenuItem,
  useTheme,
  useMediaQuery,
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
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  NavigateNext as NextPageIcon,
  NavigateBefore as PrevPageIcon,
  Clear as ClearIcon,
  Search,
} from "@mui/icons-material";
import DynamicButton from "../DynamicButton";
import { SingleSelectDropdown } from "../Dropdown";

// Types for the dynamic listing with pagination
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

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  pageSizeOptions?: number[];
  showFirstLastButtons?: boolean;
  showPageSizeSelector?: boolean;
  showTotalCount?: boolean;
  showPageInfo?: boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export interface ListingConfig<T = any> {
  title: string;
  description?: string;
  columns: ListingColumn<T>[];
  actions?: ListingAction<T>[];
  extraFilter?: boolean;
  exportReport?: boolean;
  reportButtonAcion?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
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
  refreshableIcon?: boolean;
  filters?: FilterConfig[];
  externalFilter?: boolean;
  firstoption?: boolean;
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
  pagination?: PaginationConfig;
}

export interface DynamicListingWithPaginationProps<T = any> {
  config: ListingConfig<T>;
  data: T[];
  loading?: boolean;
  showPagination?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onDropDownChange?: (value: string, key: string) => void;
  onSearch?: (query: string) => void;
  onSearchInputChange?: (query: string) => void;
  onSearchButtonClick?: (query: string) => void;
  onFilter?: (filters: Record<string, any>) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  handleRowClick?: (row: T, index: number) => void;
  className?: string;
  initialFilters?: Record<string, any>;
  initialSearchValue?: string;
  styles?: {
    Title?: SxProps;
    Filters?: SxProps;
    TextField?: SxProps;
    RefreshIcon?: SxProps;
    FilterContainer?: SxProps;
    FilterWrapper?: SxProps;
    ExternalFIlterButtonContainer?: SxProps;
    
  };
}

export default function DynamicListingWithPagination<T = any>({
  config,
  data,
  loading = false,
  error = null,
  onRefresh,
  onSearch,
  onSearchInputChange,
  onSearchButtonClick,
  onFilter,
  onPageChange,
  showPagination = true,
  onDropDownChange,
  onPageSizeChange,
  handleRowClick,
  className,
  styles,
  initialFilters = {},
  initialSearchValue = "",
}: DynamicListingWithPaginationProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const [searchQuery, setSearchQuery] = useState(initialSearchValue);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [rowMenuAnchor, setRowMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<T | null>(null);

  // Filter state to collect values before applying, initialized with initialFilters
  const [filterValues, setFilterValues] =
    useState<Record<string, any>>(initialFilters);

  // Ref to track if initial filters have been applied
  const initialFiltersApplied = useRef(false);

  // Sync searchQuery with initialSearchValue prop
  useEffect(() => {
    setSearchQuery(initialSearchValue);
  }, [initialSearchValue]);

  // Handle search input change (local state only)
  const handleSearchInputChange = (query: string) => {
    setSearchQuery(query);
    onSearchInputChange?.(query);
  };

  // Handle search button click
  const handleSearchButtonClick = (
    e?:
      | React.MouseEvent<HTMLButtonElement>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Call the optional onSearchButtonClick prop
    onSearchButtonClick?.(searchQuery);
  };

  // Handle search (legacy support)
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
    if (selectedRow) {
      action.onClick(selectedRow, data.indexOf(selectedRow));
    }
    handleRowMenuClose();
  };

  // Handle pagination
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    onPageChange?.(page);
  };

  const handlePageSizeChange = (event: SelectChangeEvent<number>) => {
    const newPageSize = Number(event.target.value);
    onPageSizeChange?.(newPageSize);
  };

  // Handle initial filters changes - only run once on mount
  useEffect(() => {
    if (
      Object.keys(initialFilters).length > 0 &&
      !initialFiltersApplied.current
    ) {
      setFilterValues(initialFilters);
      // Only apply initial filters once on mount
      if (onFilter) {
        onFilter(initialFilters);
        initialFiltersApplied.current = true;
      }
    }
  }, [initialFilters]); // Empty dependency array - only run once on mount

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
            sx={{ fontWeight: column.key === "name" ? 500 : 400 }}
          >
            {value}
          </Typography>
        );
    }
  };

  // Custom pagination component for better mobile experience
  const renderPagination = () => {
    if (!config.pagination || !showPagination) return null;

    const {
      currentPage,
      totalPages,
      totalCount,
      pageSize,
      pageSizeOptions = [10, 25, 50, 100],
      showFirstLastButtons = true,
      showPageSizeSelector = true,
      showTotalCount = true,
      showPageInfo = true,
    } = config.pagination;

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mt: 3,
          p: 2,
          backgroundColor: "background.paper",
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Left side - Page size selector and total count */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            gap: 2,
            order: isMobile ? 2 : 1,
          }}
        >
          {showPageSizeSelector && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Show:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 80 }}>
                <Select
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  sx={{ height: 36 }}
                >
                  {pageSizeOptions.map((size) => (
                    <SelectMenuItem key={size} value={size}>
                      {size}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {showTotalCount && (
            <Typography variant="body2" color="text.secondary">
              Total: {totalCount.toLocaleString()} items
            </Typography>
          )}
        </Box>

        {/* Center - Pagination controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            order: isMobile ? 1 : 2,
          }}
        >
          {showFirstLastButtons && !isMobile && (
            <IconButton
              onClick={() => onPageChange?.(1)}
              disabled={currentPage === 1}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <FirstPageIcon />
            </IconButton>
          )}
          {!isMobile && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              size="small"
              showFirstButton={false}
              showLastButton={false}
              sx={{
                "& .MuiPaginationItem-root": {
                  minWidth: 36,
                  height: 36,
                  fontSize: "0.875rem",
                },
              }}
            />
          )}

          {showFirstLastButtons && !isMobile && (
            <IconButton
              onClick={() => onPageChange?.(totalPages)}
              disabled={currentPage === totalPages}
              size="small"
              sx={{ color: "text.secondary" }}
            >
              <LastPageIcon />
            </IconButton>
          )}
        </Box>

        {/* Right side - Page info */}
        {showPageInfo && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              order: 3,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Page {currentPage} of {totalPages}
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box className={className}>
      {/* Page Header */}
      <Box sx={{ mb: 4, ...(styles?.Title || {}) }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
            }}
          >
            {config.title}
            {(config.externalFilter || config.refreshableIcon) &&
              config.refreshable &&
              onRefresh && (
                <RefreshIcon
                  onClick={() => onRefresh()}
                  fontSize="inherit" // match text size
                  sx={{
                    ...(styles?.RefreshIcon || {}),
                  }}
                />
              )}
          </Typography>
          <Box>
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
            {config.reportButtonAcion && (
              <DynamicButton
                variant="primary"
                startIcon={config.reportButtonAcion.icon}
                onClick={config.reportButtonAcion.onClick}
                size="medium"
              >
                {config.reportButtonAcion.label}
              </DynamicButton>
            )}
          </Box>
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
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
              ? "repeat(auto-fit, minmax(180px, 1fr))"
              : "repeat(auto-fit, minmax(200px, 1fr))",
            mb: config.externalFilter ? 4 : 0,
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
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
              alignItems: "center",
              width: isMobile ? "100%" : "auto",
            }}
          >
            {config.filterable &&
              config.showFilter &&
              !config.externalFilter && (
                <DynamicButton
                  variant="outlined"
                  startIcon={<FilterIcon />}
                  size="small"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  fullWidth={isMobile}
                >
                  Filters
                </DynamicButton>
              )}
            {!config.externalFilter &&
              !config.refreshableIcon &&
              config.refreshable &&
              onRefresh && (
                <DynamicButton
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  size="small"
                  onClick={onRefresh}
                  disabled={loading}
                  fullWidth={isMobile}
                >
                  Refresh
                </DynamicButton>
              )}
          </Box>

          {config.secondaryActions && config.secondaryActions.length > 0 && (
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: 1,
                width: isMobile ? "100%" : "auto",
              }}
            >
              {config.secondaryActions.map((action, index) => (
                <DynamicButton
                  key={index}
                  variant="outlined"
                  startIcon={action.icon}
                  size="small"
                  onClick={action.onClick}
                  fullWidth={isMobile}
                >
                  {action.label}
                </DynamicButton>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Search Bar */}
      {config.searchable && (
        <Box sx={{ mb: 3 }}>
          <Paper
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: isMobile ? "100%" : 400,
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
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearchButtonClick(
                    e as React.KeyboardEvent<HTMLInputElement>
                  );
                }
              }}
              inputProps={{
                "aria-label": `search ${config.title.toLowerCase()}`,
              }}
            />
            <IconButton
              sx={{
                p: "10px",
                color: "text.secondary",
                "&:hover": { color: "text.primary" },
              }}
              aria-label="search"
              onClick={handleSearchButtonClick}
            >
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      )}
      {config.externalFilter && (
        // 1. Main Container: Set for row layout with wrapping
        <Box
          sx={{
            ...(styles?.FilterContainer || {}),
          }}
        >
          {/* Filters List */}
          {config.externalFilter &&
          config.filters &&
          config.filters.length > 0 ? (
            config.filters.map((filter) => (
              // 2. Individual Filter Wrapper: Sets responsive width based on screen size
              <>
                {/* Combined Text/Number/Date Field Logic (Unchanged) */}
                {(filter.type === "text" ||
                  filter.type === "date" ||
                  filter.type === "number") && (
                  <Box sx={{ width: "100%", ...(styles?.FilterWrapper || {}) }}>
                    <TextField
                      fullWidth
                      label={filter.label}
                      type={
                        filter.type === "date"
                          ? "date"
                          : filter.type === "number"
                          ? "number"
                          : "text"
                      }
                      size="small"
                      placeholder={
                        filter.placeholder ||
                        `Enter ${filter.label.toLowerCase()}`
                      }
                      InputLabelProps={
                        filter.type === "date" ? { shrink: true } : undefined
                      }
                      value={filterValues[filter.key] || ""}
                      autoComplete="off"
                      onChange={(e) =>
                        handleFilterValueChange(filter.key, e.target.value)
                      }
                      sx={{
                        ...(styles?.TextField || {}),
                      }}
                    />
                  </Box>
                )}

                {/* Select Filter Logic with Searchable Dropdown */}
                {filter.type === "select" && (
                  <SingleSelectDropdown
                    options={[
                      { value: "", label: `Select ${filter.label}` },
                      ...(filter.options || []),
                    ]}
                    value={filterValues[filter.key] || ""}
                    onChange={(value) =>
                      handleFilterValueChange(filter.key, value)
                    }
                    label={filter.label}
                    placeholder={`Select ${filter.label}`}
                    size="small"
                    fullWidth
                    searchable={filter.searchable !== false}
                    searchPlaceholder={
                      filter.searchPlaceholder ||
                      `Search ${filter.label.toLowerCase()}...`
                    }
                    emptyOption={false}
                    maxHeight={200}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                )}
              </>
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 2, width: "100%" }}
            >
              No filters configured for this listing.
            </Typography>
          )}
          {/* Apply Button */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: "100px",
              ...(styles?.ExternalFIlterButtonContainer || {}),
            }}
          >
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
              sx={{ minWidth: "auto", px: 1, py: 0 }}
            >
              <SearchIcon />
            </DynamicButton>
            <DynamicButton
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              fullWidth
              disabled={loading}
              sx={{ minWidth: "auto", px: 1, py: 0 }}
            >
              <ClearIcon />
            </DynamicButton>
          </Box>
        </Box>
      )}
      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Data Table */}
      {!error && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <TableContainer
              component={Paper}
              variant="outlined"
              sx={{
                border: "none",
                overflowX: "auto", // Enable horizontal scroll on small screens
              }}
            >
              <Table sx={{ minWidth: isMobile ? 600 : "auto" }}>
                <TableHead>
                  <TableRow>
                    {config.columns.map((column) => (
                      <TableCell
                        key={column.key}
                        align={column.align || "left"}
                        sx={{
                          width: column.width,
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          backgroundColor: "grey.50",
                          whiteSpace: "nowrap", // Prevent text wrapping in headers
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    {config.actions && config.actions.length > 0 && (
                      <TableCell
                        align="right"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: "grey.50",
                          fontSize: "0.875rem",
                        }}
                      >
                        Actions
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    // Skeleton rows for loading state
                    Array.from({
                      length: config.pagination?.pageSize || 10,
                    }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`}>
                        {config.columns.map((column) => (
                          <TableCell
                            key={column.key}
                            align={column.align || "left"}
                            sx={{
                              width: column.width,

                              whiteSpace: "nowrap",
                            }}
                          >
                            <Box
                              sx={{
                                height: 20,
                                backgroundColor: "grey.200",

                                borderRadius: 1,
                                animation: "pulse 1.5s ease-in-out infinite",
                                "@keyframes pulse": {
                                  "0%": {
                                    opacity: 1,
                                  },
                                  "50%": {
                                    opacity: 0.4,
                                  },
                                  "100%": {
                                    opacity: 1,
                                  },
                                },
                              }}
                            />
                          </TableCell>
                        ))}
                        {config.actions && config.actions.length > 0 && (
                          <TableCell align="right">
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                backgroundColor: "grey.200",
                                borderRadius: 1,
                                animation: "pulse 1.5s ease-in-out infinite",
                                "@keyframes pulse": {
                                  "0%": {
                                    opacity: 1,
                                  },
                                  "50%": {
                                    opacity: 0.4,
                                  },
                                  "100%": {
                                    opacity: 1,
                                  },
                                },
                              }}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : data?.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          config.columns.length + (config.actions ? 1 : 0)
                        }
                      >
                        <Box sx={{ textAlign: "center", py: 6 }}>
                          {/* No Data Image */}
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
                              <Typography
                                variant="h6"
                                sx={{ mb: 1, color: "text.secondary" }}
                              >
                                {config.emptyState.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                              >
                                {config.emptyState.description}
                              </Typography>
                              {config.emptyState.action && (
                                <DynamicButton
                                  variant="primary"
                                  onClick={config.emptyState.action.onClick}
                                >
                                  {config.emptyState.action.label}
                                </DynamicButton>
                              )}
                            </>
                          ) : (
                            <>
                              <Typography
                                variant="h6"
                                sx={{ mb: 1, color: "text.secondary" }}
                              >
                                No data found
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                There are no items to display at the moment.
                              </Typography>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data?.map((row, index) => (
                      <TableRow
                        key={index}
                        hover
                        onClick={() => handleRowClick?.(row, index)}
                      >
                        {config.columns.map((column) => (
                          <TableCell
                            key={column.key}
                            align={column.align || "left"}
                            sx={{
                              width: column.width,
                              fontSize: "0.875rem",
                              whiteSpace: "nowrap", // Prevent text wrapping in cells
                            }}
                          >
                            {renderCellContent(
                              column,
                              row && column?.key
                                ? (row as any)[column.key]
                                : null,
                              row,
                              index
                            )}
                          </TableCell>
                        ))}
                        {config.actions && config.actions.length > 0 && (
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={(e) => handleRowMenuOpen(e, row)}
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.875rem",
                                "&:hover": {
                                  backgroundColor: "action.hover",
                                  color: "text.primary",
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
      )}

      {/* Pagination */}
      {renderPagination()}

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
          const shouldShow = action.show
            ? action.show(selectedRow!, data.indexOf(selectedRow!))
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
            {config.filters &&
            !config.externalFilter &&
            config.filters.length > 0 ? (
              config.filters.map((filter) => (
                <Box key={filter.key} sx={{ position: "relative" }}>
                  {filter.type === "text" && (
                    <TextField
                      fullWidth
                      label={filter.label}
                      size="small"
                      autoComplete="off"
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
                    <SingleSelectDropdown
                      options={[
                        { value: "", label: `${filter.label}` },
                        ...(filter.options || []),
                      ]}
                      value={filterValues[filter.key] || ""}
                      onChange={(value) =>
                        handleFilterValueChange(filter.key, value)
                      }
                      label={filter.label}
                      placeholder={`Select ${filter.label}`}
                      size="small"
                      fullWidth
                      searchable={filter.searchable !== false}
                      searchPlaceholder={
                        filter.searchPlaceholder ||
                        `Search ${filter.label.toLowerCase()}...`
                      }
                      emptyOption={false}
                      maxHeight={200}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "0.875rem",
                        },
                      }}
                    />
                  )}
                  {filter.type === "date" && (
                    <TextField
                      fullWidth
                      label={filter.label}
                      type="date"
                      size="small"
                      autoComplete="off"
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
                      type="number"
                      size="small"
                      autoComplete="off"
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

