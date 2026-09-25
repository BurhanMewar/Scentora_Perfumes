import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse, ApiStatusCodes } from "../types";
import apiService from "../utils/apiService";

// Types
export interface Appsetting {
  appsettingId: number;
  merchantId: number;
  appsettingName: string;
  createdBy: number;
  createdDate: string;
  updatedBy: number;
  updatedDate: string;
  masterAppsetting: number;
  isMerchant: boolean;
}

export interface CreateAppsettingData {
  masterAppsetting: number;
  appsettingName: string;
  createdBy: number;
  isMerchant: boolean;
}

export interface UpdateAppsettingData {
  appsettingId: number;
  merchantId: number;
  appsettingName: string;
  updatedBy: number;
  isMerchant: boolean;
}


export interface AppsettingState {
  appsettings: Appsetting[];
  currentAppsetting: Appsetting | null;
  isLoading: boolean;
  isAppsettingsLoading: boolean;
  isCurrentAppsettingLoading: boolean;
  error: string | null;
}

// API Response wrappers
export type AppsettingApiResponse = ApiResponse<Appsetting>;
export type AppsettingListApiResponse = ApiResponse<Appsetting[]>;

// Initial State
const initialState: AppsettingState = {
  appsettings: [],
  currentAppsetting: null,
  isLoading: false,
  isAppsettingsLoading: false,
  isCurrentAppsettingLoading: false,
  error: null,
};

