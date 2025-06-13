// Adapter - Implémentation MongoDB du UserRepository
// Adapte l'interface du domaine à MongoDB

import mongoose, { Schema, Document } from 'mongoose';
import { User, UserProps } from '../../domain/entities/User';
import { UserRepository } from '../../domain/ports/UserRepository';

// Interface pour le document MongoDB
interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schéma MongoDB
const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Veuillez entrer un email valide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  points: {
    type: Number,
    default: 0,
    min: [0, 'Les points ne peuvent pas être négatifs']
  }
}, {
  timestamps: true
});

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export class MongoUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    const userDoc = new UserModel({
      name: user.name,
      email: user.email,
      password: user.password,
      points: user.points
    });

    const savedDoc = await userDoc.save();
    return this.toDomainEntity(savedDoc);
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await UserModel.findById(id);
    return userDoc ? this.toDomainEntity(userDoc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email: email.toLowerCase() });
    return userDoc ? this.toDomainEntity(userDoc) : null;
  }

  async findAll(): Promise<User[]> {
    const userDocs = await UserModel.find();
    return userDocs.map(doc => this.toDomainEntity(doc));
  }

  async update(user: User): Promise<User> {
    const updatedDoc = await UserModel.findByIdAndUpdate(
      user.id,
      {
        name: user.name,
        email: user.email,
        password: user.password,
        points: user.points,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedDoc) {
      throw new Error('User not found');
    }

    return this.toDomainEntity(updatedDoc);
  }

  async delete(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id);
    if (!result) {
      throw new Error('User not found');
    }
  }

  async exists(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }

  private toDomainEntity(doc: UserDocument): User {
    return User.fromPersistence({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      password: doc.password,
      points: doc.points,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    });
  }
}

export { UserModel };