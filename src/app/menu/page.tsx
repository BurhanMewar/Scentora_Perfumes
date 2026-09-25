"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchPermissionTasks,
  selectPermissionTasks,
  fetchPermissionTaskById,
  selectPermissionTasksIsLoading,
  selectPermissionTaskError,
  deletePermissionTask,
} from "../../slice/PermissionTaskSlice";
import { PermissionTask } from "../../slice/PermissionTaskSlice";
import DynamicListing, {
  ListingConfig,
  ListingColumn,
  ListingAction,
} from "../../components/listing/DynamicListing";
import AppLayout from "../../components/layout/AppLayout";
import PermissionTaskDetailModal from "./ViewEditMenu/MenuDetail";
import {
  SuccessNotification,
  ErrorNotification,
} from "../../components/notifications";
import CreatePermissionTaskModal from "./CreateMenu/CreateMenu";
import ConfirmationDialog from "../../components/notifications/ConfirmationDialog";
import {
  PersonAdd as PersonAddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from "@mui/icons-material";
import Loader from "@/components/Loader/loader";

export default function PermissionTaskPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [errorNotification, setErrorNotification] = useState({
    open: false,
    title: "",
    message: "",
  });
  const isListingLoading = useSelector((state: RootState) => state.permissionTask.isListingLoading);
  const permissionTasks = useSelector(selectPermissionTasks);
  const isLoading = useSelector(selectPermissionTasksIsLoading);
  const [searchQuery, setSearchQuery] = useState("");
  const error = useSelector(selectPermissionTaskError);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    permissionTasks: null as PermissionTask | null,
  });
  const [selectedPermissionTask, setSelectedPermissionTask] =
    useState<PermissionTask | null>(null);
  const [detailModalMode, setDetailModalMode] = useState<"view" | "edit">(
    "view"
  );
  const [successNotification, setSuccessNotification] = useState({
    open: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    dispatch(fetchPermissionTasks());
  }, [dispatch]);
  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    // TODO: Implement search functionality
  };
  const handleRefresh = () => {
    dispatch(fetchPermissionTasks());
  };

  const handleAddPermissionTask = () => {
    setCreateModalOpen(true);
  };

  const handleCreateSuccess = (message: string) => {
    setSuccessNotification({
      open: true,
      title: "Success!",
      message: message,
    });
    // Refresh the permissionTask list
    dispatch(fetchPermissionTasks());
  };

  const handleUpdateSuccess = (message: string) => {
    setSuccessNotification({
      open: true,
      title: "Success!",
      message: message,
    });
    // Refresh the permissionTask list
    dispatch(fetchPermissionTasks());
  };

  const handleCloseSuccessNotification = () => {
    setSuccessNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const handleViewPermissionTask = async (permissionTask: PermissionTask) => {
    try {
      // Fetch complete user details by ID
      await dispatch(
        fetchPermissionTaskById(permissionTask?.id.toString())
      ).unwrap();

      setSelectedPermissionTask(permissionTask);
      setDetailModalMode("view");
      setDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching menu details:", error);
      setErrorNotification({
        open: true,
        title: "Error!",
        message: `${error || "Failed to fetch menu details. Please try again."}`,
      });
    }
  };
  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.permissionTasks) return;

    setDeleteLoading(true);
    try {
      handleCloseDeleteConfirmation();
      await dispatch(
        deletePermissionTask(deleteConfirmation.permissionTasks?.id)
      ).unwrap();
      setSuccessNotification({
        open: true,
        title: "Success!",
        message: `Menu "${deleteConfirmation.permissionTasks?.id}" has been deleted successfully!`,
      });
      
    } catch (error: any) {
      console.error("Error deleting menu:", error);
      setErrorNotification({
        open: true,
        title: "Error!",
        message: error || "Failed to delete menu. Please try again.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmation({
      open: false,
      permissionTasks: null,
    });
  };
  const handleEditPermissionTask = async (permissionTask: PermissionTask) => {
    try {
      // Fetch complete user details by ID
      await dispatch(
        fetchPermissionTaskById(permissionTask?.id.toString())
      ).unwrap();

      setSelectedPermissionTask(permissionTask);
      setDetailModalMode("edit");
      setDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching menu details:", error);
      setErrorNotification({
        open: true,
        title: "Error!",
        message: `${ error ||  "Failed to fetch menu details. Please try again."}`,
      });
    }
  };

  const handleDeletePermissionTask = (permissionTask: PermissionTask) => {
    console.log("Delete menu:", permissionTask);
    setDeleteConfirmation({
      open: true,
      permissionTasks: permissionTask,
    });
    // TODO: Implement delete permissionTask functionality
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  useEffect(() => {
    if (permissionTasks) {
      console.log("Menu data:", permissionTasks);
    }
  });
  const columns: ListingColumn<PermissionTask>[] = [
    {
      key: "permissiontaskname",

      label: "Menu",
      type: "text",
      render: (value, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              backgroundColor: "#1976d2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {value?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 500, fontSize: "14px" }}>{value}</div>
          </div>
        </div>
      ),
    },
    {
      key: "parentPermissionTaskName",
      label: "Parent Menu",
      type: "text",
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: "14px" }}>
            {value || "-"}
          </div>
        </div>
      ),
    },
    {
      key: "path",

      label: "Path",
      type: "text",
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: "14px" }}>{value}</div>
        </div>
      ),
    },
    {
      key: "displayorder",

      label: "Display Order",
      type: "text",
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: "14px" }}>{value}</div>
        </div>
      ),
    },
    {
      key: "icon",

      label: "Icon",
      type: "text",
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: "14px" }}>{value}</div>
        </div>
      ),
    },
    {
      key: "createddate",

      label: "Created Date",
      type: "chip",
      render: (value, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: "14px", width: "100%" }}>
              {formatDate(value)}
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Define actions for each row
  const actions: ListingAction<PermissionTask>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditIcon />,
      color: "primary",
      onClick: handleEditPermissionTask,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteIcon />,
      color: "error",
      onClick: handleDeletePermissionTask,
    },
  ];
 const handleFailed = (message: string) => {
    setErrorNotification({
      open: true,
      title: "Error!",
      message: message,
    });
  };
  const config: ListingConfig<PermissionTask> = {
    title: "Menu Management",
    fillAvailableHeight: true,
    columns,
    actions,
    primaryAction: {
      label: "Add Menu",
      icon: <PersonAddIcon />,
      onClick: handleAddPermissionTask,
    },
    emptyState: {
      title: "No menu found",
      description: "Get started by adding your first menu to the system.",
      action: {
        label: "Add Menu",
        onClick: handleAddPermissionTask,
      },
    },
  };
  const handleCloseErrorNotification = () => {
    setErrorNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };
  return (
    <AppLayout>
      {isLoading && <Loader />}
      <DynamicListing
        config={config}
        data={permissionTasks}
        loading={isListingLoading}
        error={error}
        onRefresh={handleRefresh}
        onSearch={handleSearch}
      />

      {/* Create PermissionTask Modal */}
      <CreatePermissionTaskModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
        onFailure={handleFailed}
      />

      {/* PermissionTask Detail Modal */}
      <PermissionTaskDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        permissionTaskData={permissionTasks}
        permissionTask={selectedPermissionTask}
        mode={detailModalMode}
        onSuccess={handleUpdateSuccess}
         onFailure={handleFailed}
      />
      <ConfirmationDialog
        open={deleteConfirmation.open}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        title="Delete Menu"
        message={`Are you sure you want to delete the menu "${deleteConfirmation.permissionTasks?.permissiontaskname}"?`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        type="danger"
      />
      {/* Success Notification */}
      <SuccessNotification
        open={successNotification.open}
        onClose={handleCloseSuccessNotification}
        title={successNotification.title}
        message={successNotification.message}
        duration={5000}
        action={{
          label: "View Menu",
          onClick: () => {
            console.log("Navigate to menu");
          },
        }}
      />
      <ErrorNotification
        open={errorNotification.open}
        onClose={handleCloseErrorNotification}
        title={errorNotification.title}
        message={errorNotification.message}
        duration={6000}
      />
    </AppLayout>
  );
}
