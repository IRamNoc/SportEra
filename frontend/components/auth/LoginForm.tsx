// Composant de formulaire de connexion
// Formulaire de connexion utilisant les composants UI et hooks personnalisés

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useAuthContext } from '../../contexts/AuthContext';
import { LoginRequest } from '../../services/api';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  redirectTo = '/dashboard' 
}) => {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthContext();
  
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<LoginRequest>>({});

  // Validation du formulaire
  const validateForm = (): boolean => {
    const errors: Partial<LoginRequest> = {};
    
    if (!formData.email) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion des changements de champs
  const handleInputChange = (field: keyof LoginRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ modifié
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Effacer l'erreur générale
    if (error) {
      clearError();
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const success = await login(formData);
      
      if (success) {
        console.log('✅ Connexion réussie, redirection...');
        
        // Attendre un peu pour s'assurer que l'état est mis à jour
        setTimeout(() => {
          if (onSuccess) {
            onSuccess();
          } else {
            // Forcer la redirection avec window.location
            window.location.href = redirectTo;
          }
        }, 300);
      }
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
    }
  };

  // Basculer la visibilité du mot de passe
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Card.Header>
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Connexion
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Connectez-vous à votre compte SportEra
        </p>
      </Card.Header>
      
      <Card.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Affichage des erreurs générales */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Champ Email */}
          <Input
            type="email"
            label="Adresse email"
            placeholder="votre@email.com"
            value={formData.email}
            onChange={handleInputChange('email')}
            error={formErrors.email}
            icon={Mail}
            iconPosition="left"
            required
          />
          
          {/* Champ Mot de passe */}
          <Input
            type={showPassword ? 'text' : 'password'}
            label="Mot de passe"
            placeholder="Votre mot de passe"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={formErrors.password}
            icon={showPassword ? EyeOff : Eye}
            iconPosition="right"
            onIconClick={togglePasswordVisibility}
            required
          />
          
          {/* Bouton de soumission */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </Card.Body>
      
      <Card.Footer>
        <p className="text-center text-sm text-gray-600">
          Pas encore de compte ?{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => router.push('/register')}
          >
            Créer un compte
          </button>
        </p>
      </Card.Footer>
    </Card>
  );
};

export default LoginForm;