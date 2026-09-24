import proxyService from "./proxyService";
import {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  ROLE_ENDPOINTS,
  PERMISSION_ENDPOINTS,
  CLIENT_ENDPOINTS,
  PERMISSION_TASK_ENDPOINTS,
  BOTS_ENDPOINTS,
  DATABASE_CONNECTIONS_ENDPOINTS,
  DATABASE_TABLES_ENDPOINTS,
  CONVERSATION_REPORT_ENDPOINTS,
  APPSETTING_ENDPOINTS,
  SYSTEMSETTING_ENDPOINTS,
  DROPDOWN_ENDPOINTS,
  DOCUMENT_GROUP_ENDPOINTS,
  DOCUMENT_ENDPOINT,
  DATABASE_COLUMNS_ENDPOINTS,
  TABCOL_TRAINING_ENDPOINTS,
  CONVERSATION_ENDPOINT,
  BOT_RESPONCE_RATING_ENDPOINTS,
  TEXT_ENHANCEMENT_ENDPOINTS,
  SYNONYM_ENDPOINTS,
  SUBSCRIBER_ENDPOINTS,
} from "../constants";
import formDataService from "@/utils/formDataService";
import { create } from "axios";

// Generic API response type
export interface ApiResult<T = any> {
  success: boolean;
  result: T;
  message: string;
  statusCode: number;
}

// Auth API methods
export const authAPI = {
  login: (Credentials: any) =>
    proxyService.post(AUTH_ENDPOINTS.LOGIN, Credentials),

  register: (userData: any) =>
    proxyService.post(AUTH_ENDPOINTS.REGISTER, userData),

  logout: (token: string) =>
    proxyService.post(
      AUTH_ENDPOINTS.LOGOUT,
      {},
      { Authorization: `Bearer ${token}` }
    ),

  refreshToken: (refreshToken: string) =>
    proxyService.post(AUTH_ENDPOINTS.REFRESH_TOKEN, { refreshToken }),
};

export const userAPI = {
  getUsers: () => proxyService.get(USER_ENDPOINTS.GET_USERS),

  getUserById: (id: string) =>
    proxyService.get(USER_ENDPOINTS.GET_USER_BY_ID, { id }),

  createUser: (userData: any) =>
    proxyService.post(USER_ENDPOINTS.CREATE_USER, userData),

  updateUser: (userData: any) =>
    proxyService.put(USER_ENDPOINTS.UPDATE_USER, userData),

  deleteUser: (id: any) =>
    proxyService.delete(USER_ENDPOINTS.DELETE_USER, { id }),

  changePassword: (userData: any) =>
    proxyService.post(USER_ENDPOINTS.CHANGE_PASSWORD, userData),
};

// Generic API method for custom endpoints
export const customAPI = {
  get: (endpoint: string, params?: Record<string, string>) =>
    proxyService.get(endpoint, params),

  post: (endpoint: string, data?: any, headers?: Record<string, string>) =>
    proxyService.post(endpoint, data, headers),

  put: (endpoint: string, data?: any, headers?: Record<string, string>) =>
    proxyService.put(endpoint, data, headers),

  patch: (endpoint: string, data?: any, headers?: Record<string, string>) =>
    proxyService.patch(endpoint, data, headers),

  delete: (endpoint: string, headers?: Record<string, string>) =>
    proxyService.delete(endpoint, headers),
};

export const permissionTaskAPI = {
  getPermissionTask: (params?: Record<string, string>) =>
    proxyService.get(
      PERMISSION_TASK_ENDPOINTS.GET_ALL_PERMISSION_TASKS,
      params
    ),

  getPermissionTaskById: (id: string) =>
    proxyService.get(PERMISSION_TASK_ENDPOINTS.GET_PERMISSION_TASK_BY_ID, {
      id,
    }),

  createPermissionTask: (permissionData: any) =>
    proxyService.post(
      PERMISSION_TASK_ENDPOINTS.CREATE_PERMISSION_TASK,
      permissionData
    ),

  updatePermissionTask: (permissionData: any) =>
    proxyService.put(
      PERMISSION_TASK_ENDPOINTS.UPDATE_PERMISSION_TASK,
      permissionData
    ),

  deletePermissionTask: (id: any) =>
    proxyService.delete(PERMISSION_TASK_ENDPOINTS.DELETE_PERMISSION_TASK, {
      id,
    }),
};

