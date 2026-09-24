"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { loginUser, clearError } from "../../../slice/AuthSlice";
import {
  Alert,
  Box,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import DynamicButton from "@/components/DynamicButton";

const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({ Username: "", Password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state: any) => state.auth,
  ) as {
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    user: any;
  };

  useEffect(() => {
    if (isAuthenticated && user) router.replace("/cms");
  }, [isAuthenticated, router, user]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser(credentials));

    if (loginUser.fulfilled.match(result)) {
      const loggedInUser = result.payload;
      localStorage.setItem("userName", loggedInUser.username);
      localStorage.setItem("fullName", loggedInUser.fullname);
      localStorage.setItem("email", loggedInUser.email);

      const permissionPath = loggedInUser.permissions?.find(
        (permission: any) => permission.path && permission.path.trim() !== "/",
      )?.path;
      router.push(permissionPath || "/bot");
    }
  };

  return (
    <Box className="scent-login-page">
      <Paper className="scent-login-card" elevation={0}>
        <Box className="scent-login-art" aria-hidden="true">
          <div className="scent-orbit scent-orbit-one" />
          <div className="scent-orbit scent-orbit-two" />
          <div className="scent-orbit scent-orbit-three" />
          <div className="scent-glow scent-glow-one" />
          <div className="scent-glow scent-glow-two" />
          <div className="scent-art-copy">
            <span className="scent-mark">S</span>
            <Typography component="p" className="scent-wordmark">SCENTORA</Typography>
            <Typography component="p" className="scent-tagline">
              Timeless scents, lasting impressions.
            </Typography>
            <span className="scent-note">AMBER · ROSE · OUD</span>
          </div>
          <span className="scent-art-caption">A WORLD OF SCENT, BEAUTIFULLY CURATED</span>
        </Box>

        <Box className="scent-login-form-panel">
          <Box className="scent-login-form-content">
            <Typography component="p" className="scent-eyebrow">SCENTORA CONTENT STUDIO</Typography>
            <Typography component="h1" className="scent-login-title">Welcome back</Typography>
            <Typography component="p" className="scent-login-description">
              Sign in to shape your storefront.
            </Typography>

            {error ? (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>
                {error}
              </Alert>
            ) : null}

            <Alert severity="info" className="scent-demo-hint">
              Demo access: <strong>admin</strong> / <strong>123456</strong>
            </Alert>

            <Box component="form" onSubmit={handleSubmit} className="scent-login-form">
              <TextField
                fullWidth
                label="Username"
                name="Username"
                value={credentials.Username}
                onChange={(event) => setCredentials((current) => ({ ...current, Username: event.target.value }))}
                required
                autoComplete="username"
                autoFocus
              />
              <TextField
                fullWidth
                label="Password"
                name="Password"
                type={showPassword ? "text" : "password"}
                value={credentials.Password}
                onChange={(event) => setCredentials((current) => ({ ...current, Password: event.target.value }))}
                required
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((visible) => !visible)}
                        edge="end"
                        sx={{ color: "#a15d2d", "&:hover": { backgroundColor: "#f8ead5" } }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <DynamicButton
                type="submit"
                variant="primary"
                size="medium"
                disabled={isLoading}
                sx={{
                  width: "100%",
                  minHeight: 48,
                  mt: 1,
                  borderRadius: "10px",
                  backgroundColor: "#a85d2a",
                  color: "#fffaf2",
                  "&:hover": { backgroundColor: "#88461f" },
                  "&.Mui-disabled": { backgroundColor: "#c9a58d", color: "#fffaf2" },
                }}
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </DynamicButton>
            </Box>
            <Typography component="p" className="scent-login-footnote">
              © {new Date().getFullYear()} Scentora
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
