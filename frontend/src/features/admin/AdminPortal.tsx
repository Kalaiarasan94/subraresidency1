import { useState } from 'react';
import { 
  Users, Hotel, Calendar, PieChart, Settings, 
  LayoutDashboard, LogOut, Menu, X, CreditCard
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { CategoryManagement } from './components/CategoryManagement';
import { BookingManagement } from './components/BookingManagement';
import { RoomCalendar } from './components/RoomCalendar';
import { AdminRoomDetailView } from './components/AdminRoomDetailView';
import { CreateRoom } from '../../pages/admin/room/CreateRoom';

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [previewRoom, setPreviewRoom] = useState<any>(null);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  const handlePreviewRoom = (room: any) => {
    setPreviewRoom(room);
    setActiveTab('rooms');
  };

  const handleEditRoomFromPreview = (room: any) => {
    setEditingRoom(room);
    setPreviewRoom(null);
  };

  const handleAddRoom = () => {
    setEditingRoom(null);
    setPreviewRoom(null);
    setShowCreateRoom(true);
    setActiveTab('rooms');
  };

  const stats = [
    { label: 'Total Bookings', value: '1,284', change: '+12%', icon: Calendar, color: 'text-emerald-600' },
    { label: 'Available Rooms', value: '42', change: '85%', icon: Hotel, color: 'text-blue-600' },
    { label: 'Today Revenue', value: '₹42,500', change: '+18%', icon: CreditCard, color: 'text-amber-600' },
    { label: 'Active Guests', value: '86', change: '+5%', icon: Users, color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-emerald-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-emerald-800">
          <div className="w-10 h-10 bg-white flex items-center justify-center text-emerald-900 font-bold text-xl rounded-lg">S</div>
          {isSidebarOpen && <span className="font-bold text-lg tracking-widest">SUBRA ADMIN</span>}
        </div>

        <nav className="flex-grow p-4 space-y-1">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'rooms', icon: Hotel, label: 'Room List' },
            { id: 'calendar', icon: Calendar, label: 'Live Calendar' },
            { id: 'bookings', icon: CreditCard, label: 'Bookings' },
            { id: 'analytics', icon: PieChart, label: 'Analytics' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setEditingRoom(null); setShowCreateRoom(false); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                activeTab === item.id 
                ? 'bg-white text-emerald-950' 
                : 'text-emerald-100 hover:bg-emerald-800'
              }`}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-800">
          <button className="flex items-center gap-3 text-emerald-300 hover:text-white transition-colors text-sm font-bold w-full p-2">
            <LogOut size={20} />
            {isSidebarOpen && <span>Logout</span>}
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
               {activeTab === 'rooms' && (editingRoom || showCreateRoom) ? 'Configure Room' : 
                activeTab === 'calendar' ? 'Live System Calendar' : activeTab}
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

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
             // ... stats code remains ...
             <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-xl bg-slate-50 ${stat.color}`}>
                          <stat.icon size={24} />
                        </div>
                        <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">{stat.change}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                      <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-4">
                 <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
                 <div className="flex justify-center gap-4">
                    <Button onClick={handleAddRoom} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-widest h-auto">
                       + Create New Room
                    </Button>
                    <Button variant="outline" className="border-slate-200 font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-widest h-auto">
                       Generate Report
                    </Button>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            editingRoom || showCreateRoom ? (
              <CreateRoom 
                initialData={editingRoom} 
                onCancel={() => { setEditingRoom(null); setShowCreateRoom(false); }}
                onSuccess={() => { setEditingRoom(null); setShowCreateRoom(false); }}
              />
            ) : previewRoom ? (
              <AdminRoomDetailView 
                room={previewRoom}
                onBack={() => setPreviewRoom(null)}
                onEdit={handleEditRoomFromPreview}
              />
            ) : (
              <CategoryManagement 
                onAddRoom={handleAddRoom} 
                onEditRoom={(room) => handlePreviewRoom(room)} 
              />
            )
          )}

          {activeTab === 'calendar' && <RoomCalendar />}
          {activeTab === 'bookings' && <BookingManagement />}
          
          {['analytics', 'settings'].includes(activeTab) && (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                <Settings className="text-emerald-600 animate-spin-slow" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Module Synchronizing</h3>
              <p className="text-slate-500 max-w-sm mx-auto font-medium">This functional module is currently being optimized for faster processing.</p>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-8 py-2 text-sm font-bold h-auto">
                Notify Primary Admin
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
