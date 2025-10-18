// Analytics API Routes
import { Hono } from 'hono';
import { analyticsService } from '../services/analytics.service';
import type { JWTPayload } from '../auth/jwt.service';

const analytics = new Hono();

// Track event
analytics.post('/events', async (c) => {
  try {
    const user = c.get('user') as JWTPayload;
    const body = await c.req.json();

    await analyticsService.trackEvent({
      ...body,
      userId: user.userId,
    });

    return c.json({ message: 'Event tracked' }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to track event' }, 500);
  }
});

// Get metrics
analytics.get('/metrics', async (c) => {
  try {
    const user = c.get('user') as JWTPayload;
    const sessionId = c.req.query('sessionId') || 'default';

    // In production, fetch from analytics service
    return c.json({
      executionTime: 250,
      memoryUsage: 45.2,
      cpuUsage: 12.5,
      networkLatency: 50,
    });
  } catch (error) {
    return c.json({ error: 'Failed to fetch metrics' }, 500);
  }
});

// Get insights
analytics.get('/insights', async (c) => {
  try {
    const user = c.get('user') as JWTPayload;
    const insights = await analyticsService.generateInsights(user.userId);

    return c.json({ insights });
  } catch (error) {
    return c.json({ error: 'Failed to fetch insights' }, 500);
  }
});

// Get dashboard data
analytics.get('/dashboard', async (c) => {
  try {
    const user = c.get('user') as JWTPayload;
    const data = await analyticsService.getDashboardData(user.userId);

    return c.json(data);
  } catch (error) {
    return c.json({ error: 'Failed to fetch dashboard data' }, 500);
  }
});

export default analytics;
