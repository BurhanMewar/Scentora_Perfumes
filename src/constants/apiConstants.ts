import { GET } from "@/app/api/form/route";

// API Base URLs
export const API_BASE_URL = "https://qabotapi.consulttechies.com";

// API Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/api/Authentication/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  REFRESH_TOKEN: "/User/refresh-token",
  VERIFY_TOKEN: "/auth/verify",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
} as const;

export const USER_ENDPOINTS = {
  GET_USERS: "/api/Users/GetAllUsers",
  GET_USER_BY_ID: "/api/Users",
  CREATE_USER: "/api/Users",
  UPDATE_USER: "/api/Users",
  DELETE_USER: "/api/Users",
  CHANGE_PASSWORD: "/api/Authentication/ChangePassword",
} as const;

export const ROLE_ENDPOINTS = {
  GET_ALL_ROLES: "/api/Roles",
  GET_ROLE_BY_ID: "/api/Roles/GetRoleById",
  CREATE_ROLE: "/api/Roles",
  UPDATE_ROLE: "/api/Roles",
  DELETE_ROLE: "/api/Roles",
};

export const PERMISSION_ENDPOINTS = {
  GET_ALL_PERMISSION: "/api/Permissions",
  SAVE_BULK_PERMISSION: "/api/Permissions/SavePermissions",
};

export const CLIENT_ENDPOINTS = {
  GET_CLIENTS: "/api/Clients/GetAllClients",
  GET_CLIENT_BY_ID: "/api/Clients/GetClientById",
  CREATE_CLIENT: "/api/Clients",
  UPDATE_CLIENT: "/api/Clients",
  DELETE_CLIENT: "/api/Clients",
};

export const BOTS_ENDPOINTS = {
  GET_BOTS: "/api/Bots/GetAllBots",
  GET_BOT_BY_ID: "/api/Bots/GetBotById",
  CREATE_BOT: "/api/Bots",
  CREATE_BOT_RETRAINING: "/api/Bottrainings/CreateGenralBotTraining",
  UPDATE_BOT: "/api/Bots",
  DELETE_BOT: "/api/Bots",
  GET_BOT_ROLES: "/api/Bots/GetBotRoleMap",
  CREATE_BOT_ROLES: "/api/Bots/CreateBotRoleMap",
};

export const DATABASE_CONNECTIONS_ENDPOINTS = {
  GET_DATABASE_CONNECTIONS: "/api/Databaseconnections",
  GET_DATABASE_CONNECTION_BY_ID:
    "/api/Databaseconnections/GetDatabaseConnectionById",
  CREATE_DATABASE_CONNECTION: "/api/Databaseconnections",
  UPDATE_DATABASE_CONNECTION: "/api/Databaseconnections",
  DELETE_DATABASE_CONNECTION: "/api/Databaseconnections",
  DB_REFRESH_CONNECTION: "/api/Databaseconnections/RefreshDatabaseSchema",
};
export const PERMISSION_TASK_ENDPOINTS = {
  GET_ALL_PERMISSION_TASKS: "/api/Permissiontasks",
  GET_PERMISSION_TASK_BY_ID: "/api/Permissiontasks/GetPermissionTaskById",
  CREATE_PERMISSION_TASK: "/api/Permissiontasks",
  UPDATE_PERMISSION_TASK: "/api/Permissiontasks/UpdatePermissiontask",
  DELETE_PERMISSION_TASK: "/api/Permissiontasks",
};
export const DATABASE_TABLES_ENDPOINTS = {
  GET_DATABASE_TABLES: "/api/Databasetables",
  GET_DATABASE_TABLE_BY_ID: "/api/Databasetables",
  GET_DATABASE_TABLE_ROLES: "/api/Databasetables/GetDatabaseTableRoleMap",
  CREATE_DATABASE_TABLE_ROLES: "/api/Databasetables/CreateDatabaseTableRoleMap",
};

export const CONVERSATION_REPORT_ENDPOINTS = {
  GET_CONVERSATION_REPORTS: "#",
  GET_CONVERSATION_REPORT_BY_ID: "#",
};

export const APPSETTING_ENDPOINTS = {
  GET_APPSETTINGS: "#",
  GET_APPSETTING_BY_ID: "#",
  UPDATE_APPSETTING: "#",
};

