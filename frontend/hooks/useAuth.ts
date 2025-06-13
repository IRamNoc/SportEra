import { useState, useEffect, useCallback } from 'react';
import apiService, { User, LoginRequest, RegisterRequest } from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

type UseAuthReturn = AuthState & AuthActions;

const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = () => {
      try {
        if (typeof window === 'undefined') {
          setState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          try {
            const user = JSON.parse(storedUser);
            apiService.setToken(token);
            
            setState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      } catch {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Erreur lors de l\'initialisation',
        });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.login(credentials);
      
      if (response.success && response.user && response.token) {
        const { user, token } = response;
        
        apiService.setToken(token);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('token', token);
        }
        
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        
        return true;
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: response.message || 'Erreur de connexion',
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion';
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      
      return false;
    }
  }, []);

  const register = useCallback(async (userData: RegisterRequest): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.register(userData);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
        return true;
      } else {
        throw new Error(response.message || 'Erreur d\'inscription');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      apiService.removeToken();
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const refreshUser = useCallback(async () => {
    if (!apiService.isAuthenticated()) return;
    
    try {
      const response = await apiService.getCurrentUser();
      
      if (response.success && response.data) {
        const user = response.data;
        localStorage.setItem('user', JSON.stringify(user));
        
        setState(prev => ({
          ...prev,
          user,
        }));
      }
    } catch {
      logout();
    }
  }, [logout]);

  return {
    ...state,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  };
};

export default useAuth;
export type { UseAuthReturn };