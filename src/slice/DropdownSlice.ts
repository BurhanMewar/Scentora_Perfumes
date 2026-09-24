import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse, ApiStatusCodes } from "../types";
import apiService from "../utils/apiService";

export interface DropdownProps {
  id: number;
  name: string;
  isWallet?: boolean;
}
export interface RoleDropdownFilters {
  isMerchant?: boolean | null;
}
export type DropdownApiResponse = ApiResponse<DropdownProps[]>;
export interface DropdownState {
  roleDropdown: DropdownProps[];
  permissionTaskDropdown: DropdownProps[];
  userDropdown: DropdownProps[];
  merchantDropdown: DropdownProps[];
  botDropdown: DropdownProps[];
  clientDropdown: DropdownProps[];
  dbConnectionDropdown: DropdownProps[];
  dbTableDropdown: DropdownProps[];
  roleDropdownByBot: DropdownProps[];
  languageDropdown: any[];
  isLoading: boolean;
  error: string | null;
}
const initialState: DropdownState = {
  roleDropdown: [],
  permissionTaskDropdown: [],
  userDropdown: [],
  merchantDropdown: [],
  botDropdown: [],
  clientDropdown: [],
  dbConnectionDropdown: [],
  languageDropdown: [],
  dbTableDropdown: [],
  roleDropdownByBot: [],
  isLoading: false,
  error: null,
};

