import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// OLD API imports - kept commented for future NestJS integration
// import { AUTH_ENDPOINTS, API_BASE_URL } from "../constants";
// import { ApiResponse, ApiStatusCodes } from "../types";
// import apiService from "../utils/apiService";

import { DEMO_ADMIN_ACCESS_TOKEN } from "../utils/cookieConstants";

// Permission interface
export interface Permission {
  permissionId: number;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  permissionTaskId: number;
  permissionTaskName: string;
  path: string | null;
  parentId: number;
  displayOrder: number;
  icon: string;
  children: Permission[];
}

// Types
export interface User {
  userId: number;
  username: string;
  email: string;
  phone: string;
  isdcode?: string;
  fullname: string;
  isActive: boolean;
  recordStatus: number;
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiry: string;
  createdBy: number;
  createdDate: string;
  updatedBy: number | null;
  updatedDate: string | null;
  balance: number | null;
  isWallet: boolean;
  useridentifier: string;
  roleId: number | null;
  roleName: string | null;
  walletBalance: number | null;
  currencyCode: string;
  merchantId?: number | null;
  isMerchant?: boolean | null;
  merchantName?: string | null;
  permissions: Permission[];
  status?: number;
  message?: string | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  Username: string;
  Password: string;
}

// Temporary Scentora demo session key
export const DEMO_ADMIN_SESSION_KEY = "scentora.demoAdminSession.v1";

// -----------------------------------------------------------------------------
// TEMPORARY SCENTORA DEMO PERMISSIONS
// -----------------------------------------------------------------------------
// These permissions are only for the frontend/demo stage.
// Later, these will come from the Scentora NestJS backend.
const demoAdminPermissions: Permission[] = [
  "/cms",
  "/admin",
  "/appsetting",
  "/user",
  "/role",
  "/permission",
  "/menu",
  "/shop",
  "/products",
  "/collections",
  "/best-sellers",
  "/cart",
  "/checkout",
  "/wishlist",
  "/about",
  "/contact",
  "/faqs",
  "/guide",
  "/terms",
  "/privacy",
  "/shipping-returns",
].map((path, index) => ({
  permissionId: index + 1,
  canView: true,
  canCreate: true,
  canUpdate: true,
  canDelete: true,
  permissionTaskId: index + 1,
  permissionTaskName: path
    .replace(/^\//, "")
    .replaceAll("-", " "),
  path,
  parentId: 0,
  displayOrder: index + 1,
  icon: "Dashboard",
  children: [],
}));

// -----------------------------------------------------------------------------
// TEMPORARY SCENTORA DEMO USER
// -----------------------------------------------------------------------------
// Used until the separate Scentora NestJS backend is created.
function createDemoAdminUser(): User {
  const now = new Date().toISOString();

  return {
    userId: 1,
    username: "admin",
    email: "admin@scentora.local",
    phone: "",
    fullname: "Scentora Admin",
    isActive: true,
    recordStatus: 1,

    // Temporary frontend/demo token
    accessToken: DEMO_ADMIN_ACCESS_TOKEN,

    refreshToken: "scentora-local-demo-refresh-token",

    refreshTokenExpiry: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString(),

    createdBy: 1,
    createdDate: now,

    updatedBy: null,
    updatedDate: null,

    balance: 0,
    isWallet: false,

    useridentifier: "scentora-demo-admin",

    roleId: 1,
    roleName: "Administrator",

    walletBalance: 0,
    currencyCode: "KWD",

    merchantId: null,
    isMerchant: false,
    merchantName: null,

    permissions: demoAdminPermissions,
  };
}

// -----------------------------------------------------------------------------
// OLD API RESPONSE TYPE
// -----------------------------------------------------------------------------
// Kept commented because it will be required when NestJS API authentication
// is implemented.
//
// export type AuthApiResponse = ApiResponse<User>;

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// -----------------------------------------------------------------------------
// LOGIN THUNK
// -----------------------------------------------------------------------------
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      // -----------------------------------------------------------------------
      // TEMPORARY SCENTORA FRONTEND-ONLY LOGIN
      // -----------------------------------------------------------------------
      // This allows the Scentora frontend to work on both localhost and Vercel
      // without calling the old QABot API.
      //
      // Temporary credentials:
      // Username: admin
      // Password: 123456
      //
      // IMPORTANT:
      // This is only for the current frontend/demo stage.
      // Replace this with Scentora NestJS authentication later.
      // -----------------------------------------------------------------------

      const isValidDemoLogin =
        credentials.Username === "admin" &&
        credentials.Password === "123456";

      if (!isValidDemoLogin) {
        return rejectWithValue("Invalid username or password");
      }

      // Create temporary Scentora admin user
      const user = createDemoAdminUser();

      // -----------------------------------------------------------------------
      // CREATE HTTP-ONLY AUTH COOKIES
      // -----------------------------------------------------------------------
      const cookieResponse = await fetch("/api/auth/set-cookies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...user,
          rolesId: user.roleId,
        }),
      });

      if (!cookieResponse.ok) {
        let errorMessage = "Unable to create Scentora session";

        try {
          const errorData = await cookieResponse.json();

          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch {
          // Ignore JSON parsing error
        }

        return rejectWithValue(errorMessage);
      }

      // -----------------------------------------------------------------------
      // STORE FRONTEND SESSION DATA
      // -----------------------------------------------------------------------
      if (typeof window !== "undefined") {
        localStorage.setItem(
          DEMO_ADMIN_SESSION_KEY,
          JSON.stringify(user)
        );

        localStorage.setItem("CurrencyCode", user.currencyCode);
      }

      return user;

      // -----------------------------------------------------------------------
      // OLD API LOGIN - COMMENTED FOR FUTURE NESTJS INTEGRATION
      // -----------------------------------------------------------------------
      /*
      const data = (await apiService.auth.login(
        credentials
      )) as AuthApiResponse;

      if (
        !data.success ||
        data.statusCode !== ApiStatusCodes.SUCCESS
      ) {
        return rejectWithValue(
          data.message || "Login failed"
        );
      }

      const cookieResponse = await fetch(
        "/api/auth/set-cookies",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.result),
          credentials: "include",
        }
      );

      if (!cookieResponse.ok) {
        const errorText = await cookieResponse.text();

        console.error(
          "Failed to set authentication cookies:",
          errorText
        );

        return rejectWithValue(
          "Unable to create authentication session"
        );
      }

      localStorage.setItem(
        "CurrencyCode",
        data.result.currencyCode
      );

      return data.result;
      */
    } catch (error) {
      console.error("Scentora login error:", error);

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Unable to sign in"
      );
    }
  }
);

