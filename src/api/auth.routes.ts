// Feature 61: Authentication API Routes
import { Hono } from 'hono';
import { jwtService } from '../auth/jwt.service';
import { twoFactorService } from '../auth/two-factor.service';
import { oauthService } from '../auth/oauth.service';
import { userRepository } from '../database/user.repository';

const auth = new Hono();

// Feature 62: Register Endpoint
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const { email, username, password, displayName } = body;

    // Validate input
    if (!email || !username || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check if user exists
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return c.json({ error: 'User already exists' }, 409);
    }

    // Create user
    const user = await userRepository.create({
      email,
      username,
      password, // In production, hash the password
      displayName,
    });

    // Generate tokens
    const tokens = await jwtService.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions.map(p => p.action),
    });

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
      tokens,
    }, 201);
  } catch (error) {
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Feature 63: Login Endpoint
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, twoFactorCode } = body;

    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    // In production, verify password hash
    // if (!await verifyPassword(password, user.passwordHash)) {
    //   return c.json({ error: 'Invalid credentials' }, 401);
    // }

    // Check 2FA
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return c.json({ 
          requires2FA: true,
          tempToken: 'temp_token_here' 
        }, 200);
      }

      // Verify 2FA code
      // const valid = twoFactorService.verifyCode(user.twoFactorSecret, twoFactorCode);
      // if (!valid) {
      //   return c.json({ error: 'Invalid 2FA code' }, 401);
      // }
    }

    // Update last login
    await userRepository.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await jwtService.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions.map(p => p.action),
    });

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        avatar: user.avatar,
      },
      tokens,
    });
  } catch (error) {
    return c.json({ error: 'Login failed' }, 500);
  }
});

// Feature 64: Refresh Token Endpoint
auth.post('/refresh', async (c) => {
  try {
    const body = await c.req.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return c.json({ error: 'Refresh token required' }, 400);
    }

    const tokens = await jwtService.refreshAccessToken(refreshToken);
    if (!tokens) {
      return c.json({ error: 'Invalid refresh token' }, 401);
    }

    return c.json({ tokens });
  } catch (error) {
    return c.json({ error: 'Token refresh failed' }, 500);
  }
});

// Feature 65: Logout Endpoint
auth.post('/logout', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = await jwtService.verifyToken(token);
    
    if (payload) {
      await jwtService.revokeToken(payload.sessionId);
    }

    return c.json({ message: 'Logged out successfully' });
  } catch (error) {
    return c.json({ error: 'Logout failed' }, 500);
  }
});

// Feature 66: Setup 2FA Endpoint
auth.post('/2fa/setup', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = await jwtService.verifyToken(token);
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const user = await userRepository.findById(payload.userId);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    const setup = await twoFactorService.setup(user.id, user.email);

    return c.json(setup);
  } catch (error) {
    return c.json({ error: '2FA setup failed' }, 500);
  }
});

// Feature 67: Verify 2FA Endpoint
auth.post('/2fa/verify', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = await jwtService.verifyToken(token);
    if (!payload) {
      return c.json({ error: 'Invalid token' }, 401);
    }

    const body = await c.req.json();
    const { code, secret } = body;

    const valid = twoFactorService.verifyCode(secret, code);
    if (!valid) {
      return c.json({ error: 'Invalid code' }, 400);
    }

    // Enable 2FA for user
    await userRepository.toggle2FA(payload.userId, true);

    return c.json({ message: '2FA enabled successfully' });
  } catch (error) {
    return c.json({ error: '2FA verification failed' }, 500);
  }
});

// Feature 68: OAuth Authorization Endpoint
auth.get('/oauth/:provider', async (c) => {
  try {
    const provider = c.req.param('provider') as any;
    const redirectUri = c.req.query('redirect_uri') || `${c.req.url}/callback`;

    const authUrl = oauthService.getAuthorizationUrl(provider, redirectUri);

    return c.redirect(authUrl);
  } catch (error) {
    return c.json({ error: 'OAuth authorization failed' }, 500);
  }
});

// Feature 69: OAuth Callback Endpoint
auth.get('/oauth/:provider/callback', async (c) => {
  try {
    const provider = c.req.param('provider');
    const code = c.req.query('code');
    const state = c.req.query('state');

    if (!code || !state) {
      return c.json({ error: 'Missing OAuth parameters' }, 400);
    }

    const redirectUri = `${c.req.url}`;
    const userInfo = await oauthService.handleCallback(
      { code, state, provider },
      redirectUri
    );

    // Find or create user
    let user = await userRepository.findByEmail(userInfo.email);
    if (!user) {
      user = await userRepository.create({
        email: userInfo.email,
        username: userInfo.name.replace(/\s+/g, '_').toLowerCase(),
        password: '', // OAuth users don't need password
        displayName: userInfo.name,
      });
    }

    // Generate tokens
    const tokens = await jwtService.generateTokenPair({
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions.map(p => p.action),
    });

    // Redirect to frontend with tokens
    return c.redirect(`/auth/callback?token=${tokens.accessToken}`);
  } catch (error) {
    return c.json({ error: 'OAuth callback failed' }, 500);
  }
});

// Feature 70: Verify Email Endpoint
auth.post('/verify-email', async (c) => {
  try {
    const body = await c.req.json();
    const { token } = body;

    // In production, verify email verification token
    const payload = await jwtService.verifyToken(token);
    if (!payload) {
      return c.json({ error: 'Invalid verification token' }, 400);
    }

    await userRepository.verifyEmail(payload.userId);

    return c.json({ message: 'Email verified successfully' });
  } catch (error) {
    return c.json({ error: 'Email verification failed' }, 500);
  }
});

export default auth;
