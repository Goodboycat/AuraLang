/**
 * Project Analytics & Insights
 * Feature 17: Project Analytics
 */

import type {
  Project,
  ProjectAnalytics,
  FileStats,
  CollaboratorStats,
  CodeMetrics,
  ActivityTimeline,
  LanguageBreakdown
} from './types'

export class AnalyticsManager {
  private analytics: Map<string, ProjectAnalytics> = new Map()
  private pageViews: Map<string, number> = new Map()
  private executions: Map<string, number> = new Map()

  /**
   * Feature 17: Project Analytics
   */
  async getProjectAnalytics(projectId: string): Promise<ProjectAnalytics> {
    if (!this.analytics.has(projectId)) {
      this.analytics.set(projectId, this.createDefaultAnalytics(projectId))
    }

    return this.analytics.get(projectId)!
  }

  async trackView(projectId: string, userId?: string): Promise<void> {
    const views = this.pageViews.get(projectId) || 0
    this.pageViews.set(projectId, views + 1)

    const analytics = await this.getProjectAnalytics(projectId)
    analytics.totalViews++
    if (userId) {
      analytics.uniqueVisitors++
    }
  }

  async trackExecution(projectId: string): Promise<void> {
    const executions = this.executions.get(projectId) || 0
    this.executions.set(projectId, executions + 1)

    const analytics = await this.getProjectAnalytics(projectId)
    analytics.totalExecutions++
  }

  async getCodeMetrics(project: Project): Promise<CodeMetrics> {
    let totalLines = 0
    const languageMap = new Map<string, { lines: number; files: number }>()

    for (const file of project.files) {
      const lines = file.content.split('\n').length
      totalLines += lines

      const lang = file.language
      const current = languageMap.get(lang) || { lines: 0, files: 0 }
      languageMap.set(lang, {
        lines: current.lines + lines,
        files: current.files + 1
      })
    }

    const languages: LanguageBreakdown[] = Array.from(languageMap.entries()).map(
      ([language, data]) => ({
        language,
        lines: data.lines,
        files: data.files,
        percentage: (data.lines / totalLines) * 100
      })
    )

    return {
      totalLines,
      totalFiles: project.files.length,
      languages,
      complexity: this.calculateComplexity(project),
      maintainability: this.calculateMaintainability(project)
    }
  }

  async getFileStats(projectId: string): Promise<FileStats[]> {
    // In real implementation, track per-file stats
    return []
  }

  async getCollaboratorStats(project: Project): Promise<CollaboratorStats[]> {
    return project.collaborators.map(c => ({
      userId: c.userId,
      username: `user_${c.userId}`,
      commits: 0, // Would track from version control
      linesAdded: 0,
      linesRemoved: 0,
      lastActive: c.joinedAt
    }))
  }

  async getActivityTimeline(projectId: string, days = 30): Promise<ActivityTimeline[]> {
    const timeline: ActivityTimeline[] = []
    const now = new Date()

    for (let i = 0; i < days; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)

      timeline.push({
        date,
        commits: Math.floor(Math.random() * 10),
        views: Math.floor(Math.random() * 50),
        executions: Math.floor(Math.random() * 30),
        collaborators: Math.floor(Math.random() * 5)
      })
    }

    return timeline.reverse()
  }

  async getPopularProjects(limit = 10): Promise<Project[]> {
    // Sort by views, stars, forks
    return []
  }

  async getTrendingProjects(timeframe = '7d'): Promise<Project[]> {
    // Sort by recent activity
    return []
  }

  async getRecommendedProjects(userId: string, limit = 10): Promise<Project[]> {
    // AI-powered recommendations based on user interests
    return []
  }

  async generateReport(projectId: string): Promise<{
    summary: string
    metrics: CodeMetrics
    trends: ActivityTimeline[]
    topContributors: CollaboratorStats[]
  }> {
    const analytics = await this.getProjectAnalytics(projectId)

    return {
      summary: this.generateSummary(analytics),
      metrics: analytics.codeMetrics,
      trends: analytics.timeline,
      topContributors: analytics.collaboratorActivity.slice(0, 5)
    }
  }

  // Helper methods
  private createDefaultAnalytics(projectId: string): ProjectAnalytics {
    return {
      projectId,
      totalViews: 0,
      totalExecutions: 0,
      uniqueVisitors: 0,
      avgSessionDuration: 0,
      topFiles: [],
      collaboratorActivity: [],
      codeMetrics: {
        totalLines: 0,
        totalFiles: 0,
        languages: [],
        complexity: 0,
        maintainability: 100
      },
      timeline: []
    }
  }

  private calculateComplexity(project: Project): number {
    // Simplified complexity calculation
    let complexity = 0
    
    for (const file of project.files) {
      const content = file.content
      complexity += (content.match(/if|for|while|switch/g) || []).length
      complexity += (content.match(/function|class|interface/g) || []).length
    }

    return complexity
  }

  private calculateMaintainability(project: Project): number {
    // Simplified maintainability score (0-100)
    const avgFileSize = project.files.reduce((sum, f) => sum + f.size, 0) / project.files.length
    const complexity = this.calculateComplexity(project)

    let score = 100
    if (avgFileSize > 10000) score -= 20
    if (complexity > 100) score -= 20
    if (project.files.length > 50) score -= 10

    return Math.max(0, score)
  }

  private generateSummary(analytics: ProjectAnalytics): string {
    return `Project has ${analytics.totalViews} views, ${analytics.totalExecutions} executions, and ${analytics.codeMetrics.totalLines} lines of code across ${analytics.codeMetrics.totalFiles} files.`
  }
}