// -----------------------------------------------------------------------------
// OLD REFRESH TOKEN THUNK
// -----------------------------------------------------------------------------
// Currently disabled because Scentora does not have its NestJS backend yet.
//
// Later:
//
// Scentora FE
//     ↓
// NestJS Refresh Token API
//     ↓
// New Access Token
//     ↓
// /api/auth/set-cookies
//
// -----------------------------------------------------------------------------

/*
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as {
        auth: AuthState;
      };

      const refreshTokenEncoded = state.auth.refreshToken;

      if (!refreshTokenEncoded) {
        return rejectWithValue(
          "No refresh token available"
        );
      }

      const refreshTokenValue =
        decodeURIComponent(refreshTokenEncoded);

      const response = await fetch(
        `${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refreshToken: refreshTokenValue,
          }),
        }
      );

      if (!response.ok) {
        return rejectWithValue(
          "Token refresh failed"
        );
      }

      const result = await response.json();

      if (result.success) {
        const cookieResponse = await fetch(
          "/api/auth/set-cookies",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(result.result),
            credentials: "include",
          }
        );

        if (!cookieResponse.ok) {
          console.error(
            "Failed to update cookies after token refresh"
          );
        }

        if (result.result.currencyCode) {
          localStorage.setItem(
            "CurrencyCode",
            result.result.currencyCode
          );
        }

        return result.result;
      }

      return rejectWithValue(
        "Failed to refresh token"
      );
    } catch (error) {
      console.error(
        "Error refreshing token:",
        error
      );

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Network error occurred during token refresh"
      );
    }
  }
);
*/

// -----------------------------------------------------------------------------
// LOGOUT
// -----------------------------------------------------------------------------
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Clear browser-side session
      if (typeof window !== "undefined") {
        localStorage.removeItem(
          DEMO_ADMIN_SESSION_KEY
        );

        localStorage.removeItem("userName");
        localStorage.removeItem("fullName");
        localStorage.removeItem("email");
        localStorage.removeItem("CurrencyCode");
      }

      // Clear server-side HTTP-only cookies
      const response = await fetch(
        "/api/auth/clear-cookies",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error(
          "Failed to clear authentication cookies"
        );

        return rejectWithValue(
          "Failed to clear authentication session"
        );
      }

      return true;
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Failed to logout"
      );
    }
  }
);

