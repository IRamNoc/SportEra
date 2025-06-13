// Port - Interface pour le repository User
// Définit le contrat pour la persistance des utilisateurs

import { User } from '../entities/User';

export interface UserRepository {
  // Création
  save(user: User): Promise<User>;
  
  // Lecture
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  
  // Mise à jour
  update(user: User): Promise<User>;
  
  // Suppression
  delete(id: string): Promise<void>;
  
  // Vérifications
  exists(email: string): Promise<boolean>;
}