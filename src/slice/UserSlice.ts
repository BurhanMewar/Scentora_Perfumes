import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../utils/apiService";
import { ApiResult } from "../utils/apiService";

// User interface
export interface User {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  fullname: string | null;
  status: number;
  createdDate: string;
  createdBy: string;
  updatedDate: string | null;
  updatedBy: string | null;
  rolesId: string;
  countryCode: string;
}

// User filters interface
export interface UserFilters {
  search?: string;
  isActive?: boolean;
  recordStatus?: number;
  isWallet?: boolean;
  createdDateFrom?: string;
  createdDateTo?: string;
}

// Create user data interface
export interface CreateUserData {
  username: string;
  password: string;
  email: string;
  phone: string;
  status: number;
  fullname: string;
  rolesId: any;
  countryCode: string;
}
export interface ChangePasswordData {
  userId: number | undefined;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Update user data interface
export interface UpdateUserData {
  userId: number;
  username: string;
  email: string;
  phone: string;
  fullname: string;
  status: number;
  countryCode: string;
  rolesId: any;
  updatedBy: string;
}

// User state interface
export interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  isListingLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
  updateError: string | null;
  filters: UserFilters;
}

// API response types
export type UserListApiResponse = ApiResult<User[]>;
export type UserDetailApiResponse = ApiResult<User>;

// Initial state
const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  isListingLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  updateError: null,
  filters: {},
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching users...");

      const data = (await apiService.user.getUsers()) as UserListApiResponse;
      console.log(data);
      if (!data.success || data.statusCode !== 0) {
        return rejectWithValue(data.message || "Failed to fetch users");
      }

      return data.result;
    } catch (error) {
      console.error("Users fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const fetchUserById = createAsyncThunk(
  "user/fetchUserById",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("Fetching user by ID:", id);

      const data = (await apiService.user.getUserById(
        id
      )) as UserDetailApiResponse;
      if (!data.success || data.statusCode !== 0) {
        return rejectWithValue(data.message || "Failed to fetch user");
      }

      return data.result;
    } catch (error) {
      console.error("User fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData: CreateUserData, { rejectWithValue }) => {
    try {
      console.log("Creating user:", userData);

      const data = await apiService.user.createUser(userData);

      if (!data.success || data.statusCode !== 0) {
        return rejectWithValue(data.message || "Failed to create user");
      }

      return data.result;
    } catch (error) {
      console.error("User creation error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userData }: { userData: UpdateUserData }, { rejectWithValue }) => {
    try {
      console.log("Updating user:", userData);

      const data = await apiService.user.updateUser(userData);

      if (!data.success || data.statusCode !== 0) {
        return rejectWithValue(data.message || "Failed to update user");
      }

      return data.result;
    } catch (error) {
      console.error("User update error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (UserId: number, { rejectWithValue }) => {
    try {
      console.log("Deleting user:", UserId);

      const data = await apiService.user.deleteUser(UserId);

      if (!data.success || data.statusCode !== 0) {
        return rejectWithValue(data.message || "Failed to delete user");
      }

      return UserId;
    } catch (error) {
      console.error("User deletion error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);
export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (userData: ChangePasswordData, { rejectWithValue }) => {
    try {
      console.log("Deleting user:", userData);

      const data = await apiService.user.changePassword(userData);

      if (!data.success || data.statusCode !== 0) {
        return rejectWithValue(data.message || "Failed to delete user");
      }

      return data.result;
    } catch (error) {
      console.error("User deletion error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

// User slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setFilters: (state, action: PayloadAction<UserFilters>) => {
      state.filters = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isListingLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isListingLoading = false;

        // Handle the array response from result field
        const Users: User[] = Array.isArray(action.payload)
          ? action.payload
          : [];

        state.users = Users;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isListingLoading = false;
        state.error = action.payload as string;
      });

    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoading = true;
        state.updateError = null;
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.selectedUser = action.payload;
          state.updateError = null;
        }
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.updateError = action.payload as string;
      });

    // Create user
    builder
      .addCase(createUser.pending, (state) => {
        state.isLoading = true;
        state.updateError = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.users.push(action.payload);
        state.updateError = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false;
        state.updateError = action.payload as string;
      });

    // Update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.updateError = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.updateError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.updateError = action.payload as string;
      });

    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.updateError = null;
      })
      .addCase(
        changePassword.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.updateError = null;
        }
      )
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.updateError = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, clearSelectedUser, setFilters, clearFilters } =
  userSlice.actions;

// Selectors
export const selectUsers = (state: { user: UserState }) => state.user.users;
export const selectSelectedUser = (state: { user: UserState }) =>
  state.user.selectedUser;
export const selectUsersIsLoading = (state: { user: UserState }) =>
  state.user.isLoading;
export const selectUserIsCreating = (state: { user: UserState }) =>
  state.user.isCreating;
export const selectUserIsUpdating = (state: { user: UserState }) =>
  state.user.isUpdating;
export const selectUserIsDeleting = (state: { user: UserState }) =>
  state.user.isDeleting;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserFilters = (state: { user: UserState }) =>
  state.user.filters;

export const selectRecentUsers = (
  state: { user: UserState },
  days: number = 7
) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  return state.user.users.filter(
    (user) => new Date(user.createdDate) >= cutoffDate
  );
};

export default userSlice.reducer;

