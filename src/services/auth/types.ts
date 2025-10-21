/**
 * Authentication Types and Interfaces
 */

export interface User {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  role: 'user' | 'premium' | 'enterprise' | 'admin'
  verified: boolean
  twoFactorEnabled: boolean
  createdAt: Date
  lastLogin: Date
  preferences: UserPreferences
  stats: UserStats
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto' | 'quantum' | 'neon'
  language: string
  editorSettings: EditorSettings
  notifications: NotificationSettings
  privacy: PrivacySettings
}

export interface EditorSettings {
  fontSize: number
  fontFamily: string
  lineHeight: number
  tabSize: number
  wordWrap: boolean
  minimap: boolean
  autoSave: boolean
  autoSaveDelay: number
  keybindings: 'default' | 'vim' | 'emacs'
}

export interface NotificationSettings {
  email: boolean
  push: boolean
  desktop: boolean
  inApp: boolean
  collaboration: boolean
  updates: boolean
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends'
  showActivity: boolean
  allowMessages: boolean
  shareAnalytics: boolean
}

export interface UserStats {
  totalProjects: number
  totalIntents: number
  totalExecutions: number
  totalCollaborations: number
  achievements: Achievement[]
  level: number
  xp: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface AuthResult {
  success: boolean
  user?: User
  token?: string
  message: string
}

export interface Session {
  id: string
  userId: string
  token: string
  createdAt: Date
  expiresAt: Date
  lastActivity: Date
}

export interface TwoFactorSetup {
  secret: string
  qrCode: string
  backupCodes: string[]
}

export interface UserAnalytics {
  userId: string
  activityScore: number
  engagementLevel: string
  learningProgress: number
  collaborationScore: number
  achievements: Achievement[]
  level: number
  xp: number
  nextLevelXP: number
  topSkills: string[]
  recentActivity: Activity[]
  weeklyStats: WeeklyStats
}

export interface Activity {
  type: string
  description: string
  timestamp: Date
}

export interface WeeklyStats {
  intentExecutions: number
  projectsCreated: number
  collaborations: number
  optimizationsApplied: number
}
