// Presentation Layer - Middleware d'authentification
// Vérifie les tokens JWT pour les routes protégées

import { Request, Response, NextFunction } from 'express';
import { JwtTokenService } from '../../infrastructure/adapters/JwtTokenService';
import { MongoUserRepository } from '../../infrastructure/adapters/MongoUserRepository';

// Extension de l'interface Request pour inclure l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

export class AuthMiddleware {
  private tokenService: JwtTokenService;
  private userRepository: MongoUserRepository;

  constructor() {
    this.tokenService = new JwtTokenService();
    this.userRepository = new MongoUserRepository();
  }

  async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Récupérer le token depuis l'en-tête Authorization
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          message: 'Token d\'authentification requis'
        });
        return;
      }

      const token = authHeader.substring(7); // Enlever 'Bearer '

      // Vérifier le token
      const decoded = this.tokenService.verifyToken(token) as any;
      if (!decoded || !decoded.userId) {
        res.status(401).json({
          success: false,
          message: 'Token invalide'
        });
        return;
      }

      // Vérifier que l'utilisateur existe toujours
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        });
        return;
      }

      // Ajouter les informations utilisateur à la requête
      req.user = {
        userId: decoded.userId,
        email: decoded.email
      };

      next();
    } catch (error) {
      console.error('Error in auth middleware:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  // Méthode statique pour faciliter l'utilisation
  static create() {
    const middleware = new AuthMiddleware();
    return (req: Request, res: Response, next: NextFunction) => 
      middleware.authenticate(req, res, next);
  }
}