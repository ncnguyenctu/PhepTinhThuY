import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-11 h-11 rounded-full shadow-lg transition-all hover:scale-110"
      style={{
        background: 'linear-gradient(135deg, #1f5ca9 0%, #00afef 100%)',
        color: '#fff',
        animation: 'fadeIn 0.3s ease both',
      }}
      title="Lên đầu trang"
    >
      <ArrowUp size={20} />
    </button>
  );
}
