import React from 'react';
import { MOCK_HOMEWORK, MOCK_TEAMS_MESSAGES } from '../constants';
import { Tab } from '../types';

interface DashboardProps {
  onNavigate: (tab: Tab) => void;
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, userName }) => {
  const pendingHomework = MOCK_HOMEWORK.filter(h => !h.completed).length;
  const recentMessages = MOCK_TEAMS_MESSAGES.length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 9) return 'Dobré ráno';
    if (hour < 11) return 'Dobré dopoledne';
    if (hour < 14) return 'Dobré poledne';
    if (hour < 18) return 'Dobré odpoledne';
    return 'Dobrý večer';
  };

  // Get first name for a more natural greeting
  const firstName = userName.split(' ')[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 md:p-10 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {firstName}! 👋</h1>
        <p className="text-blue-100 max-w-xl">
          Máš <span className="font-bold text-white">{pendingHomework} nedokončených úkolů</span> a <span className="font-bold text-white">{recentMessages} nových zpráv</span> v Teams.
        </p>
        <button 
          onClick={() => onNavigate(Tab.CHAT)}
          className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
        >
          Zeptat se AI asistenta
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
             </div>
             <h3 className="font-semibold text-slate-700">Domácí úkoly</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">{pendingHomework}</p>
          <p className="text-sm text-slate-500 mt-1">S termínem tento týden</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
             </div>
             <h3 className="font-semibold text-slate-700">Materiály</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">3</p>
          <p className="text-sm text-slate-500 mt-1">Nové poznámky</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
             </div>
             <h3 className="font-semibold text-slate-700">Podcasty</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">Připraveno</p>
          <p className="text-sm text-slate-500 mt-1">Vytvořit z poznámek</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-lg text-slate-800 mb-4">Urgentní úkoly</h3>
        <div className="space-y-3">
            {MOCK_HOMEWORK.slice(0, 2).map(hw => (
                <div key={hw.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${hw.completed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div>
                            <p className="font-semibold text-slate-800">{hw.title}</p>
                            <p className="text-xs text-slate-500">{hw.subject} • {hw.platform}</p>
                        </div>
                    </div>
                    <span className="text-xs font-medium bg-white px-2 py-1 rounded border border-slate-200 shadow-sm">{hw.dueDate}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;