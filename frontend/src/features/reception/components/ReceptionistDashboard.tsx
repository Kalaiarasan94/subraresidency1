import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  Users, LogIn, LogOut, 
  Hotel, ArrowUpRight, Search, 
  Smartphone, PlusCircle, 
  MessageSquare
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip } from 'recharts';
import { API_BASE_URL } from '../../../lib/api';

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => {
  const colorMap: any = {
    'bg-blue-500': { border: 'border-emerald-100', text: 'text-emerald-800', bg: 'bg-emerald-50/30', topBorder: 'bg-emerald-500' },
    'bg-amber-500': { border: 'border-amber-100', text: 'text-amber-800', bg: 'bg-amber-50/30', topBorder: 'bg-amber-550' },
    'bg-emerald-500': { border: 'border-teal-100', text: 'text-teal-800', bg: 'bg-teal-50/30', topBorder: 'bg-emerald-600' },
    'bg-emerald-700': { border: 'border-emerald-200/50', text: 'text-emerald-900', bg: 'bg-emerald-50/50', topBorder: 'bg-emerald-800' },
    'bg-rose-500': { border: 'border-rose-100', text: 'text-rose-800', bg: 'bg-rose-50/30', topBorder: 'bg-rose-500' },
  };
  const style = colorMap[color] || { border: 'border-slate-100', text: 'text-slate-655', bg: 'bg-slate-50', topBorder: 'bg-slate-400' };

  return (
    <Card className={`relative overflow-hidden border ${style.border} ${style.bg} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group rounded-2xl`}>
      <div className={`absolute top-0 left-0 w-full h-[4px] ${style.topBorder}`} />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-white shadow-sm text-emerald-800 transition-transform group-hover:scale-110">
            <Icon size={18} />
          </div>
          {trend && (
            <span className="text-[9px] font-black text-emerald-700 bg-white border border-emerald-150 px-2.5 py-0.5 rounded-full flex items-center gap-1 tracking-wider uppercase">
              {trend}
            </span>
          )}
        </div>
        <h3 className="text-[9px] font-black text-slate-455 uppercase tracking-widest leading-none mb-2">{label}</h3>
        <p className="text-3xl font-extrabold text-slate-800 font-sans tabular-nums">{value}</p>
      </CardContent>
    </Card>
  );
};

