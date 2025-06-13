// Infrastructure Layer - Configuration de la base de données
// Gère la connexion à MongoDB

import mongoose from 'mongoose';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('📦 Base de données déjà connectée');
      return;
    }

    try {
      const uri = process.env.MONGO_URI;
      if (!uri) {
        throw new Error('MONGO_URI non définie dans les variables d\'environnement');
      }

      const options = {
        maxPoolSize: 10, // Maintenir jusqu'à 10 connexions socket
        serverSelectionTimeoutMS: 5000, // Garder en essayant d'envoyer des opérations pendant 5 secondes
        socketTimeoutMS: 45000, // Fermer les sockets après 45 secondes d'inactivité
        bufferCommands: false, // Désactiver mongoose buffering
      };

      await mongoose.connect(uri, options);
      this.isConnected = true;
      
      console.log('🗄️ MongoDB connecté avec succès');
      console.log(`📍 Base de données: ${mongoose.connection.name}`);
      
      // Gestion des événements de connexion
      mongoose.connection.on('error', (error) => {
        console.error('❌ Erreur de connexion MongoDB:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('🔌 MongoDB déconnecté');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnecté');
        this.isConnected = true;
      });

    } catch (error) {
      console.error('❌ Erreur de connexion à MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('🔌 MongoDB déconnecté proprement');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  public getConnectionStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

// Export de la fonction de connexion pour compatibilité
const connectDB = async (): Promise<void> => {
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.connect();
};

export default connectDB;
export { DatabaseConnection };