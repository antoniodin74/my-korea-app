import { useState, useEffect } from 'react';
import { 
  MoreHorizontal, Mail, Phone, MapPin, Tag, Search, X, 
  Calendar, ShieldCheck, User, Users, UserCheck, UserMinus,
  FileSpreadsheet
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as XLSX from 'xlsx';

const DATA = [
  { id: 1, name: "Min-jun Kim", email: "mj.kim@tech.kr", status: "Active", phone: "+82 10 1234", type: "Enterprise", color: "bg-blue-400", location: "Seoul", joinDate: "12 Gen 2024" },
  { id: 2, name: "Sofia Rossi", email: "s.rossi@nexa.it", status: "Pending", phone: "+39 340 5566", type: "Startup", color: "bg-amber-400", location: "Milano", joinDate: "05 Feb 2024" },
  { id: 3, name: "Ji-hye Park", email: "ji.park@art.kr", status: "Active", phone: "+82 10 9988", type: "Partner", color: "bg-purple-400", location: "Busan", joinDate: "20 Nov 2023" },
  { id: 4, name: "Luca Bianchi", email: "l.b@agency.it", status: "Offline", phone: "+39 02 1122", type: "Standard", color: "bg-slate-400", location: "Torino", joinDate: "15 Mar 2024" },
];

// --- SOTTO-COMPONENTI ---

const Counter = ({ value }) => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    key={value}
    className="text-2xl font-black text-sky-950"
  >
    {value}
  </motion.span>
);

const CircularProgress = ({ percentage }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-16 h-16 transform -rotate-90">
        <circle
          cx="32" cy="32" r={radius}
          stroke="currentColor" strokeWidth="8"
          fill="transparent" className="text-sky-100/50"
        />
        <motion.circle
          cx="32" cy="32" r={radius}
          stroke="currentColor" strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="text-emerald-500"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-black text-sky-900">{Math.round(percentage)}%</span>
    </div>
  );
};

export default function CustomerTableV2() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredData = DATA.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: filteredData.length,
    active: filteredData.filter(u => u.status === 'Active').length,
    pending: filteredData.filter(u => u.status === 'Pending' || u.status === 'Offline').length
  };

  const activePercentage = stats.total > 0 ? (stats.active / stats.total) * 100 : 0;

  const exportToExcel = () => {
    const dataToExport = filteredData.map(user => ({
      ID: `#00${user.id}`, Nome: user.name, Email: user.email, Stato: user.status,
      Telefono: user.phone, Segmento: user.type, Sede: user.location, 'Data Iscrizione': user.joinDate
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Database");
    XLSX.writeFile(workbook, `Aqua_Export_${new Date().toLocaleDateString()}.xlsx`);
  };

  const SkeletonRow = () => (
    <tr className="relative overflow-hidden">
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-sky-900/10 rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/40 to-transparent -translate-x-full" />
          </div>
          <div className="h-4 w-32 bg-sky-900/15 rounded relative overflow-hidden" />
        </div>
      </td>
      <td className="px-8 py-6"><div className="h-4 w-40 bg-sky-900/10 rounded-lg" /></td>
      <td className="px-8 py-6"><div className="h-6 w-20 bg-sky-900/10 rounded-lg" /></td>
      <td className="px-8 py-6"><div className="h-4 w-24 bg-sky-900/10 rounded-full" /></td>
      <td className="px-8 py-6 text-right"><div className="h-8 w-8 bg-sky-900/10 rounded-full ml-auto" /></td>
    </tr>
  );

  return (
    <div className="relative min-h-screen bg-linear-to-br from-sky-50 to-white">
      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        {[
          { label: "Totale Clienti", val: stats.total, icon: Users, color: "text-sky-600", bg: "bg-sky-500/10" },
          { label: "Attivi Ora", val: stats.active, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "In Attesa", val: stats.pending, icon: UserMinus, color: "text-amber-600", bg: "bg-amber-500/10" }
        ].map((stat, i) => (
          <motion.div
            key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/50 flex items-center gap-5 shadow-sm"
          >
            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}><stat.icon size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-sky-900/40 uppercase tracking-widest">{stat.label}</p>
              <Counter value={isLoading ? "--" : stat.val} />
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white flex items-center justify-between shadow-sm"
        >
          <div>
            <p className="text-[10px] font-black text-sky-900/40 uppercase tracking-widest">Activity Rate</p>
            <p className="text-xs font-bold text-sky-950 mt-1">Status Attivo</p>
          </div>
          <CircularProgress percentage={isLoading ? 0 : activePercentage} />
        </motion.div>
      </div>

      {/* SEARCH BAR & EXPORT */}
      <div className="p-6 border-b border-white/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-900/40 group-focus-within:text-sky-600 transition-colors" size={20} />
          <input 
            type="text" placeholder="Cerca cliente..." value={searchTerm} disabled={isLoading}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/30 backdrop-blur-lg border border-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-sky-400/50 transition-all text-sky-950 font-medium"
          />
        </div>

        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
          onClick={exportToExcel} disabled={isLoading}
          className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
        >
          <FileSpreadsheet size={18} /> Esporta Excel
        </motion.button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-0">
          <thead>
            <tr className="bg-white/10">
              <th className="px-8 py-5 text-[10px] font-black text-sky-900/60 uppercase tracking-[0.2em]">Profilo</th>
              <th className="px-8 py-5 text-[10px] font-black text-sky-900/60 uppercase tracking-[0.2em]">Contatti</th>
              <th className="px-8 py-5 text-[10px] font-black text-sky-900/60 uppercase tracking-[0.2em]">Segmento</th>
              <th className="px-8 py-5 text-[10px] font-black text-sky-900/60 uppercase tracking-[0.2em]">Stato</th>
              <th className="px-8 py-5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/20">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : (
              filteredData.map((user) => (
                <motion.tr 
                  layoutId={`row-${user.id}`} key={user.id} onClick={() => setSelectedCustomer(user)}
                  className="group hover:bg-white/40 transition-all cursor-pointer"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${user.color} rounded-2xl flex items-center justify-center text-white font-black shadow-lg group-hover:scale-110 transition-transform`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sky-950 text-base">{user.name}</div>
                        <div className="text-xs text-sky-800/50 font-medium">ID: #00{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-medium text-sky-900/80 text-sm">{user.email}</td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/30 rounded-lg text-[10px] font-black text-sky-700 uppercase tracking-tighter">
                      <Tag size={10} /> {user.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span className="text-sm font-bold text-sky-900/70">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <MoreHorizontal size={20} className="inline text-sky-900/30 group-hover:text-sky-600 transition-colors" />
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETTAGLI SIDE-OVER */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-sky-900/20 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white/90 backdrop-blur-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[101] p-8 border-l border-white/50 overflow-y-auto"
            >
              <button onClick={() => setSelectedCustomer(null)} className="absolute top-6 right-6 p-2 hover:bg-sky-100 rounded-full text-sky-900 transition-colors"><X size={24} /></button>

              <div className="mt-12 space-y-8">
                <div className="flex flex-col items-center text-center">
                  <motion.div layoutId={`avatar-${selectedCustomer.id}`} className={`w-24 h-24 ${selectedCustomer.color} rounded-[2.5rem] flex items-center justify-center text-3xl text-white font-black mb-4 shadow-2xl`}>
                    {selectedCustomer.name.charAt(0)}
                  </motion.div>
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