export const SYSTEMSETTING_ENDPOINTS = {
  GET_SYSTEMSETTINGS: "#",
  GET_SYSTEMSETTING_BY_ID: "#",
  UPDATE_SYSTEMSETTING: "#",
  CREATE_SYSTEMSETTING: "#",
  DELETE_SYSTEMSETTING: "#",
  SYSTEMSETTING_DROPDOWN: "#",
};
export const TEXT_ENHANCEMENT_ENDPOINTS = {
  TEXT_ENHANCEMENT: "/api/TextEnhancement/process",
};
export const DROPDOWN_ENDPOINTS = {
  GET_ROLE_DROPDOWN: "/api/Roles/GetRoles",
  GET_USER_DROPDOWN: "/Dropdown/GetUserDropdown",
  GET_PERMISSIONTASK_DROPDOWN: "/api/Permissiontasks/GetPermissionTask",
  GET_BOTS_DROPDOWN: "/api/Bots/GetBots",
  GET_CLIENT_DROPDOWN: "api/Clients/GetClients",
  GET_DBCONNECTION_DROPDOWN: "/api/Databaseconnections/GetDatabaseConnetion",
  GET_DBTABLE_DROPDOWN: "/api/Databasetables/GetDatabasetables",
  GET_ROLES_DROPDOWN_BY_BOTID: "/api/Roles/GetRolesByBotId",
  GET_LANGUAGE_DROPDOWN: "/api/Language",
};

export const DOCUMENT_GROUP_ENDPOINTS = {
  GET_DOCUMENT_GROUPS: "/api/Documentgroups/GetAllDocumentGroup",
  CREATE_DOCUMENT_GROUP: "/api/Documentgroups",
  DELETE_DOCUMENT_GROUP: "/api/Documentgroups",
  GET_DOCUMENTGROUP_ROLE: "/api/Documentgroups/GetDocumentGroupRoleMap",
  CREATE_DOCUMENTGROUP_ROLE: "/api/Documentgroups/CreateDocumentGroupRoleMap",
};

export const DOCUMENT_ENDPOINT = {
  GET_DOCUMENTS: "/api/Documents/GetAllDocuments",
  UPLOAD_DOCUMENT: "/api/Documents/UploadDocument",
  DELETE_DOCUMENT: "/api/Documents",
};

export const DATABASE_COLUMNS_ENDPOINTS = {
  GET_DATABASE_COLUMNS: "/api/Databasetablescolumns",
  GET_DATABASE_COLUMN_BY_ID:
    "/api/Databasetablescolumns/GetDatabaseTableColumnById",
};

export const TABCOL_TRAINING_ENDPOINTS = {
  GET_TABCOL_TRAINING: "#",
  GET_TABCOL_TRAINING_BY_ID: "#",
  CREATE_TABCOL_TRAINING: "/api/Bottrainings",
  UPDATE_TABCOL_TRAINING: "#",
  DELETE_TABCOL_TRAINING: "#",
};

export const CONVERSATION_ENDPOINT = {
  GET_USER_CONVERSATION: "/api/Conversations/GetUserConversations",
  GET_CONVERSATION_MESSAGE: "/api/Conversations/GetConversationMessage",
  SEND_MESSAGE: "/api/Conversations/GetResponse",
};
export const SYNONYM_ENDPOINTS = {
  GET_SYNONYMS: "/api/Synonym",
  GET_SYNONYM_BY_ID: "/api/Synonym/GetSynonymById",
  CREATE_SYNONYM: "/api/Synonym/CreateSynonym",
  UPDATE_SYNONYM: "/api/Synonym/UpdateSynonym",
};
export const BOT_RESPONCE_RATING_ENDPOINTS = {
  SEND_BOT_RESPONCE_RATING: "/api/BotResponseRating",
  GET_BOT_RESPONCE_RATING: "/api/BotResponseRating",
};

export const SUBSCRIBER_ENDPOINTS = {
  GET_SUBSCRIBERS: "/api/Subscriber/GetAllSubscriber",
  GET_SUBSCRIBER_BY_ID: "/api/Subscriber/GetSubscriberById",
  CREATE_SUBSCRIBER: "/api/Subscriber",
};
