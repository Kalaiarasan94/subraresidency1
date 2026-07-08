import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { 
  Users, LogIn, LogOut, 
  Hotel, ArrowUpRight, Search, 
  Smartphone, PlusCircle, 
  MessageSquare
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip } from 'recharts';
import { API_BASE_URL } from '../../../lib/api';

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <Card className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden bg-white">
    <CardContent className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10 transition-transform group-hover:scale-110`}>
          <Icon className={color.replace('bg-', 'text-')} size={24} />
        </div>
        {trend && (
          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
            <ArrowUpRight size={10} /> {trend}
          </span>
        )}
      </div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{label}</h3>
      <p className="text-3xl font-black text-slate-800">{value}</p>
    </CardContent>
  </Card>
);

const QuickAction = ({ icon: Icon, label, description, color }: any) => (
  <button className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all group w-full text-left">
    <div className={`p-4 rounded-xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
      <Icon className={color.replace('bg-', 'text-')} size={20} />
    </div>
    <div>
      <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{label}</p>
      <p className="text-[10px] text-slate-400 font-bold mt-0.5">{description}</p>
    </div>
  </button>
);

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
       <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const stats = data?.stats || { arrivals: 0, departures: 0, checked_in: 0, available: 0, occupied: 0 };
  const roomData = data?.room_distribution || [];
  const recentBookings = data?.recent_bookings || [];

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
        <Card className="lg:col-span-2 border-none shadow-xl rounded-3xl overflow-hidden bg-white">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
            <div>
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Recent Bookings (Online)</h3>
               <p className="text-[10px] text-slate-400 font-bold mt-1">Status of pending check-ins</p>
            </div>
            <button className="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-widest">View All</button>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Check-in</th>
                    <th className="px-6 py-4">Room No.</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentBookings.map((bk: any, i: number) => (
                    <tr key={i} className="hover:bg-emerald-50/30 transition-colors group">
                      <td className="px-6 py-4 text-[11px] font-black text-emerald-700">{bk.booking_id}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-800 uppercase tracking-tight">{bk.guest_name}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500">{bk.check_in_date}</td>
                      <td className="px-6 py-4 text-xs font-black text-slate-700">{bk.room_id || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${
                          bk.status === 'checked-in' ? 'bg-emerald-100 text-emerald-700' :
                          bk.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
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
        <Card className="border-none shadow-xl rounded-3xl bg-white flex flex-col">
          <div className="p-6 border-b border-slate-50">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest font-sans">Room Status Distribution</h3>
          </div>
          <CardContent className="flex-grow flex flex-col p-6">
            <div className="h-[300px] w-full relative">
              {roomData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <RePie>
                    <Pie
                      data={roomData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {roomData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RePie>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-300 text-xs font-black uppercase tracking-widest">Loading chart…</div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black text-slate-800">{stats.total_rooms}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Rooms</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              {roomData.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <div className="flex flex-col">
                     <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight leading-none">{item.name}</span>
                     <span className="text-[10px] font-bold text-slate-400 mt-1">{item.value} Units</span>
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
