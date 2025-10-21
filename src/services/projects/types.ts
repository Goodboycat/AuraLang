/**
 * Project Management Type Definitions
 */

export interface Project {
  id: string
  name: string
  description: string
  owner: string
  collaborators: Collaborator[]
  visibility: 'private' | 'public' | 'unlisted'
  tags: string[]
  category: string
  files: ProjectFile[]
  settings: ProjectSettings
  metadata: ProjectMetadata
  createdAt: Date
  updatedAt: Date
}

export interface ProjectFile {
  id: string
  name: string
  path: string
  content: string
  language: 'auralang' | 'typescript' | 'javascript' | 'python'
  size: number
  versions: FileVersion[]
  createdAt: Date
  updatedAt: Date
}

export interface FileVersion {
  id: string
  content: string
  message: string
  author: string
  timestamp: Date
  diff?: string
}

export interface Collaborator {
  userId: string
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: Date
  permissions: string[]
}

export interface ProjectSettings {
  autoSave: boolean
  autoFormat: boolean
  linting: boolean
  autoComplete: boolean
  realTimeCollab: boolean
  allowComments: boolean
  allowForking: boolean
}

export interface ProjectMetadata {
  stars: number
  forks: number
  views: number
  executions: number
  lastExecuted?: Date
  thumbnail?: string
  readme?: string
}

export interface CreateProjectData {
  name: string
  description?: string
  visibility?: 'private' | 'public' | 'unlisted'
  tags?: string[]
  category?: string
  template?: string
}

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  files: TemplateFile[]
  icon: string
  popular: boolean
}

export interface TemplateFile {
  name: string
  path: string
  content: string
  language: string
}

export interface ProjectAnalytics {
  projectId: string
  totalViews: number
  totalExecutions: number
  uniqueVisitors: number
  avgSessionDuration: number
  topFiles: FileStats[]
  collaboratorActivity: CollaboratorStats[]
  codeMetrics: CodeMetrics
  timeline: ActivityTimeline[]
}

export interface FileStats {
  fileId: string
  fileName: string
  views: number
  edits: number
  lastModified: Date
}

export interface CollaboratorStats {
  userId: string
  username: string
  commits: number
  linesAdded: number
  linesRemoved: number
  lastActive: Date
}

export interface CodeMetrics {
  totalLines: number
  totalFiles: number
  languages: LanguageBreakdown[]
  complexity: number
  maintainability: number
}

export interface LanguageBreakdown {
  language: string
  lines: number
  files: number
  percentage: number
}

export interface ActivityTimeline {
  date: Date
  commits: number
  views: number
  executions: number
  collaborators: number
}

export interface ShareSettings {
  isPublic: boolean
  allowComments: boolean
  allowForking: boolean
  embedEnabled: boolean
  customDomain?: string
  password?: string
  expiresAt?: Date
}

export interface Comment {
  id: string
  projectId: string
  fileId?: string
  lineNumber?: number
  author: string
  content: string
  replies: Comment[]
  resolved: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Issue {
  id: string
  projectId: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee?: string
  labels: string[]
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}
