import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    console.log('🚀 Tentative de connexion au backend...');
    setStatus('Connexion en cours...');
    
    fetch('/api/ping')
      .then(res => {
        console.log('📡 Réponse reçue:', res.status, res.statusText);
        setStatus(`Statut HTTP: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('✅ Données reçues:', data);
        setMessage(data.message || 'pong');
        setStatus('✅ Connexion réussie!');
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Erreur de connexion:', err);
        setError(`Erreur: ${err.message}`);
        setStatus('❌ Échec de la connexion');
        setMessage('Erreur de connexion');
        setLoading(false);
      });
  }, []);

  const testConnection = () => {
    setLoading(true);
    setError('');
    setStatus('Test en cours...');
    
    fetch('/api/ping')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message || 'pong');
        setStatus('✅ Test réussi!');
        setLoading(false);
      })
      .catch(err => {
        setError(`Erreur: ${err.message}`);
        setStatus('❌ Test échoué');
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2563eb', marginBottom: '30px' }}>SportEra - Test de Connexion</h1>
      
      <div style={{ 
        backgroundColor: '#f8fafc', 
        border: '1px solid #e2e8f0', 
        borderRadius: '8px', 
        padding: '20px', 
        marginBottom: '20px',
        maxWidth: '600px',
        margin: '0 auto 20px'
      }}>
        <h3>État de la connexion Backend</h3>
        <p><strong>Statut:</strong> {status}</p>
        {loading ? (
          <p style={{ color: '#f59e0b' }}>🔄 Chargement...</p>
        ) : (
          <>
            <p><strong>Réponse du backend:</strong> <span style={{ color: '#059669' }}>{message}</span></p>
            {error && <p style={{ color: '#dc2626' }}>{error}</p>}
          </>
        )}
      </div>

      <button 
        onClick={testConnection}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
        disabled={loading}
      >
        {loading ? 'Test en cours...' : 'Tester la connexion'}
      </button>

      <div style={{ marginTop: '30px', fontSize: '14px', color: '#6b7280' }}>
        <p>💡 Ouvrez la console du navigateur (F12) pour voir les logs détaillés</p>
        <p>🔧 Frontend: http://localhost:3001 | Backend: http://localhost:3000</p>
      </div>
    </div>
  );
}