export const fetchRoleDropdown = createAsyncThunk(
  "role/fetchRoleDropdown",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching roles...");

      const data =
        (await apiService.dropdown.getRoleDropdown()) as DropdownApiResponse;

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
export const fetchRoleDropdownByBotId = createAsyncThunk(
  "role/fetchRoleDropdownByBotId",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("Fetching...");

      const data = (await apiService.dropdown.getRoleDropdownByBotId(
        id
      )) as DropdownApiResponse;

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

export const fetchUserDropdown = createAsyncThunk(
  "user/fetchUserDropdown",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("Fetching user...");

      const data =
        (await apiService.dropdown.getUserDropdown()) as DropdownApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to fetch user");
      }

      return data.result;
    } catch (error) {
      console.error("Roles fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);
export const fetchPermissionTasksDropdown = createAsyncThunk(
  "menu/fetchMerchantDropdown",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching menu...");

      const data =
        (await apiService.dropdown.getPermissionTaskDropdown()) as DropdownApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to fetch menu");
      }

      return data.result;
    } catch (error) {
      console.error("menu fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);
export const fetchBotDropdown = createAsyncThunk(
  "bot/fetchBotDropdown",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching bot...");

      const data =
        (await apiService.dropdown.getBotsDropdown()) as DropdownApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to fetch bot");
      }

      return data.result;
    } catch (error) {
      console.error("Bot fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);
export const fetchClientDropdown = createAsyncThunk(
  "client/fetchClientDropdown",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching bot...");

      const data =
        (await apiService.dropdown.getClientDropdown()) as DropdownApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to fetch bot");
      }

      return data.result;
    } catch (error) {
      console.error("Bot fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);
export const fetchDBConnectionDropdown = createAsyncThunk(
  "dbconnection/fetchDBConnectionDropdown",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching bot...");

      const data =
        (await apiService.dropdown.getDatabaseConnectionDropdown()) as DropdownApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to fetch bot");
      }

      return data.result;
    } catch (error) {
      console.error("DB Connection fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);
export const fetchDBTableDropdown = createAsyncThunk(
  "dbtable/fetchDBTableDropdown",
  async (connectionId: string, { rejectWithValue }) => {
    try {
      console.log("Fetching ...");

      const data = (await apiService.dropdown.getDatabaseTableDropdown(
        connectionId
      )) as DropdownApiResponse;

      if (!data.success || data.statusCode !== ApiStatusCodes.SUCCESS) {
        return rejectWithValue(data.message || "Failed to fetch ");
      }

      return data.result;
    } catch (error) {
      console.error("fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);
export const fetchLanguageDropdown = createAsyncThunk(
  "language/fetchLanguageDropdown",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching language...");

      const data = (await apiService.dropdown.getLanguageDropdown()) as any;

      if (!data.success) {
        return rejectWithValue(data.message || "Failed to fetch language");
      }

      return data.result;
    } catch (error) {
      console.error("Language fetch error:", error);
      return rejectWithValue(error || "Network error occurred");
    }
  }
);
const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRoleDropdownState: (state) => {
      state.roleDropdown = [];
    },
    clearPermissionTaskDataDropdownState: (state) => {
      state.permissionTaskDropdown = [];
    },
    clearUserDropdownState: (state) => {
      state.userDropdown = [];
    },
    clearTableDropdownState: (state) => {
      state.dbTableDropdown = [];
    },
    clearConnectionDropdowState: (state) => {
      state.dbConnectionDropdown = [];
    }
  },
  extraReducers: (builder) => {
    // Fetch Roles
    builder
      .addCase(fetchRoleDropdown.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchRoleDropdown.fulfilled,
        (state, action: PayloadAction<DropdownProps[]>) => {
          state.isLoading = false;

          // Handle the simple array response
          const roleDrop: DropdownProps[] = Array.isArray(action.payload)
            ? action.payload
            : [];

          state.roleDropdown = roleDrop;
          state.error = null;
        }
      )
      .addCase(fetchRoleDropdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchRoleDropdownByBotId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchRoleDropdownByBotId.fulfilled,
        (state, action: PayloadAction<DropdownProps[]>) => {
          state.isLoading = false;

          // Handle the simple array response
          const roleDropByBot: DropdownProps[] = Array.isArray(action.payload)
            ? action.payload
            : [];

          state.roleDropdownByBot = roleDropByBot;
          state.error = null;
        }
      )
      .addCase(fetchRoleDropdownByBotId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchPermissionTasksDropdown.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchPermissionTasksDropdown.fulfilled,
        (state, action: PayloadAction<DropdownProps[]>) => {
          state.isLoading = false;

          // Handle the simple array response
          const permissionTaskDataDropdown: DropdownProps[] = Array.isArray(
            action.payload
          )
            ? action.payload
            : [];

          state.permissionTaskDropdown = permissionTaskDataDropdown;
          state.error = null;
        }
      )
      .addCase(fetchPermissionTasksDropdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchUserDropdown.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserDropdown.fulfilled,
        (state, action: PayloadAction<DropdownProps[]>) => {
          state.isLoading = false;

          // Handle the simple array response
          const userDropodown: DropdownProps[] = Array.isArray(action.payload)
            ? action.payload
            : [];

          state.userDropdown = userDropodown;
          state.error = null;
        }
      )
      .addCase(fetchUserDropdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchBotDropdown.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchBotDropdown.fulfilled,
        (state, action: PayloadAction<DropdownProps[]>) => {
          state.isLoading = false;

          // Handle the simple array response
          const botDropodown: DropdownProps[] = Array.isArray(action.payload)
            ? action.payload
            : [];

          state.botDropdown = botDropodown;
          state.error = null;
        }
      )
      .addCase(fetchBotDropdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchClientDropdown.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchClientDropdown.fulfilled,
        (state, action: PayloadAction<DropdownProps[]>) => {
          state.isLoading = false;

          // Handle the simple array response
          const clientDropodown: DropdownProps[] = Array.isArray(action.payload)
            ? action.payload
            : [];

          state.clientDropdown = clientDropodown;
          state.error = null;
        }
      )
      .addCase(fetchClientDropdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchDBConnectionDropdown.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchDBConnectionDropdown.fulfilled,
        (state, action: PayloadAction<DropdownProps[]>) => {
          state.isLoading = false;

          // Handle the simple array response
          const dbConnectionDropdown: DropdownProps[] = Array.isArray(
            action.payload
          )
            ? action.payload
            : [];

          state.dbConnectionDropdown = dbConnectionDropdown;
          state.error = null;
        }
      )
      .addCase(fetchDBConnectionDropdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchDBTableDropdown.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchDBTableDropdown.fulfilled,
        (state, action: PayloadAction<DropdownProps[]>) => {
          state.isLoading = false;

          // Handle the simple array response
          const dbTableDropdown: DropdownProps[] = Array.isArray(action.payload)
            ? action.payload
            : [];

          state.dbTableDropdown = dbTableDropdown;
          state.error = null;
        }
      )
      .addCase(fetchDBTableDropdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(fetchLanguageDropdown.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchLanguageDropdown.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;

          // Handle the simple array response
          const languageDropdown: any = Array.isArray(action.payload.data)
            ? action.payload.data
            : [];

          state.languageDropdown = languageDropdown;
          state.error = null;
        }
      )
      .addCase(fetchLanguageDropdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError,clearTableDropdownState, clearConnectionDropdowState } = dropdownSlice.actions;

export default dropdownSlice.reducer;
