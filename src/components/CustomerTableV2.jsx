import { useState, useEffect } from 'react';
import { 
  MoreHorizontal, Tag, Search, 
  FileSpreadsheet, Users, UserCheck, UserMinus 
} from 'lucide-react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';

const DATA = [
  { id: 1, name: "Min-jun Kim", email: "mj.kim@tech.kr", status: "Active", phone: "+82 10 1234", type: "Enterprise", color: "bg-blue-400", location: "Seoul", joinDate: "12 Gen 2024" },
  { id: 2, name: "Sofia Rossi", email: "s.rossi@nexa.it", status: "Pending", phone: "+39 340 5566", type: "Startup", color: "bg-amber-400", location: "Milano", joinDate: "05 Feb 2024" },
  { id: 3, name: "Ji-hye Park", email: "ji.park@art.kr", status: "Active", phone: "+82 10 9988", type: "Partner", color: "bg-purple-400", location: "Busan", joinDate: "20 Nov 2023" },
  { id: 4, name: "Luca Bianchi", email: "l.b@agency.it", status: "Offline", phone: "+39 02 1122", type: "Standard", color: "bg-slate-400", location: "Torino", joinDate: "15 Mar 2024" },
];

const floatingVariants = {
  animate: (i = 0) => ({
    y: [0, -10, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: i * 0.2,
    }
  })
};

const Counter = ({ value }) => (
  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={value} className="text-2xl font-black text-sky-950">
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
        <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-sky-100/50" />
        <motion.circle
          cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
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

export default function CustomerTableV2({ onSelectCustomer, selectedId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  const exportToExcel = (e) => {
    e.stopPropagation();
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
    <tr>
      <td className="px-8 py-6"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-sky-900/10 rounded-2xl animate-pulse" /><div className="h-4 w-32 bg-sky-900/15 rounded animate-pulse" /></div></td>
      <td className="px-8 py-6"><div className="h-4 w-40 bg-sky-900/10 rounded-lg animate-pulse" /></td>
      <td className="px-8 py-6"><div className="h-6 w-20 bg-sky-900/10 rounded-lg animate-pulse" /></td>
      <td className="px-8 py-6"><div className="h-4 w-24 bg-sky-900/10 rounded-full animate-pulse" /></td>
      <td className="px-8 py-6 text-right"><div className="h-8 w-8 bg-sky-900/10 rounded-full ml-auto animate-pulse" /></td>
    </tr>
  );

  return (
    <div className="relative w-full">
      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
        {[
          { label: "Totale Clienti", val: stats.total, icon: Users, color: "text-sky-600", bg: "bg-sky-500/10" },
          { label: "Attivi Ora", val: stats.active, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "In Attesa", val: stats.pending, icon: UserMinus, color: "text-amber-600", bg: "bg-amber-500/10" }
        ].map((stat, i) => (
          <motion.div key={i} variants={floatingVariants} animate="animate" custom={i} className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white flex items-center gap-5 shadow-sm">
            <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}><stat.icon size={24} /></div>
            <div>
              <p className="text-[10px] font-black text-sky-900/40 uppercase tracking-widest">{stat.label}</p>
              <Counter value={isLoading ? "--" : stat.val} />
            </div>
          </motion.div>
        ))}
        <motion.div variants={floatingVariants} animate="animate" custom={3} className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-black text-sky-900/40 uppercase tracking-widest">Activity Rate</p>
            <p className="text-xs font-bold text-sky-950 mt-1">Status Attivo</p>
          </div>
          <CircularProgress percentage={isLoading ? 0 : activePercentage} />
        </motion.div>
      </div>

      {/* SEARCH BAR & EXPORT */}
      <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
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
      <div className="overflow-x-auto px-4 pb-10">
        <table className="w-full text-left border-separate border-spacing-y-4">
          <thead>
            <tr>
              <th className="px-8 py-2 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Profilo</th>
              <th className="px-8 py-2 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Contatti</th>
              <th className="px-8 py-2 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Segmento</th>
              <th className="px-8 py-2 text-[10px] font-black text-sky-900/40 uppercase tracking-[0.2em]">Stato</th>
              <th className="px-8 py-2 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
            ) : (
              filteredData.map((user, i) => (
                <motion.tr 
                  key={user.id} variants={floatingVariants} animate="animate" custom={i}
                  whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.6)" }}
                  onClick={() => onSelectCustomer(user)}
                  className={`group bg-white/40 backdrop-blur-md border shadow-sm cursor-pointer transition-all ${selectedId === user.id ? 'ring-2 ring-sky-500/50 border-sky-500/50 bg-white/80' : 'border-white'}`}
                >
                  <td className="px-8 py-5 first:rounded-l-4xl">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${user.color} rounded-2xl flex items-center justify-center text-white font-black shadow-lg group-hover:rotate-6 transition-transform`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sky-950 text-base">{user.name}</div>
                        <div className="text-xs text-sky-800/50 font-medium">ID: #00{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-medium text-sky-900/80 text-sm">
                    <div className="flex flex-col">
                       <span>{user.email}</span>
                       <span className="text-[10px] text-sky-900/40">{user.phone}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-sky-500/10 rounded-lg text-[10px] font-black text-sky-700 uppercase tracking-tighter">
                      <Tag size={10} /> {user.type}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full animate-pulse ${user.status === 'Active' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span className="text-sm font-bold text-sky-900/70">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right last:rounded-r-4xl">
                    <MoreHorizontal size={20} className="inline text-sky-900/20 group-hover:text-sky-600 transition-colors" />
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}