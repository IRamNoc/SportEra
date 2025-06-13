// Presentation Layer - Middleware de gestion d'erreurs
// Gère les erreurs globales de l'application

import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Erreur interne du serveur';

  // Erreurs MongoDB
  if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Ressource non trouvée';
  }

  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Données de validation invalides';
  }

  if (error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = 400;
    message = 'Ressource déjà existante';
  }

  // Erreurs JWT
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token invalide';
  }

  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expiré';
  }

  // Log de l'erreur en développement
  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 Erreur:', {
      message: error.message,
      stack: error.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      error: error
    })
  });
};