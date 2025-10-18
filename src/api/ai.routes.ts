// AI Assistant API Routes
import { Hono } from 'hono';
import { aiAssistantService } from '../ai/assistant.service';
import type { JWTPayload } from '../auth/jwt.service';

const ai = new Hono();

// Chat with AI
ai.post('/chat', async (c) => {
  try {
    const user = c.get('user') as JWTPayload;
    const body = await c.req.json();

    const response = await aiAssistantService.chat(user.userId, body.message, body.context);

    return c.json({ response });
  } catch (error) {
    return c.json({ error: 'Failed to process chat' }, 500);
  }
});

// Code completion
ai.post('/complete', async (c) => {
  try {
    const body = await c.req.json();

    const suggestions = await aiAssistantService.completeCode(
      body.code,
      body.cursorPosition,
      body.language
    );

    return c.json({ suggestions });
  } catch (error) {
    return c.json({ error: 'Failed to generate completions' }, 500);
  }
});

// Analyze code
ai.post('/analyze', async (c) => {
  try {
    const body = await c.req.json();

    const analysis = await aiAssistantService.analyzeCode(body.code, body.language);

    return c.json(analysis);
  } catch (error) {
    return c.json({ error: 'Failed to analyze code' }, 500);
  }
});

// Refactor suggestions
ai.post('/refactor', async (c) => {
  try {
    const body = await c.req.json();

    const suggestions = await aiAssistantService.suggestRefactoring(body.code, body.language);

    return c.json({ suggestions });
  } catch (error) {
    return c.json({ error: 'Failed to generate refactoring suggestions' }, 500);
  }
});

// Generate code
ai.post('/generate', async (c) => {
  try {
    const body = await c.req.json();

    const code = await aiAssistantService.generateCode(body.description, body.language);

    return c.json({ code });
  } catch (error) {
    return c.json({ error: 'Failed to generate code' }, 500);
  }
});

// Explain code
ai.post('/explain', async (c) => {
  try {
    const body = await c.req.json();

    const explanation = await aiAssistantService.explainCode(body.code, body.language);

    return c.json({ explanation });
  } catch (error) {
    return c.json({ error: 'Failed to explain code' }, 500);
  }
});

// Optimize code
ai.post('/optimize', async (c) => {
  try {
    const body = await c.req.json();

    const result = await aiAssistantService.optimizeCode(body.code, body.language);

    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to optimize code' }, 500);
  }
});

// Generate documentation
ai.post('/document', async (c) => {
  try {
    const body = await c.req.json();

    const documentation = await aiAssistantService.generateDocumentation(body.code, body.language);

    return c.json({ documentation });
  } catch (error) {
    return c.json({ error: 'Failed to generate documentation' }, 500);
  }
});

export default ai;
