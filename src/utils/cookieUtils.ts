// Server-side cookie utilities for secure authentication
// These functions will be called from API routes to set HTTP-only cookies
"use server";
import { cookies } from "next/headers";
import { promisify } from "util";
import { gzip, gunzip } from "zlib";
import {
  COOKIE_NAMES,
  COOKIE_OPTIONS,
  PermissionItem,
} from "./cookieConstants";

// Convert gzip callback functions to async/await
const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

// Compression utilities
const compressString = async (input: string): Promise<string> => {
  try {
    const buffer = Buffer.from(input, "utf8");
    const compressed = await gzipAsync(buffer);
    return compressed.toString("base64");
  } catch (error) {
    console.error("Compression error:", error);
    throw error;
  }
};

const decompressString = async (input: string): Promise<string> => {
  try {
    const buffer = Buffer.from(input, "base64");
    const decompressed = await gunzipAsync(buffer);
    return decompressed.toString("utf8");
  } catch (error) {
    console.error("Decompression error:", error);
    throw error;
  }
};

// Set HTTP-only cookie (called from server-side)
export const setHttpOnlyCookie = async (
  res: any,
  name: string,
  value: string
) => {
  res.setHeader(
    "Set-Cookie",
    `${name}=${value}; HttpOnly; Path=/; Max-Age=${COOKIE_OPTIONS.maxAge}; ${
      COOKIE_OPTIONS.secure ? "Secure;" : ""
    } SameSite=${COOKIE_OPTIONS.sameSite}`
  );
};

// Set all user data as HTTP-only cookies using Next.js App Router
export const setUserHttpOnlyCookies = async (userData: any) => {
  try {
    // Set each cookie individually using Next.js cookies() method
    const cookieStore = await cookies();
    
    // Helper function to safely set cookie value
    const setCookie = (name: string, value: any) => {
      if (value !== undefined && value !== null) {
        const cookieValue = String(value);
        const cookieOptions = {
          httpOnly: true,
          secure:
            process.env.NODE_ENV === "production" || process.env.VERCEL === "1", // Secure in production and Vercel
          sameSite: "lax" as const, // Use 'lax' for better compatibility with IIS
          path: "/",
          maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        };

        cookieStore.set(name, cookieValue, cookieOptions);
      } else {
        console.log(`Skipping cookie ${name} - value is ${value}`);
      }
    };

    // Set all user cookies
    setCookie(COOKIE_NAMES.USER_ID, userData.userId);
    setCookie(COOKIE_NAMES.ROLE_ID, userData.rolesId);
    setCookie(COOKIE_NAMES.SUBSCRIBER_ID, userData.subscriberId);
    setCookie(COOKIE_NAMES.USER_NAME, userData.username ?? userData.userName);
    setCookie(COOKIE_NAMES.EMAIL, userData.email ?? userData.emailAddress);
    setCookie(COOKIE_NAMES.PHONE, userData.phone ?? userData.phoneNumber);
    setCookie(COOKIE_NAMES.COUNTRY_CODE, userData.countryCode ?? userData.isdcode);
    setCookie(COOKIE_NAMES.FULL_NAME, userData.fullname ?? userData.fullName);
    setCookie(COOKIE_NAMES.ACCESS_TOKEN, userData.accessToken);
    setCookie(COOKIE_NAMES.REFRESH_TOKEN, userData.refreshToken);
    setCookie(COOKIE_NAMES.REFRESH_TOKEN_EXPIRY, userData.refreshTokenExpiry);
    setCookie(COOKIE_NAMES.IS_AUTHENTICATED, "true");
    setCookie(COOKIE_NAMES.RECORD_STATUS, userData.recordStatus);
    setCookie(COOKIE_NAMES.IS_ACTIVE, userData.isActive);
    setCookie(COOKIE_NAMES.CREATED_BY, userData.createdBy);
    setCookie(COOKIE_NAMES.CREATED_DATE, userData.createdDate);
    setCookie(COOKIE_NAMES.UPDATED_BY, userData.updatedBy);
    setCookie(COOKIE_NAMES.UPDATED_DATE, userData.updatedDate);
    setCookie(COOKIE_NAMES.CURRENCY_CODE, userData.currencyCode);

    // Store permissions in cookies using compression
    if (userData.permissions) {
      try {
        const permissionsJson = JSON.stringify(userData.permissions);
        const compressedPermissions = await compressString(permissionsJson);
        setCookie(COOKIE_NAMES.PERMISSIONS, compressedPermissions);
      } catch (error) {
        console.error("❌ Error compressing permissions for cookie:", error);
      }
    } else {
      console.log("⚠️ No permissions data found in userData");
    }
    // Verify cookies were set by reading them back
    const verifyCookies = async () => {
      try {
        const verifyCookie = async (name: string, description: string) => {
          const cookieValue = await cookieStore.get(name);
          if (name === COOKIE_NAMES.PERMISSIONS && cookieValue) {
          }
        };

        await verifyCookie(COOKIE_NAMES.USER_ID, "userId");
        await verifyCookie(COOKIE_NAMES.ACCESS_TOKEN, "accessToken");
        await verifyCookie(COOKIE_NAMES.PERMISSIONS, "permissions");
      } catch (error) {
        console.error("Error verifying cookies:", error);
      }
    };

    await verifyCookies();
  } catch (error) {
    console.error("Error in setUserHttpOnlyCookies:", error);
    throw error;
  }
};

