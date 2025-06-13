// Adapter - Implémentation Bcrypt du CryptoService
// Adapte l'interface du domaine à la librairie bcrypt

import bcrypt from 'bcryptjs';
import { CryptoService } from '../../domain/ports/CryptoService';

export class BcryptService implements CryptoService {
  private readonly saltRounds = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}