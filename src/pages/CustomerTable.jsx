import { useState } from 'react';
import { MoreHorizontal, MapPin, Search, Filter, X } from 'lucide-react';

const CUSTOMERS = [
  { id: 1, name: "Min-jun Kim", email: "mj.kim@tech-korea.com", status: "Attivo", phone: "+82 10-1234-5678", location: "Seoul", type: "Premium" },
  { id: 2, name: "Sofia Rossi", email: "s.rossi@nexa.it", status: "Inattivo", phone: "+39 340 123 4567", location: "Milano", type: "Standard" },
  { id: 3, name: "Ji-hye Park", email: "ji.park@design.kr", status: "Attivo", phone: "+82 10-9876-5432", location: "Busan", type: "Premium" },
  { id: 4, name: "Luca Bianchi", email: "l.bianchi@fiat.it", status: "Attivo", phone: "+39 02 998877", location: "Torino", type: "Standard" },
];

export default function CustomerTable() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = CUSTOMERS.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Barra di Ricerca */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Cerca per nome o città..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-10 py-3 bg-white/60 backdrop-blur-md border border-white rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:bg-white outline-none transition-all text-sm font-medium"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white/60 backdrop-blur-md border border-white rounded-2xl text-sm font-semibold text-gray-600 hover:bg-white transition-all shadow-sm">
            <Filter size={16} /> Filtri
          </button>
          <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all shadow-lg shadow-blue-200 active:scale-95">
            + Nuovo
          </button>
        </div>
      </div>

      {/* Tabella Dati */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30">
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Cliente</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Contatti</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Stato</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-linear-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center font-bold text-blue-400 border-2 border-white shadow-sm">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[15px] font-bold text-gray-900">{customer.name}</div>
                          <div className="flex items-center gap-1 text-xs text-gray-400 font-medium uppercase tracking-tight">
                            <MapPin size={12} /> {customer.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium text-sm text-gray-600">
                      <div className="flex flex-col gap-0.5">
                        <span>{customer.email}</span>
                        <span className="text-gray-400 text-xs">{customer.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        customer.status === "Attivo" ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${customer.status === "Attivo" ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100">
                        <MoreHorizontal className="text-gray-400" size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Search size={40} className="mx-auto text-gray-200 mb-2" />
                    <p className="text-gray-400 font-medium">Nessun cliente trovato</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}