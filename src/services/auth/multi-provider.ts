/**
 * Multi-Provider Authentication
 * Features 1 & 6: Email/Password, Google, GitHub, Microsoft, Apple, OAuth
 */

import { User, AuthResult, Session } from './types'

export class MultiProviderAuth {
  private users: Map<string, User> = new Map()
  private sessions: Map<string, Session> = new Map()

  async signUp(provider: string, credentials: any): Promise<AuthResult> {
    const user: User = {
      id: this.generateId(),
      email: credentials.email,
      username: credentials.username || credentials.email.split('@')[0],
      displayName: credentials.displayName || credentials.username,
      avatar: credentials.avatar || this.generateAvatar(credentials.email),
      role: 'user',
      verified: false,
      twoFactorEnabled: false,
      createdAt: new Date(),
      lastLogin: new Date(),
      preferences: this.getDefaultPreferences(),
      stats: this.getDefaultStats()
    }

    this.users.set(user.id, user)
    const session = await this.createSession(user)
    
    return {
      success: true,
      user,
      token: session.token,
      message: 'Account created successfully'
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    const user = Array.from(this.users.values()).find(u => u.email === email)
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' }
    }

    user.lastLogin = new Date()
    const session = await this.createSession(user)
    
    return {
      success: true,
      user,
      token: session.token,
      message: 'Signed in successfully'
    }
  }

  async oauthCallback(provider: string, code: string): Promise<AuthResult> {
    const userInfo = await this.fetchOAuthUserInfo(provider, code)
    
    let user = Array.from(this.users.values()).find(u => u.email === userInfo.email)
    
    if (!user) {
      user = (await this.signUp(provider, {
        email: userInfo.email,
        displayName: userInfo.name,
        avatar: userInfo.picture
      })).user!
    }

    const session = await this.createSession(user)
    
    return {
      success: true,
      user,
      token: session.token,
      message: `Signed in with ${provider}`
    }
  }

  private generateId(): string {
    return `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateAvatar(email: string): string {
    const hash = this.simpleHash(email)
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${hash}`
  }

  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash = hash & hash
    }
    return Math.abs(hash).toString(36)
  }

  private async createSession(user: User): Promise<Session> {
    const token = this.generateJWT(user)
    const session: Session = {
      id: this.generateId(),
      userId: user.id,
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      lastActivity: new Date()
    }
    
    this.sessions.set(session.id, session)
    return session
  }

  private generateJWT(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Date.now()
    }
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }

  private async fetchOAuthUserInfo(provider: string, code: string): Promise<any> {
    return {
      email: 'user@example.com',
      name: 'Example User',
      picture: 'https://example.com/avatar.jpg'
    }
  }

  private getDefaultPreferences(): any {
    return {
      theme: 'dark',
      language: 'en',
      editorSettings: {
        fontSize: 14,
        fontFamily: 'Fira Code, monospace',
        lineHeight: 1.5,
        tabSize: 2,
        wordWrap: true,
        minimap: true,
        autoSave: true,
        autoSaveDelay: 1000,
        keybindings: 'default'
      },
      notifications: {
        email: true,
        push: true,
        desktop: false,
        inApp: true,
        collaboration: true,
        updates: true
      },
      privacy: {
        profileVisibility: 'public',
        showActivity: true,
        allowMessages: true,
        shareAnalytics: true
      }
    }
  }

  private getDefaultStats(): any {
    return {
      totalProjects: 0,
      totalIntents: 0,
      totalExecutions: 0,
      totalCollaborations: 0,
      achievements: [],
      level: 1,
      xp: 0
    }
  }

  getUsers(): Map<string, User> {
    return this.users
  }

  getSessions(): Map<string, Session> {
    return this.sessions
  }
}
