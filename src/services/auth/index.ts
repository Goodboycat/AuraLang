/**
 * Authentication Service - Main Export
 * Combines all auth modules into a unified service
 */

import { MultiProviderAuth } from './multi-provider'
import { TwoFactorAuth } from './two-factor'
import { User, AuthResult, TwoFactorSetup, UserAnalytics } from './types'

export class AuthService {
  private multiProvider: MultiProviderAuth
  private twoFactor: TwoFactorAuth

  constructor() {
    this.multiProvider = new MultiProviderAuth()
    this.twoFactor = new TwoFactorAuth()
  }

  // Multi-Provider Auth (Features 1 & 6)
  async signUp(provider: string, credentials: any): Promise<AuthResult> {
    return this.multiProvider.signUp(provider, credentials)
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    return this.multiProvider.signIn(email, password)
  }

  async oauthCallback(provider: string, code: string): Promise<AuthResult> {
    return this.multiProvider.oauthCallback(provider, code)
  }

  // Two-Factor Auth (Feature 3)
  async enable2FA(userId: string): Promise<TwoFactorSetup> {
    const users = this.multiProvider.getUsers()
    const user = users.get(userId)
    if (!user) throw new Error('User not found')
    return this.twoFactor.enable2FA(user)
  }

  async verify2FA(userId: string, code: string): Promise<boolean> {
    return this.twoFactor.verify2FA(userId, code)
  }

  // Biometric Auth (Feature 4)
  async registerBiometric(userId: string, publicKey: string): Promise<boolean> {
    return true // Placeholder
  }

  // Magic Link (Feature 5)
  async sendMagicLink(email: string): Promise<boolean> {
    return true // Placeholder
  }

  // RBAC (Feature 7)
  hasPermission(userId: string, permission: string): boolean {
    const users = this.multiProvider.getUsers()
    const user = users.get(userId)
    if (!user) return false

    const rolePermissions = {
      user: ['read', 'create', 'edit_own'],
      premium: ['read', 'create', 'edit_own', 'advanced_features'],
      enterprise: ['read', 'create', 'edit_own', 'edit_team', 'advanced_features'],
      admin: ['*']
    }

    const userPermissions = rolePermissions[user.role]
    return userPermissions.includes('*') || userPermissions.includes(permission)
  }

  // User Analytics (Feature 10)
  async getUserAnalytics(userId: string): Promise<UserAnalytics> {
    const users = this.multiProvider.getUsers()
    const user = users.get(userId)
    if (!user) throw new Error('User not found')

    return {
      userId: user.id,
      activityScore: user.stats.totalExecutions * 10,
      engagementLevel: 'high',
      learningProgress: (user.stats.achievements.length / 4) * 100,
      collaborationScore: user.stats.totalCollaborations * 20,
      achievements: user.stats.achievements,
      level: user.stats.level,
      xp: user.stats.xp,
      nextLevelXP: (user.stats.level + 1) * 1000,
      topSkills: ['Intent Design', 'Quantum States'],
      recentActivity: [],
      weeklyStats: {
        intentExecutions: 42,
        projectsCreated: 3,
        collaborations: 7,
        optimizationsApplied: 156
      }
    }
  }
}

export * from './types'
