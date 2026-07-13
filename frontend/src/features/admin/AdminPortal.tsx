import { useState } from 'react';
import { 
  Hotel, Calendar, Settings, 
  LayoutDashboard, LogOut, Menu, X, CreditCard,
  BarChart3, Layout, PieChart, Mail, Users
} from 'lucide-react';
import { CategoryManagement } from './components/CategoryManagement';
import { BookingManagement } from './components/BookingManagement';
import { RoomCalendar } from './components/RoomCalendar';
import { AdminRoomDetailView } from './components/AdminRoomDetailView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AdminSettingsView } from './components/AdminSettingsView';
import { CreateRoom } from '../../pages/admin/room/CreateRoom';

const SidebarItem = ({ activeTab, item, isSidebarOpen, onClick }: any) => {
  const isActive = activeTab === item.id;
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-500/25 scale-[1.02] translate-x-1' 
          : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-100 hover:translate-x-1'
      }`}
    >
      <item.icon 
        size={18} 
        className={`transition-colors duration-200 ${
          isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
        }`} 
      />
      {isSidebarOpen && <span>{item.label}</span>}
    </button>
  );
};

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardView, setDashboardView] = useState('overview'); // Added state for dashboard sub-tabs
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [previewRoom, setPreviewRoom] = useState<any>(null);

  const handlePreviewRoom = (room: any) => {
    setPreviewRoom(room);
    setActiveTab('rooms');
  };

  const handleAddRoom = () => {
    setPreviewRoom(null);
    setShowCreateRoom(true);
    setActiveTab('rooms');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 flex font-sans selection:bg-indigo-100 selection:text-indigo-900 admin-portal-theme">
      {/* Sidebar */}
      <aside className={`bg-[#0f172a] text-white transition-all duration-300 flex flex-col fixed h-full z-50 shadow-xl border-r border-slate-800/20 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl rounded-xl shadow-lg shadow-indigo-500/20 border border-indigo-400/20">S</div>
          {isSidebarOpen && <span className="font-extrabold text-sm tracking-[0.2em] text-slate-100 uppercase">SUBRA SYSTEM</span>}
        </div>

        <nav className="flex-grow p-4 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Section: Intelligence */}
          <div>
            {isSidebarOpen && (
              <div className="flex items-center gap-2 px-4 mb-2">
                <span className="text-[9px] font-bold uppercase text-indigo-400 tracking-widest">Intelligence</span>
                <div className="h-[1px] flex-grow bg-slate-800/40"></div>
              </div>
            )}
            <div className="space-y-1">
              {[
                { id: 'dashboard', icon: LayoutDashboard, label: 'Analytics Hub' },
                { id: 'reports', icon: BarChart3, label: 'System Reports' },
              ].map((item: any) => (
                <SidebarItem 
                   key={item.id} 
                   activeTab={activeTab} 
                   item={item} 
                   isSidebarOpen={isSidebarOpen} 
                   onClick={() => { setActiveTab(item.id); setShowCreateRoom(false); }} 
                />
              ))}
            </div>
          </div>

          {/* Section: Hospitality */}
          <div>
            {isSidebarOpen && (
              <div className="flex items-center gap-2 px-4 mb-2">
                <span className="text-[9px] font-bold uppercase text-indigo-400 tracking-widest">Hospitality</span>
                <div className="h-[1px] flex-grow bg-slate-800/40"></div>
              </div>
            )}
            <div className="space-y-1">
              {[
                { id: 'booking_mgmt', icon: Calendar, label: 'Booking Control' },
                { id: 'rooms', icon: Hotel, label: 'Room Manager' },
                { id: 'calendar', icon: Calendar, label: 'Live Inventory' },
                { id: 'bookings', icon: CreditCard, label: 'Transactions' },
              ].map((item: any) => (
                <SidebarItem 
                   key={item.id} 
                   activeTab={activeTab} 
                   item={item} 
                   isSidebarOpen={isSidebarOpen} 
                   onClick={() => { setActiveTab(item.id); setShowCreateRoom(false); }} 
                />
              ))}
            </div>
          </div>

          {/* Section: System */}
          <div>
            {isSidebarOpen && (
              <div className="flex items-center gap-2 px-4 mb-2">
                <span className="text-[9px] font-bold uppercase text-indigo-400 tracking-widest">Configuration</span>
                <div className="h-[1px] flex-grow bg-slate-800/40"></div>
              </div>
            )}
            <div className="space-y-1">
              {[
                { id: 'website', icon: Layout, label: 'Website Settings' },
              ].map((item: any) => (
                <SidebarItem 
                   key={item.id} 
                   activeTab={activeTab} 
                   item={item} 
                   isSidebarOpen={isSidebarOpen} 
                   onClick={() => { setActiveTab(item.id); setShowCreateRoom(false); }} 
                />
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm font-bold w-full p-2 hover:bg-slate-800/30 rounded-xl">
            <LogOut size={20} className="text-slate-400" />
            {isSidebarOpen && <span>Exit Portal</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/50 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2.5 bg-slate-100/60 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-indigo-600 transition-all border border-slate-200/40"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-[0.15em]">
               {activeTab === 'rooms' && showCreateRoom ? 'Configure Room' : 
                activeTab === 'calendar' ? 'Inventory Calendar' : 
                activeTab === 'dashboard' ? 'Business Intelligence' : 
                activeTab === 'reports' ? 'Operational Reports' :
                activeTab === 'booking_mgmt' ? 'Booking & Room Control' :
                activeTab === 'bookings' ? 'Financial Hub' :
                activeTab === 'website' ? 'Interface Management' :
                activeTab === 'settings' ? 'System Configuration' : activeTab}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-l pl-6 border-slate-200/60">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900 leading-tight">System Admin</p>
                <p className="text-[9px] text-indigo-600 font-extrabold uppercase tracking-widest mt-1">Active Session</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl flex items-center justify-center font-extrabold text-xs shadow-md shadow-indigo-500/20 border border-indigo-400/20">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto pb-20">
          {activeTab === 'dashboard' && <AdminDashboardView activeSubTab={dashboardView} onNavigate={setActiveTab} />}
          
          {activeTab === 'reports' && <AdminDashboardView activeSubTab="finance" onNavigate={setActiveTab} />}
          {activeTab === 'booking_mgmt' && <AdminDashboardView activeSubTab="rooms" onNavigate={setActiveTab} />}
          {activeTab === 'bookings' && <AdminDashboardView activeSubTab="finance" onNavigate={setActiveTab} />}
          {activeTab === 'website' && <AdminSettingsView />}

          {activeTab === 'rooms' && (
            showCreateRoom ? (
              <CreateRoom 
                onCancel={() => { setShowCreateRoom(false); }}
                onSuccess={() => { setShowCreateRoom(false); }}
              />
            ) : previewRoom ? (
              <AdminRoomDetailView 
                room={previewRoom}
                onBack={() => setPreviewRoom(null)}
                onRefresh={() => {
                  setPreviewRoom(null);
                }}
              />
            ) : (
              <CategoryManagement 
                onAddRoom={handleAddRoom} 
                onEditRoom={(room) => handlePreviewRoom(room)} 
              />
            )
          )}

          {activeTab === 'calendar' && <RoomCalendar />}
          {activeTab === 'settings' && <AdminSettingsView />}
          {activeTab === 'bookings' && <BookingManagement />}
        </div>
      </main>
    </div>
  );
};
