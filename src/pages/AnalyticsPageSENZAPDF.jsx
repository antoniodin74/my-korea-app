import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, TrendingUp, Download, FileBarChart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import PageContainer from './PageContainer';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const data = [
  { name: 'Gen', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'Mag', value: 500 },
  { name: 'Giu', value: 900 },
];

const pieData = [
  { name: 'Enterprise', value: 400, color: '#0ea5e9' },
  { name: 'Startup', value: 300, color: '#38bdf8' },
  { name: 'Partner', value: 200, color: '#7dd3fc' },
];

export default function AnalyticsPage() {
  const navigate = useNavigate();

  const handleDoubleClick = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Funzione per esportare in PDF
  const exportToPDF = async () => {
    const element = document.getElementById('report-area');
    const canvas = await html2canvas(element, {
      scale: 2, // Migliora la risoluzione
      useCORS: true,
      backgroundColor: "#0f172a", // Mantiene il fondo scuro nel PDF
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Aggiunta header testuale al PDF
    pdf.setTextColor(15, 23, 42); // Colore scuro per il testo esterno all'immagine
    pdf.setFontSize(20);
    pdf.text("AQUA - Digital Soul Report", 15, 20);
    pdf.setFontSize(10);
    pdf.text(`Data generazione: ${new Date().toLocaleString()}`, 15, 28);
    
    // Inserimento dell'immagine dei grafici
    pdf.addImage(imgData, 'PNG', 0, 40, pdfWidth, pdfHeight);
    pdf.save(`Aqua_Report_${new Date().getTime()}.pdf`);
  };

  return (
    <div 
      onDoubleClick={handleDoubleClick}
      className="relative h-screen w-full overflow-hidden bg-linear-to-br from-[#0f172a] via-[#0ea5e9] to-[#7dd3fc] select-none"
    >
      {/* BACKGROUND LAYER */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 h-full overflow-y-auto custom-scrollbar">
        <PageContainer>
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-white/60 font-bold text-xs uppercase tracking-[0.3em] mb-4 hover:text-white transition-all group"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Center
              </button>
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
                Digital <span className="text-sky-200">Soul Analytics</span>
              </h1>
            </div>

            {/* BOTTONE EXPORT */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToPDF}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest shadow-2xl hover:bg-white/20 transition-all"
            >
              <Download size={18} className="text-sky-300" />
              Esporta Report PDF
            </motion.button>
          </header>

          {/* AREA CATTURATA NEL PDF */}
          <div id="report-area" className="p-4 rounded-[4rem]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              
              {/* GRAFICO AREA */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 glass-card p-8 rounded-[3rem] border-white/20 bg-white/10 backdrop-blur-2xl shadow-2xl"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-white font-bold flex items-center gap-2 italic">
                    <TrendingUp size={20} className="text-sky-300" /> Crescita Network
                  </h3>
                  <div className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Real-time Data</div>
                </div>
                <div className="h-75 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}
                        itemStyle={{ color: '#7dd3fc' }}
                      />
                      <Area type="monotone" dataKey="value" stroke="#7dd3fc" strokeWidth={4} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* GRAFICO PIE */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="glass-card p-8 rounded-[3rem] border-white/20 bg-white/10 backdrop-blur-2xl flex flex-col items-center shadow-2xl"
              >
                <h3 className="text-white font-bold mb-4 self-start italic flex items-center gap-2">
                   <FileBarChart size={18} className="text-sky-300" /> Distribuzione
                </h3>
                <div className="h-62.5 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value" animationBegin={0} animationDuration={1500}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 gap-2 w-full mt-4">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold p-3 bg-white/5 rounded-xl border border-white/10">
                      <span className="text-white/60">{item.name}</span>
                      <span className="text-white">{item.value} units</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}