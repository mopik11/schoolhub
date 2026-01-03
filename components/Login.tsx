import React, { useState } from 'react';
import { verifyUserOnRPi } from '../services/geminiService';

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !password.trim()) {
      setError('Vyplň prosím jméno i heslo.');
      return;
    }

    setIsLoading(true);

    // OVĚŘENÍ PROTI RASPBERRY PI (Ne proti kódu na GitHubu)
    const isAllowed = await verifyUserOnRPi(name.trim(), password.trim());

    if (isAllowed) {
      onLogin(name.trim());
    } else {
      setError('Neplatné jméno nebo heslo. Přístup zamítnut.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-center">
           <h1 className="text-3xl font-bold text-white mb-2">EduHub AI</h1>
           <p className="text-blue-100">Soukromý školní asistent</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jméno</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tvé jméno"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Heslo</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {isLoading ? 'Ověřování na RPi...' : 'Vstoupit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
