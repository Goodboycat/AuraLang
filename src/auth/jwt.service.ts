// Feature 11: JWT Authentication Service
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  sessionId: string;
  iat: number;
  exp: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export class JWTService {
  private readonly SECRET_KEY = 'your-secret-key-change-in-production';
  private readonly ACCESS_TOKEN_EXPIRY = 900; // 15 minutes
  private readonly REFRESH_TOKEN_EXPIRY = 604800; // 7 days

  // Feature 12: Generate Access Token
  async generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    const fullPayload: JWTPayload = {
      ...payload,
      iat: now,
      exp: now + this.ACCESS_TOKEN_EXPIRY,
    };

    return this.encode(fullPayload);
  }

  // Feature 13: Generate Refresh Token
  async generateRefreshToken(userId: string, sessionId: string): Promise<string> {
    const payload = {
      userId,
      sessionId,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.REFRESH_TOKEN_EXPIRY,
    };

    return this.encode(payload);
  }

  // Feature 14: Generate Token Pair
  async generateTokenPair(user: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  }): Promise<TokenPair> {
    const sessionId = this.generateSessionId();
    
    const accessToken = await this.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      sessionId,
    });

    const refreshToken = await this.generateRefreshToken(user.id, sessionId);

    return {
      accessToken,
      refreshToken,
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    };
  }

  // Feature 15: Verify Token
  async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const payload = await this.decode(token);
      
      // Check expiration
      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null;
      }

      return payload as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  // Feature 16: Refresh Access Token
  async refreshAccessToken(refreshToken: string): Promise<TokenPair | null> {
    const payload = await this.verifyToken(refreshToken);
    
    if (!payload || (payload as any).type !== 'refresh') {
      return null;
    }

    // In production, verify refresh token against database
    // and check if session is still valid
    
    return this.generateTokenPair({
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      permissions: payload.permissions,
    });
  }

  // Feature 17: Revoke Token (Session Management)
  async revokeToken(sessionId: string): Promise<boolean> {
    // In production, add sessionId to blacklist in database
    // For now, return success
    return true;
  }

  // Feature 18: Decode Token Without Verification
  decodeWithoutVerification(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch {
      return null;
    }
  }

  private async encode(payload: any): Promise<string> {
    // Simplified JWT encoding (use proper library in production)
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerB64 = btoa(JSON.stringify(header));
    const payloadB64 = btoa(JSON.stringify(payload));
    
    const signature = await this.sign(`${headerB64}.${payloadB64}`);
    
    return `${headerB64}.${payloadB64}.${signature}`;
  }

  private async decode(token: string): Promise<any> {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const [headerB64, payloadB64, signature] = parts;
    
    // Verify signature
    const expectedSignature = await this.sign(`${headerB64}.${payloadB64}`);
    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    return JSON.parse(atob(payloadB64));
  }

  private async sign(data: string): Promise<string> {
    // Simplified signing (use crypto library in production)
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data + this.SECRET_KEY);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return btoa(String.fromCharCode(...hashArray));
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const jwtService = new JWTService();
