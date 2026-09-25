"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  fetchAppsettings,
  fetchAppsettingById,
  
  selectAppsettings,
  selectAppsettingsIsLoading,
  selectAppsettingError,
  Appsetting,
} from "../../slice/AppSettingSlice";
import DynamicListing, {
  ListingConfig,
  ListingColumn,
  ListingAction,
} from "../../components/listing/DynamicListing";
import AppLayout from "../../components/layout/AppLayout";
import { AppsettingDetailModal } from "./ViewEditAppsetting";
import {
  SuccessNotification,
  ConfirmationDialog,
} from "../../components/notifications";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Security as SecurityIcon,
  AdminPanelSettings as MasterAppsettingIcon,
  Business as MerchantIcon,
  Person as UserIcon,
} from "@mui/icons-material";
export default function AppsettingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const appsettings = useSelector(selectAppsettings);
  const isLoading = useSelector(selectAppsettingsIsLoading);
  const error = useSelector(selectAppsettingError);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedAppsetting, setSelectedAppsetting] = useState<Appsetting | null>(null);
  const [detailModalMode, setDetailModalMode] = useState<"view" | "edit">(
    "view"
  );
 
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successNotification, setSuccessNotification] = useState({
    open: false,
    title: "",
    message: "",
  });
  useEffect(() => {
    dispatch(fetchAppsettings());
  }, [dispatch]);

  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    // TODO: Implement search functionality
  };

  const handleRefresh = () => {
    dispatch(fetchAppsettings());
  };

  const handleViewAppsetting = async (appsetting: Appsetting) => {
    try {
      // Fetch complete appsetting details by ID
      await dispatch(fetchAppsettingById(appsetting.appsettingId.toString())).unwrap();
      setSelectedAppsetting(appsetting);
      setDetailModalMode("view");
      setDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching details:", error);
      setSuccessNotification({
        open: true,
        title: "Error!",
        message: "Failed to fetch details. Please try again.",
      });
    }
  };

  const handleEditAppsetting = async (appsetting: Appsetting) => {
    try {
      // Fetch complete appsetting details by ID
      await dispatch(fetchAppsettingById(appsetting.appsettingId.toString())).unwrap();
      setSelectedAppsetting(appsetting);
      setDetailModalMode("edit");
      setDetailModalOpen(true);
    } catch (error) {
      console.error("Error fetching details:", error);
      setSuccessNotification({
        open: true,
        title: "Error!",
        message: "Failed to fetch details. Please try again.",
      });
    }
  };



  const handleAddAppsetting = () => {
    setCreateModalOpen(true);
  };

  const handleCreateSuccess = (message: string) => {
    setSuccessNotification({
      open: true,
      title: "Success!",
      message: message,
    });
    // Refresh the appsetting list
    dispatch(fetchAppsettings());
  };

  const handleUpdateSuccess = (message: string) => {
    setSuccessNotification({
      open: true,
      title: "Success!",
      message: message,
    });
    // Refresh the appsetting list
    dispatch(fetchAppsettings());
  };

  const handleCloseSuccessNotification = () => {
    setSuccessNotification((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Filter appsettings based on search query
  const filteredAppsettings = appsettings.filter(
    (appsetting) =>
      appsetting.appsettingName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define columns for the appsetting listing
  const columns: ListingColumn<Appsetting>[] = [
    {
      key: "appsettingName",
      label: "Appsetting Name",
      sortable: true,
      render: (value, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SecurityIcon sx={{ color: "primary.main", fontSize: 20 }} />
          <span style={{ fontWeight: 500 }}>{row.appsettingName}</span>
        </div>
      ),
    },
    // {
    //   key: "merchantId",
    //   label: "Merchant ID",
    //   sortable: true,
    //   render: (value, row) => (
    //     <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
    //       <MerchantIcon sx={{ color: "text.secondary", fontSize: 16 }} />
    //       <span
    //         style={{
    //           backgroundColor: "#f5f5f5",
    //           padding: "4px 8px",
    //           borderRadius: "4px",
    //           fontSize: "0.875rem",
    //         }}
    //       >
    //         {row.merchantId}
    //       </span>
    //     </div>
    //   ),
    // },
    {
      key: "isMerchant",
      label: "Is Merchant",
      sortable: true,
      render: (value, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <MasterAppsettingIcon
            sx={{
              color: row.isMerchant === true ? "success.main" : "text.secondary",
              fontSize: 16,
            }}
          />
          <span
            style={{
              backgroundColor: row.isMerchant === true ? "#e8f5e8" : "#fff3cd",
              color: row.isMerchant === true ? "#2e7d32" : "#856404",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {row.isMerchant === true ? "Yes" : "No"}
          </span>
        </div>
      ),
    },
    {
      key: "createdBy",
      label: "Created By",
      sortable: true,
      render: (value, row) => (
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <UserIcon sx={{ color: "text.secondary", fontSize: 16 }} />
          <span style={{ fontSize: "0.875rem" }}>User {row.createdBy}</span>
        </div>
      ),
    },
    {
      key: "createdDate",
      label: "Created Date",
      sortable: true,
      render: (value, row) => {
        const date = new Date(row.createdDate);
        return (
          <span style={{ fontSize: "0.875rem" }}>
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        );
      },
    },
  ];

  // Define actions for each appsetting
  const actions: ListingAction<Appsetting>[] = [
    {
      key: "edit",
      label: "Edit",
      icon: <EditIcon />,
      onClick: handleEditAppsetting,
      color: "secondary",
    },
  ];

  // Configuration for the dynamic listing
  const listingConfig: ListingConfig<Appsetting> = {
    title: "Appsetting Management",
    fillAvailableHeight: true,
    searchPlaceholder: "Search appsettings...",
    columns,
    actions,
    searchable: true,
    showFilter: false, // No filters for appsettings
    primaryAction: {
      label: "Add Appsetting",
      icon: <AddIcon />,
      onClick: handleAddAppsetting,
    },
    emptyState: {
      title: "No data Found",
      description:
        "There are no data in the system yet",
      action: {
        label: "Add",
        onClick: handleAddAppsetting,
      },
    },
  };

  return (
    <AppLayout>
      <DynamicListing
        config={listingConfig}
        data={filteredAppsettings}
        loading={isLoading}
        error={error}
        onRefresh={handleRefresh}
        onSearch={handleSearch}
      />


      {/* Appsetting Detail Modal */}
      <AppsettingDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        appsetting={selectedAppsetting}
        mode={detailModalMode}
        onSuccess={handleUpdateSuccess}
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

