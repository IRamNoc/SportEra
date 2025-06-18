// Use Case - Inscription d'un utilisateur
// Contient la logique métier pour l'inscription

import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';
import { CryptoService } from '../../domain/ports/CryptoService';

import { UserType } from '../../domain/entities/User';

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  userType?: UserType;
  companyName?: string;
  description?: string;
}

export interface RegisterUserResponse {
  success: boolean;
  user?: Omit<any, 'password'>;
  message?: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptoService: CryptoService
  ) {}

  async execute(request: RegisterUserRequest): Promise<RegisterUserResponse> {
    try {
      // Validation des données d'entrée
      if (!this.validateInput(request)) {
        return {
          success: false,
          message: 'Données d\'entrée invalides'
        };
      }

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.userRepository.findByEmail(request.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Un utilisateur avec cet email existe déjà'
        };
      }

      // Hasher le mot de passe
      const hashedPassword = await this.cryptoService.hash(request.password);

      // Créer l'entité utilisateur
      const user = User.create({
        name: request.name.trim(),
        email: request.email.toLowerCase().trim(),
        password: hashedPassword,
        points: 0,
        userType: request.userType || 'user',
        companyName: request.companyName?.trim(),
        description: request.description?.trim()
      });

      // Sauvegarder l'utilisateur
      const savedUser = await this.userRepository.save(user);

      return {
        success: true,
        user: savedUser.toJSON(),
        message: 'Utilisateur créé avec succès'
      };
    } catch (error) {
      console.error('Error in RegisterUserUseCase:', error);
      return {
        success: false,
        message: 'Erreur lors de la création de l\'utilisateur'
      };
    }
  }

  private validateInput(request: RegisterUserRequest): boolean {
    const baseValidation = (
      User.isValidName(request.name) &&
      User.isValidEmail(request.email) &&
      User.isValidPassword(request.password)
    );

    // Validation spécifique pour les partenaires
    if (request.userType === 'provider') {
      return baseValidation && 
             request.companyName && 
             request.companyName.trim().length > 0 &&
             request.companyName.length <= 100;
    }

    return baseValidation;
  }
}