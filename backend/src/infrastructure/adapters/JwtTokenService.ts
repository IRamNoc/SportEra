// Adapter - Implémentation JWT du TokenService
// Adapte l'interface du domaine à la librairie jsonwebtoken

import jwt from 'jsonwebtoken';
import { TokenService } from '../../domain/ports/CryptoService';

export class JwtTokenService implements TokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

  verifyToken(token: string): object | null {
    try {
      return jwt.verify(token, this.secret) as object;
    } catch (error) {
      return null;
    }
  }

  decodeToken(token: string): object | null {
    try {
      return jwt.decode(token) as object;
    } catch (error) {
      return null;
    }
  }
}