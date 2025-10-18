// Feature 99: Notification Service
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  expiresAt?: Date;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  SYSTEM = 'system',
  COLLABORATION = 'collaboration',
  DEPLOYMENT = 'deployment',
  SECURITY = 'security',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  types: NotificationType[];
  quietHours?: {
    start: string;
    end: string;
  };
}

export class NotificationService {
  private notifications: Map<string, Notification[]> = new Map();
  private preferences: Map<string, NotificationPreferences> = new Map();
  private listeners: Map<string, Set<(notification: Notification) => void>> = new Map();

  // Feature 100: Send Notification
  async send(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<Notification> {
    const fullNotification: Notification = {
      ...notification,
      id: this.generateId(),
      createdAt: new Date(),
      read: false,
    };

    // Store notification
    const userNotifications = this.notifications.get(notification.userId) || [];
    userNotifications.unshift(fullNotification);
    this.notifications.set(notification.userId, userNotifications);

    // Check preferences
    const prefs = this.preferences.get(notification.userId);
    if (prefs) {
      if (!prefs.types.includes(notification.type)) {
        return fullNotification;
      }

      // Check quiet hours
      if (prefs.quietHours && this.isQuietHours(prefs.quietHours)) {
        return fullNotification;
      }

      // Send through enabled channels
      if (prefs.email) {
        await this.sendEmail(fullNotification);
      }
      if (prefs.push) {
        await this.sendPush(fullNotification);
      }
    }

    // Notify listeners (for real-time updates)
    if (prefs?.inApp) {
      this.notifyListeners(notification.userId, fullNotification);
    }

    return fullNotification;
  }

  // Subscribe to real-time notifications
  subscribe(userId: string, callback: (notification: Notification) => void): () => void {
    const userListeners = this.listeners.get(userId) || new Set();
    userListeners.add(callback);
    this.listeners.set(userId, userListeners);

    // Return unsubscribe function
    return () => {
      userListeners.delete(callback);
    };
  }

  // Get user notifications
  async getNotifications(userId: string, options: {
    unreadOnly?: boolean;
    type?: NotificationType;
    limit?: number;
  } = {}): Promise<Notification[]> {
    let notifications = this.notifications.get(userId) || [];

    if (options.unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }

    if (options.type) {
      notifications = notifications.filter(n => n.type === options.type);
    }

    if (options.limit) {
      notifications = notifications.slice(0, options.limit);
    }

    // Filter expired notifications
    const now = new Date();
    notifications = notifications.filter(n => !n.expiresAt || n.expiresAt > now);

    return notifications;
  }

  // Mark notification as read
  async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    const notifications = this.notifications.get(userId);
    if (!notifications) return false;

    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return false;

    notification.read = true;
    return true;
  }

  // Mark all as read
  async markAllAsRead(userId: string): Promise<number> {
    const notifications = this.notifications.get(userId);
    if (!notifications) return 0;

    let count = 0;
    for (const notification of notifications) {
      if (!notification.read) {
        notification.read = true;
        count++;
      }
    }

    return count;
  }

  // Delete notification
  async delete(userId: string, notificationId: string): Promise<boolean> {
    const notifications = this.notifications.get(userId);
    if (!notifications) return false;

    const index = notifications.findIndex(n => n.id === notificationId);
    if (index === -1) return false;

    notifications.splice(index, 1);
    return true;
  }

  // Delete all notifications
  async deleteAll(userId: string): Promise<number> {
    const notifications = this.notifications.get(userId);
    if (!notifications) return 0;

    const count = notifications.length;
    this.notifications.set(userId, []);
    return count;
  }

  // Get unread count
  async getUnreadCount(userId: string): Promise<number> {
    const notifications = this.notifications.get(userId) || [];
    return notifications.filter(n => !n.read).length;
  }

  // Update preferences
  async updatePreferences(userId: string, prefs: NotificationPreferences): Promise<void> {
    this.preferences.set(userId, prefs);
  }

  // Get preferences
  async getPreferences(userId: string): Promise<NotificationPreferences> {
    return this.preferences.get(userId) || this.getDefaultPreferences();
  }

  // Batch notifications for digest
  async createDigest(userId: string, period: 'hourly' | 'daily' | 'weekly'): Promise<{
    notifications: Notification[];
    summary: string;
  }> {
    const notifications = await this.getNotifications(userId, { unreadOnly: true });
    
    // Group by type
    const grouped = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Generate summary
    const summary = Object.entries(grouped)
      .map(([type, count]) => `${count} ${type} notification${count > 1 ? 's' : ''}`)
      .join(', ');

    return {
      notifications,
      summary: `You have ${notifications.length} unread notifications: ${summary}`,
    };
  }

  private notifyListeners(userId: string, notification: Notification): void {
    const listeners = this.listeners.get(userId);
    if (listeners) {
      listeners.forEach(callback => callback(notification));
    }
  }

  private async sendEmail(notification: Notification): Promise<void> {
    // In production, integrate with email service
    console.log('Sending email notification:', notification);
  }

  private async sendPush(notification: Notification): Promise<void> {
    // In production, integrate with push notification service
    console.log('Sending push notification:', notification);
  }

  private isQuietHours(quietHours: { start: string; end: string }): boolean {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return currentTime >= quietHours.start && currentTime <= quietHours.end;
  }

  private getDefaultPreferences(): NotificationPreferences {
    return {
      email: true,
      push: true,
      inApp: true,
      types: Object.values(NotificationType),
    };
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const notificationService = new NotificationService();
