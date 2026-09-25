// Cookie constants and types for the application
// These can be imported by both client and server code

// Permission type definition for sidebar items
export interface PermissionItem {
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
  children: PermissionItem[];
}

// Cookie names
export const COOKIE_NAMES = {
  USER_ID: 'user_id',
  USER_NAME: 'user_name',
  SUBSCRIBER_ID: 'subscriber_id',
  EMAIL: 'email',
  PHONE: 'phone',
  COUNTRY_CODE: 'country_code',
  FULL_NAME: 'full_name',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  REFRESH_TOKEN_EXPIRY: 'refresh_token_expiry',
  ROLE_ID: 'role_id',
  IS_AUTHENTICATED: 'is_authenticated',
  RECORD_STATUS: 'record_status',
  IS_ACTIVE: 'is_active',
  CREATED_BY: 'created_by',
  CREATED_DATE: 'created_date',
  UPDATED_BY: 'updated_by',
  UPDATED_DATE: 'updated_date',
  CURRENCY_CODE: 'currency_code',
  PERMISSIONS: 'permissions'
};

// Temporary local-only credentials/session used for frontend flow testing.
export const DEMO_ADMIN_ACCESS_TOKEN = 'scentora-local-demo-token';

// Cookie options for HTTP-only, secure cookies
export const COOKIE_OPTIONS = {
  httpOnly: true, // Cannot be accessed by JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict' as const, // CSRF protection
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};


