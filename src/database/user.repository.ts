// Feature 38: User Database Repository
import type { User, UserRole, UserStatus } from '../types/user.types';

export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface UpdateUserData {
  displayName?: string;
  bio?: string;
  avatar?: string;
  settings?: Partial<User['settings']>;
  preferences?: Partial<User['preferences']>;
}

export class UserRepository {
  private users: Map<string, User> = new Map();

  // Feature 39: Create User
  async create(data: CreateUserData): Promise<User> {
    const user: User = {
      id: this.generateId(),
      email: data.email,
      username: data.username,
      displayName: data.displayName || data.username,
      role: UserRole.DEVELOPER,
      permissions: [],
      settings: this.getDefaultSettings(),
      preferences: this.getDefaultPreferences(),
      subscription: this.getDefaultSubscription(),
      twoFactorEnabled: false,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      status: UserStatus.PENDING,
      metadata: {},
    };

    this.users.set(user.id, user);
    return user;
  }

  // Feature 40: Find User by ID
  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  // Feature 41: Find User by Email
  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  // Feature 42: Find User by Username
  async findByUsername(username: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  // Feature 43: Update User
  async update(id: string, data: UpdateUserData): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updated: User = {
      ...user,
      ...data,
      settings: data.settings ? { ...user.settings, ...data.settings } : user.settings,
      preferences: data.preferences ? { ...user.preferences, ...data.preferences } : user.preferences,
      updatedAt: new Date(),
    };

    this.users.set(id, updated);
    return updated;
  }

  // Feature 44: Delete User
  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Feature 45: List Users with Pagination
  async list(options: {
    page?: number;
    limit?: number;
    role?: UserRole;
    status?: UserStatus;
    search?: string;
  } = {}): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      search,
    } = options;

    let filtered = Array.from(this.users.values());

    // Apply filters
    if (role) {
      filtered = filtered.filter(u => u.role === role);
    }
    if (status) {
      filtered = filtered.filter(u => u.status === status);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(u =>
        u.email.toLowerCase().includes(searchLower) ||
        u.username.toLowerCase().includes(searchLower) ||
        u.displayName.toLowerCase().includes(searchLower)
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const users = filtered.slice(start, start + limit);

    return { users, total, page, limit };
  }

  // Feature 46: Update Last Login
  async updateLastLogin(id: string): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      user.lastLogin = new Date();
      this.users.set(id, user);
    }
  }

  // Feature 47: Verify Email
  async verifyEmail(id: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;

    user.emailVerified = true;
    user.status = UserStatus.ACTIVE;
    this.users.set(id, user);
    return true;
  }

  // Feature 48: Enable/Disable 2FA
  async toggle2FA(id: string, enabled: boolean): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;

    user.twoFactorEnabled = enabled;
    this.users.set(id, user);
    return true;
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDefaultSettings(): User['settings'] {
    return {
      theme: 'dark',
      language: 'en',
      timezone: 'UTC',
      notifications: {
        email: true,
        push: true,
        inApp: true,
        digest: 'realtime',
      },
      privacy: {
        profileVisibility: 'public',
        showActivity: true,
        allowCollaboration: true,
        shareAnalytics: false,
      },
      editor: {
        fontSize: 14,
        fontFamily: 'monospace',
        tabSize: 2,
        autoSave: true,
        autoComplete: true,
        lineNumbers: true,
        minimap: true,
        wordWrap: false,
      },
    };
  }

  private getDefaultPreferences(): User['preferences'] {
    return {
      recentProjects: [],
      favoriteComponents: [],
      customKeybindings: {},
      dashboardLayout: {
        widgets: [],
        columns: 3,
      },
    };
  }

  private getDefaultSubscription(): User['subscription'] {
    return {
      plan: 'free' as any,
      status: 'active' as any,
      startDate: new Date(),
      features: ['basic_ide', 'limited_executions'],
      limits: {
        maxProjects: 5,
        maxCollaborators: 3,
        maxExecutionsPerDay: 100,
        maxStorageGB: 1,
        maxAPICallsPerMonth: 1000,
      },
    };
  }
}

export const userRepository = new UserRepository();
