import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse, ApiStatusCodes } from "../types";
import apiService from "../utils/apiService";
import { DEMO_ADMIN_ACCESS_TOKEN } from "@/utils/cookieConstants";
import { DEMO_ADMIN_SESSION_KEY } from "@/slice/AuthSlice";

// Types
export interface Role {
  id: number;
  rolename: string;
  status: number;
  createdDate: string;
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
  botsId: string;
}

export interface CreateRoleData {
  botsId: any;
  rolename: string;
  createdBy: string;
  status: number;
}

export interface UpdateRoleData {
  id: number;
  rolename: string;
  status: number;
  botsId: any;
}

export interface RoleState {
  roles: Role[];
  demoInitialized: boolean;
  currentRole: Role | null;
  isLoading: boolean;
  isListingLoading: boolean;
  isRolesLoading: boolean;
  isCurrentRoleLoading: boolean;
  error: string | null;
  updateError: string | null;
}

// API Response wrappers
export type RoleApiResponse = ApiResponse<Role>;
export type RoleListApiResponse = ApiResponse<Role[]>;

const demoRoles: Role[] = [
  { id: 1, rolename: "Administrator", status: 1, createdDate: "2026-01-01T00:00:00.000Z", createdBy: "Scentora Admin", updatedDate: null, updatedBy: null, botsId: "" },
  { id: 2, rolename: "Editor", status: 1, createdDate: "2026-01-01T00:00:00.000Z", createdBy: "Scentora Admin", updatedDate: null, updatedBy: null, botsId: "" },
  { id: 3, rolename: "Catalog manager", status: 1, createdDate: "2026-01-01T00:00:00.000Z", createdBy: "Scentora Admin", updatedDate: null, updatedBy: null, botsId: "" },
];

function isDemoSession(getState: () => unknown) {
  if ((getState() as { auth?: { token?: string | null } }).auth?.token === DEMO_ADMIN_ACCESS_TOKEN) return true;
  if (typeof window === "undefined") return false;
  try {
    const savedSession = window.localStorage.getItem(DEMO_ADMIN_SESSION_KEY);
    return savedSession ? JSON.parse(savedSession)?.accessToken === DEMO_ADMIN_ACCESS_TOKEN : false;
  } catch {
    return false;
  }
}

// Initial State
const initialState: RoleState = {
  roles: [],
  demoInitialized: false,
  currentRole: null,
  isLoading: false,
  isListingLoading: false,
  isRolesLoading: false,
  isCurrentRoleLoading: false,
  error: null,
  updateError: null,
};

