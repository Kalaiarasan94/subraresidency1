import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  BedDouble, 
  Settings, 
  TrendingUp, 
  FileText, 
  CreditCard, 
  Monitor,
  Menu,
  ChevronDown,
  Globe,
  PieChart as PieChartIcon,
  X,
  Plus,
  Save,
  Search,
  Check
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Mon', revenue: 45000, occupancy: 65 },
  { name: 'Tue', revenue: 52000, occupancy: 72 },
  { name: 'Wed', revenue: 48000, occupancy: 68 },
  { name: 'Thu', revenue: 61000, occupancy: 85 },
  { name: 'Fri', revenue: 85000, occupancy: 95 },
  { name: 'Sat', revenue: 98000, occupancy: 98 },
  { name: 'Sun', revenue: 75000, occupancy: 82 },
];

const pieData = [
  { name: 'Direct', value: 45, color: '#0B4D46' },
  { name: 'OTA (Booking.com)', value: 30, color: '#C89B3C' },
  { name: 'Corporate', value: 15, color: '#1C1C1C' },
  { name: 'Others', value: 10, color: '#EDE4D3' },
];

const billingData = [
  { id: 'INV-2024-001', guest: 'Rahul Sharma', amount: '₹12,450', date: '2024-06-10', status: 'Paid', method: 'UPI' },
  { id: 'INV-2024-002', guest: 'Priya Patel', amount: '₹8,900', date: '2024-06-11', status: 'Pending', method: 'Credit Card' },
  { id: 'INV-2024-003', guest: 'Amit Kumar', amount: '₹22,100', date: '2024-06-11', status: 'Paid', method: 'Cash' },
  { id: 'INV-2024-004', guest: 'Sneha Gupta', amount: '₹15,600', date: '2024-06-12', status: 'Refunded', method: 'Bank Transfer' },
];

