import React, { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';

export default function TestLogin() {
  const { login, isLoading, error, user, isAuthenticated } = useAuthContext();
  const [email, setEmail] = useState('martin.conta@gmail.com');
  const [password, setPassword] = useState('test123');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleLogin = async () => {
    addLog('🔄 Début de la connexion...');
    addLog(`📧 Email: ${email}`);
    addLog(`🔑 Mot de passe: ${password}`);
    
    try {
      const success = await login({ email, password });
      addLog(`📊 Résultat de login(): ${success}`);
      
      if (success) {
        addLog('✅ Connexion réussie!');
        addLog(`👤 Utilisateur: ${JSON.stringify(user)}`);
        addLog(`🔐 Authentifié: ${isAuthenticated}`);
        
        // Test de redirection manuelle
        setTimeout(() => {
          addLog('🔄 Tentative de redirection...');
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        addLog('❌ Échec de la connexion');
        addLog(`🚨 Erreur: ${error}`);
      }
    } catch (err) {
      addLog(`💥 Erreur: ${err}`);
    }
  };

  const testCommonPasswords = async () => {
    const commonPasswords = ['test123', 'password', 'password123', 'test', '123456', 'admin'];
    
    for (const pwd of commonPasswords) {
      addLog(`🧪 Test avec mot de passe: ${pwd}`);
      try {
        const success = await login({ email, password: pwd });
        if (success) {
          addLog(`✅ SUCCÈS avec le mot de passe: ${pwd}`);
          return;
        } else {
          addLog(`❌ Échec avec: ${pwd}`);
        }
      } catch (err) {
        addLog(`💥 Erreur avec ${pwd}: ${err}`);
      }
      // Petite pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    addLog('🔚 Fin des tests de mots de passe');
  };

  const checkLocalStorage = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    addLog(`🗄️ Token: ${token ? 'Présent' : 'Absent'}`);
    addLog(`🗄️ User: ${storedUser ? 'Présent' : 'Absent'}`);
    if (storedUser) {
      addLog(`🗄️ User data: ${storedUser}`);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    addLog('🗑️ LocalStorage nettoyé');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🔧 Test de Connexion - Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulaire de test */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Formulaire de Test</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 mb-2"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
            
            <button
              onClick={testCommonPasswords}
              disabled={isLoading}
              className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              🧪 Tester mots de passe courants
            </button>
            
            <div className="flex gap-2">
              <button
                onClick={checkLocalStorage}
                className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
              >
                Vérifier Storage
              </button>
              
              <button
                onClick={clearStorage}
                className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                Nettoyer Storage
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Erreur: {error}
            </div>
          )}
        </div>
        
        {/* État actuel */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">État Actuel</h2>
          
          <div className="space-y-2 text-sm">
            <div>🔐 <strong>Authentifié:</strong> {isAuthenticated ? '✅ Oui' : '❌ Non'}</div>
            <div>⏳ <strong>Chargement:</strong> {isLoading ? '✅ Oui' : '❌ Non'}</div>
            <div>👤 <strong>Utilisateur:</strong> {user ? user.name : 'Aucun'}</div>
            <div>📧 <strong>Email:</strong> {user ? user.email : 'Aucun'}</div>
            <div>🎯 <strong>Points:</strong> {user ? user.points : 'N/A'}</div>
          </div>
        </div>
      </div>
      
      {/* Logs */}
      <div className="mt-6 bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
        <h2 className="text-lg font-semibold mb-4 text-white">📋 Logs de Debug</h2>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))}
        </div>
        
        <button
          onClick={() => setLogs([])}
          className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Effacer les logs
        </button>
      </div>
    </div>
  );
}