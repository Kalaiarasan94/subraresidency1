import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  Users, LogIn, LogOut, 
  Hotel, Search, 
  Smartphone, PlusCircle, 
  MessageSquare, X, Filter, ChevronDown
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip } from 'recharts';
import { API_BASE_URL } from '../../../lib/api';

const StatCard = ({ label, value, icon: Icon, color, trend, onClick }: any) => {
  const colorMap: any = {
    'bg-blue-500': { border: 'border-emerald-100', text: 'text-emerald-800', bg: 'bg-emerald-50/30', topBorder: 'bg-emerald-500' },
    'bg-amber-500': { border: 'border-amber-100', text: 'text-amber-800', bg: 'bg-amber-50/30', topBorder: 'bg-amber-550' },
    'bg-emerald-500': { border: 'border-teal-100', text: 'text-teal-800', bg: 'bg-teal-50/30', topBorder: 'bg-emerald-600' },
    'bg-emerald-700': { border: 'border-emerald-200/50', text: 'text-emerald-900', bg: 'bg-emerald-50/50', topBorder: 'bg-emerald-800' },
    'bg-rose-500': { border: 'border-rose-100', text: 'text-rose-800', bg: 'bg-rose-50/30', topBorder: 'bg-rose-500' },
  };
  const style = colorMap[color] || { border: 'border-slate-100', text: 'text-slate-655', bg: 'bg-slate-50', topBorder: 'bg-slate-400' };

  return (
    <Card 
      onClick={onClick}
      className={`relative overflow-hidden border ${style.border} ${style.bg} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group rounded-2xl ${onClick ? 'cursor-pointer' : ''}`}
    >
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

export const ReceptionistDashboard = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeparturesModal, setShowDeparturesModal] = useState(false);
  const [showArrivalsModal, setShowArrivalsModal] = useState(false);
  const [showCheckinsModal, setShowCheckinsModal] = useState(false);
  const [showAvailableRoomsModal, setShowAvailableRoomsModal] = useState(false);
  const [showOccupiedRoomsModal, setShowOccupiedRoomsModal] = useState(false);

  // View All Bookings state
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [allBookingsLoading, setAllBookingsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

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

  const fetchAllBookings = useCallback(async () => {
    setAllBookingsLoading(true);
    try {
      const params = new URLSearchParams({ all: '1', limit: '200' });
      if (filterDate) params.set('date', filterDate);
      if (filterRoom) params.set('room', filterRoom);
      if (filterStatus) params.set('status', filterStatus);
      const resp = await fetch(`${API_BASE_URL}/admin/bookings/list?${params}`);
      const json = await resp.json();
      if (json.status === 'success') setAllBookings(json.bookings || []);
    } catch (err) {
      console.error('Failed to fetch all bookings', err);
    } finally {
      setAllBookingsLoading(false);
    }
  }, [filterDate, filterRoom, filterStatus]);

  useEffect(() => {
    if (showAllBookings) fetchAllBookings();
  }, [showAllBookings, fetchAllBookings]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
       <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const stats = data?.stats || { arrivals: 0, departures: 0, checked_in: 0, available: 0, occupied: 0 };
  const roomData = data?.room_distribution || [];
  const recentBookings = data?.recent_bookings || [];
  const departuresList = data?.departures_list || [];
  const arrivalsList = data?.arrivals_list || [];
  const checkedInList = data?.checked_in_list || [];
  const availableRoomsList = data?.available_rooms_list || [];
  const occupiedRoomsList = data?.occupied_rooms_list || [];

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
        <StatCard label="Today's Arrivals" value={stats.arrivals} icon={LogIn} color="bg-blue-500" trend={stats.today_created_bookings > 0 ? `+${stats.today_created_bookings} New` : undefined} onClick={() => setShowArrivalsModal(true)} />
        <StatCard label="Today's Departures" value={stats.departures} icon={LogOut} color="bg-amber-500" onClick={() => setShowDeparturesModal(true)} />
        <StatCard label="Current Check-ins" value={stats.checked_in} icon={Users} color="bg-emerald-500" onClick={() => setShowCheckinsModal(true)} />
        <StatCard label="Available Rooms" value={stats.available} icon={Hotel} color="bg-emerald-700" onClick={() => setShowAvailableRoomsModal(true)} />
        <StatCard label="Occupied Rooms" value={stats.occupied} icon={Hotel} color="bg-rose-500" onClick={() => setShowOccupiedRoomsModal(true)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings List */}
        <Card className="lg:col-span-2 border border-slate-150/60 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-all duration-300">
          <div className="p-6 border-b border-slate-100/60 flex items-center justify-between bg-white">
            <div>
             <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Recent Bookings (Online)</h3>
             <p className="text-[10px] text-slate-400 font-medium mt-1">Status of pending check-ins</p>
           </div>
           <button 
             onClick={() => setShowAllBookings(true)}
             className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
           >
             View All
           </button>
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
                      <td className="px-6 py-4 text-xs font-bold text-slate-700 font-sans">
                        {bk.status === 'confirmed' ? 'Pending' : (bk.room_id || 'N/A')}
                      </td>
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
                <span className="text-3xl font-extrabold text-slate-855 font-sans">{stats.total_rooms}</span>
                <span className="text-[9px] font-black text-slate-455 uppercase tracking-widest mt-1">Total Rooms</span>
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
         <QuickAction icon={Smartphone} label="Scan QR Check-in" description="Instantly verify guest arrivals" color="bg-rose-500" onClick={() => onNavigate?.('online_checkin')} />
         <QuickAction icon={Search} label="Lookup Reservation" description="Search by ID or Mobile" color="bg-blue-500" onClick={() => onNavigate?.('online_checkin')} />
         <QuickAction icon={PlusCircle} label="New Registration" description="Process walk-in guests" color="bg-emerald-500" onClick={() => onNavigate?.('offline_booking')} />
         <QuickAction icon={Users} label="Guest Directory" description="Lookup guest files & stay logs" color="bg-amber-500" onClick={() => onNavigate?.('guests')} />
      </div>

      {/* Today's Departures Modal */}
      {showDeparturesModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xs font-black text-[#0b336b] uppercase tracking-widest">
                  Today's Departures
                </h3>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-tight">
                  List of guests checking out today
                </p>
              </div>
              <button 
                onClick={() => setShowDeparturesModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
              {departuresList.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-white">
                  {departuresList.map((dep: any, index: number) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 text-amber-700 rounded-xl">
                          <LogOut size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-wide">{dep.guest_name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">Booking ID: {dep.booking_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 uppercase tracking-widest font-sans">
                          Room {dep.room_number || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                  No departures scheduled for today.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button 
                onClick={() => setShowDeparturesModal(false)}
                className="bg-[#0b336b] hover:bg-[#072145] text-[10px] uppercase font-black tracking-widest text-white px-5 py-2 rounded-lg shadow-md transition-all"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Arrivals Modal */}
      {showArrivalsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest">
                  Today's Arrivals
                </h3>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-tight">
                  List of guests checking in today
                </p>
              </div>
              <button 
                onClick={() => setShowArrivalsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
              {arrivalsList.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-white">
                  {arrivalsList.map((arr: any, index: number) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                          <LogIn size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-wide">{arr.guest_name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
                            Booking ID: {arr.booking_id}{arr.category_name ? ` · ${arr.category_name}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 uppercase tracking-widest font-sans">
                          Room {arr.room_number || 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                  No arrivals scheduled for today.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button 
                onClick={() => setShowArrivalsModal(false)}
                className="bg-emerald-800 hover:bg-emerald-900 text-[10px] uppercase font-black tracking-widest text-white px-5 py-2 rounded-lg shadow-md transition-all"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Current Check-ins Modal */}
      {showCheckinsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xs font-black text-teal-800 uppercase tracking-widest">
                  Current Check-ins
                </h3>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-tight">
                  List of guests checked-in in-house
                </p>
              </div>
              <button 
                onClick={() => setShowCheckinsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
              {checkedInList.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-white">
                  {checkedInList.map((ci: any, index: number) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                          <Users size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-wide">{ci.guest_name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
                            Booking ID: {ci.booking_id}
                          </p>
                          <p className="text-[8px] text-slate-400 font-bold mt-0.5">
                            Stay: {ci.check_in_date} to {ci.check_out_date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 uppercase tracking-widest font-sans">
                          Room {ci.room_number || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                  No checked-in guests.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button 
                onClick={() => setShowCheckinsModal(false)}
                className="bg-emerald-800 hover:bg-emerald-900 text-[10px] uppercase font-black tracking-widest text-white px-5 py-2 rounded-lg shadow-md transition-all"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Available Rooms Modal */}
      {showAvailableRoomsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest">
                  Available Rooms
                </h3>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-tight">
                  List of rooms currently vacant
                </p>
              </div>
              <button 
                onClick={() => setShowAvailableRoomsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
              {availableRoomsList.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-white">
                  {availableRoomsList.map((av: any, index: number) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                          <Hotel size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-wide">{av.room_name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">{av.category_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 uppercase tracking-widest font-sans">
                          Room {av.room_number}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                  No rooms are currently vacant.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button 
                onClick={() => setShowAvailableRoomsModal(false)}
                className="bg-emerald-800 hover:bg-emerald-900 text-[10px] uppercase font-black tracking-widest text-white px-5 py-2 rounded-lg shadow-md transition-all"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Occupied Rooms Modal */}
      {showOccupiedRoomsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xs font-black text-rose-800 uppercase tracking-widest">
                  Occupied Rooms
                </h3>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-tight">
                  List of rooms currently occupied
                </p>
              </div>
              <button 
                onClick={() => setShowOccupiedRoomsModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
              {occupiedRoomsList.length > 0 ? (
                <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-white">
                  {occupiedRoomsList.map((oc: any, index: number) => (
                    <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-rose-50 text-rose-700 rounded-xl">
                          <Hotel size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-wide">{oc.room_name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
                            {oc.category_name || 'Standard'} · Guest: {oc.guest_name || 'In-House Guest'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 uppercase tracking-widest font-sans">
                          Room {oc.room_number}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest italic">
                  No rooms are currently occupied.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button 
                onClick={() => setShowOccupiedRoomsModal(false)}
                className="bg-rose-800 hover:bg-rose-900 text-[10px] uppercase font-black tracking-widest text-white px-5 py-2 rounded-lg shadow-md transition-all"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ====== VIEW ALL BOOKINGS MODAL ====== */}
      {showAllBookings && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-emerald-900 to-emerald-800 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">All Bookings</h3>
                <p className="text-[10px] text-emerald-300 font-medium mt-1">{allBookings.length} records found</p>
              </div>
              <button 
                onClick={() => setShowAllBookings(false)}
                className="text-emerald-300 hover:text-white p-2 hover:bg-white/10 rounded-xl transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filters Bar */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-wrap items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
                <Filter size={12} className="text-slate-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filter:</span>
              </div>

              {/* Date Filter */}
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:border-emerald-400 transition-colors">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest pl-3 pr-1 whitespace-nowrap">Check-in Date</span>
                <input 
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-transparent px-3 py-2 focus:outline-none min-w-[130px]"
                />
                {filterDate && (
                  <button onClick={() => setFilterDate('')} className="pr-2 text-slate-400 hover:text-rose-500">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Room Filter */}
              <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:border-emerald-400 transition-colors">
                <Search size={12} className="ml-3 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Room name or number…"
                  value={filterRoom}
                  onChange={e => setFilterRoom(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-transparent px-3 py-2 focus:outline-none w-44 placeholder:text-slate-300 placeholder:font-medium"
                />
                {filterRoom && (
                  <button onClick={() => setFilterRoom('')} className="pr-2 text-slate-400 hover:text-rose-500">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:border-emerald-400 transition-colors">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="text-xs font-bold text-slate-700 bg-transparent pl-3 pr-8 py-2 focus:outline-none appearance-none min-w-[120px]"
                >
                  <option value="">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-in">Checked In</option>
                  <option value="checked-out">Checked Out</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 text-slate-400 pointer-events-none" />
              </div>

              <button
                onClick={fetchAllBookings}
                disabled={allBookingsLoading}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 disabled:opacity-60"
              >
                {allBookingsLoading ? 'Searching…' : 'Search'}
              </button>

              {(filterDate || filterRoom || filterStatus) && (
                <button
                  onClick={() => { setFilterDate(''); setFilterRoom(''); setFilterStatus(''); }}
                  className="text-[9px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Bookings Table */}
            <div className="flex-1 overflow-auto">
              {allBookingsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <table className="w-full text-left min-w-[700px]">
                  <thead className="sticky top-0 bg-slate-50 border-b border-slate-100">
                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <th className="px-5 py-4">Booking ID</th>
                      <th className="px-5 py-4">Guest</th>
                      <th className="px-5 py-4">Check-in</th>
                      <th className="px-5 py-4">Check-out</th>
                      <th className="px-5 py-4">Room No.</th>
                      <th className="px-5 py-4">Amount</th>
                      <th className="px-5 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allBookings.map((bk: any, i: number) => (
                      <tr key={i} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-5 py-3.5 text-[11px] font-bold text-emerald-800 font-mono">{bk.booking_id}</td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">{bk.guest_name}</p>
                          <p className="text-[9px] text-slate-400 font-medium mt-0.5">{bk.guest_phone || bk.guest_email || '—'}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-medium text-slate-500 font-sans">{bk.check_in_date}</td>
                        <td className="px-5 py-3.5 text-xs font-medium text-slate-500 font-sans">{bk.check_out_date}</td>
                        <td className="px-5 py-3.5 text-xs font-bold text-slate-700 font-sans">
                          {bk.status === 'confirmed' ? 'Pending' : (bk.rooms?.map((r: any) => r.room_number).join(', ') || bk.room_number || 'N/A')}
                        </td>
                        <td className="px-5 py-3.5 text-xs font-bold text-slate-700">₹{Number(bk.total_amount || 0).toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                            bk.status === 'checked-in'  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                            bk.status === 'confirmed'   ? 'bg-amber-50 border-amber-200 text-amber-800' :
                            bk.status === 'checked-out' ? 'bg-slate-100 border-slate-200 text-slate-600' :
                            bk.status === 'cancelled'   ? 'bg-rose-50 border-rose-200 text-rose-700' :
                                                          'bg-slate-100 border-slate-200 text-slate-500'
                          }`}>{bk.status}</span>
                        </td>
                      </tr>
                    ))}
                    {allBookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-5 py-16 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          No bookings found matching the filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex justify-between items-center flex-shrink-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{allBookings.length} records shown</span>
              <Button
                onClick={() => setShowAllBookings(false)}
                className="bg-emerald-800 hover:bg-emerald-900 text-[10px] uppercase font-black tracking-widest text-white px-5 py-2 rounded-lg shadow-md transition-all"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
