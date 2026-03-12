import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Plus, ChevronLeft } from 'lucide-react';
import PageContainer from './PageContainer';
import CustomerTableV2 from '../components/CustomerTableV2';

export default function ClientPage2() {
  const navigate = useNavigate();
  const bubbles = Array.from({ length: 20 });

  // Funzione per il toggle del Fullscreen
  const handleDoubleClick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Errore nel tentativo di attivare il fullscreen: ${e.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div 
      onDoubleClick={handleDoubleClick}
      className="relative h-screen w-full overflow-hidden bg-linear-to-br from-[#0ea5e9] via-[#7dd3fc] to-[#f0f9ff] cursor-default select-none"
    >
      
      {/* --- BACKGROUND LAYER (Bolle Potenziate) --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {bubbles.map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{ 
              y: "-20vh", 
              opacity: [0, 0.7, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            style={{ 
              width: Math.random() * 45 + 15,
              height: Math.random() * 45 + 15, 
              position: 'absolute' 
            }}
            className="border-2 border-white/40 rounded-full bg-white/10 backdrop-blur-[2px] shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          />
        ))}
        
        <div className="absolute inset-0 flex items-center justify-center select-none opacity-[0.04]">
          <h1 className="text-[20vw] font-black text-white italic tracking-tighter">
            AQUA
          </h1>
        </div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
        <PageContainer>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-sky-900/60 font-bold text-xs uppercase tracking-widest mb-4 hover:text-sky-900 transition-all group pointer-events-auto"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Torna alla Home
              </button>
              <h1 className="text-4xl font-black text-sky-950 tracking-tighter uppercase">
                Database <span className="text-white drop-shadow-sm">Clienti V2</span>
              </h1>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex gap-3 pointer-events-auto"
            >
              <button className="glass-card px-6 py-3 rounded-2xl flex items-center gap-2 text-sky-900 font-bold text-sm hover:bg-white/50 transition-all shadow-sm border-white/40">
                <Filter size={18} className="text-sky-600" /> Filtri
              </button>
              <button className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-xl shadow-sky-400/20 transition-all active:scale-95 flex items-center gap-2">
                <Plus size={18} /> Nuovo Cliente
              </button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 100, delay: 0.2 }}
            className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl shadow-sky-900/10 border-white/50 mb-10 pointer-events-auto"
          >
            <div className="bg-white/20 backdrop-blur-md">
              <CustomerTableV2 />
            </div>
          </motion.div>
        </PageContainer>
      </div>
    </div>
  );
}