const QuickAction = ({ icon: Icon, label, description, color, onClick }: any) => {
  const colorMap: any = {
    'bg-rose-500': { text: 'text-rose-700', bg: 'bg-rose-50/50', border: 'hover:border-rose-200 hover:bg-rose-50/10' },
    'bg-blue-500': { text: 'text-teal-700', bg: 'bg-teal-50/50', border: 'hover:border-teal-200 hover:bg-teal-50/10' },
    'bg-emerald-500': { text: 'text-emerald-700', bg: 'bg-emerald-50/50', border: 'hover:border-emerald-200 hover:bg-emerald-50/10' },
    'bg-amber-500': { text: 'text-amber-700', bg: 'bg-amber-50/50', border: 'hover:border-amber-200 hover:bg-amber-50/10' },
  };
  const style = colorMap[color] || { text: 'text-slate-655', bg: 'bg-slate-50', border: 'hover:border-slate-200 hover:bg-slate-55/30' };

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-150/60 shadow-sm ${style.border} hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group w-full text-left`}
    >
      <div className={`p-4 rounded-xl ${style.bg} ${style.text} group-hover:scale-110 transition-transform shadow-inner`}>
        <Icon size={20} className="group-hover:rotate-6 transition-transform" />
      </div>
      <div>
        <p className="text-xs font-black text-slate-800 uppercase tracking-wide">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-1 leading-snug">{description}</p>
      </div>
    </button>
  );
};

export const ReceptionistDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/dashboard/receptionist`);
        const json = await resp.json();
        if (json.status === 'success') {
          setData(json.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
       <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const stats = data?.stats || { arrivals: 0, departures: 0, checked_in: 0, available: 0, occupied: 0 };
  const roomData = data?.room_distribution || [];
  const recentBookings = data?.recent_bookings || [];

  // Overriding colors for premium hospitality palette
  const getHospitalityColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'available': return '#10b981'; // Mint
      case 'occupied': return '#064e3b'; // Deep Emerald
      case 'cleaning': return '#f59e0b'; // Gold-cream details
      case 'maintenance': return '#f43f5e'; // Rose
      default: return '#64748b';
    }
  };

  const chartData = roomData.map((item: any) => ({
    ...item,
    color: getHospitalityColor(item.name)
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard label="Today's Arrivals" value={stats.arrivals} icon={LogIn} color="bg-blue-500" trend="+2 New" />
        <StatCard label="Today's Departures" value={stats.departures} icon={LogOut} color="bg-amber-500" />
        <StatCard label="Current Check-ins" value={stats.checked_in} icon={Users} color="bg-emerald-500" />
        <StatCard label="Available Rooms" value={stats.available} icon={Hotel} color="bg-emerald-700" />
        <StatCard label="Occupied Rooms" value={stats.occupied} icon={Hotel} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings List */}
        <Card className="lg:col-span-2 border border-slate-150/60 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-300">
          <div className="p-6 border-b border-slate-100/60 flex items-center justify-between bg-white">
            <div>
               <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Recent Bookings (Online)</h3>
               <p className="text-[10px] text-slate-400 font-medium mt-1">Status of pending check-ins</p>
            </div>
            <button className="text-[9px] font-black text-emerald-700 hover:text-emerald-900 uppercase tracking-widest transition-colors">View All</button>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[9px] font-black text-slate-455 uppercase tracking-widest border-b border-slate-150/60">
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Check-in</th>
                    <th className="px-6 py-4">Room No.</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60">
                  {recentBookings.map((bk: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-50/40 transition-colors group">
                      <td className="px-6 py-4 text-[11px] font-bold text-emerald-800">{bk.booking_id}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-800 uppercase tracking-tight">{bk.guest_name}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 font-sans">{bk.check_in_date}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700 font-sans">{bk.room_id || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                          bk.status === 'checked-in' ? 'bg-emerald-50 border-emerald-150 text-emerald-800' :
                          bk.status === 'confirmed' ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-100 border-slate-200 text-slate-500'
                        }`}>
                          {bk.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentBookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No recent online bookings found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Room Status Overview Pie Chart */}
        <Card className="border border-slate-150/60 shadow-sm rounded-2xl bg-white flex flex-col hover:shadow-md transition-all duration-300">
          <div className="p-6 border-b border-slate-100/60">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest font-sans">Room Status Distribution</h3>
          </div>
          <CardContent className="flex-grow flex flex-col p-6">
            <div className="h-[240px] w-full relative">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <RePie>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#051e13', 
                        borderRadius: '12px', 
                        border: 'none', 
                        color: '#fff', 
                        fontSize: '10px',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </RePie>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300 text-xs font-black uppercase tracking-widest">Loading chart…</div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-extrabold text-slate-855 font-sans">{stats.arrivals + stats.checked_in + stats.available}</span>
                <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest mt-1">Total Rooms</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-100/60 pt-4">
              {chartData.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-800 uppercase tracking-wide leading-none">{item.name}</span>
                     <span className="text-[10px] font-bold text-slate-400 mt-1 font-sans">{item.value} Units</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <QuickAction icon={Smartphone} label="Scan QR Check-in" description="Instantly verify guest arrivals" color="bg-rose-500" />
         <QuickAction icon={Search} label="Lookup Reservation" description="Search by ID or Mobile" color="bg-blue-500" />
         <QuickAction icon={PlusCircle} label="New Registration" description="Process walk-in guests" color="bg-emerald-500" />
         <QuickAction icon={MessageSquare} label="Guest Comms" description="Send automated updates" color="bg-amber-500" />
      </div>
    </div>
  );
};
