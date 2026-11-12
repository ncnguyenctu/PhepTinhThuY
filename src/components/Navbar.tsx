import { useState } from 'react';
import {
  Home, BarChart2, FlaskConical, GitFork, BookOpen, Info, Menu, X, Calculator
} from 'lucide-react';

export type TabType = 'home' | 'sample-size' | 'fisher' | 'chi-square' | 'guide' | 'about';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems: { id: TabType; label: string; icon: React.ReactNode; shortLabel: string }[] = [
  { id: 'home', label: 'Trang chủ', shortLabel: 'Trang chủ', icon: <Home size={17} /> },
  { id: 'sample-size', label: 'Tính cỡ mẫu', shortLabel: 'Cỡ mẫu', icon: <BarChart2 size={17} /> },
  { id: 'fisher', label: "Fisher's Exact Test", shortLabel: 'Fisher', icon: <FlaskConical size={17} /> },
  { id: 'chi-square', label: 'Chi-square & Yates', shortLabel: 'Chi-square', icon: <GitFork size={17} /> },
  { id: 'guide', label: 'Hướng dẫn', shortLabel: 'Hướng dẫn', icon: <BookOpen size={17} /> },
  { id: 'about', label: 'Giới thiệu', shortLabel: 'Giới thiệu', icon: <Info size={17} /> },
];

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTabChange = (tab: TabType) => {
    onTabChange(tab);
    setMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1.5px solid #e0eaf5',
        boxShadow: '0 2px 16px rgba(31,92,169,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleTabChange('home')}
            className="flex items-center gap-2.5 group"
          >
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #1f5ca9 0%, #00afef 100%)',
                width: 38,
                height: 38,
              }}
            >
              <Calculator size={20} color="#fff" />
            </div>
            <div className="leading-tight">
              <div
                className="font-bold text-sm sm:text-base"
                style={{ color: '#1f5ca9', letterSpacing: '0.01em' }}
              >
                Biostatistics
              </div>
              <div className="text-xs font-medium" style={{ color: '#00afef' }}>
                Calculator
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === item.id
                    ? 'text-white'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                }`}
                style={
                  activeTab === item.id
                    ? {
                        background: 'linear-gradient(135deg, #1f5ca9 0%, #00afef 100%)',
                        boxShadow: '0 4px 12px rgba(31,92,169,0.3)',
                      }
                    : {}
                }
              >
                {item.icon}
                <span>{item.shortLabel}</span>
              </button>
            ))}
          </nav>

          {/* Mobile burger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors"
            style={{ color: '#1f5ca9' }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden border-t animate-fadeIn"
          style={{ background: '#fff', borderColor: '#e0eaf5' }}
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === item.id
                    ? 'text-white'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
                style={
                  activeTab === item.id
                    ? {
                        background: 'linear-gradient(135deg, #1f5ca9 0%, #00afef 100%)',
                      }
                    : {}
                }
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
