import React from 'react';
import { Tab } from '../types';

interface LayoutProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  children: React.ReactNode;
  userName: string;
}

const Layout: React.FC<LayoutProps> = ({ currentTab, onTabChange, children, userName }) => {
  const tabs = [
    { id: Tab.DASHBOARD, icon: '📊', label: 'Přehled' },
    { id: Tab.MATERIALS, icon: '📚', label: 'Materiály' },
    { id: Tab.CHAT, icon: '🤖', label: 'AI Doučování' },
    { id: Tab.PODCAST, icon: '🎧', label: 'Podcasty' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            EduHub AI
          </h1>
          <p className="text-slate-400 text-xs mt-1">Školní Asistent & Hub</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                currentTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 bg-slate-800 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-slate-900 font-bold text-xs uppercase">
              {userName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{userName}</p>
              <p className="text-xs text-slate-400">Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-[calc(100vh-64px)] md:h-screen overflow-hidden flex flex-col">
        <header className="bg-white border-b border-slate-200 p-4 md:px-8 md:py-5 flex justify-between items-center shadow-sm z-10">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">{currentTab}</h2>
          <div className="flex items-center space-x-4">
             <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                Online
             </span>
             <button className="text-slate-400 hover:text-slate-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
             </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;