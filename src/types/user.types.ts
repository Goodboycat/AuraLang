// Feature 1: Comprehensive User Type System
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  permissions: Permission[];
  settings: UserSettings;
  preferences: UserPreferences;
  subscription: Subscription;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  status: UserStatus;
  metadata: Record<string, any>;
}

export enum UserRole {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  COLLABORATOR = 'collaborator',
  VIEWER = 'viewer',
  GUEST = 'guest',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export interface Permission {
  id: string;
  resource: string;
  action: PermissionAction;
  conditions?: PermissionCondition[];
}

export enum PermissionAction {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  EXECUTE = 'execute',
  ADMIN = 'admin',
}

export interface PermissionCondition {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'in';
  value: any;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  editor: EditorSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  digest: 'realtime' | 'hourly' | 'daily' | 'weekly';
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showActivity: boolean;
  allowCollaboration: boolean;
  shareAnalytics: boolean;
}

export interface EditorSettings {
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  autoSave: boolean;
  autoComplete: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  wordWrap: boolean;
}

export interface UserPreferences {
  defaultProject?: string;
  recentProjects: string[];
  favoriteComponents: string[];
  customKeybindings: Record<string, string>;
  dashboardLayout: DashboardLayout;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  columns: number;
}

export interface DashboardWidget {
  id: string;
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: Record<string, any>;
}

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  features: string[];
  limits: SubscriptionLimits;
}

export enum SubscriptionPlan {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export interface SubscriptionLimits {
  maxProjects: number;
  maxCollaborators: number;
  maxExecutionsPerDay: number;
  maxStorageGB: number;
  maxAPICallsPerMonth: number;
}
