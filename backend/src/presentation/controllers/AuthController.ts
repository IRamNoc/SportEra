// Presentation Layer - Contrôleur d'authentification
// Gère les requêtes HTTP et délègue aux cas d'usage

import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/usecases/RegisterUser';
import { LoginUserUseCase } from '../../application/usecases/LoginUser';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, userType, companyName, description } = req.body;

      // Validation basique des champs requis
      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Tous les champs sont requis'
        });
        return;
      }

      // Validation spécifique pour les partenaires
      if (userType === 'provider' && !companyName) {
        res.status(400).json({
          success: false,
          message: 'Le nom de l\'entreprise est requis pour les partenaires'
        });
        return;
      }

      // Exécuter le cas d'usage
      const result = await this.registerUserUseCase.execute({
        name,
        email,
        password,
        userType,
        companyName,
        description
      });

      // Retourner la réponse appropriée
      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message,
          user: result.user
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Error in register controller:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    console.log('🔐 === DÉBUT LOGIN CONTROLLER ===');
    console.log('📥 Headers reçus:', JSON.stringify(req.headers, null, 2));
    console.log('📥 Body reçu:', JSON.stringify(req.body, null, 2));
    
    try {
      const { email, password } = req.body;
      console.log('📧 Email extrait:', email);
      console.log('🔑 Password présent:', !!password);

      // Validation basique des champs requis
      if (!email || !password) {
        console.log('❌ Validation échouée: champs manquants');
        res.status(400).json({
          success: false,
          message: 'Email et mot de passe requis'
        });
        return;
      }

      console.log('✅ Validation des champs réussie');
      console.log('🚀 Exécution du cas d\'usage LoginUser...');
      
      // Exécuter le cas d'usage
      const result = await this.loginUserUseCase.execute({
        email,
        password
      });

      console.log('📊 Résultat du cas d\'usage:', JSON.stringify({
        success: result.success,
        message: result.message,
        hasUser: !!result.user,
        hasToken: !!result.token
      }, null, 2));

      // Retourner la réponse appropriée
      if (result.success) {
        console.log('✅ Login réussi, envoi de la réponse...');
        const response = {
          success: true,
          message: result.message,
          user: result.user,
          token: result.token
        };
        console.log('📤 Réponse envoyée:', JSON.stringify({
          success: response.success,
          message: response.message,
          hasUser: !!response.user,
          hasToken: !!response.token
        }, null, 2));
        res.status(200).json(response);
      } else {
        console.log('❌ Login échoué:', result.message);
        res.status(401).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('💥 ERREUR CRITIQUE dans AuthController.login:', error);
      console.error('📍 Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
    console.log('🔐 === FIN LOGIN CONTROLLER ===\n');
  }
}