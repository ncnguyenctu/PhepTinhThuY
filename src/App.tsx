import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import SampleSizePage from './pages/SampleSizePage';
import FisherPage from './pages/FisherPage';
import ChiSquarePage from './pages/ChiSquarePage';
import GuidePage from './pages/GuidePage';
import AboutPage from './pages/AboutPage';
import type { TabType } from './components/Navbar';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [animKey, setAnimKey] = useState(0);

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAnimKey((k) => k + 1);
  }, [activeTab]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onTabChange={handleTabChange} />;
      case 'sample-size':
        return <SampleSizePage />;
      case 'fisher':
        return <FisherPage />;
      case 'chi-square':
        return <ChiSquarePage />;
      case 'guide':
        return <GuidePage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onTabChange={handleTabChange} />;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F8FBFF', fontFamily: "'K2D', sans-serif" }}
    >
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Main content with top padding for fixed navbar */}
      <main
        className="flex-1 animate-fadeIn"
        key={animKey}
        style={{ paddingTop: activeTab === 'home' ? 64 : 80 }}
      >
        {renderPage()}
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
}
