// Feature 3: Real-time Collaboration Type System
export interface CollaborationSession {
  id: string;
  projectId: string;
  participants: Participant[];
  startedAt: Date;
  endedAt?: Date;
  status: SessionStatus;
  activeEditors: ActiveEditor[];
  chat: ChatMessage[];
  cursors: CursorPosition[];
  selections: Selection[];
  changes: Change[];
}

export enum SessionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
}

export interface Participant {
  userId: string;
  username: string;
  avatar?: string;
  color: string;
  status: ParticipantStatus;
  joinedAt: Date;
  lastActive: Date;
  permissions: string[];
}

export enum ParticipantStatus {
  ONLINE = 'online',
  AWAY = 'away',
  OFFLINE = 'offline',
}

export interface ActiveEditor {
  userId: string;
  fileId: string;
  cursorPosition: CursorPosition;
  selections: Selection[];
  lastEdit: Date;
}

export interface CursorPosition {
  userId: string;
  fileId: string;
  line: number;
  column: number;
  timestamp: Date;
}

export interface Selection {
  userId: string;
  fileId: string;
  start: { line: number; column: number };
  end: { line: number; column: number };
  timestamp: Date;
}

export interface Change {
  id: string;
  userId: string;
  fileId: string;
  type: ChangeType;
  operation: Operation;
  timestamp: Date;
  applied: boolean;
  reverted: boolean;
}

export enum ChangeType {
  INSERT = 'insert',
  DELETE = 'delete',
  REPLACE = 'replace',
  MOVE = 'move',
}

export interface Operation {
  type: ChangeType;
  position: { line: number; column: number };
  content?: string;
  length?: number;
  range?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  reactions: Reaction[];
  metadata?: MessageMetadata;
}

export enum MessageType {
  TEXT = 'text',
  CODE = 'code',
  FILE = 'file',
  SYSTEM = 'system',
  COMMAND = 'command',
}

export interface Reaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

export interface MessageMetadata {
  fileId?: string;
  lineNumber?: number;
  language?: string;
  replyTo?: string;
  mentions?: string[];
}

// Feature 4: Conflict Resolution
export interface Conflict {
  id: string;
  fileId: string;
  changes: ConflictingChange[];
  resolution?: ConflictResolution;
  status: ConflictStatus;
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface ConflictingChange {
  userId: string;
  operation: Operation;
  timestamp: Date;
  version: string;
}

export interface ConflictResolution {
  strategy: ResolutionStrategy;
  acceptedChanges: string[];
  rejectedChanges: string[];
  mergedContent: string;
}

export enum ResolutionStrategy {
  ACCEPT_MINE = 'accept_mine',
  ACCEPT_THEIRS = 'accept_theirs',
  ACCEPT_BOTH = 'accept_both',
  MANUAL_MERGE = 'manual_merge',
  AUTO_MERGE = 'auto_merge',
}

export enum ConflictStatus {
  UNRESOLVED = 'unresolved',
  RESOLVING = 'resolving',
  RESOLVED = 'resolved',
  ESCALATED = 'escalated',
}

// Feature 5: WebSocket Events
export interface WebSocketEvent {
  type: WSEventType;
  payload: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export enum WSEventType {
  USER_JOINED = 'user_joined',
  USER_LEFT = 'user_left',
  USER_STATUS_CHANGED = 'user_status_changed',
  CURSOR_MOVED = 'cursor_moved',
  SELECTION_CHANGED = 'selection_changed',
  TEXT_CHANGED = 'text_changed',
  FILE_OPENED = 'file_opened',
  FILE_CLOSED = 'file_closed',
  CHAT_MESSAGE = 'chat_message',
  CONFLICT_DETECTED = 'conflict_detected',
  CONFLICT_RESOLVED = 'conflict_resolved',
  PROJECT_UPDATED = 'project_updated',
  NOTIFICATION = 'notification',
}
