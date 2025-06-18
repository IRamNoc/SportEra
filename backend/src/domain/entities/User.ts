// Domain Entity - User
// Représente l'entité métier User sans dépendances externes

import { randomUUID } from 'crypto';

export type UserType = 'user' | 'provider';

export interface UserProps {
  id?: string;
  name: string;
  email: string;
  password: string;
  points: number;
  userType: UserType;
  companyName?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _email: string,
    private readonly _password: string,
    private _points: number,
    private readonly _userType: UserType,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private readonly _companyName?: string,
    private readonly _description?: string
  ) {}

  // Factory method pour créer un nouvel utilisateur
  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    const now = new Date();
    return new User(
      randomUUID(),
      props.name,
      props.email,
      props.password,
      props.points,
      props.userType,
      now,
      now,
      props.companyName,
      props.description
    );
  }

  // Factory method pour reconstruire depuis la persistance
  static fromPersistence(props: Required<UserProps>): User {
    return new User(
      props.id,
      props.name,
      props.email,
      props.password,
      props.points,
      props.userType,
      props.createdAt,
      props.updatedAt,
      props.companyName,
      props.description
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get points(): number {
    return this._points;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get userType(): UserType {
    return this._userType;
  }

  get companyName(): string | undefined {
    return this._companyName;
  }

  get description(): string | undefined {
    return this._description;
  }

  // Business methods
  addPoints(points: number): void {
    if (points < 0) {
      throw new Error('Points cannot be negative');
    }
    this._points += points;
    this._updatedAt = new Date();
  }

  subtractPoints(points: number): void {
    if (points < 0) {
      throw new Error('Points cannot be negative');
    }
    if (this._points < points) {
      throw new Error('Insufficient points');
    }
    this._points -= points;
    this._updatedAt = new Date();
  }

  // Validation methods
  static isValidEmail(email: string): boolean {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  }

  static isValidName(name: string): boolean {
    return name.trim().length > 0 && name.length <= 50;
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  // Méthode pour la sérialisation (sans le mot de passe)
  toJSON(): Omit<UserProps, 'password'> {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      points: this._points,
      userType: this._userType,
      companyName: this._companyName,
      description: this._description,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  private static generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}