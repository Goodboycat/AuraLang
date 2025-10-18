// Feature 6: Analytics and Monitoring Type System
export interface Analytics {
  userId?: string;
  projectId?: string;
  sessionId: string;
  events: AnalyticsEvent[];
  metrics: PerformanceMetrics;
  usage: UsageStatistics;
  errors: ErrorLog[];
  insights: Insight[];
}

export interface AnalyticsEvent {
  id: string;
  type: EventType;
  category: string;
  action: string;
  label?: string;
  value?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
  userId?: string;
  sessionId: string;
}

export enum EventType {
  PAGE_VIEW = 'page_view',
  USER_ACTION = 'user_action',
  CODE_EXECUTION = 'code_execution',
  FILE_OPERATION = 'file_operation',
  COLLABORATION = 'collaboration',
  ERROR = 'error',
  PERFORMANCE = 'performance',
  CONVERSION = 'conversion',
}

export interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  renderTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

export interface UsageStatistics {
  totalExecutions: number;
  totalProjects: number;
  totalFiles: number;
  totalCollaborations: number;
  activeTime: number;
  linesOfCode: number;
  filesCreated: number;
  filesEdited: number;
  deploymentsCount: number;
  apiCallsCount: number;
}

export interface ErrorLog {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  context: ErrorContext;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
}

export enum ErrorType {
  SYNTAX = 'syntax',
  RUNTIME = 'runtime',
  NETWORK = 'network',
  PERMISSION = 'permission',
  VALIDATION = 'validation',
  SYSTEM = 'system',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export interface ErrorContext {
  userId?: string;
  projectId?: string;
  fileId?: string;
  lineNumber?: number;
  columnNumber?: number;
  url?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  actionable: boolean;
  recommendations: Recommendation[];
  metrics: Record<string, number>;
  createdAt: Date;
}

export enum InsightType {
  OPTIMIZATION = 'optimization',
  USAGE_PATTERN = 'usage_pattern',
  PERFORMANCE = 'performance',
  SECURITY = 'security',
  COLLABORATION = 'collaboration',
  LEARNING = 'learning',
}

export interface Recommendation {
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  action?: {
    type: string;
    payload: any;
  };
}

// Feature 7: Monitoring and Alerting
export interface Monitor {
  id: string;
  name: string;
  type: MonitorType;
  conditions: MonitorCondition[];
  actions: MonitorAction[];
  enabled: boolean;
  frequency: number; // in seconds
  lastCheck?: Date;
  status: MonitorStatus;
}

export enum MonitorType {
  HEALTH_CHECK = 'health_check',
  PERFORMANCE = 'performance',
  ERROR_RATE = 'error_rate',
  USAGE_LIMIT = 'usage_limit',
  SECURITY = 'security',
  CUSTOM = 'custom',
}

export interface MonitorCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  duration?: number; // in seconds
}

export interface MonitorAction {
  type: ActionType;
  config: Record<string, any>;
}

export enum ActionType {
  EMAIL = 'email',
  WEBHOOK = 'webhook',
  NOTIFICATION = 'notification',
  AUTO_SCALE = 'auto_scale',
  ALERT = 'alert',
}

export enum MonitorStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  CRITICAL = 'critical',
  UNKNOWN = 'unknown',
}

export interface Alert {
  id: string;
  monitorId: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolved: boolean;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}