// Async Thunks
export const fetchAppsettings = createAsyncThunk(
  "appsetting/fetchAppsettings",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching...");

      const data = (await apiService.appsetting.getAppsettings()) as AppsettingListApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to fetch");
      }

      return data.result;
    } catch (error) {
      console.error("fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);

export const fetchAppsettingById = createAsyncThunk(
  "appsetting/fetchAppsettingById",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("Fetching by ID:", id);

      const data = (await apiService.appsetting.getAppsettingById(id)) as AppsettingApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to fetch");
      }

      return data.result;
    } catch (error) {
      console.error("fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);


export const updateAppsetting = createAsyncThunk(
  "appsetting/updateAppsetting",
  async (appsettingData: UpdateAppsettingData, { rejectWithValue }) => {
    try {
      console.log("Updating:", appsettingData);

      const data = (await apiService.appsetting.updateAppsetting(
        appsettingData
      )) as AppsettingApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to update");
      }

      return data.result;
    } catch (error) {
      console.error("update error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);




// Slice
const appsettingSlice = createSlice({
  name: "appsetting",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAppsettingState: (state) => {
      state.appsettings = [];
      state.currentAppsetting = null;
      state.error = null;
    },
    clearCurrentAppsetting: (state) => {
      state.currentAppsetting = null;
    },
    addAppsetting: (state, action: PayloadAction<Appsetting>) => {
      state.appsettings.push(action.payload);
    },
    updateAppsettingInList: (state, action: PayloadAction<Appsetting>) => {
      const index = state.appsettings.findIndex(
        (appsetting) => appsetting.appsettingId === action.payload.appsettingId
      );
      if (index !== -1) {
        state.appsettings[index] = action.payload;
      }
    },
    removeAppsettingFromList: (state, action: PayloadAction<number>) => {
      state.appsettings = state.appsettings.filter(
        (appsetting) => appsetting.appsettingId !== action.payload
      );
    },
    toggleAppsettingStatus: (state, action: PayloadAction<number>) => {
      const appsetting = state.appsettings.find((appsetting) => appsetting.appsettingId === action.payload);
      if (appsetting) {
        appsetting.masterAppsetting = appsetting.masterAppsetting === 1 ? 0 : 1;
      }
      if (state.currentAppsetting && state.currentAppsetting.appsettingId === action.payload) {
        state.currentAppsetting.masterAppsetting =
          state.currentAppsetting.masterAppsetting === 1 ? 0 : 1;
      }
    },
    clearAppsettings: (state) => {
      state.appsettings = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Appsettings
    builder
      .addCase(fetchAppsettings.pending, (state) => {
        state.isAppsettingsLoading = true;
        state.error = null;
      })
      .addCase(fetchAppsettings.fulfilled, (state, action: PayloadAction<Appsetting[]>) => {
        state.isAppsettingsLoading = false;

        // Handle the simple array response
        const appsettings: Appsetting[] = Array.isArray(action.payload)
          ? action.payload
          : [];

        state.appsettings = appsettings;
        state.error = null;
      })
      .addCase(fetchAppsettings.rejected, (state, action) => {
        state.isAppsettingsLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Appsetting by ID
    builder
      .addCase(fetchAppsettingById.pending, (state) => {
        state.isCurrentAppsettingLoading = true;
        state.error = null;
      })
      .addCase(
        fetchAppsettingById.fulfilled,
        (state, action: PayloadAction<Appsetting>) => {
          state.isCurrentAppsettingLoading = false;
          state.currentAppsetting = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAppsettingById.rejected, (state, action) => {
        state.isCurrentAppsettingLoading = false;
        state.error = action.payload as string;
      });

    // Create Appsetting
   
    builder
      .addCase(updateAppsetting.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAppsetting.fulfilled, (state, action: PayloadAction<Appsetting>) => {
        state.isLoading = false;

        // Update in appsettings list
        const index = state.appsettings.findIndex(
          (appsetting) => appsetting.appsettingId === action.payload.appsettingId
        );
        if (index !== -1) {
          state.appsettings[index] = action.payload;
        }

        // Update current appsetting if it's the same
        if (
          state.currentAppsetting &&
          state.currentAppsetting.appsettingId === action.payload.appsettingId
        ) {
          state.currentAppsetting = action.payload;
        }

        state.error = null;
      })
      .addCase(updateAppsetting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

  },
});

// Export actions
export const {
  clearError,
  clearAppsettingState,
  clearCurrentAppsetting,
  addAppsetting,
  updateAppsettingInList,
  removeAppsettingFromList,
  toggleAppsettingStatus,
  clearAppsettings,
} = appsettingSlice.actions;

// Export selectors
export const selectAppsetting = (state: { appsetting: AppsettingState }) => state.appsetting;
export const selectAppsettings = (state: { appsetting: AppsettingState }) => state.appsetting.appsettings;
export const selectCurrentAppsetting = (state: { appsetting: AppsettingState }) =>
  state.appsetting.currentAppsetting;
export const selectAppsettingIsLoading = (state: { appsetting: AppsettingState }) =>
  state.appsetting.isLoading;
export const selectAppsettingsIsLoading = (state: { appsetting: AppsettingState }) =>
  state.appsetting.isAppsettingsLoading;
export const selectCurrentAppsettingIsLoading = (state: { appsetting: AppsettingState }) =>
  state.appsetting.isCurrentAppsettingLoading;
export const selectAppsettingError = (state: { appsetting: AppsettingState }) => state.appsetting.error;

// Helper selectors
export const selectMasterAppsettings = (state: { appsetting: AppsettingState }) =>
  state.appsetting.appsettings.filter((appsetting) => appsetting.masterAppsetting === 1);

export const selectAppsettingById = (state: { appsetting: AppsettingState }, id: number) =>
  state.appsetting.appsettings.find((appsetting) => appsetting.appsettingId === id);

export const selectAppsettingsByMerchant = (
  state: { appsetting: AppsettingState },
  merchantId: number
) => state.appsetting.appsettings.filter((appsetting) => appsetting.merchantId === merchantId);

export const selectAppsettingsByCreatedBy = (
  state: { appsetting: AppsettingState },
  createdBy: number
) => state.appsetting.appsettings.filter((appsetting) => appsetting.createdBy === createdBy);

// Export reducer
export default appsettingSlice.reducer;

