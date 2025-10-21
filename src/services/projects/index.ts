/**
 * Project Service - Main Export
 * Unified interface for all project management features
 */

import { WorkspaceManager } from './workspace'
import { CollaborationManager } from './collaboration'
import { SharingManager } from './sharing'
import { AnalyticsManager } from './analytics'

export * from './types'

export class ProjectService {
  private workspace: WorkspaceManager
  private collaboration: CollaborationManager
  private sharing: SharingManager
  private analytics: AnalyticsManager

  constructor() {
    this.workspace = new WorkspaceManager()
    this.collaboration = new CollaborationManager()
    this.sharing = new SharingManager()
    this.analytics = new AnalyticsManager()
  }

  // Workspace methods
  async createProject(ownerId: string, data: any) {
    const project = await this.workspace.createProject(ownerId, data)
    await this.analytics.trackView(project.id, ownerId)
    return project
  }

  async getProject(projectId: string) {
    return this.workspace.getProject(projectId)
  }

  async updateProject(projectId: string, updates: any) {
    return this.workspace.updateProject(projectId, updates)
  }

  async deleteProject(projectId: string) {
    return this.workspace.deleteProject(projectId)
  }

  async listProjects(userId: string, filters?: any) {
    return this.workspace.listProjects(userId, filters)
  }

  async getWorkspaceProjects(userId: string, workspace?: string) {
    return this.workspace.getWorkspaceProjects(userId, workspace)
  }

  async getTemplates(category?: string) {
    return this.workspace.getTemplates(category)
  }

  async createFromTemplate(userId: string, templateId: string, name: string) {
    return this.workspace.createFromTemplate(userId, templateId, name)
  }

  // Collaboration methods
  async joinCollaboration(projectId: string, userId: string) {
    return this.collaboration.joinCollaboration(projectId, userId)
  }

  async leaveCollaboration(projectId: string, userId: string) {
    return this.collaboration.leaveCollaboration(projectId, userId)
  }

  async getActiveCollaborators(projectId: string) {
    return this.collaboration.getActiveCollaborators(projectId)
  }

  async addCollaborator(project: any, collaborator: any) {
    return this.collaboration.addCollaborator(project, collaborator)
  }

  async removeCollaborator(project: any, userId: string) {
    return this.collaboration.removeCollaborator(project, userId)
  }

  async updateCollaboratorRole(project: any, userId: string, role: any) {
    return this.collaboration.updateCollaboratorRole(project, userId, role)
  }

  async addComment(projectId: string, comment: any) {
    return this.collaboration.addComment(projectId, comment)
  }

  async getComments(projectId: string, fileId?: string, lineNumber?: number) {
    return this.collaboration.getComments(projectId, fileId, lineNumber)
  }

  async createIssue(projectId: string, issue: any) {
    return this.collaboration.createIssue(projectId, issue)
  }

  async getIssues(projectId: string, filters?: any) {
    return this.collaboration.getIssues(projectId, filters)
  }

  async updateIssue(projectId: string, issueId: string, updates: any) {
    return this.collaboration.updateIssue(projectId, issueId, updates)
  }

  // Sharing methods
  async shareProject(projectId: string, settings: any) {
    return this.sharing.shareProject(projectId, settings)
  }

  async getShareSettings(projectId: string) {
    return this.sharing.getShareSettings(projectId)
  }

  async generateEmbedCode(projectId: string) {
    return this.sharing.generateEmbedCode(projectId)
  }

  async forkProject(project: any, userId: string) {
    const forked = await this.sharing.forkProject(project, userId)
    await this.analytics.trackView(forked.id, userId)
    return forked
  }

  async starProject(projectId: string, userId: string) {
    return this.sharing.starProject(projectId, userId)
  }

  // Analytics methods
  async getProjectAnalytics(projectId: string) {
    return this.analytics.getProjectAnalytics(projectId)
  }

  async trackView(projectId: string, userId?: string) {
    return this.analytics.trackView(projectId, userId)
  }

  async trackExecution(projectId: string) {
    return this.analytics.trackExecution(projectId)
  }

  async getCodeMetrics(project: any) {
    return this.analytics.getCodeMetrics(project)
  }

  async getActivityTimeline(projectId: string, days?: number) {
    return this.analytics.getActivityTimeline(projectId, days)
  }

  async generateReport(projectId: string) {
    return this.analytics.generateReport(projectId)
  }
}
