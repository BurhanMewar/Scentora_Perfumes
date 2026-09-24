import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse, ApiStatusCodes } from "../types";
import apiService from "../utils/apiService";

// Types
export interface Permission {
  permissionTaskName: string;
  parentId: number;
  permissionTaskId: number;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  permissionId: number;
  displayOrder: number;
  icon: string;
}
export interface CreatePermissionData {
  roleId: number;
  permissions: Permission[];
}

export interface PermissionFilters {
  roleId?: number;
}
export interface PermissionState {
  permissions: Permission[];
  currentPermission: Permission | null;
  isPermissionsLoading: boolean;
  error: string | null;
}

// API Response wrappers
export type PermissionApiResponse = ApiResponse<Permission>;
export type PermissionListApiResponse = ApiResponse<Permission[]>;

// Initial State
const initialState: PermissionState = {
  permissions: [],
  currentPermission: null,
  isPermissionsLoading: false,
  error: null,
};

// Async Thunks
export const fetchPermissions = createAsyncThunk(
  "permission/fetchPermissions",
  async (filters: PermissionFilters = {}, { rejectWithValue }) => {
    try {
      
      console.log("Fetching permissions...");

      const data = (await apiService.permission.getPermissions(
        filters as Record<string, string>
      )) as PermissionListApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to fetch permissions");
      }

      return data.result;
    } catch (error) {
      console.error("Permissions fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const savePermission = createAsyncThunk(
  "permission/savePermission",
  async (permissionData: CreatePermissionData, { rejectWithValue }) => {
    try {
      console.log("Creating permission:", permissionData);

      const data = (await apiService.permission.savePermission(
        permissionData
      )) as PermissionApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to create permission");
      }

      return data.result;
    } catch (error) {
      console.error("Permission creation error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);
// Slice
const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearPermissionState: (state) => {
      state.permissions = [];
      state.currentPermission = null;
      state.error = null;
    },
    clearCurrentPermission: (state) => {
      state.currentPermission = null;
    },
    addPermission: (state, action: PayloadAction<Permission>) => {
      state.permissions.push(action.payload);
    },
    clearPermissions: (state) => {
      state.permissions = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Permissions
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.isPermissionsLoading = true;
        state.error = null;
      })
      .addCase(
        fetchPermissions.fulfilled,
        (state, action: PayloadAction<Permission[]>) => {
          
          state.isPermissionsLoading = false;

          // Handle the simple array response
          const permissions: Permission[] = Array.isArray(action.payload)
            ? action.payload
            : [];

          state.permissions = permissions;
          state.error = null;
        }
      )
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.isPermissionsLoading = false;
        state.error = action.payload as string;
      });

    // Create Permission
    builder
      .addCase(savePermission.pending, (state) => {
        state.isPermissionsLoading = true;
        state.error = null;
      })
      .addCase(
        savePermission.fulfilled,
        (state, action: PayloadAction<Permission>) => {
          state.isPermissionsLoading = false;
          state.permissions.push(action.payload);
          state.error = null;
        }
      )
      .addCase(savePermission.rejected, (state, action) => {
        state.isPermissionsLoading = false;
        state.error = action.payload as string;
      });

    // Update Permission
  },
});

// Export actions
export const {
  clearError,
  clearPermissionState,
  clearCurrentPermission,
  addPermission,
  clearPermissions,
} = permissionSlice.actions;

export const selectPermissions = (state: { permission: PermissionState }) =>
  state.permission?.permissions;
export const selectPermissionIsLoading = (state: {
  permission: PermissionState;
}) => state.permission?.isPermissionsLoading;
export const selectPermissionError = (state: { permission: PermissionState }) =>
  state.permission?.error;
// Export reducer
export default permissionSlice.reducer;
