"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { loginUser, clearError } from "../../../slice/AuthSlice";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import DynamicButton from "@/components/DynamicButton";
const LoginPage: React.FC = () => {
  const [credentials, setCredentials] = useState({
    Username: "",
    Password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector(
    (state: any) => state.auth
  ) as {
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    user: any;
  };

  useEffect(() => {
    if (isAuthenticated && user) router.replace("/cms");
  }, [isAuthenticated, router, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser(credentials));

    // Check if login was successful and redirect to first permission's pathname
    if (loginUser.fulfilled.match(result)) {
      const user = result.payload;

      localStorage.setItem("userName", user.username);
      localStorage.setItem("fullName", user.fullname);
      localStorage.setItem("email", user.email);

      if (user.permissions && user.permissions.length > 0) {
        
        const validPermission = user.permissions.find(
          (p: any) => p.path && p.path.trim() !== "/"
        );

        if (validPermission) {
          router.push(validPermission.path || "/");
        } else {
          // If no valid path found, fallback to "/"
          router.push("/bot");
        }
      } else {
        router.push("/bot");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 0,
          display: "flex",
          minHeight: "500px",
          width: {
            xs: "100%", // full width on phones
            sm: "90%", // slightly narrower on tablets
            md: "80%", // a bit narrower on medium screens
            lg: "1200px", // fixed cap on large screens
          },
          position: "relative",
        }}
      >
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            color: "text.secondary",
            fontSize: "0.75rem",
            whiteSpace: "nowrap",
            zIndex: 1,
          }}
        >
          © Powered by Scentora. All rights reserved.
        </Typography>
        {/* Left Side - Logo */}
        <Box
          sx={{
            flex: 1,
            mb: 9,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/Logo/Empowertechnology.png"
            alt="EMP Logo"
            style={{
              maxWidth: "80%",
              maxHeight: "80%",
              width: "auto",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Box>

        {/* Right Side - Login Form */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => dispatch(clearError())}
              >
                {error}
              </Alert>
            )}

            <Alert severity="info" sx={{ mb: 2 }}>
              Temporary demo login: <strong>admin</strong> / <strong>123456</strong>
            </Alert>

            <TextField
              fullWidth
              label="User Name"
              name="Username"
              value={credentials.Username}
              onChange={handleInputChange}
              margin="normal"
              required
              autoComplete="username"
              autoFocus
              InputLabelProps={{
                shrink: Boolean(true), // Shrinks label if value exists
              }}
            />

            <TextField
              fullWidth
              label="Password"
              name="Password"
              type={showPassword ? "text" : "password"}
              value={credentials.Password}
              onChange={handleInputChange}
              margin="normal"
              required
              InputLabelProps={{
                shrink: Boolean(true), // Shrinks label if value exists
              }}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <DynamicButton
              sx={{ mt: 3, mb: 2, width: "100%" }}
              type="submit"
              variant="primary"
              size="medium"
            >
              {isLoading ? "Logging in..." : "Login"}
            </DynamicButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
