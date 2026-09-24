"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import DynamicButton from "@/components/DynamicButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import DynamicListing, {
  ListingConfig,
  ListingColumn,
  ListingAction,
} from "../../components/listing/DynamicListing";
import {
  fetchPermissions,
  savePermission,
  selectPermissions,
  PermissionFilters,
  selectPermissionError,
  selectPermissionIsLoading,
  Permission,
  CreatePermissionData,
} from "../../slice/PermissionSlice";
import AppLayout from "../../components/layout/AppLayout";
import {
  SuccessNotification,
  ConfirmationDialog,
} from "../../components/notifications";
import { SingleSelectDropdown } from "@/components/Dropdown";
import { Button, Box } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { fetchRoleDropdown } from "@/slice/DropdownSlice";
import Loader from "@/components/Loader/loader";

export default function PermissionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const permissions = useSelector(selectPermissions);
  const isLoading = useSelector(selectPermissionIsLoading);
  const error = useSelector(selectPermissionError);
  const { roleDropdown, isLoading: isRolesLoading } = useSelector(
    (state: RootState) => state.dropdown
  );
  const [filters, setFilters] = useState<PermissionFilters>({
    roleId: 0,
  });
  const [formData, setFormData] = useState<CreatePermissionData>({
    roleId: 0,
    permissions: [
      {
        displayOrder: 0,
        icon: "",
        permissionTaskName: "",
        parentId: 0,
        permissionTaskId: 0,
        canView: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        permissionId: 0,
      },
    ],
  });
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [errors, setErrors] = useState<{ roleId?: string }>({});
  // const Dropdownfilters: RoleDropdownFilters = {
  //   isMerchant: undefined,
  // };
  const [successNotification, setSuccessNotification] = useState({
    open: false,
    title: "",
    message: "",
  });
  useEffect(() => {
    // Only dispatch if this is not a pagination-only change
    if (filters.roleId) {
      dispatch(fetchPermissions(filters));
    }
  }, [dispatch, filters.roleId]);
  useEffect(() => {
    if (permissions && permissions.length > 0) {
      setFormData((prev) => ({
        ...prev,
        roleId: filters.roleId ?? 0,
        permissions: permissions,
      }));
    }
  }, [permissions, filters.roleId]);
  const togglePermission = (
    permissionTaskId: number,
    field: keyof Permission
  ) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.map((row) =>
        row.permissionTaskId === permissionTaskId
          ? { ...row, [field]: !row[field] }
          : row
      ),
    }));
  };

  const handleCheckboxChangeCanView = (permissionTaskId: number) =>
    togglePermission(permissionTaskId, "canView");

  const handleCheckboxChangeCanCreate = (permissionTaskId: number) =>
    togglePermission(permissionTaskId, "canCreate");

  const handleCheckboxChangeCanUpdate = (permissionTaskId: number) =>
    togglePermission(permissionTaskId, "canUpdate");

  const handleCheckboxChangeCanDelete = (permissionTaskId: number) =>
    togglePermission(permissionTaskId, "canDelete");

  const handleUpdateSuccess = (message: string) => {
    setSuccessNotification({
      open: true,
      title: "Success!",
      message: message,
    });
    // Refresh the role list
    dispatch(fetchPermissions(filters));
  };

  useEffect(() => {
    dispatch(fetchRoleDropdown());
  }, [dispatch]);
  const handleSave = async (): Promise<void> => {
    let newErrors: { roleId?: string } = {};
    if (!formData.roleId) {
      newErrors.roleId = "Role is required";
    }

    setErrors(newErrors);

    try {
      const requestBody: CreatePermissionData = {
        roleId: formData.roleId,
        permissions: formData.permissions,
      };
      try {
        if (Object.keys(newErrors).length === 0) {
          await dispatch(savePermission(requestBody)).unwrap();
          handleUpdateSuccess(`Permission has been updated successfully!`);
        }
      } catch (error: any) {
        console.error("Error creating role:", error);
        // You can add error handling here
      }
    } catch (error) {
      console.error("Failed to save permission:", error);
    }
  };

  const toggle = (id: number) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const handleRoleChange = (roleId: string | number | null) => {
    const numericId = roleId ? Number(roleId) : 0;
    setErrors({});
    setFilters((prev) => ({
      ...prev,
      roleId: numericId,
    }));
    setFormData((prev) => ({
      ...prev,
      roleId: numericId,
    }));
  };
  const handleCloseSuccessNotification = () => {
    setSuccessNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };
  const columns: ListingColumn<Permission>[] = [
    {
      key: "permissionTaskName",
      label: "Permission Name",
      sortable: true,
      render: (value, row) => {
        const hasChildren = formData.permissions.some(
          (child) => child?.parentId === row?.permissionTaskId
        );
        const isTopLevel = row?.parentId === 0;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "1px" }}>
            <span style={{ fontWeight: 500 }}>{row.permissionTaskName}</span>
            {isTopLevel && hasChildren && (
              <IconButton
                onClick={() => toggle(row.permissionTaskId)}
                size="small"
                color="primary"
                sx={{
                  fontSize: "0.575rem",
                  padding: "1px",
                  marginLeft: "6px", // spacing before text
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  "&:hover": {
                    backgroundColor: "#e0e0e0",
                  },
                }}
              >
                {collapsed[row.permissionTaskId] ? (
                  <KeyboardArrowDown fontSize="small" />
                ) : (
                  <KeyboardArrowUp fontSize="small" />
                )}
              </IconButton>
            )}
          </div>
        );
      },
    },
    {
      key: "canView",

      label: "View",
      sortable: false,
      render: (value, row) => {
        const hasChildren = formData.permissions.some(
          (child) => child?.parentId === row?.permissionTaskId
        );
        return (
          <>
            {!hasChildren && (
              <input
                type="checkbox"
                style={{ marginLeft: "20px" }}
                checked={row.canView}
                onChange={() =>
                  handleCheckboxChangeCanView(row.permissionTaskId)
                }
              />
            )}
          </>
        );
      },
    },
    {
      key: "canCreate",
      label: "Create",
      sortable: false,
      render: (value, row) => {
        const hasChildren = formData.permissions.some(
          (child) => child?.parentId === row?.permissionTaskId
        );
        return (
          <>
            {!hasChildren && (
              <input
                type="checkbox"
                style={{ marginLeft: "20px" }}
                checked={row.canCreate}
                onChange={() =>
                  handleCheckboxChangeCanCreate(row.permissionTaskId)
                }
              />
            )}
          </>
        );
      },
    },
    {
      key: "canUpdate",
      label: "Update",
      sortable: false,
      render: (value, row) => {
        const hasChildren = formData.permissions.some(
          (child) => child?.parentId === row?.permissionTaskId
        );
        return (
          <>
            {!hasChildren && (
              <input
                type="checkbox"
                style={{ marginLeft: "20px" }}
                checked={row.canUpdate}
                onChange={() =>
                  handleCheckboxChangeCanUpdate(row.permissionTaskId)
                }
              />
            )}
          </>
        );
      },
    },
    {
      key: "canDelete",
      label: "Delete",
      sortable: false,
      render: (value, row) => {
        const hasChildren = formData.permissions.some(
          (child) => child?.parentId === row?.permissionTaskId
        );
        return (
          <>
            {!hasChildren && (
              <input
                type="checkbox"
                style={{ marginLeft: "20px" }}
                checked={row.canDelete}
                onChange={() =>
                  handleCheckboxChangeCanDelete(row.permissionTaskId)
                }
              />
            )}
          </>
        );
      },
    },
  ];
  const orderedPermissions = [...formData.permissions];
  const renderRows = (
    parentId: number = 0,
    level = 0,
    visited: Set<number> = new Set()
  ): React.ReactNode => {
    // prevent cycles
    if (visited.has(parentId)) {
      console.warn("Circular reference detected for parentId:", parentId);
      return null;
    }
    visited.add(parentId);

    return filters.roleId ? (
      orderedPermissions
        .filter((item) => {
          // Handle top-level items: parentId === 0 OR parentId === null
          if (parentId === 0) {
            return item?.parentId === 0 || item?.parentId === null;
          }
          // Handle child items: exact match
          return item?.parentId === parentId;
        })
        .map((row) => (
          <React.Fragment key={row.permissionTaskId}>
            <TableRow
              sx={{ bgcolor: row.parentId ? "action.selected" : "#fff" }}
            >
              {columns.map((col, index) => (
                <TableCell
                  key={col.key as string}
                  sx={{
                    pl: col.key === "permissionTaskName" ? level * 4 : 0, // MUI spacing units
                    fontWeight: 600,
                  }}
                >
                  {col.render
                    ? col.render(
                        (row as any)[col.key as keyof Permission],
                        row,
                        index
                      )
                    : (row as any)[col.key as keyof Permission]}
                </TableCell>
              ))}
            </TableRow>

            {!collapsed[row.permissionTaskId] &&
              renderRows(row.permissionTaskId, level + 1, new Set(visited))}
          </React.Fragment>
        ))
    ) : (
      <TableRow>
        <TableCell colSpan={columns.length} align="center">
          Please select a role first.
        </TableCell>
      </TableRow>
    );
  };

  const listingConfig: ListingConfig<Permission> = {
    title: "Permission",
    description: "Manage system permission for each role",
    columns,
    searchable: false,
    showFilter: false, // No filters for roles
    emptyState: {
      title: "No Roles Found",
      description: filters.roleId
        ? "Please select a role first."
        : "Please select a role first.",
    },
  };

  return (
    <AppLayout>
      {(isLoading || isRolesLoading) && <Loader />}
      <Box>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            marginBottom: "2rem",
            textAlign: "left",
          }}
        >
          Permissions
        </h1>
      </Box>
      <div>
        <Box sx={{ maxWidth: "20%" }}>
          {" "}
          {/* 👈 fixed width */}
          <SingleSelectDropdown
            label="Select Role"
            size="medium"
            options={roleDropdown.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
            onChange={handleRoleChange}
            value={formData.roleId}
            disabled={isLoading}
            required
            emptyOption
            emptyOptionLabel="Select Role"
            error={!!errors.roleId} // 👈 validation error
            helperText={errors.roleId || ""}
          />
        </Box>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ p: 2, mt: 2 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((col) => (
                  <TableCell key={col.key as string}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{renderRows()}</TableBody>
          </Table>
        </TableContainer>
      </div>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <DynamicButton
          variant="primary"
          size="medium"
          onClick={handleSave}
          disabled={isRolesLoading || !filters.roleId} 
          loadingText="Saving..."
        >
          Save
        </DynamicButton>
      </Box>
      {/* Success Notification */}
      <SuccessNotification
        open={successNotification.open}
        onClose={handleCloseSuccessNotification}
        title={successNotification.title}
        message={successNotification.message}
      />
    </AppLayout>
  );
}
