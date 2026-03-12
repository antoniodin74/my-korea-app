import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, ChevronLeft, 
  X, Mail, Phone, MapPin, Calendar, 
  ShieldCheck, Tag 
} from 'lucide-react';
import PageContainer from './PageContainer';
import CustomerTableV2 from '../components/CustomerTableV2';

// In un'app reale, questi dati verrebbero da un file di costanti o da Redux
const DATA = [
  { id: 1, name: "Min-jun Kim", email: "mj.kim@tech.kr", status: "Active", phone: "+82 10 1234", type: "Enterprise", color: "bg-blue-400", location: "Seoul", joinDate: "12 Gen 2024" },
  { id: 2, name: "Sofia Rossi", email: "s.rossi@nexa.it", status: "Pending", phone: "+39 340 5566", type: "Startup", color: "bg-amber-400", location: "Milano", joinDate: "05 Feb 2024" },
  { id: 3, name: "Ji-hye Park", email: "ji.park@art.kr", status: "Active", phone: "+82 10 9988", type: "Partner", color: "bg-purple-400", location: "Busan", joinDate: "20 Nov 2023" },
  { id: 4, name: "Luca Bianchi", email: "l.b@agency.it", status: "Offline", phone: "+39 02 1122", type: "Standard", color: "bg-slate-400", location: "Torino", joinDate: "15 Mar 2024" },
];

export default function ClientPage2() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const bubbles = Array.from({ length: 20 });

  // --- LOGICA DI AGGANCIO DAL CALENDARIO ---
  useEffect(() => {
    // Se arriviamo qui con un ID nello stato della navigazione
    if (location.state?.openCustomer) {
      const customerToOpen = DATA.find(c => c.id === location.state.openCustomer);
      if (customerToOpen) {
        setSelectedCustomer(customerToOpen);
        // Puliamo lo stato per evitare che si riapra al refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location]);

  const handleDoubleClick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => console.error(e));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  return (
    <div 
      onDoubleClick={handleDoubleClick}
      className="relative h-screen w-full overflow-hidden bg-linear-to-br from-[#0ea5e9] via-[#7dd3fc] to-[#f0f9ff] cursor-default select-none"
    >
      
      {/* --- BACKGROUND LAYER (Bolle) --- */}
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
          <h1 className="text-[20vw] font-black text-white italic tracking-tighter">AQUA</h1>
        </div>
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
        <PageContainer>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
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

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-3 pointer-events-auto">
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
              {/* Passiamo la funzione per selezionare il cliente dalla tabella */}
              <CustomerTableV2 onSelectCustomer={setSelectedCustomer} />
            </div>
          </motion.div>
        </PageContainer>
      </div>

      {/* --- SIDE-OVER (DETTAGLI CLIENTE) --- */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-sky-900/20 backdrop-blur-sm z-100"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white/90 backdrop-blur-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-101 p-8 border-l border-white/50 overflow-y-auto"
            >
              <button onClick={() => setSelectedCustomer(null)} className="absolute top-6 right-6 p-2 hover:bg-sky-100 rounded-full text-sky-900 transition-colors">
                <X size={24} />
              </button>

              <div className="mt-12 space-y-8">
                <div className="flex flex-col items-center text-center">
                  <div className={`w-24 h-24 ${selectedCustomer.color} rounded-[2.5rem] flex items-center justify-center text-3xl text-white font-black mb-4 shadow-2xl`}>
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <h2 className="text-2xl font-black text-sky-950">{selectedCustomer.name}</h2>
                  <p className="text-sky-600 font-bold uppercase text-xs tracking-widest">{selectedCustomer.type}</p>
                </div>

                <div className="space-y-6 bg-white/60 p-6 rounded-[2.5rem] border border-white shadow-sm">
                  <h3 className="text-[10px] font-black text-sky-900/40 uppercase tracking-widest">Contatti</h3>
                  <div className="space-y-5">
                    {[
                      { icon: Mail, label: "Email", value: selectedCustomer.email },
                      { icon: Phone, label: "Telefono", value: selectedCustomer.phone },
                      { icon: MapPin, label: "Sede", value: selectedCustomer.location }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="p-3 bg-sky-50 rounded-2xl text-sky-500"><item.icon size={18} /></div>
                        <div>
                          <p className="text-[9px] font-bold text-sky-900/30 uppercase">{item.label}</p>
                          <p className="font-bold text-sky-950 text-sm">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/40 rounded-3xl border border-white flex flex-col items-center justify-center gap-1">
                    <Calendar className="text-sky-400" size={20} /><p className="text-[9px] font-black text-sky-900/40 uppercase">Membro dal</p><p className="text-xs font-bold text-sky-950">{selectedCustomer.joinDate}</p>
                  </div>
                  <div className="p-4 bg-white/40 rounded-3xl border border-white flex flex-col items-center justify-center gap-1">
                    <ShieldCheck className="text-emerald-400" size={20} /><p className="text-[9px] font-black text-sky-900/40 uppercase">Status</p><p className="text-xs font-bold text-sky-950">Certificato</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-sky-600 text-white rounded-3xl font-black text-sm shadow-xl shadow-sky-600/20 hover:bg-sky-500 hover:-translate-y-1 transition-all active:scale-95 uppercase tracking-widest">
                  Aggiorna Anagrafica
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}