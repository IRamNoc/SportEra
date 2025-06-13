// Presentation Layer - Routes d'authentification
// Configure les routes HTTP pour l'authentification

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { RegisterUserUseCase } from '../../application/usecases/RegisterUser';
import { LoginUserUseCase } from '../../application/usecases/LoginUser';
import { MongoUserRepository } from '../../infrastructure/adapters/MongoUserRepository';
import { BcryptService } from '../../infrastructure/adapters/BcryptService';
import { JwtTokenService } from '../../infrastructure/adapters/JwtTokenService';

// Factory function pour créer les routes avec injection de dépendances
export function createAuthRoutes(): Router {
  const router = Router();

  // Instanciation des adapters
  const userRepository = new MongoUserRepository();
  const cryptoService = new BcryptService();
  const tokenService = new JwtTokenService();

  // Instanciation des cas d'usage
  const registerUserUseCase = new RegisterUserUseCase(userRepository, cryptoService);
  const loginUserUseCase = new LoginUserUseCase(userRepository, cryptoService, tokenService);

  // Instanciation du contrôleur
  const authController = new AuthController(registerUserUseCase, loginUserUseCase);

  // Configuration des routes
  router.post('/register', (req, res) => authController.register(req, res));
  router.post('/login', (req, res) => authController.login(req, res));

  return router;
}