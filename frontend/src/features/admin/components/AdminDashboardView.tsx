import { useState, useEffect } from 'react';
import { 
  Users, Hotel, Calendar, CreditCard, 
  TrendingUp, Mail, 
  Settings, Shield, Layout, 
  FileText, PieChart as PieIcon,
  CheckCircle,
  AlertCircle, History, LayoutDashboard, LogOut, X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { API_BASE_URL } from '../../../lib/api';


interface DashboardStats {
  stats: {
    total_bookings: number;
    today_bookings: number;
    today_revenue: number;
    monthly_revenue: number;
    total_revenue: number;
    total_rooms: number;
    available_rooms: number;
    occupied_rooms: number;
    maintenance_rooms: number;
    confirmed_bookings: number;
    cancelled_bookings: number;
    pending_bookings: number;
    checked_in_bookings: number;
    checked_out_bookings: number;
  };
  chart_data: Array<{ day: string; bookings: number }>;
  revenue_overview: Array<{ name: string; value: number }>;
  booking_sources: Array<{ booking_source: string; count: number }>;
  payment_methods: Array<{ method: string; amount: number; percentage: number }>;
  today_bookings_list?: Array<{
    booking_id: string;
    guest_name: string;
    check_in_date: string;
    check_out_date: string;
    total_amount: number;
    status: string;
  }>;
  today_revenue_list?: Array<{
    transaction_id: string;
    amount: number;
    payment_method: string;
    payment_date: string;
    booking_id: string;
    guest_name: string;
  }>;
  available_rooms_list?: Array<{
    room_number: string;
    room_name: string;
    category_name: string;
    status: string;
  }>;
  occupied_rooms_list?: Array<{
    room_number: string;
    room_name: string;
    category_name: string;
    guest_name?: string;
    check_in_date?: string;
    check_out_date?: string;
  }>;
  recent_bookings: Array<{
    booking_id: string;
    guest_name: string;
    check_in_date: string;
    total_amount: number;
    status: string;
  }>;
  rooms_grid: Array<{
    id: number;
    number: string;
    status: string;
    category?: string;
  }>;
}

export const AdminDashboardView = ({ 
  activeSubTab = 'overview',
  onNavigate
}: { 
  activeSubTab?: string;
  onNavigate?: (tabName: string) => void;
}) => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTodayBookingsModal, setShowTodayBookingsModal] = useState(false);
  const [showTodayRevenueModal, setShowTodayRevenueModal] = useState(false);
  const [showAvailableRoomsModal, setShowAvailableRoomsModal] = useState(false);
  const [showOccupiedRoomsModal, setShowOccupiedRoomsModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const fetchData = async () => {
     try {
       const resp = await fetch(`${API_BASE_URL}/dashboard/admin?_t=${Date.now()}`, {
         cache: 'no-store',
         headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
       });
       const json = await resp.json();
       if (json.status === 'success') {
         setData(json.data);
       }
     } catch (e) {
       console.error(e);
     } finally {
       setLoading(false);
     }
  };

  const handleClearData = async () => {
    if (window.confirm("ARE YOU SURE?\nThis will permanently delete all customer bookings, guest history, payments, and financial transaction records from the live database.")) {
      try {
        setLoading(true);
        const resp = await fetch(`${API_BASE_URL}/dashboard/clearData`);
        const json = await resp.json();
        if (json.status === 'success') {
          alert("All customer booking and transaction data has been cleared!");
          await fetchData();
        } else {
          alert("Error clearing data: " + (json.message || "Unknown error"));
          setLoading(false);
        }
      } catch (e: any) {
        alert("Failed to connect to clearData endpoint: " + e.message);
        setLoading(false);
      }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-none h-10 w-10 border-2 border-black border-t-transparent"></div>
        <p className="text-black font-bold uppercase tracking-widest text-[10px]">Synchronizing System Data...</p>
      </div>
    </div>
  );

  if (!data) return <div className="p-10 text-rose-600 font-bold">Error: Connection to Management API lost.</div>;

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div>
      {/* VIEW CONDITIONAL RENDERING */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-medium text-gray-800 tracking-tight">
                  System overview
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Real-time metrics and hotel operations</p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-600">Live Telemetry</span>
            </div>
            
            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MiniStat icon={Calendar} label="Total Bookings" value={data.stats.total_bookings} />
              <MiniStat icon={Users} label="Today's Bookings" value={data.stats.today_bookings} onClick={() => setShowTodayBookingsModal(true)} />
              <MiniStat icon={TrendingUp} label="Today's Revenue" value={`₹${data.stats.today_revenue.toLocaleString('en-IN')}`} onClick={() => setShowTodayRevenueModal(true)} />
              <MiniStat icon={CreditCard} label="This Month Revenue" value={`₹${data.stats.monthly_revenue.toLocaleString('en-IN')}`} />
              
              <MiniStat icon={Hotel} label="Total Rooms" value={data.stats.total_rooms} />
              <MiniStat icon={CheckCircle} label="Available Rooms" value={data.stats.available_rooms} onClick={() => setShowAvailableRoomsModal(true)} />
              <MiniStat icon={AlertCircle} label="Occupied Rooms" value={data.stats.occupied_rooms} onClick={() => setShowOccupiedRoomsModal(true)} />
              <MiniStat icon={XCircleIcon} label="Cancelled Bookings" value={data.stats.cancelled_bookings} />
            </div>

            {/* First Row of Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Booking Trend Chart */}
              <Card className="lg:col-span-2 border border-gray-200 shadow-xs rounded-lg bg-white p-5 flex flex-col justify-between h-[340px]">
                 <div className="mb-2">
                   <h3 className="text-sm font-medium text-gray-800">Booking trend</h3>
                   <p className="text-xs text-gray-400 mt-0.5">Daily volume over the last 7 days</p>
                 </div>
                 <div className="h-[230px] w-full mt-2 min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={230}>
                      <AreaChart data={data.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.12}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.00}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} dy={8} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} width={30} dx={-4} />
                        <Area type="monotone" dataKey="bookings" stroke="#2563eb" fill="url(#colorBookings)" strokeWidth={2} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            borderRadius: '0.375rem', 
                            border: '1px solid #e2e8f0', 
                            color: '#1e293b', 
                            fontSize: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                          }} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </Card>

              {/* Revenue Breakdown */}
              <Card className="lg:col-span-1 border border-gray-200 shadow-xs rounded-lg bg-white p-5 flex flex-col justify-between h-[340px]">
                 <div>
                   <h3 className="text-sm font-medium text-gray-800">Revenue breakdown</h3>
                   <p className="text-xs text-gray-400 mt-0.5">Estimated this month's revenue share</p>
                 </div>
                 <div className="h-[140px] flex items-center justify-center relative mt-2 min-w-0">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={140}>
                      <PieChart>
                        <Pie data={data.revenue_overview} innerRadius={42} outerRadius={56} paddingAngle={2} dataKey="value">
                          {data.revenue_overview.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                          contentStyle={{ 
                            backgroundColor: '#ffffff', 
                            borderRadius: '0.375rem', 
                            border: '1px solid #e2e8f0', 
                            color: '#1e293b', 
                            fontSize: '12px'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] font-medium text-gray-400 uppercase">Total</span>
                      <span className="text-sm font-semibold text-gray-900">₹{data.stats.monthly_revenue.toLocaleString('en-IN')}</span>
                    </div>
                 </div>
                 <div className="space-y-2 mt-2 border-t border-gray-100 pt-3">
                   {(() => {
                     const totalRev = data.revenue_overview.reduce((sum, item) => sum + item.value, 0) || 1;
                     return data.revenue_overview.map((item, idx) => (
                       <div key={idx} className="flex items-center justify-between text-xs text-gray-600">
                         <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                           <span>{item.name}</span>
                         </div>
                         <span className="font-mono text-gray-900">₹{item.value.toLocaleString('en-IN')} ({Math.round(item.value / totalRev * 100)}%)</span>
                       </div>
                     ));
                   })()}
                 </div>
              </Card>
            </div>

            {/* Second Row of Operations & Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Bookings Table */}
              <Card className="lg:col-span-2 border border-gray-200 shadow-xs rounded-lg bg-white flex flex-col justify-between h-[380px]">
                 <div className="p-4 flex flex-row items-center justify-between border-b border-gray-100">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">Recent bookings</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Most recent reservation entries</p>
                    </div>
                    <Button 
                      variant="link" 
                      className="text-xs font-medium text-blue-600 hover:text-blue-700 p-0 h-auto" 
                      onClick={() => onNavigate?.('bookings')}
                    >
                      View all →
                    </Button>
                 </div>
                 <div className="flex-grow overflow-y-auto">
                    <table className="w-full text-xs text-left">
                       <thead className="bg-gray-50/80 text-gray-500 uppercase font-medium text-[10px] tracking-wider border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-2.5">Booking ID</th>
                            <th className="px-4 py-2.5">Guest</th>
                            <th className="px-4 py-2.5">Check-in</th>
                            <th className="text-right px-4 py-2.5">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          {data.recent_bookings.map(b => (
                            <tr key={b.booking_id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 font-mono font-medium text-blue-600">{b.booking_id}</td>
                              <td className="px-4 py-3 text-gray-800 font-medium">{b.guest_name}</td>
                              <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">{b.check_in_date}</td>
                              <td className="px-4 py-3 text-right">
                                 <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                                   b.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                   b.status === 'checked-in' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                   b.status === 'checked-out' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                                   b.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                   'bg-gray-100 text-gray-400 border-gray-200 line-through'
                                 }`}>
                                   {b.status}
                                 </span>
                              </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </Card>

              {/* Live Room Grid */}
              <Card className="lg:col-span-1 border border-gray-200 shadow-xs rounded-lg bg-white p-5 flex flex-col justify-between h-[380px]">
                 <div className="mb-2">
                   <h3 className="text-sm font-medium text-gray-800">Live room grid</h3>
                   <p className="text-xs text-gray-400 mt-0.5">Real-time status of all hotel rooms</p>
                 </div>
                 <div className="flex-grow overflow-y-auto mt-2 pr-1">
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {data.rooms_grid.map((room, idx) => (
                        <div 
                          key={idx}
                          title={`${room.number} - ${room.category || 'Standard'} (${room.status})`}
                          className={`flex flex-col items-center justify-center p-2 rounded-md border text-center transition-colors ${
                            room.status === 'Available' ? 'bg-white border-gray-200 text-gray-800 hover:border-gray-400' :
                            room.status === 'Occupied' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' :
                            'bg-amber-50 border-amber-200 text-amber-800'
                          }`}
                        >
                          <span className="text-xs font-semibold font-mono">{room.number}</span>
                          <span className="text-[9px] font-medium tracking-tight mt-0.5 opacity-80">{room.status}</span>
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-medium text-gray-500 mt-4 border-t border-gray-100 pt-3">
                   <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-white border border-gray-300"></div> Available</div>
                   <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-50 border border-emerald-300"></div> Occupied</div>
                   <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-amber-50 border border-amber-200"></div> Maint</div>
                 </div>
              </Card>
            </div>
          </div>

          {/* Today's Bookings Modal */}
          {showTodayBookingsModal && (
            <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
              <div className="bg-white rounded-none border border-black shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
                <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                  <div>
                     <h3 className="text-xs font-bold text-black uppercase tracking-widest">Today's Bookings</h3>
                     <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Reservations registered on current date</p>
                  </div>
                  <button onClick={() => setShowTodayBookingsModal(false)} className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors rounded-none border border-neutral-300">
                    <X size={16} />
                  </button>
                </div>
                
                <div className="p-5 max-h-[400px] overflow-y-auto">
                  <div className="space-y-2">
                    {(data.today_bookings_list || []).filter((bk: any) => String(bk.status).toLowerCase() !== 'pending').map((bk: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3.5 bg-neutral-50 border border-neutral-200 rounded-none hover:border-black transition-colors">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold font-mono text-black">{bk.booking_id}</span>
                            <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 border rounded-none uppercase ${
                              bk.status === 'checked-in' ? 'bg-black text-white border-black' :
                              bk.status === 'confirmed' ? 'bg-neutral-800 text-white border-neutral-800' : 'bg-neutral-100 border-neutral-300 text-neutral-700'
                            }`}>
                              {bk.status}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-black uppercase">{bk.guest_name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">
                            {bk.check_in_date} to {bk.check_out_date}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Total</span>
                          <span className="text-sm font-black text-black font-mono block">₹{parseFloat(bk.total_amount).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                    {(data.today_bookings_list || []).filter((bk: any) => String(bk.status).toLowerCase() !== 'pending').length === 0 && (
                      <div className="py-10 text-center text-neutral-400 text-xs uppercase tracking-wider font-bold">No confirmed bookings registered today</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Today's Revenue Modal */}
          {showTodayRevenueModal && (
            <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
              <div className="bg-white rounded-none border border-black shadow-2xl max-w-xl w-full overflow-hidden flex flex-col">
                <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                  <div>
                     <h3 className="text-xs font-bold text-black uppercase tracking-widest">Today's Collections</h3>
                     <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Transactions settled today</p>
                  </div>
                  <button onClick={() => setShowTodayRevenueModal(false)} className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors rounded-none border border-neutral-300">
                    <X size={16} />
                  </button>
                </div>
                
                <div className="p-5 max-h-[400px] overflow-y-auto">
                  <div className="space-y-2">
                    {(data.today_revenue_list || []).map((rev: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3.5 bg-neutral-50 border border-neutral-200 rounded-none hover:border-black transition-colors">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-black">TXN: {rev.transaction_id || 'N/A'}</span>
                            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 border border-neutral-300 bg-white uppercase text-neutral-700">
                              {rev.payment_method || 'UPI'}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-black uppercase">{rev.guest_name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">
                            Ref: {rev.booking_id}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Paid</span>
                          <span className="text-sm font-black text-black font-mono block">₹{parseFloat(rev.amount).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    ))}
                    {(data.today_revenue_list || []).length === 0 && (
                      <div className="py-10 text-center text-neutral-400 text-xs uppercase tracking-wider font-bold">No payments recorded today</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Available Rooms Modal */}
          {showAvailableRoomsModal && (
            <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
              <div className="bg-white rounded-none border border-black shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
                <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                  <div>
                     <h3 className="text-xs font-bold text-black uppercase tracking-widest">Available Rooms</h3>
                     <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Current vacant inventory</p>
                  </div>
                  <button onClick={() => setShowAvailableRoomsModal(false)} className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors rounded-none border border-neutral-300">
                    <X size={16} />
                  </button>
                </div>
                
                <div className="p-5 max-h-[400px] overflow-y-auto">
                  <div className="space-y-2">
                    {(data.available_rooms_list || []).map((rm: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3.5 bg-neutral-50 border border-neutral-200 rounded-none hover:border-black transition-colors">
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-black uppercase">{rm.room_name || `Room ${rm.room_number}`}</p>
                          <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">{rm.category_name}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Room No</span>
                          <span className="text-sm font-black text-black font-mono block">{rm.room_number}</span>
                        </div>
                      </div>
                    ))}
                    {(data.available_rooms_list || []).length === 0 && (
                      <div className="py-10 text-center text-neutral-400 text-xs uppercase tracking-wider font-bold">No available rooms remaining</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Occupied Rooms Modal */}
          {showOccupiedRoomsModal && (
            <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
              <div className="bg-white rounded-none border border-black shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
                <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
                  <div>
                     <h3 className="text-xs font-bold text-black uppercase tracking-widest">Occupied Rooms</h3>
                     <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">Rooms currently allocated to guests</p>
                  </div>
                  <button onClick={() => setShowOccupiedRoomsModal(false)} className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors rounded-none border border-neutral-300">
                    <X size={16} />
                  </button>
                </div>
                
                <div className="p-5 max-h-[400px] overflow-y-auto">
                  <div className="space-y-2">
                    {(data.occupied_rooms_list || []).map((rm: any, i: number) => (
                      <div key={i} className="flex justify-between items-start p-3.5 bg-neutral-50 border border-neutral-200 rounded-none hover:border-black transition-colors gap-3">
                        <div className="space-y-0.5 min-w-0">
                          <p className="text-xs font-bold text-black uppercase">{rm.room_name || `Room ${rm.room_number}`}</p>
                          <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">{rm.category_name}</p>
                          <p className="text-[10px] text-black font-bold uppercase mt-1">Guest: {rm.guest_name || 'Checked-in'}</p>
                          {(rm.check_in_date || rm.check_out_date) && (
                            <div className="flex items-center gap-1.5 mt-1.5 font-mono text-[9px] text-neutral-600">
                              <span>{rm.check_in_date}</span>
                              <span>→</span>
                              <span>{rm.check_out_date}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Room No</span>
                          <span className="text-sm font-black text-black font-mono block">{rm.room_number}</span>
                        </div>
                      </div>
                    ))}
                    {(data.occupied_rooms_list || []).length === 0 && (
                      <div className="py-10 text-center text-neutral-400 text-xs uppercase tracking-wider font-bold">No occupied rooms currently</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'rooms' && (
        <div className="space-y-6">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">
              Booking &amp; Room Management
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* All Bookings */}
             <ManagementBox 
               title="All Bookings" 
               items={[
                 { label: `All (${data.stats.total_bookings})`, active: true },
                 { label: `Confirmed (${data.stats.confirmed_bookings})`, icon: CheckCircle },
                 { label: `Checked-in (${data.stats.checked_in_bookings})`, icon: LayoutDashboard },
                 { label: `Checked-out (${data.stats.checked_out_bookings})`, icon: LogOut },
                 { label: `Cancelled (${data.stats.cancelled_bookings})`, icon: AlertCircle },
                 { label: `Pending (${data.stats.pending_bookings})`, icon: History },
               ]}
               footer="VIEW ALL"
               onFooterClick={() => onNavigate?.('bookings')}
             />

             {/* Room Availability Form - Interactive */}
             <Card className="border border-neutral-200 shadow-none flex flex-col h-full bg-white rounded-none">
                <CardHeader className="pb-4 flex flex-row items-center justify-between border-b border-neutral-100">
                  <CardTitle className="text-xs font-bold uppercase text-black tracking-wider">Room Search</CardTitle>
                  <Calendar size={14} className="text-black" />
                </CardHeader>
                <CardContent className="space-y-4 flex-grow p-5">
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-bold uppercase text-neutral-500 tracking-wider">Accommodation Type</label>
                      <select className="w-full bg-neutral-50 border border-neutral-300 rounded-none p-2.5 text-xs font-bold text-black focus:border-black outline-none">
                         <option>Standard Deluxe</option>
                         <option>Heritage Suite</option>
                         <option>Royal Temple View</option>
                         <option>Executive Family</option>
                      </select>
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase text-neutral-500 tracking-wider">Arrival Date</label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <Calendar size={14} />
                          </div>
                          <input 
                            type="date" 
                            defaultValue={new Date().toISOString().split('T')[0]} 
                            className="w-full bg-white border border-neutral-300 rounded-none py-2 pl-9 pr-3 text-xs font-mono font-bold text-black focus:border-black outline-none" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold uppercase text-neutral-500 tracking-wider">Departure Date</label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                            <Calendar size={14} />
                          </div>
                          <input 
                            type="date" 
                            defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]} 
                            className="w-full bg-white border border-neutral-300 rounded-none py-2 pl-9 pr-3 text-xs font-mono font-bold text-black focus:border-black outline-none" 
                          />
                        </div>
                      </div>
                   </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button onClick={() => onNavigate?.('calendar')} className="w-full bg-black hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider h-10 rounded-none transition-colors">
                    Search Availability
                  </Button>
                </div>
             </Card>
          </div>

          {/* Reports & Analytics */}
          <ManagementBox 
            title="Reports &amp; Analytics" 
            items={[
              { label: 'Booking Report', icon: FileText },
              { label: 'Revenue Report', icon: TrendingUp },
              { label: 'Occupancy Report', icon: PieIcon },
              { label: 'Payment Report', icon: CreditCard },
              { label: 'Cancellation Report', icon: AlertCircle },
              { label: 'Guest Report', icon: Users },
            ]}
            footer="VIEW REPORTS"
            onFooterClick={() => onNavigate?.('reports')}
          />
        </div>
      )}

      {activeSubTab === 'finance' && (
        <div className="space-y-6">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black">
              Payments, Accounts &amp; Transactions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             {/* Payment Overview */}
             <Card className="lg:col-span-3 border border-neutral-200 shadow-none flex flex-col rounded-none bg-white">
                <CardHeader className="pb-4 border-b border-neutral-100"><CardTitle className="text-xs font-bold uppercase text-black tracking-wider">Payment Overview</CardTitle></CardHeader>
                <CardContent className="space-y-4 flex-grow p-4">
                   <PaymentStat icon={Calendar} label="Today's Collections" value={`₹ ${data.stats.today_revenue.toLocaleString()}`} />
                   <PaymentStat icon={Calendar} label="This Month Collections" value={`₹ ${data.stats.monthly_revenue.toLocaleString()}`} />
                   <PaymentStat icon={Calendar} label="Total Collections (All Time)" value={`₹ ${data.stats.total_revenue.toLocaleString()}`} />
                </CardContent>
             </Card>

             {/* Recent Transactions */}
             <Card className="lg:col-span-6 border border-neutral-200 shadow-none overflow-hidden flex flex-col rounded-none bg-white">
                <CardHeader className="pb-3 border-b border-neutral-100"><CardTitle className="text-xs font-bold uppercase text-black tracking-wider">Recent Transactions</CardTitle></CardHeader>
                <CardContent className="p-0 flex-grow">
                   <div className="overflow-x-auto">
                      <table className="w-full text-[11px] text-left">
                        <thead className="bg-neutral-50 text-neutral-500 uppercase font-bold text-[9px] tracking-wider border-b border-neutral-200">
                           <tr>
                             <th className="px-4 py-3">Transaction ID</th>
                             <th className="px-4 py-3">Booking ID</th>
                             <th className="px-4 py-3">Guest Name</th>
                             <th className="text-right px-4 py-3">Amount</th>
                             <th className="text-center px-4 py-3">Method</th>
                             <th className="text-center px-4 py-3">Date</th>
                             <th className="text-right px-4 py-3">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                           {data.recent_bookings.map((t: any, i: number) => (
                             <tr key={i} className="hover:bg-neutral-50 transition-colors">
                               <td className="px-4 py-3 text-neutral-400 font-mono text-[10px]">TXN{t.booking_id}</td>
                               <td className="px-4 py-3 font-mono font-bold text-black">{t.booking_id}</td>
                               <td className="px-4 py-3 font-bold text-black uppercase">{t.guest_name}</td>
                               <td className="px-4 py-3 text-right font-mono font-bold text-black">₹{parseFloat(t.total_amount).toLocaleString()}</td>
                               <td className="px-4 py-3 text-center"><span className="text-[9px] uppercase font-mono font-bold text-neutral-600">{t.method || 'UPI'}</span></td>
                               <td className="px-4 py-3 text-center text-neutral-500 font-mono text-[10px] whitespace-nowrap">{new Date(t.check_in_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                               <td className="px-4 py-3 text-right">
                                 <span className="px-2 py-0.5 border border-neutral-300 bg-neutral-100 text-neutral-800 rounded-none text-[8px] font-mono font-bold uppercase tracking-wider">{t.status}</span>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                      </table>
                   </div>
                </CardContent>
                <div className="p-4 border-t border-neutral-200 flex justify-center">
                  <Button onClick={() => onNavigate?.('bookings')} className="bg-black hover:bg-neutral-800 text-white text-[9px] font-bold uppercase tracking-wider h-9 px-8 rounded-none transition-colors">VIEW ALL TRANSACTIONS</Button>
                </div>
             </Card>

             {/* Accounts Summary */}
             <Card className="lg:col-span-3 border border-neutral-200 shadow-none flex flex-col rounded-none bg-white">
                <CardHeader className="pb-3 border-b border-neutral-100 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase text-black tracking-wider">Accounts Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full gap-5 p-4">
                   <div className="flex-grow space-y-4">
                      <div>
                        <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Revenue</p>
                        <p className="text-base font-bold text-black font-mono">₹{data.stats.total_revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Expenses (Est.)</p>
                        <p className="text-base font-bold text-neutral-700 font-mono">₹{(data.stats.total_revenue * 0.35).toLocaleString()}</p>
                      </div>
                      <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Net Profit</p>
                          <p className="text-base font-black text-black font-mono">₹{(data.stats.total_revenue * 0.65).toLocaleString()}</p>
                        </div>
                        <div className="relative w-14 h-14">
                           <PieChart width={56} height={56}>
                              <Pie data={[{v:65},{v:35}]} innerRadius={0} outerRadius={28} dataKey="v">
                                <Cell fill="#000000" />
                                <Cell fill="#e5e5e5" />
                              </Pie>
                            </PieChart>
                        </div>
                      </div>
                   </div>
                   
                   {/* Payment Methods Chart */}
                   <div className="pt-3 border-t border-neutral-200">
                      <p className="text-[10px] font-bold text-black mb-3 text-center tracking-wider uppercase">Payment Methods</p>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 relative shrink-0">
                          <PieChart width={80} height={80}>
                              <Pie 
                                data={data.payment_methods || []} 
                                innerRadius={24} 
                                outerRadius={38} 
                                dataKey="amount" 
                                nameKey="method" 
                                paddingAngle={1}
                              >
                                {(data.payment_methods || []).map((_, i) => (
                                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => [`₹${parseFloat(value).toLocaleString()}`, 'Amount']} />
                            </PieChart>
                        </div>
                        <div className="flex-grow space-y-1 max-h-[90px] overflow-y-auto pr-1">
                           {(data.payment_methods || []).map((item, i) => (
                             <LegendItem 
                               key={i}
                               colorHex={COLORS[i % COLORS.length]}
                               label={item.method} 
                               percent={`${item.percentage}%`} 
                             />
                           ))}
                        </div>
                      </div>
                   </div>

                    {/* Booking Channels Chart */}
                    <div className="pt-3 border-t border-neutral-200">
                       <p className="text-[10px] font-bold text-black mb-3 text-center tracking-wider uppercase">Booking Channels</p>
                       <div className="flex items-center gap-4">
                         <div className="w-20 h-20 relative shrink-0">
                           <PieChart width={80} height={80}>
                               <Pie 
                                 data={data.booking_sources || []} 
                                 innerRadius={24} 
                                 outerRadius={38} 
                                 dataKey="count" 
                                 nameKey="booking_source" 
                                 paddingAngle={1}
                               >
                                 {(data.booking_sources || []).map((_, i) => (
                                   <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                 ))}
                               </Pie>
                               <Tooltip formatter={(value: any) => [`${value} bookings`, 'Volume']} />
                             </PieChart>
                         </div>
                         <div className="flex-grow space-y-1 max-h-[90px] overflow-y-auto pr-1">
                            {(() => {
                              const totalCount = (data.booking_sources || []).reduce((sum: number, b: any) => sum + (parseInt(b.count) || 0), 0) || 1;
                              return (data.booking_sources || []).map((b: any, i: number) => {
                                const percent = Math.round((parseInt(b.count) || 0) / totalCount * 100);
                                return (
                                  <LegendItem 
                                    key={i}
                                    colorHex={COLORS[i % COLORS.length]}
                                    label={b.booking_source || 'Unknown'} 
                                    percent={`${percent}%`} 
                                  />
                                );
                              });
                            })()}
                         </div>
                       </div>
                    </div>
                </CardContent>
             </Card>
          </div>
        </div>
      )}

      {activeSubTab === 'settings' && (
        <div className="space-y-6">
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-white">
            <h2 className="text-xs font-bold text-black uppercase tracking-[0.2em]">
              System Management &amp; Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
             <SettingsGroup 
               title="User Management"
               icon={Users}
               links={['Admin Users', 'Reception Users', 'Roles & Permissions']}
               action="Manage Users"
             />
             <SettingsGroup 
               title="Website Settings"
               icon={Layout}
               links={['General Settings', 'SEO Settings', 'Social Links', 'Custom Code']}
               action="Manage Settings"
             />
             <SettingsGroup 
               title="Email &amp; Notifications"
               icon={Mail}
               links={['Email Templates', 'Booking Confirmation', 'Invoice Email', 'Check-in Email']}
               action="Manage Emails"
               onActionClick={() => alert('Sending diagnostic mail... check logs.')}
             />
             <SettingsGroup 
               title="Rooms &amp; Pricing"
               icon={Hotel}
               links={['Room Types', 'Pricing Management', 'Taxes & Charges', 'Season & Offers']}
               action="Manage Pricing"
             />
             <SettingsGroup 
               title="Other Management"
               icon={Settings}
               links={['Guests', 'Documents', 'Amenities', 'Hotel Information']}
               action="Manage All"
             />
              <SettingsGroup 
               title="Backup &amp; Security"
               icon={Shield}
               links={['Database Backup', 'System Logs', 'Activity Logs', 'Security Settings']}
               action="Manage Security"
             />
             <SettingsGroup 
               title="Database Reset"
               icon={X}
               links={['Clear Bookings', 'Clear Payments', 'Clear Guest Directory', 'Reset Live Inventory']}
               action="RESET ALL BOOKING DATA"
               onActionClick={handleClearData}
             />
          </div>
        </div>
      )}

    </div>
  );
};


const ManagementBox = ({ title, items, footer, onFooterClick }: any) => (
  <Card className="border border-gray-200 shadow-xs rounded-lg flex flex-col h-full bg-white">
    <CardHeader className="pb-3 border-b border-gray-100">
      <CardTitle className="text-sm font-medium text-gray-800 text-center">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-0 flex-grow">
       {items.map((it: any, i: number) => (
          <div key={i} className={`flex items-center gap-3 p-3 px-5 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group ${it.active ? 'bg-[#f0fdf4]' : ''}`}>
             <div className={`p-1.5 border rounded-md ${it.active ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]' : 'border-gray-200 text-gray-400 group-hover:text-gray-700 group-hover:border-gray-300'}`}>
                {it.icon ? <it.icon size={14} /> : <div className="w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px]">■</div>}
             </div>
             <span className={`text-xs ${it.active ? 'text-[#059669] font-medium' : 'text-gray-600'}`}>{it.label}</span>
          </div>
       ))}
    </CardContent>
    <div className="p-4 border-t border-gray-100">
       <Button onClick={onFooterClick} className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-medium h-9 rounded-md transition-colors shadow-xs">{footer}</Button>
    </div>
  </Card>
);

const PaymentStat = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center gap-3.5 bg-white p-4 rounded-lg border border-gray-200 shadow-xs">
    <div className="w-9 h-9 rounded-md bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-600">
      <Icon size={16} />
    </div>
    <div className="flex flex-col">
      <span className="text-[11px] font-medium text-gray-500">{label}</span>
      <span className="text-base font-semibold tracking-tight text-gray-900 font-mono">{value}</span>
    </div>
  </div>
);

const LegendItem = ({ colorHex, label, percent }: any) => (
  <div className="flex items-center justify-between gap-3 group cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors">
    <div className="flex items-center gap-2">
      <div 
        className="w-2.5 h-2.5 rounded-full" 
        style={colorHex ? { backgroundColor: colorHex } : { backgroundColor: '#2563eb' }}
      />
      <span className="text-xs text-gray-600">{label}</span>
    </div>
    <span className="text-xs font-mono text-gray-400">{percent}</span>
  </div>
);

const MiniStat = ({ icon: Icon, label, value, onClick }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-4.5 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between hover:border-gray-300 hover:shadow-sm transition-all ${onClick ? 'cursor-pointer select-none active:bg-gray-50' : ''}`}
    >
      <div className="space-y-1">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <h4 className="text-xl font-semibold text-gray-900 tracking-tight leading-none tabular-nums">{value}</h4>
      </div>
      <div className="w-9 h-9 rounded-lg border border-gray-100 bg-gray-50 text-gray-600 flex items-center justify-center shrink-0">
        <Icon size={17} />
      </div>
    </div>
  );
};

const SettingsGroup = ({ title, icon: Icon, links, action, onActionClick }: any) => (
  <Card className="border border-gray-200 shadow-xs rounded-lg h-fit bg-white">
    <CardHeader className="pb-2 border-b border-gray-100"><CardTitle className="text-xs font-medium text-gray-800 flex items-center gap-2">
       <Icon size={14} className="text-gray-500" /> {title}
    </CardTitle></CardHeader>
    <CardContent className="p-3">
       <div className="space-y-1.5">
          {links.map((link: string, i: number) => (
            <div key={i} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded group">
               <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-600 transition-colors"></div>
               <span className="text-xs text-gray-600 group-hover:text-gray-900">{link}</span>
            </div>
          ))}
       </div>
       <Button onClick={onActionClick} className="w-full mt-4 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-medium h-8 py-0 rounded-md transition-colors shadow-xs">
          {action}
       </Button>
    </CardContent>
  </Card>
);

const XCircleIcon = ({ size, className }: any) => <AlertCircle size={size} className={`${className} rotate-45`} />;
