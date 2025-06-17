// Service API - Gestion centralisée des appels API
// Centralise toutes les communications avec le backend

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

interface User {
  id: string;
  name: string;
  email: string;
  points: number;
  userType: 'user' | 'provider';
  companyName?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  userType?: 'user' | 'provider';
  companyName?: string;
  description?: string;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_API_PREFIX || ''}`;
    // Récupérer le token depuis le localStorage si disponible
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  // Configuration des headers par défaut
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Méthode générique pour les appels API
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    console.log('🌐 === DÉBUT REQUÊTE API ===');
    
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const headers = this.getHeaders();
      const config: RequestInit = {
        headers,
        ...options,
      };

      console.log('📡 Détails de la requête:');
      console.log('  URL:', url);
      console.log('  Method:', options.method || 'GET');
      console.log('  Headers:', JSON.stringify(headers, null, 2));
      console.log('  Body:', options.body || 'Pas de body');
      
      console.log('🚀 Envoi de la requête...');
      const response = await fetch(url, config);
      
      console.log('📨 Réponse reçue:');
      console.log('  Status:', response.status);
      console.log('  StatusText:', response.statusText);
      console.log('  Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));
      
      console.log('📄 Parsing JSON...');
      const data = await response.json();
      console.log('📄 Data parsée:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.log('❌ Réponse HTTP non OK');
        const errorMsg = data.message || `HTTP Error: ${response.status}`;
        console.log('❌ Message d\'erreur:', errorMsg);
        throw new Error(errorMsg);
      }

      console.log(`✅ Requête API réussie: ${endpoint}`);
      return data;
    } catch (error) {
      console.error(`💥 ERREUR REQUÊTE API: ${endpoint}`);
      console.error('💥 Détails de l\'erreur:', error);
      console.error('💥 Stack trace:', error instanceof Error ? error.stack : 'Pas de stack trace');
      throw error;
    } finally {
      console.log('🌐 === FIN REQUÊTE API ===\n');
    }
  }

  // Méthodes d'authentification
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse> & AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Retourner les données à la fois dans data et au niveau supérieur pour compatibilité
    if (response.success && response.data) {
      return {
        ...response,
        user: response.data.user,
        token: response.data.token
      };
    }
    
    return response as ApiResponse<AuthResponse> & AuthResponse;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    return response;
  }

  // Méthodes de gestion du token
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  removeToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Méthodes de santé
  async ping(): Promise<ApiResponse> {
    return this.request('/ping');
  }

  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Méthodes utilisateur (à implémenter selon les besoins)
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
}

// Instance singleton du service API
const apiService = new ApiService();

export default apiService;
export type { ApiResponse, User, AuthResponse, LoginRequest, RegisterRequest };
