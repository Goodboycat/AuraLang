// Feature 71: Real-time Collaboration WebSocket Handler
import type {
  CollaborationSession,
  Participant,
  ChatMessage,
  CursorPosition,
  Selection,
  Change,
  WSEventType,
  WebSocketEvent,
} from '../types/collaboration.types';

export class CollaborationHandler {
  private sessions: Map<string, CollaborationSession> = new Map();
  private connections: Map<string, WebSocket> = new Map();
  private userSessions: Map<string, string> = new Map(); // userId -> sessionId

  // Feature 72: Handle New Connection
  async handleConnection(ws: WebSocket, userId: string, projectId: string, username: string): Promise<void> {
    const connectionId = this.generateId();
    this.connections.set(connectionId, ws);

    // Find or create session
    let session = await this.findSessionByProject(projectId);
    if (!session) {
      session = await this.createSession(projectId);
    }

    // Add participant
    const participant: Participant = {
      userId,
      username,
      color: this.generateColor(),
      status: 'online',
      joinedAt: new Date(),
      lastActive: new Date(),
      permissions: ['read', 'write'],
    };

    session.participants.push(participant);
    this.userSessions.set(userId, session.id);
    this.sessions.set(session.id, session);

    // Notify other participants
    this.broadcast(session.id, {
      type: 'user_joined' as WSEventType,
      payload: participant,
      timestamp: new Date(),
      userId,
      sessionId: session.id,
    }, userId);

    // Send current session state to new participant
    ws.send(JSON.stringify({
      type: 'session_state',
      payload: {
        session,
        participants: session.participants,
        recentMessages: session.chat.slice(-50),
      },
    }));

    // Setup message handler
    ws.addEventListener('message', (event) => {
      this.handleMessage(session!, userId, event.data);
    });

    // Setup close handler
    ws.addEventListener('close', () => {
      this.handleDisconnection(session!, userId, connectionId);
    });
  }

