import { useState } from 'react';
import { 
  LayoutDashboard, Calendar, Search, 
  Users, CreditCard, Bell, LogOut,
  Menu, X, Smartphone, PlusCircle,
  FileText, History, Settings
} from 'lucide-react';
import { ReceptionistDashboard } from './components/ReceptionistDashboard';
import { OnlineCheckInFlow } from './components/OnlineCheckInFlow';
import { OfflineBookingFlow } from './components/OfflineBookingFlow';

const SidebarItem = ({ activeTab, id, icon: Icon, label, onClick, isSidebarOpen }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
      activeTab === id 
      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 scale-[1.02]' 
      : 'text-emerald-100 hover:bg-emerald-800'
    }`}
  >
    <Icon size={20} />
    {isSidebarOpen && <span>{label}</span>}
  </button>
);

export const ReceptionistPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-[#0b3a24] text-white transition-all duration-300 flex flex-col fixed h-full z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-emerald-900/50">
          <div className="w-10 h-10 bg-emerald-500 flex items-center justify-center text-white font-black text-xl rounded-xl shadow-lg">R</div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-widest leading-none">SUBRA RESIDENCY</span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter mt-1">Reception Desk</span>
            </div>
          )}
        </div>

        <nav className="flex-grow p-4 space-y-8 overflow-y-auto custom-scrollbar">
          <div>
            {isSidebarOpen && <p className="px-4 mb-3 text-[10px] font-black uppercase text-emerald-500/50 tracking-widest">Main Operations</p>}
            <div className="space-y-1">
              <SidebarItem id="dashboard" icon={LayoutDashboard} label="Front Desk Hub" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
              <SidebarItem id="online_checkin" icon={Smartphone} label="Online Check-in" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
              <SidebarItem id="offline_booking" icon={PlusCircle} label="New Registration" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
            </div>
          </div>

          <div>
            {isSidebarOpen && <p className="px-4 mb-3 text-[10px] font-black uppercase text-emerald-500/50 tracking-widest">Management</p>}
            <div className="space-y-1">
              <SidebarItem id="guest_database" icon={Users} label="Guest Directory" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
              <SidebarItem id="transactions" icon={CreditCard} label="Payment Records" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
              <SidebarItem id="history" icon={History} label="Stay History" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-emerald-900/50">
           <button className="flex items-center gap-3 text-emerald-300 hover:text-white transition-colors text-sm font-bold w-full p-2">
             <LogOut size={20} />
             {isSidebarOpen && <span>Sign Out</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/80">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tighter">
              {activeTab === 'dashboard' ? 'Front Desk Dashboard' : 
               activeTab === 'online_checkin' ? 'Online Check-In Processing' : 
               activeTab === 'offline_booking' ? 'Walk-In Guest Registration' : activeTab.replace('_', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group p-2 rounded-full hover:bg-slate-50 cursor-pointer transition-colors">
              <Bell size={20} className="text-slate-400 group-hover:text-emerald-600" />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
              )}
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
               <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-none">K. Ramachandran</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Shift Manager</p>
               </div>
               <div className="w-10 h-10 bg-[#0b3a24] text-white rounded-xl flex items-center justify-center font-black shadow-lg">KR</div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto pb-20">
          {activeTab === 'dashboard' && <ReceptionistDashboard onNavigate={setActiveTab} />}
          {activeTab === 'online_checkin' && <OnlineCheckInFlow />}
          {activeTab === 'offline_booking' && <OfflineBookingFlow />}
        </div>
      </main>
    </div>
  );
};