const AdminStat = ({ title, value, change, icon: Icon }: any) => (
  <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-xs font-bold text-brand-charcoal/40 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-manrope font-extrabold text-brand-charcoal">{value}</p>
          <p className={`text-[10px] font-bold ${change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
            {change} <span className="text-brand-charcoal/30 font-normal">vs last month</span>
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-brand-sand/30 flex items-center justify-center text-brand-emerald">
          <Icon size={24} />
        </div>
      </div>
    </CardContent>
  </Card>
);

const RoomManagementTable = ({ rooms, onAdd, onEdit }: { rooms: any[], onAdd: () => void, onEdit: (room: any) => void }) => {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-white">
      <CardHeader className="border-b border-brand-sand/30 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="font-playfair">Global Room Inventory</CardTitle>
          <CardDescription>Manage property units, pricing, and availability states</CardDescription>
        </div>
        <Button variant="gold" size="sm" className="font-bold gap-2" onClick={onAdd}>
          <Plus size={16} /> Add New Room
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-brand-sand/20 border-b border-brand-sand/30">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Photo</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Room ID</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Category</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Floor</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Base Price</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-sand/30">
            {rooms.map((row) => (
              <tr key={row.id} className="hover:bg-brand-sand/10 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-brand-sand/30 bg-brand-sand/10">
                    {row.image ? (
                      <img src={row.image} alt={row.id} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-charcoal/20">
                        <BedDouble size={20} />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-brand-emerald">{row.id}</td>
                <td className="px-6 py-4 text-sm font-semibold">{row.type}</td>
                <td className="px-6 py-4 text-sm text-brand-charcoal/60">{row.floor}</td>
                <td className="px-6 py-4 text-sm font-bold text-brand-gold">{row.price}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter ${
                    row.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                    row.status === 'Occupied' ? 'bg-blue-100 text-blue-800' :
                    row.status === 'Reserved' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" className="text-brand-emerald font-bold text-[10px] uppercase" onClick={() => onEdit(row)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
};

export const AdminPortal = () => {
  const [activeTab, setActiveTab] = React.useState('analytics');
  const [rooms, setRooms] = useState([
    { id: '101', type: 'Deluxe Heritage', status: 'Available', price: '₹3,500', floor: '1st Floor', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80' },
    { id: '201', type: 'Executive Suite', status: 'Occupied', price: '₹5,500', floor: '2nd Floor', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80' },
    { id: '301', type: 'Royal Family', status: 'Reserved', price: '₹9,000', floor: '3rd Floor', image: 'https://images.unsplash.com/photo-1591088398332-8a7761a9e044?auto=format&fit=crop&w=800&q=80' },
    { id: '401', type: 'Deluxe Heritage', status: 'Maintenance', price: '₹3,500', floor: '4th Floor', image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleAddRoom = () => {
    setEditingRoom(null);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: any) => {
    setEditingRoom(room);
    setPreviewImage(room.image || null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const roomData = {
      id: formData.get('id') as string,
      type: formData.get('type') as string,
      status: formData.get('status') as string,
      price: formData.get('price') as string,
      floor: formData.get('floor') as string,
      image: previewImage || (formData.get('image') as string),
    };

    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? roomData : r));
    } else {
      setRooms([...rooms, roomData]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-[#FDFBF7] font-manrope overflow-hidden relative">
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-luxury shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-2xl font-bold text-brand-charcoal">{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-brand-charcoal/40" /></button>
            </div>
            <form onSubmit={handleSaveRoom} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Room ID</label>
                <input name="id" defaultValue={editingRoom?.id} required className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" placeholder="e.g. 501" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Category</label>
                <select name="type" defaultValue={editingRoom?.type || 'Deluxe Heritage'} className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none">
                  <option>Deluxe Heritage</option>
                  <option>Executive Suite</option>
                  <option>Royal Family</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Room Photo</label>
                <div className="flex flex-col gap-3">
                  {previewImage && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-brand-sand/30">
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-brand-charcoal hover:bg-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Button type="button" variant="outline" className="w-full border-dashed border-2 border-brand-sand/50 h-12 text-brand-charcoal/40 font-bold">
                        <Plus size={16} className="mr-2" /> Upload Photo
                      </Button>
                    </div>
                    <div className="flex-1">
                      <input name="image" defaultValue={editingRoom?.image} className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none h-12 text-sm" placeholder="Or paste URL..." />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Floor</label>
                  <input name="floor" defaultValue={editingRoom?.floor} required className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" placeholder="e.g. 5th Floor" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Price</label>
                  <input name="price" defaultValue={editingRoom?.price} required className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" placeholder="₹4,000" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Status</label>
                <select name="status" defaultValue={editingRoom?.status || 'Available'} className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none">
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Reserved</option>
                  <option>Maintenance</option>
                </select>
              </div>
              <Button type="submit" variant="gold" className="w-full h-12 font-bold uppercase tracking-widest text-xs mt-4">
                {editingRoom ? 'Update Room' : 'Save Room'}
              </Button>
            </form>
          </div>
        </div>
      )}
      {/* Mini Sidebar */}
      <aside className="w-20 bg-brand-charcoal flex flex-col items-center py-8 gap-8 border-r border-white/5 shrink-0">
        <div className="w-10 h-10 bg-brand-gold rounded-lg flex items-center justify-center font-cinzel font-black text-brand-charcoal text-xl shadow-lg shadow-brand-gold/20">
          S
        </div>
        <nav className="flex flex-col gap-6">
          {[
            { id: 'analytics', icon: BarChart3 },
            { id: 'guests', icon: Users },
            { id: 'rooms', icon: BedDouble },
            { id: 'billing', icon: CreditCard },
            { id: 'settings', icon: Settings }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`p-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-brand-emerald text-brand-cream' : 'text-brand-cream/30 hover:text-brand-cream hover:bg-white/5'}`}
            >
              <item.icon size={20} />
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-brand-sand/50 bg-white flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="font-playfair text-xl font-bold text-brand-charcoal uppercase tracking-widest">
              {activeTab} Portal
            </h1>
            <Badge variant="outline" className="text-[10px] border-brand-gold/30 text-brand-gold bg-brand-gold/5">PROPERTY ID: KUM-01</Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-xs font-bold">
                <Globe size={14} /> View Website
              </Button>
            </Link>
            <div className="h-4 w-px bg-brand-sand/50 mx-2" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-emerald text-brand-cream flex items-center justify-center font-bold text-xs">AD</div>
              <ChevronDown size={14} className="text-brand-charcoal/40" />
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-brand-sand/10">
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1">Fiscal Performance</p>
                  <h2 className="text-3xl font-playfair font-bold text-brand-charcoal">Property Analytics</h2>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="font-bold text-xs h-9">Export Report</Button>
                  <Button variant="primary" size="sm" className="font-bold text-xs h-9 bg-brand-emerald">Real-time Sync</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStat title="Total Revenue" value="₹12.84L" change="+12.5%" icon={TrendingUp} />
                <AdminStat title="Total Bookings" value="142" change="+8.2%" icon={FileText} />
                <AdminStat title="Avg. Occupancy" value="78.4%" change="+4.1%" icon={BedDouble} />
                <AdminStat title="Active Guests" value="38" change="-2.4%" icon={Users} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-sm bg-white">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="font-playfair">Revenue Trends</CardTitle>
                      <CardDescription>Fiscal yield monitoring across last 7 days</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="h-80 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0B4D46" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#0B4D46" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE4D3" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#1C1C1C', opacity: 0.5 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#1C1C1C', opacity: 0.5 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1C1C1C', border: 'none', borderRadius: '8px', color: '#F8F4EB' }}
                          itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#0B4D46" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm bg-white">
                  <CardHeader>
                    <CardTitle className="font-playfair">Booking Sources</CardTitle>
                    <CardDescription>Channel performance distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64 flex flex-col justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {pieData.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-[10px] font-bold text-brand-charcoal/60 uppercase">{item.name}</span>
                          <span className="text-[10px] font-black text-brand-charcoal ml-auto">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1">Infrastructure Control</p>
                  <h2 className="text-3xl font-playfair font-bold text-brand-charcoal">Room Inventory</h2>
                </div>
              </div>
              <RoomManagementTable rooms={rooms} onAdd={handleAddRoom} onEdit={handleEditRoom} />
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1">Financial Operations</p>
                  <h2 className="text-3xl font-playfair font-bold text-brand-charcoal">Billing & Invoices</h2>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="font-bold text-xs h-9">Download All</Button>
                  <Button variant="gold" size="sm" className="font-bold text-xs h-9">Create Invoice</Button>
                </div>
              </div>

              <Card className="border-none shadow-sm overflow-hidden bg-white">
                <CardContent className="p-0">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-sand/20 border-b border-brand-sand/30">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Invoice ID</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Guest</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Amount</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Date</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Method</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-sand/30">
                      {billingData.map((row) => (
                        <tr key={row.id} className="hover:bg-brand-sand/10 transition-colors">
                          <td className="px-6 py-4 font-bold text-brand-emerald">{row.id}</td>
                          <td className="px-6 py-4 text-sm font-semibold">{row.guest}</td>
                          <td className="px-6 py-4 text-sm font-bold text-brand-gold">{row.amount}</td>
                          <td className="px-6 py-4 text-sm text-brand-charcoal/60">{row.date}</td>
                          <td className="px-6 py-4 text-sm text-brand-charcoal/60">{row.method}</td>
                          <td className="px-6 py-4">
                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tighter ${
                              row.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                              row.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" className="text-brand-emerald font-bold text-[10px] uppercase">View</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-brand-gold uppercase tracking-[0.2em] mb-1">System Configuration</p>
                  <h2 className="text-3xl font-playfair font-bold text-brand-charcoal">Global Settings</h2>
                </div>
                <Button variant="gold" className="gap-2">
                  <Check size={16} /> Save Settings
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <aside className="space-y-2">
                  {['General Info', 'Notifications', 'Security', 'User Management', 'API Access'].map((item, i) => (
                    <button key={i} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${i === 0 ? 'bg-brand-emerald text-brand-cream shadow-md' : 'text-brand-charcoal/60 hover:bg-brand-sand/30'}`}>
                      {item}
                    </button>
                  ))}
                </aside>

                <div className="md:col-span-2 space-y-6">
                  <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="font-playfair text-xl">Property Details</CardTitle>
                      <CardDescription>Core identity and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Property Name</label>
                          <input className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" defaultValue="The Subra Heritage" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Property ID</label>
                          <input className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" defaultValue="KUM-01" disabled />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Official Email</label>
                        <input className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" defaultValue="info@subraheritage.com" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-brand-charcoal/60">Contact Number</label>
                        <input className="w-full bg-brand-sand/20 border-brand-sand/30 rounded-lg p-3 outline-none" defaultValue="+91 98765 43210" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="font-playfair text-xl">Operational Preferences</CardTitle>
                      <CardDescription>Configure basic hotel operations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-2">
                        <div>
                          <p className="font-bold text-brand-charcoal">Auto-Confirm Direct Bookings</p>
                          <p className="text-xs text-brand-charcoal/60">Skip manual approval for website reservations</p>
                        </div>
                        <div className="w-12 h-6 bg-brand-emerald rounded-full relative p-1 cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute right-1" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2">
                        <div>
                          <p className="font-bold text-brand-charcoal">SMS Guest Notifications</p>
                          <p className="text-xs text-brand-charcoal/60">Send automated booking details via SMS</p>
                        </div>
                        <div className="w-12 h-6 bg-brand-sand rounded-full relative p-1 cursor-pointer">
                          <div className="w-4 h-4 bg-white rounded-full absolute left-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