export const roleAPI = {
  getRoles: (params?: Record<string, string>) =>
    proxyService.get(ROLE_ENDPOINTS.GET_ALL_ROLES, params),

  getRoleById: (id: string) =>
    proxyService.get(ROLE_ENDPOINTS.GET_ROLE_BY_ID, { id }),

  createRole: (roleData: any) =>
    proxyService.post(ROLE_ENDPOINTS.CREATE_ROLE, roleData),

  updateRole: (roleData: any) =>
    proxyService.put(ROLE_ENDPOINTS.UPDATE_ROLE, roleData),

  deleteRole: (id: string) =>
    proxyService.delete(ROLE_ENDPOINTS.DELETE_ROLE, { id }),
};

export const permissionAPI = {
  getPermissions: (params?: Record<string, string>) =>
    proxyService.get(PERMISSION_ENDPOINTS.GET_ALL_PERMISSION, params),
  savePermission: (permissionData: any) =>
    proxyService.post(
      PERMISSION_ENDPOINTS.SAVE_BULK_PERMISSION,
      permissionData
    ),
};

export const clientAPI = {
  getClients: () => proxyService.get(CLIENT_ENDPOINTS.GET_CLIENTS),

  getClientById: (id: string) =>
    proxyService.get(CLIENT_ENDPOINTS.GET_CLIENT_BY_ID, { id }),

  createClient: (clientData: any) =>
    formDataService.post(CLIENT_ENDPOINTS.CREATE_CLIENT, clientData),

  updateClient: (clientData: any) =>
    formDataService.put(CLIENT_ENDPOINTS.UPDATE_CLIENT, clientData),

  deleteClient: (id: any) =>
    proxyService.delete(CLIENT_ENDPOINTS.DELETE_CLIENT, { id }),
};

export const botAPI = {
  getBots: () => proxyService.get(BOTS_ENDPOINTS.GET_BOTS),
  createBotRetrain: (botData: any) =>
    proxyService.post(BOTS_ENDPOINTS.CREATE_BOT_RETRAINING, botData),
  getBotById: (id: string) =>
    proxyService.get(BOTS_ENDPOINTS.GET_BOT_BY_ID, { id }),

  createBot: (botData: any) =>
    formDataService.post(BOTS_ENDPOINTS.CREATE_BOT, botData),

  updateBot: (botData: any) =>
    formDataService.put(BOTS_ENDPOINTS.UPDATE_BOT, botData),

  deleteBot: (id: any) =>
    proxyService.delete(BOTS_ENDPOINTS.DELETE_BOT, { id }),

  getBotRole: (BotId: string) =>
    proxyService.get(BOTS_ENDPOINTS.GET_BOT_ROLES, { BotId }),
  createBotRole: (botData: any) =>
    proxyService.post(BOTS_ENDPOINTS.CREATE_BOT_ROLES, botData),
};
export const dropdownAPI = {
  getRoleDropdown: () => proxyService.get(DROPDOWN_ENDPOINTS.GET_ROLE_DROPDOWN),
  getPermissionTaskDropdown: (params?: Record<string, string>) =>
    proxyService.get(DROPDOWN_ENDPOINTS.GET_PERMISSIONTASK_DROPDOWN, params),
  getUserDropdown: () => proxyService.get(DROPDOWN_ENDPOINTS.GET_USER_DROPDOWN),
  getBotsDropdown: () => proxyService.get(DROPDOWN_ENDPOINTS.GET_BOTS_DROPDOWN),
  getClientDropdown: () =>
    proxyService.get(DROPDOWN_ENDPOINTS.GET_CLIENT_DROPDOWN),
  getDatabaseConnectionDropdown: () =>
    proxyService.get(DROPDOWN_ENDPOINTS.GET_DBCONNECTION_DROPDOWN),
  getDatabaseTableDropdown: (connectionId: string) =>
    proxyService.get(DROPDOWN_ENDPOINTS.GET_DBTABLE_DROPDOWN, {
      connectionId,
    }),
  getRoleDropdownByBotId: (botId: string) =>
    proxyService.get(DROPDOWN_ENDPOINTS.GET_ROLES_DROPDOWN_BY_BOTID, { botId }),
  getLanguageDropdown: () =>
    proxyService.get(DROPDOWN_ENDPOINTS.GET_LANGUAGE_DROPDOWN),
};
export const databaseConnectionsAPI = {
  getDatabaseConnections: () =>
    proxyService.get(DATABASE_CONNECTIONS_ENDPOINTS.GET_DATABASE_CONNECTIONS),

  getDatabaseConnectionById: (id: string) =>
    proxyService.get(
      DATABASE_CONNECTIONS_ENDPOINTS.GET_DATABASE_CONNECTION_BY_ID,
      { id }
    ),

  createDatabaseConnection: (connectionData: any) =>
    proxyService.post(
      DATABASE_CONNECTIONS_ENDPOINTS.CREATE_DATABASE_CONNECTION,
      connectionData
    ),

  updateDatabaseConnection: (connectionData: any) =>
    proxyService.put(
      DATABASE_CONNECTIONS_ENDPOINTS.UPDATE_DATABASE_CONNECTION,
      connectionData
    ),

  deleteDatabaseConnection: (connectionId: any) =>
    proxyService.delete(
      DATABASE_CONNECTIONS_ENDPOINTS.DELETE_DATABASE_CONNECTION,
      { connectionId }
    ),

  refreshDatabaseConnection: (connectionId: any) =>
    proxyService.put(
      `${DATABASE_CONNECTIONS_ENDPOINTS.DB_REFRESH_CONNECTION}?connectionId=${connectionId}`
    ),
};
export const databaseTablesAPI = {
  getDatabaseTables: (filters: any) =>
    proxyService.get(DATABASE_TABLES_ENDPOINTS.GET_DATABASE_TABLES, filters),
  getDatabaseTableById: (connectionId: string) =>
    proxyService.get(DATABASE_TABLES_ENDPOINTS.GET_DATABASE_TABLE_BY_ID, {
      connectionId,
    }),
  getDatabaseTableRoles: (databasetableid: string) =>
    proxyService.get(DATABASE_TABLES_ENDPOINTS.GET_DATABASE_TABLE_ROLES, {
      databasetableid,
    }),
  createDatabaseTableRoles: (tableRoleData: any) =>
    proxyService.post(
      DATABASE_TABLES_ENDPOINTS.CREATE_DATABASE_TABLE_ROLES,
      tableRoleData
    ),
};

