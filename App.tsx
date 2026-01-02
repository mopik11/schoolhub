import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Materials from './components/Materials';
import Chatbot from './components/Chatbot';
import PodcastGenerator from './components/PodcastGenerator';
import Login from './components/Login';
import { Tab } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('Jan Student'); // Default fallback
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.DASHBOARD);
  
  // State to hold material passed to podcast generator
  const [podcastMaterial, setPodcastMaterial] = useState<{title: string, content: string} | null>(null);

  const handleLogin = (name: string) => {
    if (name) {
        setUserName(name);
    }
    setIsAuthenticated(true);
  };

  const handleGeneratePodcast = (title: string, content: string) => {
    setPodcastMaterial({ title, content });
    setCurrentTab(Tab.PODCAST);
  };

  const renderContent = () => {
    switch (currentTab) {
      case Tab.DASHBOARD:
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} userName={userName} />;
      case Tab.MATERIALS:
        return <Materials onGeneratePodcast={handleGeneratePodcast} />;
      case Tab.CHAT:
        return <Chatbot />;
      case Tab.PODCAST:
        return <PodcastGenerator selectedMaterial={podcastMaterial} />;
      default:
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} userName={userName} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab} userName={userName}>
      {renderContent()}
    </Layout>
  );
};

export default App;