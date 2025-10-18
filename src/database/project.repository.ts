// Feature 49: Project Database Repository
import type { 
  Project, 
  ProjectFile, 
  ProjectCollaborator, 
  ProjectVisibility,
  ProjectStatus,
  CollaboratorRole 
} from '../types/project.types';

export interface CreateProjectData {
  name: string;
  description: string;
  owner: string;
  visibility?: ProjectVisibility;
  category?: string;
  tags?: string[];
}

export interface UpdateProjectData {
  name?: string;
  description?: string;
  visibility?: ProjectVisibility;
  status?: ProjectStatus;
  category?: string;
  tags?: string[];
}

export class ProjectRepository {
  private projects: Map<string, Project> = new Map();

  // Feature 50: Create Project
  async create(data: CreateProjectData): Promise<Project> {
    const project: Project = {
      id: this.generateId(),
      name: data.name,
      description: data.description,
      owner: data.owner,
      collaborators: [{
        userId: data.owner,
        role: CollaboratorRole.OWNER,
        permissions: ['*'],
        addedAt: new Date(),
        invitedBy: data.owner,
        status: 'active',
      }],
      visibility: data.visibility || ProjectVisibility.PRIVATE,
      status: ProjectStatus.ACTIVE,
      files: [],
      settings: this.getDefaultSettings(),
      metadata: this.getDefaultMetadata(),
      tags: data.tags || [],
      category: data.category || 'general',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastAccessed: new Date(),
      version: '1.0.0',
      deployments: [],
    };

    this.projects.set(project.id, project);
    return project;
  }

  // Feature 51: Find Project by ID
  async findById(id: string): Promise<Project | null> {
    const project = this.projects.get(id);
    if (project) {
      project.lastAccessed = new Date();
      this.projects.set(id, project);
    }
    return project || null;
  }

  // Feature 52: Update Project
  async update(id: string, data: UpdateProjectData): Promise<Project | null> {
    const project = this.projects.get(id);
    if (!project) return null;

    const updated: Project = {
      ...project,
      ...data,
      updatedAt: new Date(),
    };

    this.projects.set(id, updated);
    return updated;
  }

  // Feature 53: Delete Project
  async delete(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Feature 54: List User Projects
  async listByUser(userId: string, options: {
    page?: number;
    limit?: number;
    status?: ProjectStatus;
    visibility?: ProjectVisibility;
    search?: string;
  } = {}): Promise<{ projects: Project[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      status,
      visibility,
      search,
    } = options;

    let filtered = Array.from(this.projects.values()).filter(p => 
      p.owner === userId || p.collaborators.some(c => c.userId === userId)
    );

    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }
    if (visibility) {
      filtered = filtered.filter(p => p.visibility === visibility);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(t => t.toLowerCase().includes(searchLower))
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const projects = filtered
      .sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())
      .slice(start, start + limit);

    return { projects, total };
  }

  // Feature 55: Add File to Project
  async addFile(projectId: string, file: Omit<ProjectFile, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProjectFile | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const newFile: ProjectFile = {
      ...file,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    project.files.push(newFile);
    project.updatedAt = new Date();
    this.projects.set(projectId, project);

    return newFile;
  }

  // Feature 56: Update File in Project
  async updateFile(projectId: string, fileId: string, content: string, updatedBy: string): Promise<ProjectFile | null> {
    const project = this.projects.get(projectId);
    if (!project) return null;

    const file = project.files.find(f => f.id === fileId);
    if (!file) return null;

    file.content = content;
    file.updatedAt = new Date();
    file.updatedBy = updatedBy;
    file.hash = this.generateHash(content);

    project.updatedAt = new Date();
    this.projects.set(projectId, project);

    return file;
  }

  // Feature 57: Delete File from Project
  async deleteFile(projectId: string, fileId: string): Promise<boolean> {
    const project = this.projects.get(projectId);
    if (!project) return false;

    const index = project.files.findIndex(f => f.id === fileId);
    if (index === -1) return false;

    project.files.splice(index, 1);
    project.updatedAt = new Date();
    this.projects.set(projectId, project);

    return true;
  }

  // Feature 58: Add Collaborator
  async addCollaborator(projectId: string, collaborator: Omit<ProjectCollaborator, 'addedAt'>): Promise<boolean> {
    const project = this.projects.get(projectId);
    if (!project) return false;

    // Check if already exists
    if (project.collaborators.some(c => c.userId === collaborator.userId)) {
      return false;
    }

    project.collaborators.push({
      ...collaborator,
      addedAt: new Date(),
    });

    project.updatedAt = new Date();
    this.projects.set(projectId, project);

    return true;
  }

  // Feature 59: Remove Collaborator
  async removeCollaborator(projectId: string, userId: string): Promise<boolean> {
    const project = this.projects.get(projectId);
    if (!project) return false;

    const index = project.collaborators.findIndex(c => c.userId === userId);
    if (index === -1) return false;

    // Cannot remove owner
    if (project.collaborators[index].role === CollaboratorRole.OWNER) {
      return false;
    }

    project.collaborators.splice(index, 1);
    project.updatedAt = new Date();
    this.projects.set(projectId, project);

    return true;
  }

  // Feature 60: Update Collaborator Role
  async updateCollaboratorRole(projectId: string, userId: string, role: CollaboratorRole): Promise<boolean> {
    const project = this.projects.get(projectId);
    if (!project) return false;

    const collaborator = project.collaborators.find(c => c.userId === userId);
    if (!collaborator) return false;

    // Cannot change owner role
    if (collaborator.role === CollaboratorRole.OWNER) {
      return false;
    }

    collaborator.role = role;
    project.updatedAt = new Date();
    this.projects.set(projectId, project);

    return true;
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateHash(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private getDefaultSettings(): Project['settings'] {
    return {
      autoSave: true,
      autoFormat: true,
      linting: true,
      testing: false,
      cicd: false,
      notifications: true,
      analytics: true,
      security: {
        requireApproval: false,
        allowedDomains: [],
        secretsManagement: false,
        vulnerabilityScanning: true,
        accessLogs: true,
      },
      performance: {
        optimizationLevel: 'basic',
        caching: true,
        compression: true,
        cdn: false,
        monitoring: true,
      },
    };
  }

  private getDefaultMetadata(): Project['metadata'] {
    return {
      stars: 0,
      forks: 0,
      downloads: 0,
      views: 0,
      rating: 0,
      reviews: [],
      dependencies: [],
      buildInfo: {
        lastBuildTime: new Date(),
        buildDuration: 0,
        success: true,
        errors: [],
        warnings: [],
        artifacts: [],
      },
    };
  }
}

export const projectRepository = new ProjectRepository();
