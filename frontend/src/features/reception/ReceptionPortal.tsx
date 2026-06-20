import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  QrCode, 
  PlusCircle, 
  LogOut, 
  LayoutDashboard, 
  BedDouble, 
  ClipboardList, 
  Clock,
  AlertCircle,
  Bell,
  Menu,
  X,
  UserCheck,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { ReceptionDashboard } from './components/ReceptionDashboard';
import { OnlineBookings } from './components/OnlineBookings';
import { OfflineBookings } from './components/OfflineBookings';
import { RoomManagement } from '../admin/components/RoomManagement';

export const ReceptionPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const stats = [
    { label: "Today's Arrivals", value: '12', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Today's Departures", value: '08', icon: ClipboardList, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Available Rooms', value: '35', icon: BedDouble, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Occupied Rooms', value: '47', icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Currently Checked-in', value: '15', icon: UserCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="min-h-screen bg-brand-cream/30 flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center gap-3 border-b border-slate-100 bg-catalogue-green text-white">
          <div className="w-10 h-10 bg-white flex items-center justify-center text-catalogue-green font-playfair font-bold text-xl">R</div>
          {isSidebarOpen && <span className="font-playfair font-bold text-white text-lg tracking-tight uppercase">RECEPTION</span>}
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <NavItem active={activeTab === 'dashboard'} icon={LayoutDashboard} label="Dashboard" hideLabel={!isSidebarOpen} onClick={() => setActiveTab('dashboard')} />
          <NavItem active={activeTab === 'online'} icon={ClipboardList} label="Online Bookings" hideLabel={!isSidebarOpen} onClick={() => setActiveTab('online')} />
          <NavItem active={activeTab === 'offline'} icon={PlusCircle} label="Offline Booking" hideLabel={!isSidebarOpen} onClick={() => setActiveTab('offline')} />
          <NavItem active={activeTab === 'rooms'} icon={BedDouble} label="Room Management" hideLabel={!isSidebarOpen} onClick={() => setActiveTab('rooms')} />
          <NavItem active={activeTab === 'guests'} icon={Users} label="Guest Database" hideLabel={!isSidebarOpen} onClick={() => setActiveTab('guests')} />
          <NavItem active={activeTab === 'reports'} icon={FileText} label="Reports" hideLabel={!isSidebarOpen} onClick={() => setActiveTab('reports')} />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="flex items-center gap-3 w-full p-3 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-md text-slate-500">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
              <Clock size={12} />
              <span>Shift: Morning (07:00 - 15:00)</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-4 border-r border-slate-200">
              <button className="flex items-center gap-2 bg-catalogue-gold text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-catalogue-gold/90 transition-all rounded-sm shadow-sm group">
                <QrCode size={16} className="group-hover:scale-110 transition-transform" />
                <span>Quick Search</span>
              </button>
              <button className="p-2 relative text-slate-500 hover:bg-slate-50 rounded-full">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Reception Office</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-catalogue-gold">Active Session</p>
              </div>
              <div className="w-10 h-10 bg-catalogue-green/10 flex items-center justify-center text-catalogue-green rounded-full border border-catalogue-green/20">
                <Users size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 pb-20">
          {activeTab === 'dashboard' && (
            <ReceptionDashboard 
              stats={stats} 
              ArrowRight={ArrowRight} 
              QuickActionButton={QuickActionButton} 
            />
          )}

          {activeTab === 'online' && <OnlineBookings />}
          {activeTab === 'offline' && <OfflineBookings />}
          {activeTab === 'rooms' && <RoomManagement />}

          {['dashboard', 'online', 'offline', 'rooms'].indexOf(activeTab) === -1 && (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4">
              <div className="p-6 bg-brand-cream/10 rounded-xl text-catalogue-gold">
                <AlertCircle size={48} />
              </div>
              <h2 className="text-2xl font-playfair font-bold text-catalogue-green uppercase">Reception Module Loading</h2>
              <p className="text-slate-500 max-w-md">The {activeTab} section is currently being synchronized with the master database. Please check the Dashboard for real-time arrivals.</p>
              <Button onClick={() => setActiveTab('dashboard')} className="bg-catalogue-green text-white px-8 rounded-none font-bold uppercase text-xs tracking-widest">Return to Dashboard</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const QuickActionButton = ({ icon: Icon, label }: any) => (
  <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white/10 hover:bg-white/20 transition-all border border-white/10 group">
    <Icon size={24} className="text-catalogue-gold group-hover:scale-110 transition-transform" />
    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{label}</span>
  </button>
);

const NavItem = ({ active, icon: Icon, label, hideLabel, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-3 transition-all duration-200 border-l-4 ${
      active 
        ? 'bg-catalogue-green/5 text-catalogue-green border-catalogue-green' 
        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600 border-transparent'
    }`}
  >
    <Icon size={20} />
    {!hideLabel && <span className="font-bold text-[10px] uppercase tracking-widest">{label}</span>}
  </button>
);

const ArrowRight = ({ size, className }: any) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
