// Project Management API Routes
import { Hono } from 'hono';
import { projectRepository } from '../database/project.repository';
import type { JWTPayload } from '../auth/jwt.service';

const projects = new Hono();

// List user projects
projects.get('/', async (c) => {
  try {
    const user = c.get('user') as JWTPayload;
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 20;
    const search = c.req.query('search');

    const result = await projectRepository.listByUser(user.userId, {
      page,
      limit,
      search,
    });

    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

// Create project
projects.post('/', async (c) => {
  try {
    const user = c.get('user') as JWTPayload;
    const body = await c.req.json();

    const project = await projectRepository.create({
      ...body,
      owner: user.userId,
    });

    return c.json(project, 201);
  } catch (error) {
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

// Get project
projects.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const project = await projectRepository.findById(id);

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json(project);
  } catch (error) {
    return c.json({ error: 'Failed to fetch project' }, 500);
  }
});

// Update project
projects.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();

    const project = await projectRepository.update(id, body);

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json(project);
  } catch (error) {
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

// Delete project
projects.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const success = await projectRepository.delete(id);

    if (!success) {
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// Get project files
projects.get('/:id/files', async (c) => {
  try {
    const id = c.req.param('id');
    const project = await projectRepository.findById(id);

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json({ files: project.files });
  } catch (error) {
    return c.json({ error: 'Failed to fetch files' }, 500);
  }
});

// Add file to project
projects.post('/:id/files', async (c) => {
  try {
    const id = c.req.param('id');
    const user = c.get('user') as JWTPayload;
    const body = await c.req.json();

    const file = await projectRepository.addFile(id, {
      ...body,
      updatedBy: user.userId,
    });

    if (!file) {
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json(file, 201);
  } catch (error) {
    return c.json({ error: 'Failed to add file' }, 500);
  }
});

// Update file
projects.put('/:id/files/:fileId', async (c) => {
  try {
    const id = c.req.param('id');
    const fileId = c.req.param('fileId');
    const user = c.get('user') as JWTPayload;
    const body = await c.req.json();

    const file = await projectRepository.updateFile(id, fileId, body.content, user.userId);

    if (!file) {
      return c.json({ error: 'File not found' }, 404);
    }

    return c.json(file);
  } catch (error) {
    return c.json({ error: 'Failed to update file' }, 500);
  }
});

// Delete file
projects.delete('/:id/files/:fileId', async (c) => {
  try {
    const id = c.req.param('id');
    const fileId = c.req.param('fileId');

    const success = await projectRepository.deleteFile(id, fileId);

    if (!success) {
      return c.json({ error: 'File not found' }, 404);
    }

    return c.json({ message: 'File deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete file' }, 500);
  }
});

// Get collaborators
projects.get('/:id/collaborators', async (c) => {
  try {
    const id = c.req.param('id');
    const project = await projectRepository.findById(id);

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json({ collaborators: project.collaborators });
  } catch (error) {
    return c.json({ error: 'Failed to fetch collaborators' }, 500);
  }
});

// Add collaborator
projects.post('/:id/collaborators', async (c) => {
  try {
    const id = c.req.param('id');
    const user = c.get('user') as JWTPayload;
    const body = await c.req.json();

    const success = await projectRepository.addCollaborator(id, {
      ...body,
      invitedBy: user.userId,
      status: 'pending',
    });

    if (!success) {
      return c.json({ error: 'Failed to add collaborator' }, 400);
    }

    return c.json({ message: 'Collaborator added successfully' }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to add collaborator' }, 500);
  }
});

// Remove collaborator
projects.delete('/:id/collaborators/:userId', async (c) => {
  try {
    const id = c.req.param('id');
    const userId = c.req.param('userId');

    const success = await projectRepository.removeCollaborator(id, userId);

    if (!success) {
      return c.json({ error: 'Failed to remove collaborator' }, 400);
    }

    return c.json({ message: 'Collaborator removed successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to remove collaborator' }, 500);
  }
});

export default projects;
