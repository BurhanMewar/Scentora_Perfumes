"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchUsers,
  selectUsers,
  selectUsersIsLoading,
  selectUserError,
  fetchUserById,
  deleteUser,
} from "../../slice/UserSlice";
import { User } from "../../slice/UserSlice";
import DynamicListing, {
  ListingConfig,
  ListingColumn,
  ListingAction,
} from "../../components/listing/DynamicListing";
import ConfirmationDialog from "../../components/notifications/ConfirmationDialog";
import AppLayout from "../../components/layout/AppLayout";
import { CreateUserModal } from "./CreateUsers";
import { UserDetailModal } from "./ViewEditUser";
import { SuccessNotification, ErrorNotification } from "../../components/notifications";
import {
  PersonAdd as PersonAddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Key as KeyIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
} from "@mui/icons-material";
import Loader from "@/components/Loader/loader";

export default function UserPage() {
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(selectUsers);
  const isLoading = useSelector(selectUsersIsLoading);
  const error = useSelector(selectUserError);
  const isListingLoading = useSelector((state: RootState) => state.user.isListingLoading);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    users: null as User | null,
  });
  const [errorNotification, setErrorNotification] = useState({
      open: false,
      title: "",
      message: "",
    });
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailModalMode, setDetailModalMode] = useState<"view" | "edit">(
    "view"
  );
  const [successNotification, setSuccessNotification] = useState({
    open: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);



  const handleRefresh = () => {
    dispatch(fetchUsers());
  };

  const handleAddUser = () => {
    setCreateModalOpen(true);
  };
  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    // TODO: Implement search functionality
  };
  const handleCreateSuccess = (message: string) => {
    setSuccessNotification({
      open: true,
      title: "Success!",
      message: message,
    });
    // Refresh the user list
    dispatch(fetchUsers());
  };

  const handleUpdateSuccess = (message: string) => {
    setSuccessNotification({
      open: true,
      title: "Success!",
      message: message,
    });
    // Refresh the user list
    dispatch(fetchUsers());
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.users) return;

    setDeleteLoading(true);
    try {
      handleCloseDeleteConfirmation();
      await dispatch(deleteUser(deleteConfirmation.users.id)).unwrap();
      setSuccessNotification({
        open: true,
        title: "Success!",
        message: `User "${deleteConfirmation.users.username}" has been deleted successfully!`,
      });
      
    } catch (error: any) {
      setErrorNotification({
        open: true,
        title: "Error!",
        message: error || "Failed to delete user. Please try again.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleCloseSuccessNotification = () => {
    setSuccessNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };


  const handleEditUser = async (user: User) => {
    try {
      // Fetch complete user details by ID
      await dispatch(fetchUserById(user.id.toString())).unwrap();

      setSelectedUser(user);
      setDetailModalMode("edit");
      setDetailModalOpen(true);
    } catch (error) {
      setErrorNotification({
        open: true,
        title: "Error!",
        message: `${ error || "Failed to fetch user details. Please try again."}`,
      });
    }
  };

  const handleDeleteUser = (user: User) => {
    setDeleteConfirmation({
      open: true,
      users: user,
    });
  };
  const handleCloseDeleteConfirmation = () => {
    setDeleteConfirmation({
      open: false,
      users: null,
    });
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

  const columns: ListingColumn<User>[] = [
    {
      key: "username",
      label: "User",
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
          {value}
        </div>
      ),
    },
    {
      key: "createddate",
      label: "Created",
      type: "text",
      render: (value) => (
        <span style={{ fontSize: "14px", color: "#666" }}>
          {formatDate(value)}
        </span>
      ),
    },
  ];
 const handleCloseErrorNotification = () => {
    setErrorNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };
  // Define actions for each row
  const actions: ListingAction<User>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditIcon />,
      color: "primary",
      onClick: handleEditUser,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteIcon />,
      color: "error",
      onClick: handleDeleteUser,
    },
  ];

  const config: ListingConfig<User> = {
    title: "User",
    fillAvailableHeight: true,
    columns,
    actions,
    primaryAction: {
      label: "Add User",
      icon: <PersonAddIcon />,
      onClick: handleAddUser,
    },
    emptyState: {
      title: "No users found",
      description: "Get started by adding your first user.",
      action: {
        label: "Add User",
        onClick: handleAddUser,
      },
    },
  };
  // const filteredUser = users.filter((user) => {
  //   const query = searchQuery.toLowerCase();

  //   return (
  //     (user.UserName.toLowerCase().includes(query) ||
  //       user.RoleName.toLowerCase().includes(query) ||
  //       user.ClientName.toLowerCase().includes(query) ||
  //       (user.Status === true && "active".includes(query)) ||
  //       (user.Status === false && "inactive".includes(query))
  //      )
  //   );
  // });

  return (
    <AppLayout>
      {isLoading && <Loader/>}
      <DynamicListing
        config={config}
        data={users || []}
        loading={isListingLoading}
        error={error}
        onRefresh={handleRefresh}
        onSearch={handleSearch}
      />
      <ErrorNotification
              open={errorNotification.open}
              onClose={handleCloseErrorNotification}
              title={errorNotification.title}
              message={errorNotification.message}
              duration={6000}
            />
      <ConfirmationDialog
        open={deleteConfirmation.open}
        onClose={handleCloseDeleteConfirmation}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete the user "${deleteConfirmation.users?.username}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        type="danger"
      />
      {/* Create User Modal */}
      <CreateUserModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* User Detail Modal */}
      <UserDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        user={selectedUser}
        mode={detailModalMode}
        onSuccess={handleUpdateSuccess}
      />

      {/* Success Notification */}
      <SuccessNotification
        open={successNotification.open}
        onClose={handleCloseSuccessNotification}
        title={successNotification.title}
        message={successNotification.message}
        duration={5000}
        action={{
          label: "View Users",
          onClick: () => {
            console.log("Navigate to users");
          },
        }}
      />
    </AppLayout>
  );
}
