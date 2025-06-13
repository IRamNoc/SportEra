// Presentation Layer - Contrôleur de santé
// Gère les requêtes de vérification de l'état du serveur

import { Request, Response } from 'express';

export class HealthController {
  async ping(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        message: 'pong',
        timestamp: new Date().toISOString(),
        service: 'SportEra Backend',
        version: '1.0.0'
      });
    } catch (error) {
      console.error('Error in ping controller:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur interne du serveur'
      });
    }
  }

  async health(req: Request, res: Response): Promise<void> {
    try {
      // Ici on pourrait ajouter des vérifications de santé
      // comme la connexion à la base de données, etc.
      
      res.status(200).json({
        success: true,
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: '1.0.0'
      });
    } catch (error) {
      console.error('Error in health controller:', error);
      res.status(500).json({
        success: false,
        status: 'unhealthy',
        message: 'Erreur interne du serveur'
      });
    }
  }
}