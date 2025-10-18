// Feature 19: Two-Factor Authentication Service
export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  userId: string;
  code: string;
  timestamp: Date;
}

export class TwoFactorService {
  // Feature 20: Generate 2FA Secret
  generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    return secret;
  }

  // Feature 21: Setup 2FA for User
  async setup(userId: string, email: string): Promise<TwoFactorSetup> {
    const secret = this.generateSecret();
    const qrCode = await this.generateQRCode(userId, email, secret);
    const backupCodes = this.generateBackupCodes();

    return {
      secret,
      qrCode,
      backupCodes,
    };
  }

  // Feature 22: Verify 2FA Code
  verifyCode(secret: string, code: string): boolean {
    const currentCode = this.generateCode(secret);
    const previousCode = this.generateCode(secret, -1);
    const nextCode = this.generateCode(secret, 1);

    // Allow codes from previous, current, and next 30-second window
    return code === currentCode || code === previousCode || code === nextCode;
  }

  // Feature 23: Verify Backup Code
  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    // In production, check against stored backup codes in database
    // and mark the code as used
    return code.length === 8 && /^[A-Z0-9]{8}$/.test(code);
  }

  // Feature 24: Generate Backup Codes
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    for (let i = 0; i < count; i++) {
      let code = '';
      for (let j = 0; j < 8; j++) {
        code += chars[Math.floor(Math.random() * chars.length)];
      }
      codes.push(code);
    }
    
    return codes;
  }

  // Feature 25: Generate Time-based Code
  private generateCode(secret: string, timeOffset: number = 0): string {
    const time = Math.floor(Date.now() / 1000 / 30) + timeOffset;
    const hmac = this.hmacSha1(secret, time.toString());
    const offset = hmac.charCodeAt(hmac.length - 1) & 0x0f;
    
    let code = 0;
    for (let i = 0; i < 4; i++) {
      code = (code << 8) | hmac.charCodeAt(offset + i);
    }
    
    code = (code & 0x7fffffff) % 1000000;
    return code.toString().padStart(6, '0');
  }

  // Feature 26: Generate QR Code Data URL
  private async generateQRCode(
    userId: string,
    email: string,
    secret: string
  ): Promise<string> {
    const issuer = 'AuraLang';
    const otpauth = `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`;
    
    // In production, use a proper QR code library
    // For now, return a data URL that would represent the QR code
    return `data:image/svg+xml;base64,${btoa(this.generateQRCodeSVG(otpauth))}`;
  }

  private generateQRCodeSVG(data: string): string {
    // Simplified QR code SVG generation
    // In production, use qrcode library
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="white"/>
      <text x="100" y="100" text-anchor="middle" fill="black" font-size="10">
        ${data.substring(0, 20)}...
      </text>
    </svg>`;
  }

  private hmacSha1(key: string, message: string): string {
    // Simplified HMAC-SHA1 (use crypto library in production)
    const combined = key + message;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash = hash & hash;
    }
    return hash.toString();
  }

  // Feature 27: Disable 2FA
  async disable(userId: string, password: string): Promise<boolean> {
    // In production, verify password and remove 2FA data from database
    return true;
  }

  // Feature 28: Get 2FA Status
  async getStatus(userId: string): Promise<{
    enabled: boolean;
    method: '2fa' | 'sms' | 'email' | null;
    backupCodesRemaining: number;
  }> {
    // In production, fetch from database
    return {
      enabled: false,
      method: null,
      backupCodesRemaining: 0,
    };
  }
}

export const twoFactorService = new TwoFactorService();