// -----------------------------------------------------------------------------
// SLICE
// -----------------------------------------------------------------------------
const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    restoreAuthSession: (
      state,
      action: PayloadAction<User>
    ) => {
      state.user = action.payload;
      state.token = action.payload.accessToken;
      state.refreshToken =
        action.payload.refreshToken;

      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },

    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // -------------------------------------------------------------------------
    // LOGIN
    // -------------------------------------------------------------------------
    builder
      .addCase(
        loginUser.pending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )

      .addCase(
        loginUser.fulfilled,
        (
          state,
          action: PayloadAction<User>
        ) => {
          state.isLoading = false;

          state.user = action.payload;

          state.token =
            action.payload.accessToken;

          state.refreshToken =
            action.payload.refreshToken;

          state.isAuthenticated = true;

          state.error = null;
        }
      )

      .addCase(
        loginUser.rejected,
        (state, action) => {
          state.isLoading = false;

          state.error =
            (action.payload as string) ||
            "Unable to sign in";
        }
      );

    // -------------------------------------------------------------------------
    // OLD REFRESH TOKEN REDUCERS
    // -------------------------------------------------------------------------
    /*
    builder
      .addCase(
        refreshToken.pending,
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )

      .addCase(
        refreshToken.fulfilled,
        (
          state,
          action: PayloadAction<User>
        ) => {
          state.isLoading = false;
          state.user = action.payload;

          state.token =
            action.payload.accessToken;

          state.refreshToken =
            action.payload.refreshToken;

          state.isAuthenticated = true;
          state.error = null;
        }
      )

      .addCase(
        refreshToken.rejected,
        (state, action) => {
          state.isLoading = false;

          state.error =
            action.payload as string;

          state.user = null;
          state.token = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
        }
      );
    */

    // -------------------------------------------------------------------------
    // LOGOUT
    // -------------------------------------------------------------------------
    builder
      .addCase(
        logoutUser.pending,
        (state) => {
          state.isLoading = true;
        }
      )

      .addCase(
        logoutUser.fulfilled,
        (state) => {
          state.isLoading = false;

          state.user = null;
          state.token = null;
          state.refreshToken = null;

          state.isAuthenticated = false;
          state.error = null;
        }
      )

      .addCase(
        logoutUser.rejected,
        (state, action) => {
          state.isLoading = false;

          state.error =
            (action.payload as string) ||
            "Failed to logout";
        }
      );
  },
});

// -----------------------------------------------------------------------------
// ACTIONS
// -----------------------------------------------------------------------------
export const {
  clearError,
  clearAuth,
  restoreAuthSession,
} = authSlice.actions;

// -----------------------------------------------------------------------------
// SELECTORS
// -----------------------------------------------------------------------------
export const selectAuth = (
  state: { auth: AuthState }
) => state.auth;

export const selectUser = (
  state: { auth: AuthState }
) => state.auth.user;

export const selectIsAuthenticated = (
  state: { auth: AuthState }
) =>
  state.auth.isAuthenticated;

export const selectIsLoading = (
  state: { auth: AuthState }
) =>
  state.auth.isLoading;

export const selectError = (
  state: { auth: AuthState }
) =>
  state.auth.error;

export const selectToken = (
  state: { auth: AuthState }
) =>
  state.auth.token;

export const selectBalance = (
  state: { auth: AuthState }
) =>
  state.auth.user?.walletBalance || 0;

export const selectIsWallet = (
  state: { auth: AuthState }
) =>
  state.auth.user?.isWallet || false;

export const selectPermissions = (
  state: { auth: AuthState }
) =>
  state.auth.user?.permissions || [];

// -----------------------------------------------------------------------------
// GET PERMISSIONS FROM CURRENT REDUX STATE
// -----------------------------------------------------------------------------
export const getPermissionsFromState = (
  state: {
    auth: AuthState;
  }
): Permission[] => {
  return state.auth.user?.permissions || [];
};

// -----------------------------------------------------------------------------
// EXPORT REDUCER
// -----------------------------------------------------------------------------
export default authSlice.reducer;
