// Feature 81: Advanced Analytics Service
import type {
  Analytics,
  AnalyticsEvent,
  PerformanceMetrics,
  UsageStatistics,
  ErrorLog,
  Insight,
  InsightType,
} from '../types/analytics.types';

export class AnalyticsService {
  private events: Map<string, AnalyticsEvent[]> = new Map();
  private metrics: Map<string, PerformanceMetrics> = new Map();
  private errors: Map<string, ErrorLog[]> = new Map();

  // Feature 82: Track Event
  async trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: AnalyticsEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date(),
    };

    const sessionEvents = this.events.get(event.sessionId) || [];
    sessionEvents.push(fullEvent);
    this.events.set(event.sessionId, sessionEvents);

    // Send to analytics backend (in production)
    await this.sendToBackend(fullEvent);
  }

  // Feature 83: Track Performance Metrics
  async trackPerformance(sessionId: string, metrics: Partial<PerformanceMetrics>): Promise<void> {
    const existing = this.metrics.get(sessionId) || this.getEmptyMetrics();
    const updated = { ...existing, ...metrics };
    this.metrics.set(sessionId, updated);
  }

  // Feature 84: Log Error
  async logError(error: Omit<ErrorLog, 'id' | 'timestamp'>): Promise<void> {
    const errorLog: ErrorLog = {
      ...error,
      id: this.generateId(),
      timestamp: new Date(),
      resolved: false,
    };

    const sessionErrors = this.errors.get(error.context.userId || 'anonymous') || [];
    sessionErrors.push(errorLog);
    this.errors.set(error.context.userId || 'anonymous', sessionErrors);

    // Send to error tracking service
    await this.sendErrorToBackend(errorLog);
  }

  // Feature 85: Generate Insights
  async generateInsights(userId: string): Promise<Insight[]> {
    const insights: Insight[] = [];

    // Get user's analytics data
    const userEvents = await this.getUserEvents(userId);
    const userMetrics = await this.getUserMetrics(userId);
    const userErrors = this.errors.get(userId) || [];

    // Performance insights
    if (userMetrics.executionTime > 5000) {
      insights.push({
        id: this.generateId(),
        type: InsightType.PERFORMANCE,
        title: 'Slow Execution Detected',
        description: 'Your code executions are taking longer than average',
        priority: 'high',
        category: 'performance',
        actionable: true,
        recommendations: [
          {
            title: 'Optimize algorithms',
            description: 'Review your code for inefficient loops or operations',
            impact: 'high',
            effort: 'medium',
          },
          {
            title: 'Enable caching',
            description: 'Cache frequently accessed data to reduce computation',
            impact: 'medium',
            effort: 'low',
          },
        ],
        metrics: {
          averageExecutionTime: userMetrics.executionTime,
          recommendedTime: 2000,
        },
        createdAt: new Date(),
      });
    }

    // Error insights
    if (userErrors.length > 10) {
      insights.push({
        id: this.generateId(),
        type: InsightType.SECURITY,
        title: 'High Error Rate',
        description: `You have ${userErrors.length} errors in the last period`,
        priority: 'medium',
        category: 'errors',
        actionable: true,
        recommendations: [
          {
            title: 'Review error logs',
            description: 'Check common error patterns and fix underlying issues',
            impact: 'high',
            effort: 'medium',
          },
        ],
        metrics: {
          errorCount: userErrors.length,
        },
        createdAt: new Date(),
      });
    }

    // Usage insights
    const executionCount = userEvents.filter(e => e.type === 'code_execution').length;
    if (executionCount > 100) {
      insights.push({
        id: this.generateId(),
        type: InsightType.USAGE_PATTERN,
        title: 'Power User Detected',
        description: 'You are a highly active user! Consider upgrading for more features',
        priority: 'low',
        category: 'usage',
        actionable: true,
        recommendations: [
          {
            title: 'Upgrade to Pro',
            description: 'Get unlimited executions and advanced features',
            impact: 'high',
            effort: 'low',
            action: {
              type: 'navigate',
              payload: { url: '/pricing' },
            },
          },
        ],
        metrics: {
          executionsThisMonth: executionCount,
        },
        createdAt: new Date(),
      });
    }

    return insights;
  }

  // Feature 86: Get Usage Statistics
  async getUsageStatistics(userId: string): Promise<UsageStatistics> {
    const events = await this.getUserEvents(userId);

    return {
      totalExecutions: events.filter(e => e.type === 'code_execution').length,
      totalProjects: new Set(events.filter(e => e.metadata?.projectId).map(e => e.metadata?.projectId)).size,
      totalFiles: events.filter(e => e.type === 'file_operation').length,
      totalCollaborations: events.filter(e => e.type === 'collaboration').length,
      activeTime: this.calculateActiveTime(events),
      linesOfCode: events.reduce((sum, e) => sum + (e.metadata?.linesOfCode || 0), 0),
      filesCreated: events.filter(e => e.action === 'create_file').length,
      filesEdited: events.filter(e => e.action === 'edit_file').length,
      deploymentsCount: events.filter(e => e.action === 'deploy').length,
      apiCallsCount: events.filter(e => e.type === 'code_execution').length,
    };
  }

  // Feature 87: Get Analytics Dashboard Data
  async getDashboardData(userId: string): Promise<Analytics> {
    const events = await this.getUserEvents(userId);
    const sessionId = events[0]?.sessionId || 'unknown';
    const metrics = await this.getUserMetrics(userId);
    const usage = await this.getUsageStatistics(userId);
    const errors = this.errors.get(userId) || [];
    const insights = await this.generateInsights(userId);

    return {
      userId,
      sessionId,
      events,
      metrics,
      usage,
      errors,
      insights,
    };
  }

  // Feature 88: Real-time Analytics Stream
  async *streamAnalytics(userId: string): AsyncGenerator<AnalyticsEvent> {
    // In production, this would connect to a real-time stream
    const events = await this.getUserEvents(userId);
    for (const event of events) {
      yield event;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private async getUserEvents(userId: string): Promise<AnalyticsEvent[]> {
    const allEvents: AnalyticsEvent[] = [];
    for (const events of this.events.values()) {
      allEvents.push(...events.filter(e => e.userId === userId));
    }
    return allEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  private async getUserMetrics(userId: string): Promise<PerformanceMetrics> {
    // Aggregate metrics from all sessions
    const allMetrics: PerformanceMetrics[] = [];
    for (const [sessionId, metrics] of this.metrics.entries()) {
      const events = this.events.get(sessionId) || [];
      if (events.some(e => e.userId === userId)) {
        allMetrics.push(metrics);
      }
    }

    if (allMetrics.length === 0) {
      return this.getEmptyMetrics();
    }

    // Calculate averages
    return {
      executionTime: this.average(allMetrics.map(m => m.executionTime)),
      memoryUsage: this.average(allMetrics.map(m => m.memoryUsage)),
      cpuUsage: this.average(allMetrics.map(m => m.cpuUsage)),
      networkLatency: this.average(allMetrics.map(m => m.networkLatency)),
      renderTime: this.average(allMetrics.map(m => m.renderTime)),
      timeToInteractive: this.average(allMetrics.map(m => m.timeToInteractive)),
      firstContentfulPaint: this.average(allMetrics.map(m => m.firstContentfulPaint)),
      largestContentfulPaint: this.average(allMetrics.map(m => m.largestContentfulPaint)),
      cumulativeLayoutShift: this.average(allMetrics.map(m => m.cumulativeLayoutShift)),
      firstInputDelay: this.average(allMetrics.map(m => m.firstInputDelay)),
    };
  }

  private calculateActiveTime(events: AnalyticsEvent[]): number {
    if (events.length === 0) return 0;
    
    const sortedEvents = events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    let activeTime = 0;
    let lastEventTime = sortedEvents[0].timestamp.getTime();

    for (let i = 1; i < sortedEvents.length; i++) {
      const currentTime = sortedEvents[i].timestamp.getTime();
      const gap = currentTime - lastEventTime;
      
      // Count as active if events are within 5 minutes of each other
      if (gap < 5 * 60 * 1000) {
        activeTime += gap;
      }
      
      lastEventTime = currentTime;
    }

    return activeTime;
  }

  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  private getEmptyMetrics(): PerformanceMetrics {
    return {
      executionTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      networkLatency: 0,
      renderTime: 0,
      timeToInteractive: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
    };
  }

  private async sendToBackend(event: AnalyticsEvent): Promise<void> {
    // In production, send to analytics service
  }

  private async sendErrorToBackend(error: ErrorLog): Promise<void> {
    // In production, send to error tracking service
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const analyticsService = new AnalyticsService();