// Async Thunks
export const fetchRoles = createAsyncThunk(
  "role/fetchRoles",
  async (_, { rejectWithValue, getState }) => {
    try {
      if (isDemoSession(getState)) {
        const roleState = (getState() as { role?: RoleState }).role;
        return roleState?.demoInitialized ? (roleState.roles ?? []) : demoRoles;
      }
      console.log("Fetching roles...");

      const data = (await apiService.role.getRoles()) as RoleListApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to fetch roles");
      }

      return data.result;
    } catch (error) {
      console.error("Roles fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const fetchRoleById = createAsyncThunk(
  "role/fetchRoleById",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      if (isDemoSession(getState)) {
        const role = ((getState() as { role?: RoleState }).role?.roles ?? demoRoles).find((item) => item.id === Number(id));
        if (!role) return rejectWithValue("Role not found");
        return role;
      }
      console.log("Fetching role by ID:", id);

      const data = (await apiService.role.getRoleById(id)) as RoleApiResponse;

      if (!data.success) {
        return rejectWithValue(data.message || "Failed to fetch role");
      }
      return data.result;
    } catch (error) {
      console.error("Role fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const createRole = createAsyncThunk(
  "role/createRole",
  async (roleData: CreateRoleData, { rejectWithValue, getState }) => {
    try {
      if (isDemoSession(getState)) {
        const roles = (getState() as { role?: RoleState }).role?.roles ?? demoRoles;
        return {
          id: Math.max(0, ...roles.map((item) => item.id)) + 1,
          rolename: roleData.rolename,
          status: roleData.status,
          createdDate: new Date().toISOString(),
          createdBy: roleData.createdBy || "Scentora Admin",
          updatedDate: null,
          updatedBy: null,
          botsId: Array.isArray(roleData.botsId) ? roleData.botsId.join(",") : String(roleData.botsId ?? ""),
        } satisfies Role;
      }
      console.log("Creating role:", roleData);

      const data = (await apiService.role.createRole(
        roleData
      )) as RoleApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to create role");
      }

      return data.result;
    } catch (error) {
      console.error("Role creation error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const updateRole = createAsyncThunk(
  "role/updateRole",
  async (roleData: UpdateRoleData, { rejectWithValue, getState }) => {
    try {
      if (isDemoSession(getState)) {
        const role = ((getState() as { role?: RoleState }).role?.roles ?? demoRoles).find((item) => item.id === roleData.id);
        if (!role) return rejectWithValue("Role not found");
        return {
          ...role,
          rolename: roleData.rolename,
          status: roleData.status,
          botsId: Array.isArray(roleData.botsId) ? roleData.botsId.join(",") : String(roleData.botsId ?? ""),
          updatedDate: new Date().toISOString(),
        } satisfies Role;
      }
      console.log("Updating role:", roleData);

      const data = (await apiService.role.updateRole(
        roleData
      )) as RoleApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to update role");
      }

      return data.result;
    } catch (error) {
      console.error("Role update error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const deleteRole = createAsyncThunk(
  "role/deleteRole",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      if (isDemoSession(getState)) return id;
      console.log("Deleting role:", id);

      const data = await apiService.role.deleteRole(id);

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to delete role");
      }

      return id;
    } catch (error) {
      console.error("Role deletion error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

// Slice
const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRoleState: (state) => {
      state.roles = [];
      state.currentRole = null;
      state.error = null;
    },
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
    addRole: (state, action: PayloadAction<Role>) => {
      state.roles.push(action.payload);
    },
    updateRoleInList: (state, action: PayloadAction<Role>) => {
      const index = state.roles.findIndex(
        (role) => role.id === action.payload.id
      );
      if (index !== -1) {
        state.roles[index] = action.payload;
      }
    },
    removeRoleFromList: (state, action: PayloadAction<number>) => {
      state.roles = state.roles.filter((role) => role.id !== action.payload);
    },
    clearRoles: (state) => {
      state.roles = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Roles
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.isListingLoading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
        state.isListingLoading = false;
        state.demoInitialized = true;

        // Handle the simple array response
        const roles: Role[] = Array.isArray(action.payload)
          ? action.payload
          : [];

        state.roles = roles;
        state.error = null;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.isListingLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Role by ID
    builder
      .addCase(fetchRoleById.pending, (state) => {
        state.isRolesLoading = true;
        state.error = null;
      })
      .addCase(
        fetchRoleById.fulfilled,
        (state, action: PayloadAction<Role>) => {
          state.isRolesLoading = false;
          state.currentRole = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.isRolesLoading = false;
        state.error = action.payload as string;
      });

    // Create Role
    builder
      .addCase(createRole.pending, (state) => {
        state.isRolesLoading = true;
        state.updateError = null;
      })
      .addCase(createRole.fulfilled, (state, action: PayloadAction<Role>) => {
        state.isRolesLoading = false;
        state.roles.push(action.payload);
        state.updateError = null;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isRolesLoading = false;
        state.updateError = action.payload as string;
      });

    // Update Role
    builder
      .addCase(updateRole.pending, (state) => {
        state.isRolesLoading = true;
        state.updateError = null;
      })
      .addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
        state.isRolesLoading = false;

        state.currentRole = action.payload;
        state.roles = state.roles.map((role) => role.id === action.payload.id ? action.payload : role);

        state.updateError = null;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isRolesLoading = false;
        state.updateError = action.payload as string;
      });

    // Delete Role
    builder
      .addCase(deleteRole.pending, (state) => {
        state.isRolesLoading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action: PayloadAction<any>) => {
        state.isRolesLoading = false;
        const deletedId = parseInt(action.payload);
        state.roles = state.roles.filter((role) => role.id !== deletedId);

        // Clear current role if it was deleted
        if (state.currentRole && state.currentRole.id === deletedId) {
          state.currentRole = null;
        }

        state.error = null;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.isRolesLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  clearRoleState,
  clearCurrentRole,
  addRole,
  updateRoleInList,
  removeRoleFromList,
  clearRoles,
} = roleSlice.actions;

// Export selectors
export const selectRole = (state: { role: RoleState }) => state.role;
export const selectRoles = (state: { role: RoleState }) => state.role.roles;
export const selectCurrentRole = (state: { role: RoleState }) =>
  state.role.currentRole;
export const selectRoleIsLoading = (state: { role: RoleState }) =>
  state.role.isLoading;
export const selectRolesIsLoading = (state: { role: RoleState }) =>
  state.role.isRolesLoading;
export const selectCurrentRoleIsLoading = (state: { role: RoleState }) =>
  state.role.isCurrentRoleLoading;
export const selectRoleError = (state: { role: RoleState }) => state.role.error;

// Helper selectors

export const selectRoleById = (state: { role: RoleState }, id: number) =>
  state.role.roles.find((role) => role.id === id);

// Export reducer
export default roleSlice.reducer;