  // Feature 73: Handle WebSocket Messages
  private async handleMessage(session: CollaborationSession, userId: string, data: string): Promise<void> {
    try {
      const message = JSON.parse(data);
      const { type, payload } = message;

      switch (type) {
        case 'cursor_moved':
          await this.handleCursorMove(session, userId, payload);
          break;
        case 'selection_changed':
          await this.handleSelectionChange(session, userId, payload);
          break;
        case 'text_changed':
          await this.handleTextChange(session, userId, payload);
          break;
        case 'chat_message':
          await this.handleChatMessage(session, userId, payload);
          break;
        case 'file_opened':
          await this.handleFileOpen(session, userId, payload);
          break;
        case 'file_closed':
          await this.handleFileClose(session, userId, payload);
          break;
        default:
          console.warn('Unknown message type:', type);
      }

      // Update participant last active
      const participant = session.participants.find(p => p.userId === userId);
      if (participant) {
        participant.lastActive = new Date();
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  }

  // Feature 74: Handle Cursor Movement
  private async handleCursorMove(session: CollaborationSession, userId: string, payload: any): Promise<void> {
    const cursor: CursorPosition = {
      userId,
      fileId: payload.fileId,
      line: payload.line,
      column: payload.column,
      timestamp: new Date(),
    };

    // Update session cursors
    const existingIndex = session.cursors.findIndex(c => c.userId === userId && c.fileId === payload.fileId);
    if (existingIndex >= 0) {
      session.cursors[existingIndex] = cursor;
    } else {
      session.cursors.push(cursor);
    }

    // Broadcast to others
    this.broadcast(session.id, {
      type: 'cursor_moved' as WSEventType,
      payload: cursor,
      timestamp: new Date(),
      userId,
      sessionId: session.id,
    }, userId);
  }

  // Feature 75: Handle Selection Change
  private async handleSelectionChange(session: CollaborationSession, userId: string, payload: any): Promise<void> {
    const selection: Selection = {
      userId,
      fileId: payload.fileId,
      start: payload.start,
      end: payload.end,
      timestamp: new Date(),
    };

    // Update session selections
    const existingIndex = session.selections.findIndex(s => s.userId === userId && s.fileId === payload.fileId);
    if (existingIndex >= 0) {
      session.selections[existingIndex] = selection;
    } else {
      session.selections.push(selection);
    }

    // Broadcast to others
    this.broadcast(session.id, {
      type: 'selection_changed' as WSEventType,
      payload: selection,
      timestamp: new Date(),
      userId,
      sessionId: session.id,
    }, userId);
  }

  // Feature 76: Handle Text Change with Operational Transform
  private async handleTextChange(session: CollaborationSession, userId: string, payload: any): Promise<void> {
    const change: Change = {
      id: this.generateId(),
      userId,
      fileId: payload.fileId,
      type: payload.type,
      operation: payload.operation,
      timestamp: new Date(),
      applied: false,
      reverted: false,
    };

    // Add to changes history
    session.changes.push(change);

    // Apply operational transformation
    const transformedChange = await this.transformChange(session, change);

    // Broadcast transformed change
    this.broadcast(session.id, {
      type: 'text_changed' as WSEventType,
      payload: transformedChange,
      timestamp: new Date(),
      userId,
      sessionId: session.id,
    }, userId);
  }

  // Feature 77: Handle Chat Message
  private async handleChatMessage(session: CollaborationSession, userId: string, payload: any): Promise<void> {
    const participant = session.participants.find(p => p.userId === userId);
    if (!participant) return;

    const message: ChatMessage = {
      id: this.generateId(),
      userId,
      username: participant.username,
      content: payload.content,
      type: payload.type || 'text',
      timestamp: new Date(),
      reactions: [],
      metadata: payload.metadata,
    };

    session.chat.push(message);

    // Broadcast to all participants
    this.broadcast(session.id, {
      type: 'chat_message' as WSEventType,
      payload: message,
      timestamp: new Date(),
      userId,
      sessionId: session.id,
    });
  }

  // Feature 78: Handle Disconnection
  private handleDisconnection(session: CollaborationSession, userId: string, connectionId: string): void {
    // Remove connection
    this.connections.delete(connectionId);

    // Update participant status
    const participant = session.participants.find(p => p.userId === userId);
    if (participant) {
      participant.status = 'offline';
    }

    // Notify others
    this.broadcast(session.id, {
      type: 'user_left' as WSEventType,
      payload: { userId },
      timestamp: new Date(),
      userId,
      sessionId: session.id,
    });

    // Clean up if no active participants
    const hasActive = session.participants.some(p => p.status === 'online');
    if (!hasActive) {
      this.endSession(session.id);
    }
  }

  // Feature 79: Broadcast Message to Session
  private broadcast(sessionId: string, event: WebSocketEvent, excludeUserId?: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const message = JSON.stringify(event);

    for (const participant of session.participants) {
      if (participant.userId === excludeUserId) continue;
      if (participant.status !== 'online') continue;

      // Find connection for this user
      for (const [connId, ws] of this.connections.entries()) {
        if (this.userSessions.get(participant.userId) === sessionId) {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(message);
          }
        }
      }
    }
  }

  // Feature 80: Operational Transform for Conflict Resolution
  private async transformChange(session: CollaborationSession, change: Change): Promise<Change> {
    // Get concurrent changes
    const concurrentChanges = session.changes.filter(c => 
      c.fileId === change.fileId &&
      c.userId !== change.userId &&
      c.timestamp >= new Date(Date.now() - 5000) // Last 5 seconds
    );

    if (concurrentChanges.length === 0) {
      return change;
    }

    // Apply operational transformation
    let transformedOp = change.operation;

    for (const concurrentChange of concurrentChanges) {
      transformedOp = this.transformOperations(transformedOp, concurrentChange.operation);
    }

    return {
      ...change,
      operation: transformedOp,
    };
  }

  private transformOperations(op1: Change['operation'], op2: Change['operation']): Change['operation'] {
    // Simplified OT - in production, use proper OT library
    if (op1.type === 'insert' && op2.type === 'insert') {
      if (op1.position.line === op2.position.line && op1.position.column <= op2.position.column) {
        return {
          ...op1,
          position: {
            ...op1.position,
            column: op1.position.column + (op2.content?.length || 0),
          },
        };
      }
    }

    return op1;
  }

  private async createSession(projectId: string): Promise<CollaborationSession> {
    const session: CollaborationSession = {
      id: this.generateId(),
      projectId,
      participants: [],
      startedAt: new Date(),
      status: 'active',
      activeEditors: [],
      chat: [],
      cursors: [],
      selections: [],
      changes: [],
    };

    return session;
  }

  private async findSessionByProject(projectId: string): Promise<CollaborationSession | null> {
    for (const session of this.sessions.values()) {
      if (session.projectId === projectId && session.status === 'active') {
        return session;
      }
    }
    return null;
  }

  private endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = 'ended';
      session.endedAt = new Date();
    }
  }

  private handleFileOpen(session: CollaborationSession, userId: string, payload: any): void {
    // Implementation for file open tracking
  }

  private handleFileClose(session: CollaborationSession, userId: string, payload: any): void {
    // Implementation for file close tracking
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateColor(): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export const collaborationHandler = new CollaborationHandler();