export const conversationReportAPI = {
  getConversationReports: (filters: any) =>
    proxyService.get(CONVERSATION_REPORT_ENDPOINTS.GET_CONVERSATION_REPORTS),
  getConversationReportById: (id: string) =>
    proxyService.get(
      CONVERSATION_REPORT_ENDPOINTS.GET_CONVERSATION_REPORT_BY_ID,
      { id }
    ),
};
export const appsettingAPI = {
  getAppsettings: () => proxyService.get(APPSETTING_ENDPOINTS.GET_APPSETTINGS),
  getAppsettingById: (id: string) =>
    proxyService.get(APPSETTING_ENDPOINTS.GET_APPSETTING_BY_ID, { id }),
  updateAppsetting: (appsettingData: any) =>
    proxyService.put(APPSETTING_ENDPOINTS.UPDATE_APPSETTING, appsettingData),
};
export const systemsettingAPI = {
  getSystemsettings: () =>
    proxyService.get(SYSTEMSETTING_ENDPOINTS.GET_SYSTEMSETTINGS),
  getSystemsettingById: (id: string) =>
    proxyService.get(SYSTEMSETTING_ENDPOINTS.GET_SYSTEMSETTING_BY_ID, { id }),
  updateSystemsetting: (systemsettingData: any) =>
    proxyService.put(
      SYSTEMSETTING_ENDPOINTS.UPDATE_SYSTEMSETTING,
      systemsettingData
    ),
  createSystemsetting: (systemsettingData: any) =>
    proxyService.post(
      SYSTEMSETTING_ENDPOINTS.CREATE_SYSTEMSETTING,
      systemsettingData
    ),
  deleteSystemsetting: (id: string) =>
    proxyService.delete(SYSTEMSETTING_ENDPOINTS.DELETE_SYSTEMSETTING, { id }),
};

