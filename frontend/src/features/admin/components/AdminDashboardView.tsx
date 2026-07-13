import { useState, useEffect } from 'react';
import { 
  Users, Hotel, Calendar, CreditCard, 
  TrendingUp, Mail, 
  Settings, Shield, Layout, 
  FileText, PieChart as PieIcon,
  CheckCircle,
  AlertCircle, History, LayoutDashboard, LogOut
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

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const fetchData = async () => {
     try {
       const resp = await fetch(`${API_BASE_URL}/dashboard/admin`);
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

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <p className="text-indigo-900 font-bold animate-pulse uppercase tracking-widest text-[10px]">Synchronizing System Data...</p>
      </div>
    </div>
  );

  if (!data) return <div className="p-10 text-rose-600 font-bold">Error: Connection to Management API lost.</div>;

  const COLORS = ['#4f46e5', '#8b5cf6', '#6366f1', '#06b6d4'];

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* VIEW CONDITIONAL RENDERING */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-6">
            <h2 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
              <div className="w-8 h-[2px] bg-indigo-600"></div>
              Dashboard Overview
            </h2>
            
            {/* Stats Cards Row (2 rows of 4 cards on desktop, spacious) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MiniStat icon={Calendar} label="Total Bookings" value={data.stats.total_bookings} color="bg-blue-50 text-blue-600" />
              <MiniStat icon={Users} label="Today's Bookings" value={data.stats.today_bookings} color="bg-emerald-50 text-emerald-600" />
              <MiniStat icon={TrendingUp} label="Today's Revenue" value={`₹${data.stats.today_revenue.toLocaleString()}`} color="bg-amber-50 text-amber-600" />
              <MiniStat icon={CreditCard} label="This Month Revenue" value={`₹${data.stats.monthly_revenue.toLocaleString()}`} color="bg-purple-50 text-purple-600" />
              
              <MiniStat icon={Hotel} label="Total Rooms" value={data.stats.total_rooms} color="bg-slate-50 text-slate-600" />
              <MiniStat icon={CheckCircle} label="Available Rooms" value={data.stats.available_rooms} color="bg-teal-50 text-teal-600" />
              <MiniStat icon={AlertCircle} label="Occupied Rooms" value={data.stats.occupied_rooms} color="bg-orange-50 text-orange-600" />
              <MiniStat icon={XCircleIcon} label="Cancelled Bookings" value={data.stats.cancelled_bookings} color="bg-rose-50 text-rose-600" />
            </div>

            {/* First Row of Charts (Spacious & Detailed) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Booking Trend Chart */}
              <Card className="lg:col-span-2 border border-slate-100/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between h-[340px]">
                 <div className="mb-2">
                   <h3 className="text-xs font-black tracking-widest uppercase text-slate-400">Booking Trend</h3>
                   <p className="text-[10px] text-slate-400 mt-0.5">Daily volume over the last 7 days</p>
                 </div>
                 <div className="h-[230px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f8fafc" vertical={false} />
                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} dy={8} />
                        <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} width={30} dx={-4} />
                        <Area type="monotone" dataKey="bookings" stroke="#4f46e5" fill="url(#colorBookings)" strokeWidth={2.5} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#0f172a', 
                            borderRadius: '12px', 
                            border: 'none', 
                            color: '#fff', 
                            fontSize: '10px',
                            fontWeight: 'bold',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </Card>

              {/* Revenue Breakdown */}
              <Card className="lg:col-span-1 border border-slate-100/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between h-[340px]">
                 <div>
                   <h3 className="text-xs font-black tracking-widest uppercase text-slate-400">Revenue Overview</h3>
                   <p className="text-[10px] text-slate-400 mt-0.5">Estimated this month's revenue share</p>
                 </div>
                 <div className="h-[140px] flex items-center justify-center relative mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.revenue_overview} innerRadius={42} outerRadius={56} paddingAngle={4} dataKey="value">
                          {data.revenue_overview.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                          contentStyle={{ 
                            backgroundColor: '#0f172a', 
                            borderRadius: '12px', 
                            border: 'none', 
                            color: '#fff', 
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total</span>
                      <span className="text-sm font-black text-slate-800">₹{data.stats.monthly_revenue.toLocaleString('en-IN')}</span>
                    </div>
                 </div>
                 <div className="space-y-2 mt-2 border-t border-slate-100 pt-4">
                   {(() => {
                     const totalRev = data.revenue_overview.reduce((sum, item) => sum + item.value, 0) || 1;
                     return data.revenue_overview.map((item, idx) => (
                       <div key={idx} className="flex items-center justify-between text-[10px] font-bold text-slate-650">
                         <div className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                           <span>{item.name}</span>
                         </div>
                         <span className="text-slate-850 font-extrabold">₹{item.value.toLocaleString('en-IN')} ({Math.round(item.value / totalRev * 100)}%)</span>
                       </div>
                     ));
                   })()}
                 </div>
              </Card>
            </div>

            {/* Second Row of Operations & Grid (Spacious & Clean) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Bookings Table */}
              <Card className="lg:col-span-2 border border-slate-100/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[380px]">
                 <div className="p-6 pb-2 flex flex-row items-center justify-between border-b border-slate-50">
                    <div>
                      <h3 className="text-xs font-black tracking-widest uppercase text-slate-400">Recent Bookings</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Most recent reservation entries</p>
                    </div>
                    <Button variant="link" className="text-[9px] uppercase font-black tracking-widest text-indigo-600 hover:text-indigo-800 p-0 h-auto" onClick={() => onNavigate?.('bookings')}>View All</Button>
                 </div>
                 <div className="flex-grow overflow-y-auto">
                    <table className="w-full text-[11px] text-left">
                       <thead className="bg-slate-50/60 text-slate-455 uppercase font-black text-[9px] tracking-widest border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4">Booking ID</th>
                            <th className="px-6 py-4">Guest</th>
                            <th className="px-6 py-4">Check-in</th>
                            <th className="text-right px-6 py-4">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100/60">
                          {data.recent_bookings.map(b => (
                            <tr key={b.booking_id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="px-6 py-4 font-extrabold text-slate-800">{b.booking_id}</td>
                              <td className="px-6 py-4 text-slate-655 font-bold uppercase tracking-tight">{b.guest_name}</td>
                              <td className="px-6 py-4 text-slate-400 font-bold font-sans">{b.check_in_date}</td>
                              <td className="px-6 py-4 text-right">
                                 <span className={`px-3 py-1 rounded-full text-[8px] font-black border uppercase tracking-wider ${
                                   b.status === 'confirmed' ? 'bg-indigo-50 border-indigo-150 text-indigo-700' :
                                   b.status === 'checked-in' ? 'bg-emerald-50 border-emerald-150 text-emerald-700' :
                                   b.status === 'checked-out' ? 'bg-slate-50 border-slate-200 text-slate-600' :
                                   b.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                   'bg-rose-50 border-rose-150 text-rose-700'
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
              <Card className="lg:col-span-1 border border-slate-100/80 shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between h-[380px]">
                 <div className="mb-2">
                   <h3 className="text-xs font-black tracking-widest uppercase text-slate-400">Live Occupancy Grid</h3>
                   <p className="text-[10px] text-slate-400 mt-0.5">Real-time status of all hotel rooms</p>
                 </div>
                 <div className="flex-grow overflow-y-auto mt-4 pr-1 custom-scrollbar">
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {data.rooms_grid.map((room, idx) => (
                        <div 
                          key={idx}
                          title={`${room.number} - ${room.category || 'Standard'} (${room.status})`}
                          className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all ${
                            room.status === 'Available' ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800' :
                            room.status === 'Occupied' ? 'bg-rose-50/40 border-rose-100 text-rose-800' :
                            'bg-amber-50/40 border-amber-150 text-amber-800'
                          }`}
                        >
                          <span className="text-[10.5px] font-extrabold">{room.number}</span>
                          <span className="text-[7px] font-black uppercase tracking-wider mt-0.5 opacity-80">{room.status}</span>
                        </div>
                      ))}
                    </div>
                 </div>
                 <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-slate-400 mt-4 border-t border-slate-100 pt-4">
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Available</div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Occupied</div>
                   <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Maint/Clean</div>
                 </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'rooms' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl mb-8 flex items-center justify-between shadow-md shadow-indigo-950/15">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 px-2">
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
                 { label: `Cancelled (${data.stats.cancelled_bookings})`, icon: AlertCircle, color: 'text-rose-500' },
                 { label: `Pending (${data.stats.pending_bookings})`, icon: History, color: 'text-amber-500' },
               ]}
               footer="VIEW ALL"
               onFooterClick={() => onNavigate?.('bookings')}
             />

             {/* Room Availability Form - Interactive */}
             <Card className="border border-slate-100 shadow-sm flex flex-col h-full bg-white group hover:shadow-md transition-all rounded-2xl">
                <CardHeader className="pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-black uppercase text-indigo-600 tracking-wider">Room Search</CardTitle>
                  <Calendar size={14} className="text-indigo-500" />
                </CardHeader>
                <CardContent className="space-y-4 flex-grow px-6">
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Accommodation Type</label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none appearance-none">
                         <option>Standard Deluxe</option>
                         <option>Heritage Suite</option>
                         <option>Royal Temple View</option>
                         <option>Executive Family</option>
                      </select>
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Arrival Date</label>
                        <div className="relative group/input">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors">
                            <Calendar size={14} />
                          </div>
                          <input 
                            type="date" 
                            defaultValue={new Date().toISOString().split('T')[0]} 
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Departure Date</label>
                        <div className="relative group/input">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-indigo-500 transition-colors">
                            <Calendar size={14} />
                          </div>
                          <input 
                            type="date" 
                            defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]} 
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" 
                          />
                        </div>
                      </div>
                   </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button onClick={() => onNavigate?.('calendar')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase h-11 rounded-xl shadow-lg shadow-indigo-500/10 active:scale-95 transition-all">
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
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 rounded-2xl mb-8 flex items-center justify-between shadow-md shadow-indigo-950/15">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] px-2">
              Payments, Accounts & Transactions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             {/* Payment Overview */}
             <Card className="lg:col-span-3 border border-slate-100 shadow-sm flex flex-col rounded-2xl bg-white">
                <CardHeader className="pb-4"><CardTitle className="text-xs font-black uppercase text-indigo-600 tracking-wider">Payment Overview</CardTitle></CardHeader>
                <CardContent className="space-y-6 flex-grow">
                   <PaymentStat icon={Calendar} label="Today's Collections" value={`₹ ${data.stats.today_revenue.toLocaleString()}`} color="text-indigo-600" />
                   <PaymentStat icon={Calendar} label="This Month Collections" value={`₹ ${data.stats.monthly_revenue.toLocaleString()}`} color="text-violet-600" />
                   <PaymentStat icon={Calendar} label="Total Collections (All Time)" value={`₹ ${data.stats.total_revenue.toLocaleString()}`} color="text-emerald-700" />
                </CardContent>
             </Card>

             {/* Recent Transactions */}
             <Card className="lg:col-span-6 border border-slate-100 shadow-sm overflow-hidden flex flex-col rounded-2xl bg-white">
                <CardHeader className="pb-4"><CardTitle className="text-xs font-black uppercase text-indigo-600 tracking-wider">Recent Transactions</CardTitle></CardHeader>
                <CardContent className="p-0 flex-grow">
                   <div className="overflow-x-auto">
                      <table className="w-full text-[11px] text-left">
                        <thead className="bg-slate-50 text-slate-455 uppercase font-black text-[9px] tracking-wider border-b border-slate-100">
                           <tr>
                             <th className="px-5 py-3">Transaction ID</th>
                             <th className="px-5 py-3">Booking ID</th>
                             <th className="px-5 py-3">Guest Name</th>
                             <th className="text-right px-5 py-3">Amount</th>
                             <th className="text-center px-5 py-3">Method</th>
                             <th className="text-center px-5 py-3">Date</th>
                             <th className="text-right px-5 py-3">Status</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/60">
                           {data.recent_bookings.map((t: any, i: number) => (
                             <tr key={i} className="hover:bg-slate-50/40 transition-colors">
                               <td className="px-5 py-3.5 text-slate-400 font-medium font-sans">TXN{t.booking_id}</td>
                               <td className="px-5 py-3.5 font-extrabold text-slate-650">{t.booking_id}</td>
                               <td className="px-5 py-3.5 font-bold text-slate-900">{t.guest_name}</td>
                               <td className="px-5 py-3.5 text-right font-extrabold text-indigo-950">₹ {parseFloat(t.total_amount).toLocaleString()}</td>
                               <td className="px-5 py-3.5 text-center"><span className="text-[9px] uppercase font-black text-slate-505">{t.method || 'UPI'}</span></td>
                               <td className="px-5 py-3.5 text-center text-slate-500 whitespace-nowrap font-sans">{new Date(t.check_in_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                               <td className="px-5 py-3.5 text-right">
                                 <span className="px-3 py-1 bg-emerald-50 border border-emerald-150 text-emerald-700 rounded-full text-[8px] font-black uppercase tracking-wider">{t.status}</span>
                               </td>
                             </tr>
                           ))}
                        </tbody>
                      </table>
                   </div>
                </CardContent>
                <div className="p-4 flex justify-center">
                  <Button onClick={() => onNavigate?.('bookings')} className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase h-10 px-10 rounded-xl shadow-lg shadow-indigo-500/10 active:scale-95 transition-all">VIEW ALL TRANSACTIONS</Button>
                </div>
             </Card>

             {/* Accounts Summary */}
             <Card className="lg:col-span-3 border border-slate-100 shadow-sm flex flex-col rounded-2xl bg-white">
                <CardHeader className="pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-black uppercase text-indigo-600 tracking-wider">Accounts Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full gap-6">
                   <div className="flex-grow space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Revenue</p>
                        <p className="text-lg font-black text-indigo-955 font-sans">₹ {data.stats.total_revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Expenses (Est.)</p>
                        <p className="text-lg font-black text-rose-600 font-sans">₹ {(data.stats.total_revenue * 0.35).toLocaleString()}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Net Profit</p>
                          <p className="text-lg font-black text-emerald-750 font-sans">₹ {(data.stats.total_revenue * 0.65).toLocaleString()}</p>
                        </div>
                        <div className="relative w-16 h-16">
                           <ResponsiveContainer width={64} height={64}>
                              <PieChart>
                                <Pie data={[{v:65},{v:35}]} innerRadius={0} outerRadius={32} dataKey="v">
                                  <Cell fill="#059669" />
                                  <Cell fill="#cbd5e1" />
                                </Pie>
                              </PieChart>
                           </ResponsiveContainer>
                           <CreditCard size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                        </div>
                      </div>
                   </div>
                   
                   {/* Payment Methods Chart */}
                   <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs font-black text-indigo-655 mb-4 text-center tracking-wide uppercase">Payment Methods</p>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={[{v:55},{v:25},{v:15},{v:5}]} innerRadius={30} outerRadius={45} dataKey="v" paddingAngle={2}>
                                <Cell fill="#4f46e5" />
                                <Cell fill="#8b5cf6" />
                                <Cell fill="#06b6d4" />
                                <Cell fill="#cbd5e1" />
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                            <p className="text-[8px] font-bold text-slate-400 uppercase leading-none">Total</p>
                            <p className="text-[10px] font-black text-slate-800 leading-tight">₹ {(data.stats.total_revenue / 100000).toFixed(2)}L</p>
                          </div>
                        </div>
                        <div className="flex-grow space-y-1">
                           <LegendItem color="bg-[#4f46e5]" label="UPI" percent="55%" />
                           <LegendItem color="bg-[#8b5cf6]" label="Card" percent="25%" />
                           <LegendItem color="bg-[#06b6d4]" label="Net Banking" percent="15%" />
                           <LegendItem color="bg-[#cbd5e1]" label="Cash" percent="5%" />
                        </div>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      )}

      {activeSubTab === 'settings' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-[11px] font-black text-indigo-950 uppercase tracking-[0.3em] flex items-center gap-3">
            <div className="w-8 h-[2px] bg-indigo-600"></div>
            System Management & Settings
          </h2>

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
               title="Email & Notifications"
               icon={Mail}
               links={['Email Templates', 'Booking Confirmation', 'Invoice Email', 'Check-in Email']}
               action="Manage Emails"
               onActionClick={() => alert('Sending diagnostic mail... check logs.')}
             />
             <SettingsGroup 
               title="Rooms & Pricing"
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
               title="Backup & Security"
               icon={Shield}
               links={['Database Backup', 'System Logs', 'Activity Logs', 'Security Settings']}
               action="Manage Security"
             />
          </div>
        </div>
      )}

    </div>
  );
};


