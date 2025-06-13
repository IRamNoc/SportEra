// Port - Interface pour le service de cryptage
// Définit le contrat pour les opérations de cryptage

export interface CryptoService {
  hash(password: string): Promise<string>;
  compare(password: string, hashedPassword: string): Promise<boolean>;
}

// Port - Interface pour le service JWT
export interface TokenService {
  generateToken(payload: object): string;
  verifyToken(token: string): object | null;
  decodeToken(token: string): object | null;
}