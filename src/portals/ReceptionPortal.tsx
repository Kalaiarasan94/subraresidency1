import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  QrCode, 
  UserPlus, 
  LogOut, 
  Bell, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  DoorOpen,
  CalendarDays
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';

const KPICard = ({ title, value, icon: Icon, trend, color }: any) => (
  <Card className="border-none shadow-md overflow-hidden">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-xs font-bold text-brand-charcoal/40 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-playfair font-bold text-brand-charcoal">{value}</p>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            {trend} <span className="text-brand-charcoal/30 font-normal">than yesterday</span>
          </p>
        </div>
        <div className={`p-3 rounded-luxury ${color} text-white shadow-lg`}>
          <Icon size={24} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const RoomBoard = ({ rooms }: { rooms: any[] }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-playfair font-bold text-brand-charcoal">Room Inventory Matrix</h2>
          <p className="text-xs text-brand-charcoal/60 font-manrope uppercase tracking-wider">Live physical room occupancy status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs uppercase font-bold tracking-widest">Filter</Button>
          <Button variant="gold" size="sm" className="text-xs uppercase font-bold tracking-widest">Update All</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="hover:shadow-lg transition-shadow border-brand-sand/20 bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-playfair font-black text-brand-emerald">{room.id}</span>
                <Badge variant={room.color as any}>{room.status}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest">{room.type}</p>
                <p className="text-sm font-manrope font-semibold text-brand-charcoal truncate">
                  {room.guest !== '-' ? room.guest : 'Ready for Check-in'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const WalkInBooking = ({ onConfirm }: { onConfirm: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'Deluxe Heritage Room',
    checkIn: '',
    checkOut: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-playfair font-bold text-brand-charcoal">New Walk-in Reservation</h2>
          <p className="text-sm text-brand-charcoal/60 uppercase tracking-widest font-bold">Front-desk booking engine</p>
        </div>
      </div>
      <Card className="border-none shadow-2xl bg-white">
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40">Guest Full Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-gold" placeholder="Enter guest name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40">Mobile Number</label>
                <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="text" className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-gold" placeholder="+91 00000 00000" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40">Room Category</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none focus:ring-2 focus:ring-brand-gold">
                  <option>Deluxe Heritage Room</option>
                  <option>Executive Temple Suite</option>
                  <option>Subra Royal Family Suite</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-charcoal/40">Duration of Stay</label>
                <div className="grid grid-cols-2 gap-2">
                  <input required value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} type="date" className="bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 text-sm outline-none" />
                  <input required value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} type="date" className="bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 text-sm outline-none" />
                </div>
              </div>
            </div>
            <div className="p-6 bg-brand-emerald text-brand-cream rounded-luxury">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">Estimated Total</p>
                  <p className="text-3xl font-playfair font-bold">₹7,000.00</p>
                </div>
                <Button type="submit" variant="gold" className="font-bold px-12 h-12">Confirm & Assign Room</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export const ReceptionPortal = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [rooms, setRooms] = useState([
    { id: '101', type: 'Deluxe Heritage', status: 'Occupied', guest: 'Ramesh Kumar', color: 'destructive' },
    { id: '102', type: 'Deluxe Heritage', status: 'Available', guest: '-', color: 'success' },
    { id: '201', type: 'Executive Suite', status: 'Cleaning', guest: '-', color: 'warning' },
    { id: '202', type: 'Executive Suite', status: 'Reserved', guest: 'Anita Sharma', color: 'default' },
    { id: '301', type: 'Royal Family', status: 'Occupied', guest: 'Venkatesh Iyer', color: 'destructive' },
    { id: '302', type: 'Royal Family', status: 'Available', guest: '-', color: 'success' },
    { id: '401', type: 'Deluxe Heritage', status: 'Maintenance', guest: '-', color: 'secondary' },
    { id: '402', type: 'Deluxe Heritage', status: 'Occupied', guest: 'John Doe', color: 'destructive' },
  ]);

  const handleWalkInConfirm = (data: any) => {
    const availableRoom = rooms.find(r => r.status === 'Available' && r.type.includes(data.type.split(' ')[0]));
    if (availableRoom) {
      setRooms(rooms.map(r => r.id === availableRoom.id ? { ...r, status: 'Occupied', guest: data.name, color: 'destructive' } : r));
      alert(`Booking confirmed for ${data.name}! Room ${availableRoom.id} assigned.`);
      setActiveView('rooms');
    } else {
      alert('No available rooms in this category!');
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-sand/20 font-manrope">
      {/* Sidebar */}
      <aside className="w-72 bg-brand-emerald text-brand-cream flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-brand-cream/10">
          <div className="font-cinzel text-xl font-bold tracking-tighter flex flex-col leading-none">
            <span className="text-brand-gold">SUBRA</span>
            <span className="text-[10px] tracking-[0.3em] font-normal">RESIDENCY</span>
          </div>
          <div className="mt-2 text-[9px] uppercase tracking-widest text-brand-gold font-bold">Reception Portal</div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'checkin', label: 'QR Check-in', icon: QrCode },
            { id: 'walkin', label: 'Walk-in Booking', icon: UserPlus },
            { id: 'rooms', label: 'Room Board', icon: DoorOpen },
            { id: 'arrivals', label: 'Daily Arrivals', icon: CalendarDays },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeView === item.id 
                  ? 'bg-brand-gold text-brand-charcoal font-bold shadow-lg' 
                  : 'hover:bg-white/5 text-brand-cream/70'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start text-brand-cream/60 hover:text-brand-gold hover:bg-white/5 gap-4">
              <LogOut size={20} /> Logout
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-brand-sand/30 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-charcoal/30" size={18} />
            <input 
              type="text" 
              placeholder="Search booking ID, guest name..." 
              className="w-full bg-brand-sand/20 border-none rounded-full pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-gold"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-brand-charcoal/60 hover:text-brand-emerald transition-colors">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-gold text-brand-charcoal text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">3</span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-brand-sand/50">
              <div className="text-right">
                <p className="text-xs font-bold text-brand-charcoal leading-none">Vignesh S.</p>
                <p className="text-[10px] text-brand-charcoal/40 uppercase font-bold tracking-tighter">Front Office Lead</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center font-bold text-brand-charcoal">VS</div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8F4EB]/50">
          {activeView === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard title="Today's Arrivals" value="12" icon={CheckCircle2} trend="+4" color="bg-brand-emerald" />
                <KPICard title="Today's Departures" value="08" icon={Clock} trend="-2" color="bg-brand-gold" />
                <KPICard title="Occupied Rooms" value="24" icon={DoorOpen} trend="+1" color="bg-brand-charcoal" />
                <KPICard title="Pending Actions" value="03" icon={AlertTriangle} trend="0" color="bg-brand-emerald/40" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-xl">
                  <CardHeader>
                    <CardTitle className="font-playfair">Recent Check-ins</CardTitle>
                    <CardDescription>Real-time guest flow monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-brand-sand/10 border border-brand-sand/20 hover:border-brand-gold/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-emerald/10 flex items-center justify-center text-brand-emerald font-bold">JD</div>
                            <div>
                              <p className="font-bold text-brand-charcoal">John Doe</p>
                              <p className="text-[10px] uppercase font-bold text-brand-charcoal/40 tracking-wider">#SR-2026-9412 • Room 202</p>
                            </div>
                          </div>
                          <Badge variant="success">Completed</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-xl bg-brand-emerald text-brand-cream">
                  <CardHeader>
                    <CardTitle className="font-playfair text-brand-gold">Upcoming Events</CardTitle>
                    <CardDescription className="text-brand-cream/60 uppercase tracking-widest text-[10px] font-bold">Temple Festivals & Tourism</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-l-2 border-brand-gold pl-4 py-1">
                      <p className="font-bold text-sm">Mahamaham Rituals</p>
                      <p className="text-xs text-brand-cream/60">Starts at 04:30 AM Tomorrow</p>
                    </div>
                    <div className="border-l-2 border-brand-gold/30 pl-4 py-1">
                      <p className="font-bold text-sm">Sarangapani Car Festival</p>
                      <p className="text-xs text-brand-cream/60">Next Tuesday • Peak Demand</p>
                    </div>
                    <Button variant="gold" className="w-full mt-4 uppercase text-[10px] tracking-[0.2em]">View Event Calendar</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeView === 'rooms' && <RoomBoard rooms={rooms} />}
          {activeView === 'walkin' && <WalkInBooking onConfirm={handleWalkInConfirm} />}

          {activeView === 'checkin' && (
            <div className="max-w-2xl mx-auto space-y-8 py-12 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-playfair font-bold text-brand-charcoal">Optical Token Verification</h2>
                <p className="text-sm text-brand-charcoal/60">Scan the guest's digital booking pass to initiate automated check-in.</p>
              </div>
              
              <Card className="border-2 border-dashed border-brand-gold/40 bg-white p-12 text-center shadow-2xl">
                <div className="relative inline-block">
                  <QrCode size={120} className="text-brand-emerald mx-auto mb-6 animate-pulse" />
                  <div className="absolute inset-0 border-2 border-brand-gold/20 rounded-lg animate-ping" />
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-charcoal/40">Waiting for scanner data...</p>
                  <Button variant="gold" size="lg" className="w-full font-bold shadow-xl" onClick={() => alert('Simulated Scan: Guest John Doe Verified.')}>
                    Simulate Manual ID Scan
                  </Button>
                  <p className="text-[10px] text-brand-charcoal/30 font-manrope">Powered by SubraSecure™ Optical Logic</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

