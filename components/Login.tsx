import React, { useState } from 'react';

// KONFIGURACE PŘÍSTUPU
const ALLOWED_USERS = [
  { name: 'Matěj Pácl', password: 'mojeheslo123' },
  { name: 'Admin', password: 'eduhub2026' },
  { name: 'Test', password: '123' }
];

interface LoginProps {
  onLogin: (name: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState(''); // Nový stav pro heslo
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = name.trim();
    const trimmedPass = password.trim();

    // 1. KONTROLA JMÉNA A HESLA
    const user = ALLOWED_USERS.find(
      u => u.name.toLowerCase() === trimmedName.toLowerCase() && u.password === trimmedPass
    );

    if (!trimmedName || !trimmedPass) {
      setError('Vyplň jméno i heslo!');
      return;
    }

    if (!user) {
      setError('Špatné jméno nebo heslo. Přístup odepřen! 🛑');
      return;
    }

    setError('');
    setIsLoading(true);

    // Simulace přihlašování
    setTimeout(() => {
      onLogin(user.name); // Pošleme originální jméno ze seznamu
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-8 pb-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-center">
           <h1 className="text-3xl font-bold text-white mb-2">EduHub AI</h1>
           <p className="text-blue-100">Zabezpečený přístup k Raspberry Pi</p>
        </div>
        
        <div className="p-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jméno</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tvé jméno"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Heslo</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-2">
                <p className="text-red-700 text-xs">{error}</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-70 flex justify-center items-center"
            >
              {isLoading ? 'Ověřování...' : 'Vstoupit'}
            </button>
          </form>
        </div>

        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-400">Školní projekt | Raspberry Pi 5</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