export const documentGroupAPI = {
  getDocumentGroups: (botId: string) =>
    proxyService.get(DOCUMENT_GROUP_ENDPOINTS.GET_DOCUMENT_GROUPS, {botId}),
  createDocumentGroup: (documentGroupData: any) =>
    proxyService.post(
      DOCUMENT_GROUP_ENDPOINTS.CREATE_DOCUMENT_GROUP,
      documentGroupData
    ),
  deleteDocumentGroup: (id: string) =>
    proxyService.delete(DOCUMENT_GROUP_ENDPOINTS.DELETE_DOCUMENT_GROUP, {
      id,
    }),
  getDocumentGroupRole: (documentGroupId: string) =>
    proxyService.get(DOCUMENT_GROUP_ENDPOINTS.GET_DOCUMENTGROUP_ROLE, {
      documentGroupId,
    }),
  createDocumentGroupRole: (documentGroupRoleData: any) =>
    proxyService.post(
      DOCUMENT_GROUP_ENDPOINTS.CREATE_DOCUMENTGROUP_ROLE,
      documentGroupRoleData
    ),
};
export const databaseColumnsAPI = {
  getDatabaseColumn: (filters: any) =>
    proxyService.get(DATABASE_COLUMNS_ENDPOINTS.GET_DATABASE_COLUMNS, filters),
  getDatabaseColumnById: (connectionId: string) =>
    proxyService.get(DATABASE_COLUMNS_ENDPOINTS.GET_DATABASE_COLUMN_BY_ID, {
      connectionId,
    }),
};
export const documentAPI = {
  getDocuments: (DocumentGroupId: any) =>
    proxyService.get(DOCUMENT_ENDPOINT.GET_DOCUMENTS, DocumentGroupId),
  uploadDocument: (documentData: any) =>
    formDataService.post(DOCUMENT_ENDPOINT.UPLOAD_DOCUMENT, documentData),
  deleteDocument: (id: any) =>
    proxyService.delete(DOCUMENT_ENDPOINT.DELETE_DOCUMENT, { id }),
};

export const tabColTrainingAPI = {
  tabColTraining: (data: any) =>
    proxyService.post(TABCOL_TRAINING_ENDPOINTS.CREATE_TABCOL_TRAINING, data),
};

export const conversationAPI = {
  getConversation: (userId: any, botId: any) =>
    proxyService.get(CONVERSATION_ENDPOINT.GET_USER_CONVERSATION, {
      userId,
      botId,
    }),
  getConversationMessage: (id: any) =>
    proxyService.get(CONVERSATION_ENDPOINT.GET_CONVERSATION_MESSAGE, { id }),
  sendMessage: (data: any) =>
    formDataService.post(CONVERSATION_ENDPOINT.SEND_MESSAGE, data),
};

export const botResponceRatingAPI = {
  sendBotRespoceRating: (data: any) =>
    proxyService.post(
      BOT_RESPONCE_RATING_ENDPOINTS.SEND_BOT_RESPONCE_RATING,
      data
    ),
  getBotRespoceRating: (botId: any) =>
    proxyService.get(
      BOT_RESPONCE_RATING_ENDPOINTS.GET_BOT_RESPONCE_RATING,
      {botId}
    ),
};
export const synonymAPI = {
  getSynonyms: () => proxyService.get(SYNONYM_ENDPOINTS.GET_SYNONYMS),
  getSynonymById: (id: string) =>
    proxyService.get(SYNONYM_ENDPOINTS.GET_SYNONYM_BY_ID, { id }),
  createSynonym: (synonymData: any) =>
    proxyService.post(SYNONYM_ENDPOINTS.CREATE_SYNONYM, synonymData),
  updateSynonym: (synonymData: any) =>
    proxyService.put(SYNONYM_ENDPOINTS.UPDATE_SYNONYM, synonymData),
};
export const subscriberAPI = {
  getSubscribers: () => proxyService.get(SUBSCRIBER_ENDPOINTS.GET_SUBSCRIBERS),
  getSubscriberById: (id: string) =>
    proxyService.get(SUBSCRIBER_ENDPOINTS.GET_SUBSCRIBER_BY_ID, { id }),
  createSubscriber: (subscriberData: any) =>
    proxyService.post(SUBSCRIBER_ENDPOINTS.CREATE_SUBSCRIBER, subscriberData),
};
export const TextEnhancementAPI = {
  textEnhancement: (data: any) =>
    proxyService.post(TEXT_ENHANCEMENT_ENDPOINTS.TEXT_ENHANCEMENT, data),
}
export default {
  auth: authAPI,
  user: userAPI,
  role: roleAPI,
  permission: permissionAPI,
  client: clientAPI,
  bot: botAPI,
  databaseconnections: databaseConnectionsAPI,
  databasetables: databaseTablesAPI,
  conversationreport: conversationReportAPI,
  appsetting: appsettingAPI,
  systemsetting: systemsettingAPI,
  permissionTask: permissionTaskAPI,
  dropdown: dropdownAPI,
  documentGroup: documentGroupAPI,
  document: documentAPI,
  dataBaseColumn: databaseColumnsAPI,
  tabColTraining: tabColTrainingAPI,
  conversation: conversationAPI,
  botResponceRating: botResponceRatingAPI,
  synonym: synonymAPI,
  subscriber: subscriberAPI,
  textEnhancement: TextEnhancementAPI
};
