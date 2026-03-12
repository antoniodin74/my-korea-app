import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  TrendingUp, 
  Download, 
  CheckCircle2, 
  Loader2, 
  Table as TableIcon 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import PageContainer from './PageContainer';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image'; // Importiamo la nuova libreria

const data = [
  { name: 'Gen', value: 400 }, { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 }, { name: 'Apr', value: 800 },
  { name: 'Mag', value: 500 }, { name: 'Giu', value: 900 },
];

const pieData = [
  { name: 'Enterprise', value: 400, color: '#0ea5e9' },
  { name: 'Startup', value: 300, color: '#38bdf8' },
  { name: 'Partner', value: 200, color: '#7dd3fc' },
];

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');

  const exportToPDF = async () => {
    if (status !== 'idle') return;
    setStatus('generating');

    const node = document.getElementById('report-area');
    
    try {
      // 1. Cattura ad alta risoluzione
      const dataUrl = await toPng(node, { 
        pixelRatio: 3, 
        quality: 1,
        backgroundColor: '#0f172a',
      });

      const img = new Image();
      img.src = dataUrl;

      img.onload = () => {
        // Dimensioni PDF A4 in mm
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Calcoliamo quanto spazio occupa l'immagine nel PDF
        const imgWidth = pdfWidth;
        const imgHeight = (img.height * imgWidth) / img.width;
        
        // Gestione multi-pagina
        let heightLeft = imgHeight;
        let position = 0; // Coordinata Y di partenza

        // Prima pagina
        pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Se l'immagine avanza, aggiungiamo pagine
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight; // Sposta l'immagine verso l'alto
          pdf.addPage();
          pdf.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        pdf.save(`Report_MultiPage_2026.pdf`);
        
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      };
    } catch (err) {
      console.error("Errore Generazione Multi-pagina:", err);
      setStatus('idle');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 text-white overflow-y-auto">
      <div className="fixed inset-0 z-0 opacity-20 bg-linear-to-br from-slate-900 to-sky-500 pointer-events-none" />

      <AnimatePresence>
        {status === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: 20, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-100 flex items-center gap-3 bg-sky-500 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold"
          >
            <CheckCircle2 size={20} /> Report completato!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 pt-8 pb-16 min-h-full">
        <PageContainer>
          <header className="mb-12 flex justify-between items-end px-4">
            <div>
              <button onClick={() => navigate('/')} className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1 hover:text-white transition-colors">
                <ChevronLeft size={14} /> Home
              </button>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
                Analytics <span className="text-sky-400">Hub</span>
              </h1>
            </div>

            <button 
              disabled={status === 'generating'}
              onClick={exportToPDF} 
              className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 transition-all text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-sky-500/20 active:scale-95"
            >
              {status === 'generating' ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              {status === 'generating' ? 'Cattura in corso...' : 'Scarica PDF'}
            </button>
          </header>

          <div id="report-area" className="p-6 space-y-8 bg-slate-900 border border-slate-800 rounded-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-2 p-8 bg-slate-800/50 rounded-3xl border border-slate-700">
                <h3 className="font-bold mb-6 flex items-center gap-2 italic text-slate-100 uppercase tracking-tighter">
                  <TrendingUp size={20} className="text-sky-400" /> Performance Network
                </h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} axisLine={false} tickLine={false} />
                      <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} fill="url(#colorArea)" isAnimationActive={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="p-8 bg-slate-800/50 rounded-3xl border border-slate-700">
                <h3 className="font-bold mb-6 italic text-slate-100 uppercase tracking-tighter text-center">Ripartizione</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" isAnimationActive={false}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.color} stroke="none" />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-slate-900/80 rounded-xl border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{item.name}</span>
                      <span className="text-xs font-black text-sky-400">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TABELLA DATI */}
            <div className="p-8 bg-slate-800/50 rounded-3xl border border-slate-700">
              <h3 className="font-bold mb-6 flex items-center gap-2 italic text-slate-100 uppercase tracking-tighter">
                <TableIcon size={20} className="text-sky-400" /> Log Statistiche
              </h3>
              <div className="w-full overflow-hidden rounded-xl border border-slate-700">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/80">
                      <th className="p-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Mese</th>
                      <th className="p-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Indice</th>
                      <th className="p-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Stato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, idx) => (
                      <tr key={idx} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-700/30 transition-colors">
                        <td className="p-4 text-sm font-medium text-slate-300 tracking-wide">{row.name}</td>
                        <td className="p-4 text-sm font-black text-sky-400">{row.value} <span className="text-[9px] text-slate-500 font-normal">pts</span></td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-black ${row.value > 500 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                            {row.value > 500 ? 'PEAK' : 'STABLE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}