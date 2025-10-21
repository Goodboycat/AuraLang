/**
 * Real-time Collaboration Features
 * Features 14, 18, 19: Real-time Collaboration, Comments, Issue Tracking
 */

import type { Project, Collaborator, Comment, Issue } from './types'

export class CollaborationManager {
  private activeUsers: Map<string, Set<string>> = new Map() // projectId -> Set of userIds
  private comments: Map<string, Comment[]> = new Map() // projectId -> comments
  private issues: Map<string, Issue[]> = new Map() // projectId -> issues

  /**
   * Feature 14: Real-time Collaboration
   */
  async joinCollaboration(projectId: string, userId: string): Promise<void> {
    if (!this.activeUsers.has(projectId)) {
      this.activeUsers.set(projectId, new Set())
    }
    this.activeUsers.get(projectId)!.add(userId)
  }

  async leaveCollaboration(projectId: string, userId: string): Promise<void> {
    const users = this.activeUsers.get(projectId)
    if (users) {
      users.delete(userId)
      if (users.size === 0) {
        this.activeUsers.delete(projectId)
      }
    }
  }

  async getActiveCollaborators(projectId: string): Promise<string[]> {
    const users = this.activeUsers.get(projectId)
    return users ? Array.from(users) : []
  }

  async broadcastCursorPosition(
    projectId: string,
    userId: string,
    position: { line: number; column: number; fileId: string }
  ): Promise<void> {
    // In real implementation, this would use WebSockets
    console.log(`User ${userId} cursor at line ${position.line}, col ${position.column}`)
  }

  async broadcastEdit(
    projectId: string,
    userId: string,
    edit: { fileId: string; changes: any[] }
  ): Promise<void> {
    // Broadcast edits to all active collaborators
    console.log(`User ${userId} made edit in file ${edit.fileId}`)
  }

  /**
   * Feature 16: Team Management
   */
  async addCollaborator(
    project: Project,
    collaborator: Omit<Collaborator, 'joinedAt'>
  ): Promise<Project> {
    const newCollaborator: Collaborator = {
      ...collaborator,
      joinedAt: new Date()
    }

    project.collaborators.push(newCollaborator)
    project.updatedAt = new Date()
    return project
  }

  async removeCollaborator(project: Project, userId: string): Promise<Project> {
    project.collaborators = project.collaborators.filter(c => c.userId !== userId)
    project.updatedAt = new Date()
    return project
  }

  async updateCollaboratorRole(
    project: Project,
    userId: string,
    role: 'owner' | 'editor' | 'viewer'
  ): Promise<Project> {
    const collaborator = project.collaborators.find(c => c.userId === userId)
    if (collaborator) {
      collaborator.role = role
      project.updatedAt = new Date()
    }
    return project
  }

  async hasPermission(project: Project, userId: string, permission: string): Promise<boolean> {
    const collaborator = project.collaborators.find(c => c.userId === userId)
    if (!collaborator) return false

    if (collaborator.permissions.includes('*')) return true
    return collaborator.permissions.includes(permission)
  }

  /**
   * Feature 18: Comments & Reviews
   */
  async addComment(
    projectId: string,
    comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'replies'>
  ): Promise<Comment> {
    const newComment: Comment = {
      ...comment,
      id: this.generateId(),
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    if (!this.comments.has(projectId)) {
      this.comments.set(projectId, [])
    }

    this.comments.get(projectId)!.push(newComment)
    return newComment
  }

  async getComments(projectId: string, fileId?: string, lineNumber?: number): Promise<Comment[]> {
    const projectComments = this.comments.get(projectId) || []

    if (fileId && lineNumber !== undefined) {
      return projectComments.filter(
        c => c.fileId === fileId && c.lineNumber === lineNumber
      )
    }

    if (fileId) {
      return projectComments.filter(c => c.fileId === fileId)
    }

    return projectComments
  }

  async replyToComment(commentId: string, projectId: string, reply: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'replies'>): Promise<Comment> {
    const comments = this.comments.get(projectId) || []
    const parentComment = this.findComment(comments, commentId)

    if (!parentComment) throw new Error('Comment not found')

    const newReply: Comment = {
      ...reply,
      id: this.generateId(),
      replies: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    parentComment.replies.push(newReply)
    return newReply
  }

  async resolveComment(projectId: string, commentId: string): Promise<void> {
    const comments = this.comments.get(projectId) || []
    const comment = this.findComment(comments, commentId)

    if (comment) {
      comment.resolved = true
      comment.updatedAt = new Date()
    }
  }

  /**
   * Feature 19: Issue Tracking
   */
  async createIssue(projectId: string, issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): Promise<Issue> {
    const newIssue: Issue = {
      ...issue,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    if (!this.issues.has(projectId)) {
      this.issues.set(projectId, [])
    }

    this.issues.get(projectId)!.push(newIssue)
    return newIssue
  }

  async getIssues(projectId: string, filters?: {
    status?: string
    priority?: string
    assignee?: string
  }): Promise<Issue[]> {
    let issues = this.issues.get(projectId) || []

    if (filters?.status) {
      issues = issues.filter(i => i.status === filters.status)
    }

    if (filters?.priority) {
      issues = issues.filter(i => i.priority === filters.priority)
    }

    if (filters?.assignee) {
      issues = issues.filter(i => i.assignee === filters.assignee)
    }

    return issues
  }

  async updateIssue(projectId: string, issueId: string, updates: Partial<Issue>): Promise<Issue> {
    const issues = this.issues.get(projectId) || []
    const issue = issues.find(i => i.id === issueId)

    if (!issue) throw new Error('Issue not found')

    Object.assign(issue, updates)
    issue.updatedAt = new Date()
    return issue
  }

  async closeIssue(projectId: string, issueId: string): Promise<Issue> {
    return this.updateIssue(projectId, issueId, { status: 'closed' })
  }

  // Helper methods
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private findComment(comments: Comment[], commentId: string): Comment | null {
    for (const comment of comments) {
      if (comment.id === commentId) return comment
      
      const found = this.findComment(comment.replies, commentId)
      if (found) return found
    }
    return null
  }
}
