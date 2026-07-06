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

const SidebarItem = ({ activeTab, item, isSidebarOpen, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
      activeTab === item.id 
      ? 'bg-white text-emerald-950 shadow-lg shadow-black/20 scale-[1.02]' 
      : 'text-emerald-100 hover:bg-emerald-800'
    }`}
  >
    <item.icon size={20} />
    {isSidebarOpen && <span>{item.label}</span>}
  </button>
);

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
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-emerald-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-emerald-800">
          <div className="w-10 h-10 bg-white flex items-center justify-center text-emerald-900 font-bold text-xl rounded-lg">S</div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-widest">SUBRA ADMIN</span>}
        </div>

        <nav className="flex-grow p-4 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Section: Intelligence */}
          <div>
            {isSidebarOpen && <p className="px-4 mb-2 text-[10px] font-black uppercase text-emerald-500 tracking-widest">Intelligence</p>}
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

          {/* Section: Management */}
          <div>
            {isSidebarOpen && <p className="px-4 mb-2 text-[10px] font-black uppercase text-emerald-500 tracking-widest">Hospitality</p>}
            <div className="space-y-1">
              {[
                { id: 'booking_mgmt', icon: Calendar, label: 'Booking Management' },
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
            {isSidebarOpen && <p className="px-4 mb-2 text-[10px] font-black uppercase text-emerald-500 tracking-widest">Configuration</p>}
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

        <div className="p-4 border-t border-emerald-800">
          <button className="flex items-center gap-3 text-emerald-300 hover:text-white transition-colors text-sm font-bold w-full p-2">
            <LogOut size={20} />
            {isSidebarOpen && <span>Exit Portal</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-grow transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">
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
            <div className="flex items-center gap-4 border-l pl-6 border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Administrator</p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Active Session</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto pb-20">
          {activeTab === 'dashboard' && <AdminDashboardView activeSubTab={dashboardView} />}
          
          {activeTab === 'reports' && <AdminDashboardView activeSubTab="finance" />}
          {activeTab === 'booking_mgmt' && <AdminDashboardView activeSubTab="rooms" />}
          {activeTab === 'bookings' && <AdminDashboardView activeSubTab="finance" />}
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
