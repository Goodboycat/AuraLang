/**
 * Advanced Project Management Service
 * Features: Multi-project workspace, version control, templates, sharing
 */

interface Project {
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

interface ProjectFile {
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

interface FileVersion {
  id: string
  content: string
  message: string
  author: string
  timestamp: Date
  diff?: string
}

interface Collaborator {
  userId: string
  role: 'owner' | 'editor' | 'viewer'
  joinedAt: Date
  permissions: string[]
}

interface ProjectSettings {
  autoSave: boolean
  autoFormat: boolean
  linting: boolean
  autoComplete: boolean
  realTimeCollab: boolean
  allowComments: boolean
  allowForking: boolean
}

interface ProjectMetadata {
  stars: number
  forks: number
  views: number
  executions: number
  lastExecuted?: Date
  thumbnail?: string
  readme?: string
}

export class ProjectService {
  private projects: Map<string, Project> = new Map()
  private templates: Map<string, ProjectTemplate> = new Map()

  constructor() {
    this.initializeTemplates()
  }

  /**
   * Feature 11: Multi-Project Workspace
   */
  async createProject(ownerId: string, data: CreateProjectData): Promise<Project> {
    const project: Project = {
      id: this.generateId(),
      name: data.name,
      description: data.description || '',
      owner: ownerId,
      collaborators: [{ userId: ownerId, role: 'owner', joinedAt: new Date(), permissions: ['*'] }],
      visibility: data.visibility || 'private',
      tags: data.tags || [],
      category: data.category || 'general',
      files: data.template ? this.getTemplateFiles(data.template) : [this.createDefaultFile()],
      settings: this.getDefaultSettings(),
      metadata: {
        stars: 0,
        forks: 0,
        views: 0,
        executions: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.projects.set(project.id, project)
    return project
  }

  /**
   * Feature 12: Version Control & History
   */
  async saveFileVersion(projectId: string, fileId: string, content: string, message: string, author: string): Promise<FileVersion> {
    const project = this.projects.get(projectId)
    if (!project) throw new Error('Project not found')

    const file = project.files.find(f => f.id === fileId)
    if (!file) throw new Error('File not found')

    const version: FileVersion = {
      id: this.generateId(),
      content,
      message,
      author,
      timestamp: new Date(),
      diff: this.calculateDiff(file.content, content)
    }

    file.versions.push(version)
    file.content = content
    file.updatedAt = new Date()
    project.updatedAt = new Date()

    return version
  }

  async getFileHistory(projectId: string, fileId: string): Promise<FileVersion[]> {
    const project = this.projects.get(projectId)
    if (!project) throw new Error('Project not found')

    const file = project.files.find(f => f.id === fileId)
    if (!file) throw new Error('File not found')

    return file.versions
  }

  async revertToVersion(projectId: string, fileId: string, versionId: string): Promise<boolean> {
    const project = this.projects.get(projectId)
    if (!project) return false

    const file = project.files.find(f => f.id === fileId)
    if (!file) return false

    const version = file.versions.find(v => v.id === versionId)
    if (!version) return false

    file.content = version.content
    file.updatedAt = new Date()
    project.updatedAt = new Date()

    return true
  }

  /**
   * Feature 13: Project Templates Library
   */
  async createFromTemplate(ownerId: string, templateId: string, name: string): Promise<Project> {
    const template = this.templates.get(templateId)
    if (!template) throw new Error('Template not found')

    return this.createProject(ownerId, {
      name,
      description: template.description,
      template: templateId,
      tags: template.tags,
      category: template.category
    })
  }

  getTemplates(): ProjectTemplate[] {
    return Array.from(this.templates.values())
  }

  /**
   * Feature 14: Real-time Collaboration
   */
  async addCollaborator(projectId: string, userId: string, role: 'editor' | 'viewer'): Promise<boolean> {
    const project = this.projects.get(projectId)
    if (!project) return false

    const exists = project.collaborators.find(c => c.userId === userId)
    if (exists) return false

    project.collaborators.push({
      userId,
      role,
      joinedAt: new Date(),
      permissions: role === 'editor' ? ['read', 'write'] : ['read']
    })

    return true
  }

  async removeCollaborator(projectId: string, userId: string): Promise<boolean> {
    const project = this.projects.get(projectId)
    if (!project) return false

    project.collaborators = project.collaborators.filter(c => c.userId !== userId)
    return true
  }

  /**
   * Feature 15: Project Sharing & Forking
   */
  async shareProject(projectId: string, visibility: 'public' | 'unlisted'): Promise<ShareResult> {
    const project = this.projects.get(projectId)
    if (!project) throw new Error('Project not found')

    project.visibility = visibility
    const shareUrl = `https://auralang.app/project/${projectId}`

    return {
      url: shareUrl,
      embedCode: this.generateEmbedCode(projectId),
      qrCode: this.generateQRCode(shareUrl)
    }
  }

  async forkProject(projectId: string, userId: string): Promise<Project> {
    const original = this.projects.get(projectId)
    if (!original) throw new Error('Project not found')

    if (original.visibility === 'private') {
      throw new Error('Cannot fork private project')
    }

    const forked: Project = {
      ...JSON.parse(JSON.stringify(original)), // Deep clone
      id: this.generateId(),
      name: `${original.name} (Fork)`,
      owner: userId,
      collaborators: [{ userId, role: 'owner', joinedAt: new Date(), permissions: ['*'] }],
      metadata: {
        ...original.metadata,
        stars: 0,
        forks: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Update original fork count
    original.metadata.forks++

    this.projects.set(forked.id, forked)
    return forked
  }

  /**
   * Feature 16: Project Search & Discovery
   */
  async searchProjects(query: string, filters?: SearchFilters): Promise<Project[]> {
    let results = Array.from(this.projects.values())
      .filter(p => p.visibility === 'public')

    // Text search
    if (query) {
      const lowerQuery = query.toLowerCase()
      results = results.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tags.some(t => t.toLowerCase().includes(lowerQuery))
      )
    }

    // Apply filters
    if (filters) {
      if (filters.category) {
        results = results.filter(p => p.category === filters.category)
      }
      if (filters.tags) {
        results = results.filter(p => 
          filters.tags!.every(tag => p.tags.includes(tag))
        )
      }
      if (filters.minStars) {
        results = results.filter(p => p.metadata.stars >= filters.minStars!)
      }
    }

    // Sort
    const sortBy = filters?.sortBy || 'updated'
    results.sort((a, b) => {
      switch (sortBy) {
        case 'stars':
          return b.metadata.stars - a.metadata.stars
        case 'forks':
          return b.metadata.forks - a.metadata.forks
        case 'views':
          return b.metadata.views - a.metadata.views
        case 'updated':
        default:
          return b.updatedAt.getTime() - a.updatedAt.getTime()
      }
    })

    return results
  }

  /**
   * Feature 17: Project Analytics
   */
  async getProjectAnalytics(projectId: string): Promise<ProjectAnalytics> {
    const project = this.projects.get(projectId)
    if (!project) throw new Error('Project not found')

    return {
      projectId,
      totalViews: project.metadata.views,
      totalExecutions: project.metadata.executions,
      totalStars: project.metadata.stars,
      totalForks: project.metadata.forks,
      collaboratorCount: project.collaborators.length,
      fileCount: project.files.length,
      totalVersions: project.files.reduce((sum, f) => sum + f.versions.length, 0),
      activityGraph: await this.getActivityGraph(projectId),
      topContributors: await this.getTopContributors(projectId),
      languageBreakdown: this.getLanguageBreakdown(project),
      growthMetrics: await this.getGrowthMetrics(projectId)
    }
  }

  /**
   * Feature 18: Project Export & Import
   */
  async exportProject(projectId: string, format: 'json' | 'zip' | 'git'): Promise<ExportResult> {
    const project = this.projects.get(projectId)
    if (!project) throw new Error('Project not found')

    switch (format) {
      case 'json':
        return {
          format: 'json',
          data: JSON.stringify(project, null, 2),
          filename: `${project.name}.json`
        }
      case 'zip':
        return {
          format: 'zip',
          data: await this.createZip(project),
          filename: `${project.name}.zip`
        }
      case 'git':
        return {
          format: 'git',
          data: await this.createGitBundle(project),
          filename: `${project.name}.bundle`
        }
    }
  }

  async importProject(userId: string, data: string, format: 'json' | 'zip'): Promise<Project> {
    let projectData: any

    if (format === 'json') {
      projectData = JSON.parse(data)
    } else {
      projectData = await this.extractZip(data)
    }

    return this.createProject(userId, {
      name: projectData.name,
      description: projectData.description,
      tags: projectData.tags,
      category: projectData.category
    })
  }

  /**
   * Feature 19: Project Comments & Discussions
   */
  async addComment(projectId: string, userId: string, content: string, fileId?: string, lineNumber?: number): Promise<Comment> {
    const comment: Comment = {
      id: this.generateId(),
      projectId,
      userId,
      content,
      fileId,
      lineNumber,
      replies: [],
      reactions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // In production, store comments in database
    return comment
  }

  /**
   * Feature 20: Project Stars & Bookmarks
   */
  async starProject(projectId: string, userId: string): Promise<boolean> {
    const project = this.projects.get(projectId)
    if (!project) return false

    project.metadata.stars++
    return true
  }

  async unstarProject(projectId: string, userId: string): Promise<boolean> {
    const project = this.projects.get(projectId)
    if (!project) return false

    project.metadata.stars = Math.max(0, project.metadata.stars - 1)
    return true
  }

  // Helper Methods
  private generateId(): string {
    return `prj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private createDefaultFile(): ProjectFile {
    return {
      id: this.generateId(),
      name: 'main.aura',
      path: '/main.aura',
      content: `intent hello_world {
  goal: "Create a simple hello world program"
  
  capabilities: [
    "display greeting message",
    "demonstrate basic intent structure"
  ]
  
  success_criteria: "Message displayed successfully"
}`,
      language: 'auralang',
      size: 0,
      versions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  private getDefaultSettings(): ProjectSettings {
    return {
      autoSave: true,
      autoFormat: true,
      linting: true,
      autoComplete: true,
      realTimeCollab: true,
      allowComments: true,
      allowForking: true
    }
  }

  private initializeTemplates() {
    const templates: ProjectTemplate[] = [
      {
        id: 'cognitive-assistant',
        name: 'Cognitive AI Assistant',
        description: 'Advanced AI assistant with cross-domain reasoning',
        category: 'ai',
        tags: ['ai', 'cognitive', 'assistant'],
        files: []
      },
      {
        id: 'quantum-state-manager',
        name: 'Quantum State Management',
        description: 'Advanced state management using quantum principles',
        category: 'system',
        tags: ['quantum', 'state', 'management'],
        files: []
      },
      {
        id: 'neural-architecture',
        name: 'Neural Architecture Evolution',
        description: 'Self-evolving neural network architecture',
        category: 'ai',
        tags: ['neural', 'evolution', 'ml'],
        files: []
      }
    ]

    templates.forEach(t => this.templates.set(t.id, t))
  }

  private getTemplateFiles(templateId: string): ProjectFile[] {
    return [this.createDefaultFile()]
  }

  private calculateDiff(oldContent: string, newContent: string): string {
    // Simple line-based diff
    const oldLines = oldContent.split('\n')
    const newLines = newContent.split('\n')
    
    let diff = ''
    const maxLen = Math.max(oldLines.length, newLines.length)
    
    for (let i = 0; i < maxLen; i++) {
      if (oldLines[i] !== newLines[i]) {
        if (oldLines[i]) diff += `- ${oldLines[i]}\n`
        if (newLines[i]) diff += `+ ${newLines[i]}\n`
      }
    }
    
    return diff
  }

  private generateEmbedCode(projectId: string): string {
    return `<iframe src="https://auralang.app/embed/${projectId}" width="800" height="600" frameborder="0"></iframe>`
  }

  private generateQRCode(url: string): string {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  }

  private async getActivityGraph(projectId: string): Promise<ActivityData[]> {
    return []
  }

  private async getTopContributors(projectId: string): Promise<Contributor[]> {
    return []
  }

  private getLanguageBreakdown(project: Project): LanguageStats[] {
    const stats = new Map<string, number>()
    
    project.files.forEach(file => {
      const current = stats.get(file.language) || 0
      stats.set(file.language, current + file.size)
    })
    
    return Array.from(stats.entries()).map(([language, bytes]) => ({
      language,
      bytes,
      percentage: (bytes / project.files.reduce((sum, f) => sum + f.size, 1)) * 100
    }))
  }

  private async getGrowthMetrics(projectId: string): Promise<GrowthMetrics> {
    return {
      viewsGrowth: 15.5,
      starsGrowth: 8.3,
      forksGrowth: 12.1,
      executionsGrowth: 25.7
    }
  }

  private async createZip(project: Project): Promise<string> {
    return Buffer.from(JSON.stringify(project)).toString('base64')
  }

  private async extractZip(data: string): Promise<any> {
    return JSON.parse(Buffer.from(data, 'base64').toString())
  }

  private async createGitBundle(project: Project): Promise<string> {
    return Buffer.from(JSON.stringify(project)).toString('base64')
  }
}

// Types
interface CreateProjectData {
  name: string
  description?: string
  visibility?: 'private' | 'public' | 'unlisted'
  tags?: string[]
  category?: string
  template?: string
}

interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  files: ProjectFile[]
}

interface SearchFilters {
  category?: string
  tags?: string[]
  minStars?: number
  sortBy?: 'updated' | 'stars' | 'forks' | 'views'
}

interface ShareResult {
  url: string
  embedCode: string
  qrCode: string
}

interface ProjectAnalytics {
  projectId: string
  totalViews: number
  totalExecutions: number
  totalStars: number
  totalForks: number
  collaboratorCount: number
  fileCount: number
  totalVersions: number
  activityGraph: ActivityData[]
  topContributors: Contributor[]
  languageBreakdown: LanguageStats[]
  growthMetrics: GrowthMetrics
}

interface ActivityData {
  date: string
  commits: number
  views: number
  executions: number
}

interface Contributor {
  userId: string
  username: string
  avatar: string
  contributions: number
}

interface LanguageStats {
  language: string
  bytes: number
  percentage: number
}

interface GrowthMetrics {
  viewsGrowth: number
  starsGrowth: number
  forksGrowth: number
  executionsGrowth: number
}

interface ExportResult {
  format: string
  data: string
  filename: string
}

interface Comment {
  id: string
  projectId: string
  userId: string
  content: string
  fileId?: string
  lineNumber?: number
  replies: Comment[]
  reactions: Reaction[]
  createdAt: Date
  updatedAt: Date
}

interface Reaction {
  userId: string
  emoji: string
  timestamp: Date
}
