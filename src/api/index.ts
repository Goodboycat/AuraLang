// Comprehensive API Router - Integrates all 100 features
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import collaborationRoutes from './collaboration.routes';
import analyticsRoutes from './analytics.routes';
import marketplaceRoutes from './marketplace.routes';
import aiRoutes from './ai.routes';
import { jwtService } from '../auth/jwt.service';

const api = new Hono();

// Middleware
api.use('*', cors());
api.use('*', logger());
api.use('*', prettyJSON());

// Authentication middleware
api.use('/api/*', async (c, next) => {
  // Public routes
  const publicPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/oauth'];
  if (publicPaths.some(path => c.req.path.startsWith(path))) {
    return next();
  }

  // Verify JWT token
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.replace('Bearer ', '');
  const payload = await jwtService.verifyToken(token);
  
  if (!payload) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  // Attach user to context
  c.set('user', payload);
  
  return next();
});

// Mount route modules
api.route('/api/auth', authRoutes);
api.route('/api/projects', projectRoutes);
api.route('/api/collaboration', collaborationRoutes);
api.route('/api/analytics', analyticsRoutes);
api.route('/api/marketplace', marketplaceRoutes);
api.route('/api/ai', aiRoutes);

// Health check
api.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    features: {
      authentication: true,
      twoFactor: true,
      oauth: true,
      projects: true,
      collaboration: true,
      websockets: true,
      analytics: true,
      marketplace: true,
      aiAssistant: true,
      notifications: true,
    },
    version: '1.0.0',
  });
});

// API documentation
api.get('/api', (c) => {
  return c.json({
    name: 'AuraLang API',
    version: '1.0.0',
    description: 'Comprehensive API with 100+ features',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        refresh: 'POST /api/auth/refresh',
        logout: 'POST /api/auth/logout',
        '2fa_setup': 'POST /api/auth/2fa/setup',
        '2fa_verify': 'POST /api/auth/2fa/verify',
        oauth: 'GET /api/auth/oauth/:provider',
      },
      projects: {
        list: 'GET /api/projects',
        create: 'POST /api/projects',
        get: 'GET /api/projects/:id',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id',
        files: 'GET /api/projects/:id/files',
        collaborators: 'GET /api/projects/:id/collaborators',
      },
      collaboration: {
        session: 'GET /api/collaboration/session/:projectId',
        chat: 'POST /api/collaboration/chat',
        cursors: 'GET /api/collaboration/cursors/:sessionId',
      },
      analytics: {
        events: 'POST /api/analytics/events',
        metrics: 'GET /api/analytics/metrics',
        insights: 'GET /api/analytics/insights',
        dashboard: 'GET /api/analytics/dashboard',
      },
      marketplace: {
        items: 'GET /api/marketplace/items',
        item: 'GET /api/marketplace/items/:id',
        purchase: 'POST /api/marketplace/purchase',
        install: 'POST /api/marketplace/install',
      },
      ai: {
        chat: 'POST /api/ai/chat',
        complete: 'POST /api/ai/complete',
        analyze: 'POST /api/ai/analyze',
        refactor: 'POST /api/ai/refactor',
        generate: 'POST /api/ai/generate',
      },
    },
    features: [
      '1-10: Core type definitions',
      '11-18: JWT authentication',
      '19-28: Two-factor authentication',
      '29-37: OAuth integration',
      '38-48: User management',
      '49-60: Project management',
      '61-70: Auth API endpoints',
      '71-80: Real-time collaboration',
      '81-88: Analytics service',
      '89-98: AI assistant',
      '99-100: Notification system',
    ],
  });
});

export default api;
