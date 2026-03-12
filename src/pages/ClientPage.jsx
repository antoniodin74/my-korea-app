import { useNavigate } from 'react-router-dom';
import CustomerTable from "./CustomerTable";
import PageContainer from './PageContainer';
// import SalesChart from "./SalesChart";
// import StatCards from "./StatCards";

export default function ClientPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Clienti</h1>
          <p className="text-gray-500">Monitoraggio e gestione della tua rete commerciale.</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
        >
          ← Torna alle Card
        </button>
      </header>
      
      {/* <StatCards /> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <CustomerTable />
        </div>
        {/* <div className="lg:col-span-1">
          <SalesChart />
        </div> */}
      </div>
    </PageContainer>
  );
}