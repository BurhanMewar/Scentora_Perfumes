"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchRoles,
  fetchRoleById,
  createRole,
  updateRole,
  deleteRole,
  selectRoles,
  selectRolesIsLoading,
  selectRoleError,
  Role,
} from "../../slice/RoleSlice";
import DynamicListing, {
  ListingConfig,
  ListingColumn,
  ListingAction,
} from "../../components/listing/DynamicListing";
import AppLayout from "../../components/layout/AppLayout";
import { CreateRoleModal } from "./CreateRole";
import { RoleDetailModal } from "./ViewEditRole";
import {
  SuccessNotification,
  ConfirmationDialog,
  ErrorNotification,
} from "../../components/notifications";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Security as SecurityIcon,
  AdminPanelSettings as MasterRoleIcon,
  Business as MerchantIcon,
  Person as UserIcon,
} from "@mui/icons-material";
import Loader from "@/components/Loader/loader";
export default function RolePage() {
  const dispatch = useDispatch<AppDispatch>();
  const roles = useSelector(selectRoles);
  const isLoading = useSelector(selectRolesIsLoading);
  const error = useSelector(selectRoleError);
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const isListingLoading = useSelector((state: RootState) => state.role.isListingLoading);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [detailModalMode, setDetailModalMode] = useState<"view" | "edit">(
    "view"
  );
  const [errorNotification, setErrorNotification] = useState({
      open: false,
      title: "",
      message: "",
    });
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    role: null as Role | null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successNotification, setSuccessNotification] = useState({
    open: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    // TODO: Implement search functionality
  };

  const handleRefresh = () => {
    dispatch(fetchRoles());
  };

  const handleEditRole = async (role: Role) => {
    try {
      // Fetch complete role details by ID
      await dispatch(fetchRoleById(role.id.toString()));
      setDetailModalOpen(true);
      setSelectedRole(role);
      setDetailModalMode("edit");
    } catch (error) {
      console.error("Error fetching role details:", error);
      setErrorNotification({
        open: true,
        title: "Error!",
        message: `${error || "Failed to fetch role details. Please try again."}`,
      });
    }
  };

  const handleDeleteRole = (role: Role) => {
    setDeleteConfirmation({
      open: true,
      role,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.role) return;

    setDeleteLoading(true);
    try {
      handleCloseDeleteConfirmation();
      await dispatch(
        deleteRole(deleteConfirmation.role.id.toString())
      ).unwrap();
      setSuccessNotification({
        open: true,
        title: "Success!",
        message: `Role "${deleteConfirmation.role?.rolename}" has been deleted successfully!`,
      });
      
    } catch (error: any) {
      console.error("Error deleting role:", error);
      setErrorNotification({
        open: true,
        title: "Error!",
        message: error || "Failed to delete role. Please try again.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmation({
      open: false,
      role: null,
    });
  };

  const handleAddRole = () => {
    setCreateModalOpen(true);
  };

  const handleCreateSuccess = (message: string) => {
    setSuccessNotification({
      open: true,
      title: "Success!",
      message: message,
    });
    // Refresh the role list
    dispatch(fetchRoles());
  };
   const handleFailed = (message: string) => {
    setErrorNotification({
      open: true,
      title: "Error!",
      message: message,
    });
  };

  const handleUpdateSuccess = (message: string) => {
    setSuccessNotification({
      open: true,
      title: "Success!",
      message: message,
    });
    // Refresh the role list
    dispatch(fetchRoles());
  };

  const handleCloseSuccessNotification = () => {
    setSuccessNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };
const handleCloseErrorNotification = () => {
    setErrorNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };
  // Filter roles based on search query
 const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Define columns for the role listing
  const columns: ListingColumn<Role>[] = [
    {
      key: "rolename",
      label: "Role Name",
      sortable: true,
      render: (value) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontWeight: 500 }}>{value || "-"}</span>
        </div>
      ),
    },
    {
      key: "createddate",
      label: "Created Date",
      sortable: true,
      render: (value) => {
        return (
          <span style={{ fontSize: "0.875rem" }}>
            {formatDate(value)}
          </span>
        );
      },
    },
  ];

  // Define actions for each role
  const actions: ListingAction<Role>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditIcon />,
      onClick: handleEditRole,
      color: "primary",
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteIcon />,
      onClick: handleDeleteRole,
      color: "error",
    },
  ];

  // Configuration for the dynamic listing
  const listingConfig: ListingConfig<Role> = {
    title: "Role",
    fillAvailableHeight: true,
    columns,
    actions,
    primaryAction: {
      label: "Add Role",
      icon: <AddIcon />,
      onClick: handleAddRole,
    },
    emptyState: {
      title: "No Roles Found",
      description:
        "There are no roles in the system yet. Create your first role to get started.",
      action: {
        label: "Create Role",
        onClick: handleAddRole,
      },
    },
  };
  return (
    <AppLayout>
      {isLoading && <Loader />}
      <DynamicListing
        config={listingConfig}
        data={roles}
        loading={isListingLoading}
        error={error}
        onRefresh={handleRefresh}
        onSearch={handleSearch}
      />

      {/* Create Role Modal */}
      <CreateRoleModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        OnFailure={handleFailed}
      />

      {/* Role Detail Modal */}
      <RoleDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        role={selectedRole}
        mode={detailModalMode}
        onSuccess={handleUpdateSuccess}
        OnFailure={handleFailed}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmation.open}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        message={`Are you sure you want to delete the role "${deleteConfirmation.role?.rolename}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        type="danger"
      />
   <ErrorNotification
          open={errorNotification.open}
          onClose={handleCloseErrorNotification}
          title={errorNotification.title}
          message={errorNotification.message}
          duration={6000}
        />
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

