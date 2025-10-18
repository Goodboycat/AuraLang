// Feature 2: Project Management Type System
export interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  collaborators: ProjectCollaborator[];
  visibility: ProjectVisibility;
  status: ProjectStatus;
  files: ProjectFile[];
  settings: ProjectSettings;
  metadata: ProjectMetadata;
  tags: string[];
  category: string;
  createdAt: Date;
  updatedAt: Date;
  lastAccessed: Date;
  version: string;
  gitRepository?: GitRepository;
  deployments: Deployment[];
}

export enum ProjectVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
  ORGANIZATION = 'organization',
}

export enum ProjectStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
  TEMPLATE = 'template',
}

export interface ProjectCollaborator {
  userId: string;
  role: CollaboratorRole;
  permissions: string[];
  addedAt: Date;
  invitedBy: string;
  status: 'active' | 'pending' | 'removed';
}

export enum CollaboratorRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer',
}

export interface ProjectFile {
  id: string;
  path: string;
  name: string;
  content: string;
  language: string;
  size: number;
  hash: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  locked?: boolean;
  lockedBy?: string;
}

export interface ProjectSettings {
  autoSave: boolean;
  autoFormat: boolean;
  linting: boolean;
  testing: boolean;
  cicd: boolean;
  notifications: boolean;
  analytics: boolean;
  security: SecuritySettings;
  performance: PerformanceSettings;
}

export interface SecuritySettings {
  requireApproval: boolean;
  allowedDomains: string[];
  secretsManagement: boolean;
  vulnerabilityScanning: boolean;
  accessLogs: boolean;
}

export interface PerformanceSettings {
  optimizationLevel: 'none' | 'basic' | 'aggressive';
  caching: boolean;
  compression: boolean;
  cdn: boolean;
  monitoring: boolean;
}

export interface ProjectMetadata {
  stars: number;
  forks: number;
  downloads: number;
  views: number;
  rating: number;
  reviews: Review[];
  dependencies: Dependency[];
  buildInfo: BuildInfo;
}

export interface Review {
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Dependency {
  name: string;
  version: string;
  type: 'runtime' | 'development' | 'peer';
  source: string;
}

export interface BuildInfo {
  lastBuildTime: Date;
  buildDuration: number;
  success: boolean;
  errors: string[];
  warnings: string[];
  artifacts: string[];
}

export interface GitRepository {
  url: string;
  branch: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  connected: boolean;
  autoSync: boolean;
  lastSync: Date;
}

export interface Deployment {
  id: string;
  environment: 'production' | 'staging' | 'development';
  url: string;
  status: DeploymentStatus;
  version: string;
  deployedAt: Date;
  deployedBy: string;
  logs: DeploymentLog[];
}

export enum DeploymentStatus {
  PENDING = 'pending',
  BUILDING = 'building',
  DEPLOYING = 'deploying',
  SUCCESS = 'success',
  FAILED = 'failed',
  ROLLED_BACK = 'rolled_back',
}

export interface DeploymentLog {
  timestamp: Date;
  level: 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, any>;
}
