import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/AuthSlice";
import userReducer from "../slice/UserSlice";
import roleReducer from "../slice/RoleSlice";
import permissionReducer from "../slice/PermissionSlice";
import appsettingReducer from "../slice/AppSettingSlice";
import permissionTaskReducer from "../slice/PermissionTaskSlice";
import dropdownReducer from "../slice/DropdownSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    role: roleReducer,
    permission: permissionReducer,
    appsetting: appsettingReducer,
    permissionTask: permissionTaskReducer,
    dropdown: dropdownReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
