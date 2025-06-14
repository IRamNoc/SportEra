// Application Entry Point - Point d'entrée de l'application
// Configure et démarre le serveur Express avec l'architecture hexagonale

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './infrastructure/config/database';
import { createAuthRoutes } from './presentation/routes/authRoutes';
import { createHealthRoutes } from './presentation/routes/healthRoutes';
import { errorHandler } from './presentation/middleware/errorHandler';
import { requestLogger } from './presentation/middleware/requestLogger';

// Configuration des variables d'environnement
dotenv.config();

class Application {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000', 10);
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Middleware de logging des requêtes
    this.app.use(requestLogger);
    
    // Middleware CORS
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3001',
      credentials: true
    }));
    
    // Middleware pour parser le JSON
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  }

  private initializeRoutes(): void {
    // Préfixe API avec version
    const apiVersion = process.env.API_VERSION || 'v1';
    const apiPrefix = `/api/${apiVersion}`;
    
    // Routes de santé (ping, health check)
    this.app.use(`${apiPrefix}/ping`, createHealthRoutes());
    this.app.use(`${apiPrefix}/health`, createHealthRoutes());
    
    // Routes d'authentification
    this.app.use(`${apiPrefix}/auth`, createAuthRoutes());
    
    // Route par défaut
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'SportEra API - Architecture Hexagonale',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    });
    
    // Route 404
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route non trouvée',
        path: req.originalUrl
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Connexion à la base de données
      await connectDB();
      console.log('✅ Base de données connectée');
      
      // Démarrage du serveur
      this.app.listen(this.port, () => {
        const apiVersion = process.env.API_VERSION || 'v1';
      const apiPrefix = `/api/${apiVersion}`;
      
      console.log(`🚀 Serveur démarré sur le port ${this.port}`);
      console.log(`📡 API disponible sur: http://localhost:${this.port}`);
      console.log(`🏥 Health check: http://localhost:${this.port}${apiPrefix}/health`);
      console.log(`🔐 Auth API: http://localhost:${this.port}${apiPrefix}/auth`);
      });
    } catch (error) {
      console.error('❌ Erreur lors du démarrage:', error);
      process.exit(1);
    }
  }
}

// Démarrage de l'application
const application = new Application();
application.start().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM reçu, arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT reçu, arrêt du serveur...');
  process.exit(0);
});
