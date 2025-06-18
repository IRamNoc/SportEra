// Use Case - Connexion d'un utilisateur
// Contient la logique métier pour l'authentification

import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';
import { CryptoService, TokenService } from '../../domain/ports/CryptoService';

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface LoginUserResponse {
  success: boolean;
  user?: any;
  token?: string;
  message?: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService,
    private readonly tokenService: TokenService
  ) {}

  async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
    console.log('🎯 === DÉBUT USE CASE LOGIN ===');
    console.log('📨 Request reçue:', JSON.stringify({
      email: request.email,
      hasPassword: !!request.password
    }, null, 2));
    
    try {
      // Validation des données d'entrée
      console.log('🔍 Validation des données d\'entrée...');
      if (!this.validateInput(request)) {
        console.log('❌ Validation échouée');
        return {
          success: false,
          message: 'Email ou mot de passe invalide'
        };
      }
      console.log('✅ Validation réussie');

      // Rechercher l'utilisateur par email
      const emailToSearch = request.email.toLowerCase().trim();
      console.log('🔎 Recherche utilisateur avec email:', emailToSearch);
      const user = await this.userRepository.findByEmail(emailToSearch);
      
      if (!user) {
        console.log('❌ Utilisateur non trouvé pour email:', emailToSearch);
        return {
          success: false,
          message: 'Email ou mot de passe incorrect'
        };
      }
      console.log('✅ Utilisateur trouvé:', {
        id: user.id,
        email: user.email,
        name: user.name
      });

      // Vérifier le mot de passe
      console.log('🔐 Vérification du mot de passe...');
      const isPasswordValid = await this.cryptoService.compare(request.password, user.password);
      console.log('🔐 Résultat vérification mot de passe:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('❌ Mot de passe incorrect');
        return {
          success: false,
          message: 'Email ou mot de passe incorrect'
        };
      }
      console.log('✅ Mot de passe correct');

      // Générer le token JWT
      console.log('🎫 Génération du token JWT...');
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        userType: user.userType
      };
      console.log('🎫 Payload du token:', tokenPayload);
      
      const token = this.tokenService.generateToken(tokenPayload);
      console.log('🎫 Token généré:', token ? 'OUI' : 'NON');
      console.log('🎫 Longueur du token:', token ? token.length : 0);

      const userJson = user.toJSON();
      console.log('👤 Données utilisateur pour réponse:', JSON.stringify({
        id: userJson.id,
        email: userJson.email,
        name: userJson.name,
        userType: userJson.userType
      }, null, 2));

      const response = {
        success: true,
        user: userJson,
        token,
        message: 'Connexion réussie'
      };
      
      console.log('✅ Use case terminé avec succès');
      return response;
    } catch (error) {
      console.error('💥 ERREUR CRITIQUE dans LoginUserUseCase:', error);
      console.error('📍 Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
      return {
        success: false,
        message: 'Erreur lors de la connexion'
      };
    } finally {
      console.log('🎯 === FIN USE CASE LOGIN ===\n');
    }
  }

  private validateInput(request: LoginUserRequest): boolean {
    return !!(
      request.email &&
      request.email.trim().length > 0 &&
      request.password &&
      request.password.length > 0
    );
  }
}