// Clear all HTTP-only cookies using Next.js App Router
export const clearUserHttpOnlyCookies = async () => {
  try {
    const cookieStore = await cookies();

    // Clear all cookies by setting them to expire immediately
    Object.values(COOKIE_NAMES).forEach((name) => {
      cookieStore.set(name, "", {
        httpOnly: true,
        secure:
          process.env.NODE_ENV === "production" || process.env.VERCEL === "1",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
      });
    });
  } catch (error) {
    console.error("Error in clearUserHttpOnlyCookies:", error);
    throw error;
  }
};

// Get cookie value from request using Next.js App Router
export const getCookieFromRequest = async (
  name: string
): Promise<string | undefined> => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
  } catch (error) {
    console.error(`Error getting cookie ${name}:`, error);
    return undefined;
  }
};

// Get user data from request cookies using Next.js App Router
export const getUserFromRequestCookies = async () => {
  try {
    const cookieStore = await cookies();

    const userId = await getCookieFromRequest(COOKIE_NAMES.USER_ID);
    const userName = await getCookieFromRequest(COOKIE_NAMES.USER_NAME);
    const email = await getCookieFromRequest(COOKIE_NAMES.EMAIL);
    const phone = await getCookieFromRequest(COOKIE_NAMES.PHONE);
    const countryCode = await getCookieFromRequest(COOKIE_NAMES.COUNTRY_CODE);
    const fullName = await getCookieFromRequest(COOKIE_NAMES.FULL_NAME);
    const accessToken = await getCookieFromRequest(COOKIE_NAMES.ACCESS_TOKEN);
    const rolesId = await getCookieFromRequest(COOKIE_NAMES.ROLE_ID);
    const isAuthenticated = await getCookieFromRequest(
      COOKIE_NAMES.IS_AUTHENTICATED
    );
    const recordStatus = await getCookieFromRequest(COOKIE_NAMES.RECORD_STATUS);
    const isActive = await getCookieFromRequest(COOKIE_NAMES.IS_ACTIVE);
    const createdBy = await getCookieFromRequest(COOKIE_NAMES.CREATED_BY);
    const createdDate = await getCookieFromRequest(COOKIE_NAMES.CREATED_DATE);
    const updatedBy = await getCookieFromRequest(COOKIE_NAMES.UPDATED_BY);
    const updatedDate = await getCookieFromRequest(COOKIE_NAMES.UPDATED_DATE);
    const currencyCode = await getCookieFromRequest(COOKIE_NAMES.CURRENCY_CODE);

    if (!userId || !accessToken) {
      return null;
    }

    return {
      userId: parseInt(userId),
      userName: userName || "",
      emailAddress: email || "",
      phoneNumber: phone || "",
      countryCode: countryCode || "",
      fullName: fullName || "",
      rolesId: rolesId,
      accessToken,
      isActive: isActive === "true",
      recordStatus: recordStatus ? parseInt(recordStatus) : 0,
      createdBy: createdBy ? parseInt(createdBy) : 0,
      createdDate: createdDate || "",
      updatedBy: updatedBy ? parseInt(updatedBy) : null,
      updatedDate: updatedDate || null,
      currencyCode: currencyCode || "",
    };
  } catch (error) {
    console.error("Error getting user from cookies:", error);
    return null;
  }
};

// Get permissions from cookies using decompression
export const getPermissionsFromCookie = async (): Promise<PermissionItem[]> => {
  try {
    const permissionsCookie = await getCookieFromRequest(
      COOKIE_NAMES.PERMISSIONS
    );

    if (!permissionsCookie) {
      return [];
    }

    const decompressedJson = await decompressString(permissionsCookie);

    // Parse the JSON back to permissions array
    const permissions = JSON.parse(decompressedJson) as PermissionItem[];
    return permissions;
  } catch (error) {
    console.error("❌ Error getting permissions from cookie:", error);
    return [];
  }
};
