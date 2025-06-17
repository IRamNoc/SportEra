// Composant de formulaire d'inscription
// Formulaire d'inscription utilisant les composants UI et hooks personnalisés

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, Building2, UserCheck } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useAuthContext } from '../../contexts/AuthContext';
import { RegisterRequest } from '../../services/api';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

type UserType = 'user' | 'provider';

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
  userType: UserType;
  companyName?: string;
  description?: string;
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
    confirmPassword: '',
    userType: 'user',
    companyName: '',
    description: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<RegisterFormData>>({});

  // Validation du formulaire
  const validateForm = (): boolean => {
    const errors: Partial<RegisterFormData> = {};
    
    if (!formData.name) {
      errors.name = formData.userType === 'provider' ? 'Le nom du contact est requis' : 'Le nom est requis';
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
    
    // Validation spécifique aux partenaires
    if (formData.userType === 'provider') {
      if (!formData.companyName) {
        errors.companyName = 'Le nom de l\'entreprise est requis';
      } else if (formData.companyName.length < 2) {
        errors.companyName = 'Le nom de l\'entreprise doit contenir au moins 2 caractères';
      }
      
      if (!formData.description) {
        errors.description = 'La description de l\'activité est requise';
      } else if (formData.description.length < 10) {
        errors.description = 'La description doit contenir au moins 10 caractères';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion des changements de champs
  const handleInputChange = (field: keyof RegisterFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
          Créez votre compte Sport'Era
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
          
          {/* Sélection du type d'utilisateur */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Type de compte
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'user', companyName: '', description: '' }))}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  formData.userType === 'user'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Utilisateur</span>
                <span className="text-xs text-center">Je cherche des services sportifs</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, userType: 'provider' }))}
                className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                  formData.userType === 'provider'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Building2 className="w-5 h-5" />
                <span className="text-sm font-medium">Partenaire</span>
                <span className="text-xs text-center">Je propose des services sportifs</span>
              </button>
            </div>
          </div>
          
          {/* Champ Nom */}
          <Input
            type="text"
            label={formData.userType === 'provider' ? 'Nom du contact' : 'Nom complet'}
            placeholder={formData.userType === 'provider' ? 'Nom du responsable' : 'Votre nom complet'}
            value={formData.name}
            onChange={handleInputChange('name')}
            error={formErrors.name}
            icon={User}
            iconPosition="left"
            required
          />
          
          {/* Champs spécifiques aux partenaires */}
          {formData.userType === 'provider' && (
            <>
              <Input
                type="text"
                label="Nom de l'entreprise"
                placeholder="Nom de votre entreprise ou structure"
                value={formData.companyName}
                onChange={handleInputChange('companyName')}
                error={formErrors.companyName}
                icon={Building2}
                iconPosition="left"
                required
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description de l'activité *
                </label>
                <textarea
                  placeholder="Décrivez vos services sportifs (coaching, location, événements, etc.)"
                  value={formData.description}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, description: e.target.value }));
                    if (formErrors.description) {
                      setFormErrors(prev => ({ ...prev, description: undefined }));
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    formErrors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  rows={3}
                  required
                />
                {formErrors.description && (
                  <p className="text-sm text-red-600">{formErrors.description}</p>
                )}
              </div>
            </>
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
            {isLoading 
              ? 'Création du compte...' 
              : formData.userType === 'provider' 
                ? 'Créer mon compte partenaire' 
                : 'Créer mon compte'
            }
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