import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCards } from './store/index'; 
import Card from './components/Card';
import { motion } from 'framer-motion';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ClientPage from './pages/ClientPage';
import ClientPage2 from './pages/ClientPage2';
import AnalyticsPage from './pages/AnalyticsPage';
import CalendarPage from './pages/CalendarPage';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cards } = useSelector((state) => state.cards);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    dispatch(fetchCards());
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, [dispatch]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => console.error(e));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const bubbles = Array.from({ length: 30 });

  const HomePage = () => (
    <div 
      onDoubleClick={toggleFullScreen}
      className="relative w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-linear-to-br from-[#0ea5e9] via-[#7dd3fc] to-[#f0f9ff] cursor-default"
    >
      {/* BUBBLES */}
      {bubbles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 0.6, 0] }}
          transition={{ duration: Math.random() * 8 + 4, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
          style={{ width: Math.random() * 25 + 5, height: Math.random() * 25 + 5, position: 'absolute', left: 0, top: 0, zIndex: 1 }}
          className="border border-white/40 rounded-full bg-white/10 backdrop-blur-[1px] pointer-events-none"
        />
      ))}

      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none z-0">
        <h1 className="text-[15vw] font-black text-white opacity-[0.03] tracking-tighter italic leading-none">AQUA</h1>
      </div>

      {/* GRID CARDS */}
      <div className="flex flex-wrap gap-16 justify-center items-center z-50">
        {cards && cards.map((card, index) => {
          const routes = ['/clienti', '/clienti2', '/analytics', '/calendar'];
          return (
            <Card 
              key={card.id} 
              title={card.title} 
              desc={card.desc} 
              delay={index * 0.8} 
              onClick={() => navigate(routes[index] || '/')}
            />
          );
        })}
      </div>

      <div className="absolute bottom-8 text-sky-900/30 text-[10px] tracking-[1em] font-bold uppercase z-50">
        Deep Water System
      </div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/clienti" element={<ClientPage />} />
      <Route path="/clienti2" element={<ClientPage2 />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
    </Routes>
  );
}

export default App;