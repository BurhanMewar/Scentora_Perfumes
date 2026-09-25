import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import apiService from "../utils/apiService";
import { ApiResult } from "../utils/apiService";

// PermissionTask interface
export interface PermissionTask {
  id: number;
  permissiontaskname: string;
  path: string;
  parentid: number;
  isactive: boolean;
  displayorder: number;
  icon: string;
  createddate: string; // ISO date string
  createdby: string;
  updateddate: string | null; // ISO date string or null
  updatedby: string | null;
}

// Create permissionTask data interface
export interface CreatePermissionTaskData {
  permissiontaskname: string;
  path: string;
  parentid: number;
  displayorder: number;
  icon: string;
  isactive: boolean;
}

// Update permissionTask data interface
export interface UpdatePermissionTaskData {
  id: number;
  permissionTaskName: string;
  path: string;
  parentId: number;
  isActive: boolean;
  displayOrder: number;
  icon: string;
  updatedBy: string;
}

// PermissionTask state interface
export interface PermissionTaskState {
  permissionTasks: PermissionTask[];
  selectedPermissionTask: PermissionTask | null;
  isListingLoading: boolean;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  message: string;
  error: string | null;
  updateError: string | null;
}

// API response types
export type PermissionTaskListApiResponse = ApiResult<PermissionTask[]>;
export type PermissionTaskDetailApiResponse = ApiResult<PermissionTask>;

// Initial state
const initialState: PermissionTaskState = {
  permissionTasks: [],
  selectedPermissionTask: null,
  isListingLoading: false,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  message: "",
  error: null,
  updateError: null,
};

