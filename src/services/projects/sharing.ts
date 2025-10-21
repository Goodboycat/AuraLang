/**
 * Project Sharing & Visibility
 * Features 15-16: Project Sharing & Team Management
 */

import type { Project, ShareSettings } from './types'

export class SharingManager {
  private shareSettings: Map<string, ShareSettings> = new Map()
  private embedTokens: Map<string, string> = new Map()

  /**
   * Feature 15: Project Sharing
   */
  async shareProject(projectId: string, settings: ShareSettings): Promise<string> {
    this.shareSettings.set(projectId, settings)
    
    const shareUrl = this.generateShareUrl(projectId, settings)
    return shareUrl
  }

  async getShareSettings(projectId: string): Promise<ShareSettings | null> {
    return this.shareSettings.get(projectId) || null
  }

  async updateShareSettings(projectId: string, settings: Partial<ShareSettings>): Promise<ShareSettings> {
    const current = this.shareSettings.get(projectId) || this.getDefaultShareSettings()
    const updated = { ...current, ...settings }
    this.shareSettings.set(projectId, updated)
    return updated
  }

  async generateEmbedCode(projectId: string): Promise<string> {
    const token = this.generateEmbedToken(projectId)
    this.embedTokens.set(projectId, token)

    return `<iframe 
  src="https://auralang.dev/embed/${projectId}?token=${token}" 
  width="100%" 
  height="600" 
  frameborder="0"
></iframe>`
  }

  async forkProject(project: Project, userId: string): Promise<Project> {
    const forkedProject: Project = {
      ...project,
      id: this.generateId(),
      name: `${project.name} (Fork)`,
      owner: userId,
      collaborators: [{
        userId,
        role: 'owner',
        joinedAt: new Date(),
        permissions: ['*']
      }],
      metadata: {
        ...project.metadata,
        stars: 0,
        forks: 0,
        views: 0,
        executions: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Increment original project's fork count
    project.metadata.forks++

    return forkedProject
  }

  async starProject(projectId: string, userId: string): Promise<void> {
    // In real implementation, track who starred
    console.log(`User ${userId} starred project ${projectId}`)
  }

  async unstarProject(projectId: string, userId: string): Promise<void> {
    console.log(`User ${userId} unstarred project ${projectId}`)
  }

  async getStarCount(projectId: string): Promise<number> {
    // Return star count from project metadata
    return 0
  }

  async verifyShareAccess(projectId: string, password?: string): Promise<boolean> {
    const settings = this.shareSettings.get(projectId)
    
    if (!settings) return false
    if (!settings.isPublic) return false
    if (settings.expiresAt && settings.expiresAt < new Date()) return false
    if (settings.password && settings.password !== password) return false

    return true
  }

  async getPublicProjects(limit = 50): Promise<Project[]> {
    // In real implementation, query public projects
    return []
  }

  // Helper methods
  private generateId(): string {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateShareUrl(projectId: string, settings: ShareSettings): string {
    let url = `https://auralang.dev/p/${projectId}`
    
    if (settings.customDomain) {
      url = `https://${settings.customDomain}`
    }

    return url
  }

  private generateEmbedToken(projectId: string): string {
    return `embed_${projectId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getDefaultShareSettings(): ShareSettings {
    return {
      isPublic: false,
      allowComments: true,
      allowForking: true,
      embedEnabled: false
    }
  }
}
