// Feature 29: OAuth Authentication Service
export interface OAuthProvider {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  scopes: string[];
}

export interface OAuthConfig {
  github: OAuthProvider;
  google: OAuthProvider;
  gitlab: OAuthProvider;
}

export interface OAuthCallbackData {
  code: string;
  state: string;
  provider: string;
}

export interface OAuthUserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
}

export class OAuthService {
  private providers: OAuthConfig = {
    github: {
      id: 'github',
      name: 'GitHub',
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      authorizationUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userInfoUrl: 'https://api.github.com/user',
      scopes: ['read:user', 'user:email'],
    },
    google: {
      id: 'google',
      name: 'Google',
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
      scopes: ['openid', 'email', 'profile'],
    },
    gitlab: {
      id: 'gitlab',
      name: 'GitLab',
      clientId: process.env.GITLAB_CLIENT_ID || '',
      clientSecret: process.env.GITLAB_CLIENT_SECRET || '',
      authorizationUrl: 'https://gitlab.com/oauth/authorize',
      tokenUrl: 'https://gitlab.com/oauth/token',
      userInfoUrl: 'https://gitlab.com/api/v4/user',
      scopes: ['read_user'],
    },
  };

  // Feature 30: Get Authorization URL
  getAuthorizationUrl(provider: keyof OAuthConfig, redirectUri: string): string {
    const config = this.providers[provider];
    const state = this.generateState();
    
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: redirectUri,
      scope: config.scopes.join(' '),
      state,
      response_type: 'code',
    });

    // Store state in session/cookie for verification
    this.storeState(state);

    return `${config.authorizationUrl}?${params.toString()}`;
  }

  // Feature 31: Handle OAuth Callback
  async handleCallback(data: OAuthCallbackData, redirectUri: string): Promise<OAuthUserInfo> {
    // Verify state
    if (!this.verifyState(data.state)) {
      throw new Error('Invalid state parameter');
    }

    const config = this.providers[data.provider as keyof OAuthConfig];
    
    // Exchange code for access token
    const token = await this.exchangeCodeForToken(config, data.code, redirectUri);
    
    // Get user info
    const userInfo = await this.getUserInfo(config, token);
    
    return {
      ...userInfo,
      provider: data.provider,
    };
  }

  // Feature 32: Exchange Code for Token
  private async exchangeCodeForToken(
    config: OAuthProvider,
    code: string,
    redirectUri: string
  ): Promise<string> {
    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();
    return data.access_token;
  }

  // Feature 33: Get User Info from Provider
  private async getUserInfo(config: OAuthProvider, accessToken: string): Promise<OAuthUserInfo> {
    const response = await fetch(config.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const data = await response.json();
    
    // Normalize user info across providers
    return this.normalizeUserInfo(config.id, data);
  }

  // Feature 34: Normalize User Info
  private normalizeUserInfo(provider: string, data: any): OAuthUserInfo {
    switch (provider) {
      case 'github':
        return {
          id: data.id.toString(),
          email: data.email,
          name: data.name || data.login,
          avatar: data.avatar_url,
          provider,
        };
      case 'google':
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          avatar: data.picture,
          provider,
        };
      case 'gitlab':
        return {
          id: data.id.toString(),
          email: data.email,
          name: data.name || data.username,
          avatar: data.avatar_url,
          provider,
        };
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  private storeState(state: string): void {
    // In production, store in session/cookie
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('oauth_state', state);
    }
  }

  private verifyState(state: string): boolean {
    // In production, verify against stored state
    if (typeof sessionStorage !== 'undefined') {
      const storedState = sessionStorage.getItem('oauth_state');
      sessionStorage.removeItem('oauth_state');
      return storedState === state;
    }
    return true;
  }

  // Feature 35: Link OAuth Account to Existing User
  async linkAccount(userId: string, provider: string, providerUserId: string): Promise<boolean> {
    // In production, store the link in database
    return true;
  }

  // Feature 36: Unlink OAuth Account
  async unlinkAccount(userId: string, provider: string): Promise<boolean> {
    // In production, remove the link from database
    return true;
  }

  // Feature 37: Get Linked Accounts
  async getLinkedAccounts(userId: string): Promise<Array<{ provider: string; email: string }>> {
    // In production, fetch from database
    return [];
  }
}

export const oauthService = new OAuthService();
