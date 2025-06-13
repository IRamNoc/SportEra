// Composant de formulaire d'inscription
// Formulaire d'inscription utilisant les composants UI et hooks personnalisés

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useAuthContext } from '../../contexts/AuthContext';
import { RegisterRequest } from '../../services/api';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSuccess, 
  redirectTo = '/login' 
}) => {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthContext();
  
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<RegisterFormData>>({});

  // Validation du formulaire
  const validateForm = (): boolean => {
    const errors: Partial<RegisterFormData> = {};
    
    if (!formData.name) {
      errors.name = 'Le nom est requis';
    } else if (formData.name.length < 2) {
      errors.name = 'Le nom doit contenir au moins 2 caractères';
    }
    
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
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion des changements de champs
  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ modifié
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Vérification spéciale pour la confirmation du mot de passe
    if (field === 'confirmPassword' || field === 'password') {
      if (formErrors.confirmPassword) {
        setFormErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
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
      const { confirmPassword, ...registerData } = formData;
      const success = await register(registerData);
      
      if (success) {
        console.log('✅ Inscription réussie, redirection...');
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push(redirectTo);
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error);
    }
  };

  // Basculer la visibilité du mot de passe
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Card.Header>
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Inscription
        </h2>
        <p className="text-center text-gray-600 mt-2">
          Créez votre compte SportEra
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
          
          {/* Champ Nom */}
          <Input
            type="text"
            label="Nom complet"
            placeholder="Votre nom complet"
            value={formData.name}
            onChange={handleInputChange('name')}
            error={formErrors.name}
            icon={User}
            iconPosition="left"
            required
          />
          
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
            helperText="Au moins 6 caractères"
            required
          />
          
          {/* Champ Confirmation mot de passe */}
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirmer le mot de passe"
            placeholder="Confirmez votre mot de passe"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            error={formErrors.confirmPassword}
            icon={showConfirmPassword ? EyeOff : Eye}
            iconPosition="right"
            onIconClick={toggleConfirmPasswordVisibility}
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
            {isLoading ? 'Création du compte...' : 'Créer mon compte'}
          </Button>
        </form>
      </Card.Body>
      
      <Card.Footer>
        <p className="text-center text-sm text-gray-600">
          Déjà un compte ?{' '}
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 font-medium"
            onClick={() => router.push('/login')}
          >
            Se connecter
          </button>
        </p>
      </Card.Footer>
    </Card>
  );
};

export default RegisterForm;