// Async thunks
export const fetchPermissionTasks = createAsyncThunk(
  "permissionTask/fetchPermissionTasks",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching permissionTasks...");

      const data =
        (await apiService.permissionTask.getPermissionTask()) as PermissionTaskListApiResponse;
      console.log(data);

      if (!data.success || data.statusCode !== 0) {
        return rejectWithValue(
          data.message || "Failed to fetch permissionTasks"
        );
      }

      return data.result;
    } catch (error) {
      console.error("PermissionTasks fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const fetchPermissionTaskById = createAsyncThunk(
  "permissionTask/fetchPermissionTaskById",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("Fetching permissionTask by ID:", id);

      const data = (await apiService.permissionTask.getPermissionTaskById(
        id
      )) as PermissionTaskDetailApiResponse;
      if (!data.success || data.statusCode == 0) {
        return rejectWithValue(
          data.message || "Failed to fetch permissionTask"
        );
      }

      return data.result;
    } catch (error) {
      console.error("PermissionTask fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const createPermissionTask = createAsyncThunk(
  "permissionTask/createPermissionTask",
  async (permissionTaskData: CreatePermissionTaskData, { rejectWithValue }) => {
    try {
      console.log("Creating permissionTask:", permissionTaskData);

      const data = await apiService.permissionTask.createPermissionTask(
        permissionTaskData
      );

      if (!data.success || data.statusCode !== 0) {
        return rejectWithValue(
          data.message || "Failed to create permissionTask"
        );
      }

      return data.message;
    } catch (error) {
      console.error("PermissionTask creation error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const updatePermissionTask = createAsyncThunk(
  "permissionTask/updatePermissionTask",
  async (
    { permissionTaskData }: { permissionTaskData: UpdatePermissionTaskData },
    { rejectWithValue }
  ) => {
    try {
      console.log("Updating permissionTask:", permissionTaskData);

      const data = await apiService.permissionTask.updatePermissionTask(
        permissionTaskData
      );

      if (!data.success || data.statusCode !== 0) {
        return rejectWithValue(
          data.message || "Failed to update permissionTask"
        );
      }

      return data.message;
    } catch (error) {
      console.error("PermissionTask update error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const deletePermissionTask = createAsyncThunk(
  "permissionTask/deletePermissionTask",
  async (id: number, { rejectWithValue }) => {
    try {
      console.log("Deleting permissionTask:", id);

      const data = await apiService.permissionTask.deletePermissionTask(id);

      if (!data.success || data.statusCode !== 0) {
        return rejectWithValue(
          data.message || "Failed to delete permissionTask"
        );
      }

      return id;
    } catch (error) {
      console.error("PermissionTask deletion error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

// PermissionTask slice
const permissionTaskSlice = createSlice({
  name: "permissionTask",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedPermissionTask: (state) => {
      state.selectedPermissionTask = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch permissionTasks
    builder
      .addCase(fetchPermissionTasks.pending, (state) => {
        state.isListingLoading = true;
        state.error = null;
      })
      .addCase(
        fetchPermissionTasks.fulfilled,
        (state, action: PayloadAction<PermissionTask[]>) => {
          state.isListingLoading = false;

          // Handle the simple array response
          const PermissionTasks: PermissionTask[] = Array.isArray(
            action.payload
          )
            ? action.payload
            : [];

          state.permissionTasks = PermissionTasks;
          state.error = null;
        }
      )
      .addCase(fetchPermissionTasks.rejected, (state, action) => {
        state.isListingLoading = false;
        state.error = action.payload as string;
      });

    // Fetch permissionTask by ID
    builder
      .addCase(fetchPermissionTaskById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchPermissionTaskById.fulfilled,
        (state, action: PayloadAction<PermissionTask>) => {
          state.isLoading = false;
          state.selectedPermissionTask = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchPermissionTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create permissionTask
    builder
      .addCase(createPermissionTask.pending, (state) => {
        state.isLoading = true;
        state.updateError = null;
      })
      .addCase(
        createPermissionTask.fulfilled,
        (state, action: PayloadAction<PermissionTask>) => {
          state.isLoading = false;
          state.permissionTasks.push(action.payload);
          state.updateError = null;
          state.message = action.payload.toString();
        }
      )
      .addCase(createPermissionTask.rejected, (state, action) => {
        state.isLoading = false;
        state.updateError = action.payload as string;
      });

    // Update permissionTask
    builder
      .addCase(updatePermissionTask.pending, (state) => {
        state.isLoading = true;
        state.updateError = null;
      })
      .addCase(
        updatePermissionTask.fulfilled,
        (state, action: PayloadAction<PermissionTask>) => {
          state.isLoading = false;
          state.updateError = null;
          state.message = action.payload.toString();
        }
      )
      .addCase(updatePermissionTask.rejected, (state, action) => {
        state.isLoading = false;
        state.updateError = action.payload as string;
      });

    // Delete permissionTask
    builder
      .addCase(deletePermissionTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        deletePermissionTask.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.isLoading = false;
          state.permissionTasks = state.permissionTasks.filter(
            (u) => u.id !== action.payload
          );
          if (state.selectedPermissionTask?.id === action.payload) {
            state.selectedPermissionTask = null;
          }
          state.error = null;
        }
      )
      .addCase(deletePermissionTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, clearSelectedPermissionTask } =
  permissionTaskSlice.actions;

// Selectors
export const selectPermissionTasks = (state: {
  permissionTask: PermissionTaskState;
}) => state.permissionTask?.permissionTasks;
export const selectSelectedPermissionTask = (state: {
  permissionTask: PermissionTaskState;
}) => state.permissionTask?.selectedPermissionTask;
export const selectPermissionTasksIsLoading = (state: {
  permissionTask: PermissionTaskState;
}) => state.permissionTask?.isLoading;
export const selectPermissionTaskIsCreating = (state: {
  permissionTask: PermissionTaskState;
}) => state.permissionTask?.isCreating;
export const selectPermissionTaskIsUpdating = (state: {
  permissionTask: PermissionTaskState;
}) => state.permissionTask?.isUpdating;
export const selectPermissionTaskIsDeleting = (state: {
  permissionTask: PermissionTaskState;
}) => state.permissionTask?.isDeleting;
export const selectPermissionTaskError = (state: {
  permissionTask: PermissionTaskState;
}) => state.permissionTask?.error;

export default permissionTaskSlice.reducer;

