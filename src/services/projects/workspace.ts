/**
 * Project Workspace Management
 * Features 11-12: Unlimited Projects & Project Workspaces
 */

import type {
  Project,
  ProjectFile,
  CreateProjectData,
  ProjectTemplate,
  TemplateFile,
  ProjectSettings
} from './types'

export class WorkspaceManager {
  private projects: Map<string, Project> = new Map()
  private templates: Map<string, ProjectTemplate> = new Map()

  constructor() {
    this.initializeTemplates()
  }

  /**
   * Feature 11: Create unlimited projects
   */
  async createProject(ownerId: string, data: CreateProjectData): Promise<Project> {
    const project: Project = {
      id: this.generateId(),
      name: data.name,
      description: data.description || '',
      owner: ownerId,
      collaborators: [{ 
        userId: ownerId, 
        role: 'owner', 
        joinedAt: new Date(), 
        permissions: ['*'] 
      }],
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
   * Feature 12: Organize projects in workspaces
   */
  async getWorkspaceProjects(userId: string, workspace?: string): Promise<Project[]> {
    const userProjects = Array.from(this.projects.values()).filter(
      p => p.owner === userId || p.collaborators.some(c => c.userId === userId)
    )

    if (workspace) {
      return userProjects.filter(p => p.category === workspace)
    }

    return userProjects
  }

  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project> {
    const project = this.projects.get(projectId)
    if (!project) throw new Error('Project not found')

    const updated = { ...project, ...updates, updatedAt: new Date() }
    this.projects.set(projectId, updated)
    return updated
  }

  async deleteProject(projectId: string): Promise<void> {
    this.projects.delete(projectId)
  }

  async getProject(projectId: string): Promise<Project | null> {
    return this.projects.get(projectId) || null
  }

  async listProjects(userId: string, filters?: {
    category?: string
    visibility?: string
    tags?: string[]
  }): Promise<Project[]> {
    let projects = Array.from(this.projects.values()).filter(
      p => p.owner === userId || p.collaborators.some(c => c.userId === userId)
    )

    if (filters?.category) {
      projects = projects.filter(p => p.category === filters.category)
    }

    if (filters?.visibility) {
      projects = projects.filter(p => p.visibility === filters.visibility)
    }

    if (filters?.tags && filters.tags.length > 0) {
      projects = projects.filter(p => 
        filters.tags!.some(tag => p.tags.includes(tag))
      )
    }

    return projects
  }

  /**
   * Feature 20: Project Templates
   */
  async getTemplates(category?: string): Promise<ProjectTemplate[]> {
    const templates = Array.from(this.templates.values())
    
    if (category) {
      return templates.filter(t => t.category === category)
    }

    return templates
  }

  async createFromTemplate(userId: string, templateId: string, name: string): Promise<Project> {
    const template = this.templates.get(templateId)
    if (!template) throw new Error('Template not found')

    return this.createProject(userId, {
      name,
      description: `Created from ${template.name} template`,
      category: template.category,
      template: templateId
    })
  }

  // Helper methods
  private generateId(): string {
    return `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private createDefaultFile(): ProjectFile {
    return {
      id: this.generateId(),
      name: 'main.aura',
      path: '/main.aura',
      content: '// Welcome to AuraLang!\n\nfunction main() {\n  print("Hello, World!")\n}\n',
      language: 'auralang',
      size: 80,
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
      realTimeCollab: false,
      allowComments: true,
      allowForking: true
    }
  }

  private getTemplateFiles(templateId: string): ProjectFile[] {
    const template = this.templates.get(templateId)
    if (!template) return [this.createDefaultFile()]

    return template.files.map(tf => ({
      id: this.generateId(),
      name: tf.name,
      path: tf.path,
      content: tf.content,
      language: tf.language as any,
      size: tf.content.length,
      versions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }))
  }

  private initializeTemplates() {
    // Web Development Templates
    this.templates.set('react-app', {
      id: 'react-app',
      name: 'React Application',
      description: 'Modern React app with TypeScript',
      category: 'web',
      icon: '⚛️',
      popular: true,
      files: [
        {
          name: 'App.tsx',
          path: '/src/App.tsx',
          content: 'import React from "react"\n\nexport default function App() {\n  return <div>Hello React!</div>\n}',
          language: 'typescript'
        }
      ]
    })

    this.templates.set('node-api', {
      id: 'node-api',
      name: 'Node.js API',
      description: 'RESTful API with Express',
      category: 'backend',
      icon: '🟢',
      popular: true,
      files: [
        {
          name: 'server.js',
          path: '/server.js',
          content: 'const express = require("express")\nconst app = express()\n\napp.get("/", (req, res) => {\n  res.json({ message: "Hello API!" })\n})\n\napp.listen(3000)',
          language: 'javascript'
        }
      ]
    })

    // Add more templates...
    this.templates.set('python-ml', {
      id: 'python-ml',
      name: 'Python ML Project',
      description: 'Machine Learning with Python',
      category: 'data-science',
      icon: '🐍',
      popular: true,
      files: [
        {
          name: 'model.py',
          path: '/model.py',
          content: 'import numpy as np\nimport pandas as pd\n\n# Your ML code here',
          language: 'python'
        }
      ]
    })
  }
}