const ManagementBox = ({ title, items, footer, onFooterClick }: any) => (
  <Card className="border border-slate-100 shadow-sm flex flex-col h-full bg-white rounded-2xl">
    <CardHeader className="pb-4"><CardTitle className="text-xs font-black uppercase text-indigo-600 tracking-wider text-center">{title}</CardTitle></CardHeader>
    <CardContent className="p-0 flex-grow">
       {items.map((it: any, i: number) => (
          <div key={i} className={`flex items-center gap-3 p-3 px-6 border-b border-slate-50 hover:bg-slate-55 transition-colors cursor-pointer group ${it.active ? 'bg-indigo-50/30' : ''}`}>
             <div className={`p-1.5 rounded-lg ${it.active ? 'bg-indigo-100 text-indigo-700' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                {it.icon ? <it.icon size={14} /> : <div className="w-3.5 h-3.5 flex items-center justify-center font-black text-[10px]">●</div>}
             </div>
             <span className={`text-[11px] font-bold ${it.active ? 'text-indigo-950 font-extrabold' : it.color || 'text-slate-600'}`}>{it.label}</span>
          </div>
       ))}
    </CardContent>
    <div className="p-4">
       <Button onClick={onFooterClick} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black uppercase h-9 rounded-xl shadow-md shadow-indigo-500/10 active:scale-95 transition-all">{footer}</Button>
    </div>
  </Card>
);

const PaymentStat = ({ icon: Icon, label, value, color }: any) => (
  <div className="flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-white">
    <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${color}`}>
      <Icon size={18} />
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
      <span className={`text-lg font-black tracking-tighter ${color}`}>{value}</span>
    </div>
  </div>
);

const LegendItem = ({ color, label, percent }: any) => (
  <div className="flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-55 p-1 rounded transition-colors">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-[10px] font-bold text-slate-655">{label}</span>
    </div>
    <span className="text-[10px] font-black text-slate-400">{percent}</span>
  </div>
);

const MiniStat = ({ icon: Icon, label, value, color }: any) => {
  const colorMap: any = {
    'bg-blue-50 text-blue-600': { border: 'border-blue-100/60', text: 'text-blue-600', bg: 'bg-blue-50/50' },
    'bg-emerald-50 text-emerald-600': { border: 'border-emerald-100/60', text: 'text-emerald-650', bg: 'bg-emerald-50/50' },
    'bg-amber-50 text-amber-600': { border: 'border-amber-100/60', text: 'text-amber-655', bg: 'bg-amber-50/50' },
    'bg-purple-50 text-purple-600': { border: 'border-purple-100/60', text: 'text-purple-600', bg: 'bg-purple-50/50' },
    'bg-slate-50 text-slate-600': { border: 'border-slate-200/60', text: 'text-slate-705', bg: 'bg-slate-50/50' },
    'bg-teal-50 text-teal-600': { border: 'border-teal-100/60', text: 'text-teal-655', bg: 'bg-teal-50/50' },
    'bg-orange-50 text-orange-600': { border: 'border-orange-100/60', text: 'text-orange-655', bg: 'bg-orange-50/50' },
    'bg-rose-50 text-rose-600': { border: 'border-rose-100/60', text: 'text-rose-655', bg: 'bg-rose-50/50' },
  };
  
  const style = colorMap[color] || { border: 'border-slate-100', text: 'text-slate-655', bg: 'bg-slate-50' };

  return (
    <div className={`relative overflow-hidden bg-white p-5 rounded-2xl border ${style.border} flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
      <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${color.includes('blue') ? 'from-blue-500 to-indigo-500' : color.includes('emerald') ? 'from-emerald-500 to-teal-500' : color.includes('amber') ? 'from-amber-500 to-yellow-500' : color.includes('purple') ? 'from-purple-500 to-violet-500' : color.includes('teal') ? 'from-teal-500 to-emerald-500' : color.includes('orange') ? 'from-orange-500 to-amber-500' : color.includes('rose') ? 'from-rose-500 to-red-500' : 'from-slate-400 to-slate-500'}`} />
      <div className={`w-9 h-9 rounded-xl ${style.bg} ${style.text} flex items-center justify-center mb-3.5 group-hover:scale-110 transition-transform`}>
        <Icon size={16} />
      </div>
      <div className="space-y-1.5 z-10">
        <h4 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none font-sans">{value}</h4>
        <p className="text-[8.5px] font-extrabold uppercase text-slate-400 tracking-wider leading-tight">{label}</p>
      </div>
    </div>
  );
};

const SettingsGroup = ({ title, icon: Icon, links, action, onActionClick }: any) => (
  <Card className="border border-slate-100 shadow-sm h-fit rounded-2xl bg-white">
    <CardHeader className="pb-1 py-1"><CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
       <Icon size={12} className="text-indigo-600" /> {title}
    </CardTitle></CardHeader>
    <CardContent className="pb-3 px-3">
       <div className="space-y-1.5 pt-2">
          {links.map((link: string, i: number) => (
            <div key={i} className="flex items-center gap-2 cursor-pointer hover:bg-slate-55 p-1 rounded group">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-600 transition-colors"></div>
               <span className="text-[11px] font-bold text-slate-655">{link}</span>
            </div>
          ))}
       </div>
       <Button onClick={onActionClick} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black uppercase h-8 py-0 rounded-lg active:scale-95 transition-all shadow-sm">
          {action}
       </Button>
    </CardContent>
  </Card>
);


const XCircleIcon = ({ size, className }: any) => <AlertCircle size={size} className={`${className} rotate-45`} />;
