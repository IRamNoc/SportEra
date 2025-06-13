// Contexte d'authentification - Partage de l'état d'authentification
// Fournit l'état d'authentification à toute l'application

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useAuth, { UseAuthReturn } from '../hooks/useAuth';

// Interface pour le contexte
interface AuthContextType extends UseAuthReturn {}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Interface pour le provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider du contexte d'authentification
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour utiliser le contexte d'authentification
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext doit être utilisé dans un AuthProvider');
  }
  
  return context;
};

// Export par défaut du contexte
export default AuthContext;