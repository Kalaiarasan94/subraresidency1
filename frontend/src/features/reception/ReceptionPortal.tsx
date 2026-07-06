import { useState, useEffect } from 'react';
import { ReceptionistLogin } from './ReceptionistLogin';
import { 
  LayoutDashboard,
  Users, CreditCard, Bell, LogOut,
  Menu, X, Smartphone, PlusCircle,
  History, CheckCircle
} from 'lucide-react';
import { ReceptionistDashboard } from './components/ReceptionistDashboard';
import { OnlineCheckInFlow } from './components/OnlineCheckInFlow';
import { OfflineBookingFlow } from './components/OfflineBookingFlow';
import { GuestDirectory } from './components/GuestDirectory';
import { Settlements } from './components/Settlements';
import { StayLogs } from './components/StayLogs';

const SidebarItem = ({ activeTab, id, icon: Icon, label, onClick, isSidebarOpen }: any) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-black transition-all ${
      activeTab === id 
      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40 scale-[1.02]' 
      : 'text-emerald-100/60 hover:bg-emerald-800 hover:text-white'
    }`}
  >
    <Icon size={20} className={activeTab === id ? 'text-white' : 'text-emerald-500'} />
    {isSidebarOpen && <span className="uppercase tracking-widest text-[10px]">{label}</span>}
  </button>
);

export const ReceptionPortal = () => {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Polling for notifications (QR Scans)
  useEffect(() => {
    if (!user) return;
    
    const fetchNotifs = async () => {
      try {
        const resp = await fetch('http://localhost:8001/api/index.php/receptionist/notifications');
        const data = await resp.json();
        if (data.status === 'success') {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error("Notif fetch error", err);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 5000);
    return () => clearInterval(interval);
  }, [user]);

  const markRead = async () => {
     try {
       await fetch('http://localhost:8001/api/index.php/receptionist/markRead', { method: 'POST' });
       setNotifications([]);
     } catch (err) {}
  };

  if (!user) {
    return <ReceptionistLogin onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sidebar */}
      <aside className={`bg-[#061c12] text-white transition-all duration-500 ease-in-out flex flex-col fixed h-full z-50 shadow-[20px_0_60px_-15px_rgba(0,0,0,0.3)] ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black text-xl rounded-2xl shadow-lg ring-4 ring-emerald-500/10">R</div>
          {isSidebarOpen && (
            <div className="flex flex-col">
              <span className="font-black text-xs tracking-[0.2em] leading-none text-white">SUBRA RESIDENCY</span>
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1.5 opacity-80">Terminal 0.1</span>
            </div>
          )}
        </div>

        <nav className="flex-grow p-6 space-y-10 overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {isSidebarOpen && <p className="px-4 text-[9px] font-black uppercase text-white/20 tracking-[0.3em]">Operational</p>}
            <div className="space-y-2">
              <SidebarItem id="dashboard" icon={LayoutDashboard} label="Front Desk Hub" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
              <SidebarItem id="online_checkin" icon={Smartphone} label="Online Check-in" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
              <SidebarItem id="offline_booking" icon={PlusCircle} label="New Folio" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
            </div>
          </div>

          <div className="space-y-4">
            {isSidebarOpen && <p className="px-4 text-[9px] font-black uppercase text-white/20 tracking-[0.3em]">Management</p>}
            <div className="space-y-2">
              <SidebarItem id="guests" icon={Users} label="Guest Directory" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
              <SidebarItem id="transactions" icon={CreditCard} label="Settlements" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
              <SidebarItem id="history" icon={History} label="Stay Logs" activeTab={activeTab} onClick={setActiveTab} isSidebarOpen={isSidebarOpen} />
            </div>
          </div>
        </nav>

        <div className="p-6 border-t border-white/5">
           <button onClick={() => setUser(null)} className="flex items-center gap-4 text-rose-400/60 hover:text-rose-400 transition-all text-[10px] font-black uppercase tracking-[0.2em] w-full p-4 rounded-xl hover:bg-rose-500/5 group">
             <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
             {isSidebarOpen && <span>Close Session</span>}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-500 ease-in-out ${isSidebarOpen ? 'ml-72' : 'ml-24'}`}>
        <header className="h-24 bg-white/80 border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-40 backdrop-blur-2xl">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 hover:text-emerald-600 transition-all border border-slate-100">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex flex-col">
               <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                 {activeTab === 'dashboard'       ? 'Office Overlook'       :
                  activeTab === 'online_checkin'  ? 'Check-in Processor'    :
                  activeTab === 'offline_booking' ? 'Walk-in Registration'  :
                  activeTab === 'guests'          ? 'Guest Directory'       :
                  activeTab === 'transactions'    ? 'Financial Settlements' :
                  activeTab === 'history'         ? 'Stay Logs'             : activeTab}
               </h2>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                 Terminal Alpha-1 <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span> Online
               </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative group">
              <button onClick={markRead} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100 relative overflow-hidden group">
                <Bell size={20} className="text-slate-400 group-hover:text-emerald-600 group-hover:rotate-12 transition-all" />
                {notifications.length > 0 && (
                  <>
                     <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full ring-4 ring-white animate-bounce"></span>
                     <div className="absolute top-0 right-0 p-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                     </div>
                  </>
                )}
              </button>
              
              {/* Notification Dropdown (Mini) */}
              {notifications.length > 0 && (
                <div className="absolute right-0 mt-4 w-80 bg-[#061c12] rounded-[2rem] shadow-2xl p-6 border border-white/10 animate-in fade-in slide-in-from-top-4 duration-500 z-50">
                   <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Urgent Operations</p>
                   <div className="space-y-3">
                      {notifications.map((n, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                           <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                 {n.type === 'QR_SCAN' ? <Smartphone size={16} /> : <CheckCircle size={16} />}
                              </div>
                              <div className="space-y-1">
                                 <p className="text-[10px] font-bold text-white/90 leading-tight">{n.message}</p>
                                 <p className="text-[9px] text-emerald-500/50 font-black uppercase">{n.created_at}</p>
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-5 pl-8 border-l border-slate-100">
               <div className="text-right">
                  <p className="text-sm font-black text-slate-900 leading-tight">{user.full_name}</p>
                  <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-1">Duty Officer</p>
               </div>
               <div className="w-14 h-14 bg-gradient-to-br from-[#061c12] to-[#04110b] text-white rounded-[1.25rem] flex items-center justify-center font-black text-lg border-2 border-slate-50 shadow-xl">
                 {user.username.slice(0,2).toUpperCase()}
               </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto pb-32">
          {activeTab === 'dashboard'      && <ReceptionistDashboard />}
          {activeTab === 'online_checkin' && <OnlineCheckInFlow />}
          {activeTab === 'offline_booking' && <OfflineBookingFlow />}
          {activeTab === 'guests'          && <GuestDirectory />}
          {activeTab === 'transactions'    && <Settlements />}
          {activeTab === 'history'         && <StayLogs />}
        </div>
      </main>
    </div>
  );
};
