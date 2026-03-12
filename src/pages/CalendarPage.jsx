import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Clock, X, Bell, ChevronRight, AlignLeft } from 'lucide-react';
import PageContainer from './PageContainer';

// Mock Data
const DATA = [
  { id: 1, name: "Min-jun Kim", color: "bg-blue-400" },
  { id: 2, name: "Sofia Rossi", color: "bg-amber-400" },
  { id: 3, name: "Ji-hye Park", color: "bg-purple-400" }
];

const APPOINTMENTS = {
  12: [
    { 
      id: 1, 
      time: "10:30", 
      title: "Review Progetto Aqua", 
      description: "Analisi dei prototipi UI e feedback sulle animazioni delle bolle di sfondo.",
      clientId: 1, 
      type: "Urgent" 
    },
    { 
      id: 2, 
      time: "15:00", 
      title: "Meeting Sviluppo", 
      description: "Sincronizzazione settimanale sullo stato del backend e integrazione API.",
      clientId: 2, 
      type: "Standard" 
    },
    { 
      id: 3, 
      time: "15:00", 
      title: "Meeting Sviluppo", 
      description: "Sincronizzazione settimanale sullo stato del backend e integrazione API.",
      clientId: 2, 
      type: "Standard" 
    }
  ],
  15: [
    { 
      id: 3, 
      time: "09:00", 
      title: "Design Sync", 
      description: "Discussione sulla nuova palette colori per la Dark Mode.",
      clientId: 3, 
      type: "Standard" 
    }
  ]
};

export default function CalendarPage() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(null);
  const bubbles = Array.from({ length: 20 });

  return (
    <div className="relative h-screen w-full overflow-hidden bg-linear-to-br from-[#0ea5e9] via-[#7dd3fc] to-[#f0f9ff]">
      {/* BACKGROUND BUBBLES */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {bubbles.map((_, i) => (
          <motion.div 
            key={i} 
            initial={{ y: "110vh", x: `${Math.random() * 100}vw` }} 
            animate={{ y: "-20vh", opacity: [0, 0.7, 0] }} 
            transition={{ duration: 10, repeat: Infinity, delay: i * 0.5 }} 
            className="border-2 border-white/40 rounded-full bg-white/10 absolute" 
            style={{ width: 40, height: 40 }} 
          />
        ))}
      </div>

      <div className="relative z-10 h-full overflow-y-auto custom-scrollbar">
        <PageContainer>
          <div className="flex justify-between items-center mb-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sky-900/60 font-bold text-xs uppercase tracking-widest mb-4 hover:text-sky-900 transition-colors">
                <ChevronLeft size={16} /> Torna alla Home
              </button>
              <h1 className="text-4xl font-black text-sky-950 uppercase tracking-tighter">Scheduler <span className="text-white">Appuntamenti</span></h1>
            </motion.div>
            <button className="bg-sky-600 text-white px-8 py-4 rounded-2xl font-black text-xs shadow-xl uppercase tracking-widest hover:bg-sky-500 transition-all flex items-center gap-2">
              <Plus size={18} /> Nuovo Slot
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2.5rem] p-8 bg-white/20 backdrop-blur-md border border-white/50 shadow-2xl">
            <div className="grid grid-cols-7 gap-4">
              {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-sky-900/40 uppercase mb-2 tracking-[0.2em]">{d}</div>
              ))}
              
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1;
                const dailyApps = APPOINTMENTS[day] || [];
                
                return (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setSelectedDay(day)}
                    className={`min-h-40 bg-white/30 border rounded-4xl p-2.5 cursor-pointer hover:bg-white/60 transition-all flex flex-col gap-2 ${dailyApps.length > 0 ? 'border-sky-400 shadow-lg shadow-sky-400/10' : 'border-white/40'}`}
                  >
                    <span className="text-xs font-black text-sky-950/30 ml-1">{day}</span>
                    
                    {/* Contenitore Appuntamenti: rimosso lo slice per mostrare tutto */}
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-32 custom-scrollbar-thin">
                      {dailyApps.map((app) => {
                        const client = DATA.find(c => c.id === app.clientId);
                        return (
                          <div key={app.id} className="flex flex-col bg-white/50 p-2 rounded-2xl border border-white/60 shadow-sm shrink-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className={`w-4 h-4 shrink-0 ${client?.color || 'bg-sky-200'} rounded-md flex items-center justify-center text-[7px] text-white font-black`}>
                                {client?.name.charAt(0)}
                              </div>
                              <span className="text-[8px] font-black text-sky-500 uppercase">{app.time}</span>
                            </div>
                            <h5 className="text-[9px] font-bold text-sky-950 leading-tight line-clamp-2 italic">
                              {app.title}
                            </h5>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </PageContainer>
      </div>

      {/* SIDE-OVER DETTAGLIATO */}
      <AnimatePresence>
        {selectedDay && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedDay(null)} className="fixed inset-0 bg-sky-900/20 backdrop-blur-sm z-100" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25 }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white/90 backdrop-blur-3xl z-101 p-8 border-l border-white/50 shadow-2xl overflow-y-auto">
              <button onClick={() => setSelectedDay(null)} className="absolute top-6 right-6 p-2 hover:bg-sky-100 rounded-full transition-colors text-sky-950"><X size={24} /></button>
              
              <div className="mt-12 space-y-8">
                <div>
                  <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-1">Agenda del Giorno</p>
                  <h2 className="text-3xl font-black text-sky-950 tracking-tighter">{selectedDay} Marzo 2026</h2>
                </div>

                <div className="space-y-6">
                  {APPOINTMENTS[selectedDay]?.map(app => {
                    const client = DATA.find(c => c.id === app.clientId);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={app.id} 
                        className="p-6 bg-white/60 rounded-[2.5rem] border border-white shadow-sm space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest flex items-center gap-1"><Clock size={12}/> {app.time}</span>
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter ${app.type === 'Urgent' ? 'bg-rose-100 text-rose-600' : 'bg-sky-100 text-sky-600'}`}>
                            {app.type}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-bold text-sky-950 text-lg leading-tight mb-2">{app.title}</h4>
                          <div className="flex gap-2 text-sky-800/70">
                            <AlignLeft size={14} className="shrink-0 mt-1 opacity-50" />
                            <p className="text-sm font-medium leading-relaxed italic">
                              "{app.description}"
                            </p>
                          </div>
                        </div>

                        {client && (
                          <div 
                            onClick={() => navigate('/clienti2', { state: { openCustomer: client.id } })}
                            className="flex items-center gap-3 p-3 bg-sky-500/5 rounded-2xl border border-sky-500/10 cursor-pointer hover:bg-sky-500/10 transition-all group"
                          >
                            <div className={`w-10 h-10 ${client.color} rounded-xl flex items-center justify-center text-white font-black text-xs shadow-sm`}>{client.name.charAt(0)}</div>
                            <div className="flex-1 text-sm font-bold text-sky-950">{client.name}</div>
                            <ChevronRight size={16} className="text-sky-300 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </motion.div>
                    );
                  }) || (
                    <div className="text-center py-20 opacity-20 font-black uppercase text-[10px] tracking-widest flex flex-col items-center gap-4 text-sky-950">
                      <Bell size={40} />
                      Nessun impegno previsto
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}