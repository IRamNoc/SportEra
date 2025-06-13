// Presentation Layer - Middleware de logging des requêtes
// Log les requêtes HTTP pour le monitoring et le debugging

import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  // Log de la requête entrante
  console.log(`📥 [${timestamp}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  // Intercepter la fin de la réponse pour logger la durée
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Emoji basé sur le code de statut
    let emoji = '✅';
    if (statusCode >= 400 && statusCode < 500) {
      emoji = '⚠️';
    } else if (statusCode >= 500) {
      emoji = '❌';
    }
    
    console.log(
      `📤 [${new Date().toISOString()}] ${emoji} ${req.method} ${req.originalUrl} - ` +
      `${statusCode} - ${duration}ms`
    );
    
    return originalSend.call(this, data);
  };
  
  next();
};