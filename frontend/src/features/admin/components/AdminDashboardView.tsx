import { useState, useEffect } from 'react';
import { 
  Users, Hotel, Calendar, CreditCard, 
  TrendingUp, Mail, 
  Settings, Shield, Layout, 
  FileText, BarChart3, PieChart as PieIcon,
  CheckCircle,
  AlertCircle, History, Package, LayoutDashboard, LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  AreaChart, Area, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

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

export const AdminDashboardView = ({ activeSubTab = 'overview' }: { activeSubTab?: string }) => {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeSubTab]);

  const fetchData = async () => {
     try {
       const resp = await fetch('http://localhost:8001/api/index.php/dashboard/admin');
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
        <p className="text-emerald-900 font-bold animate-pulse uppercase tracking-widest text-[10px]">Synchronizing System Data...</p>
      </div>
    </div>
  );

  if (!data) return <div className="p-10 text-rose-600 font-bold">Error: Connection to Management API lost.</div>;

  const COLORS = ['#0f3a20', '#cda052', '#3b82f6', '#ef4444'];

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* VIEW CONDITIONAL RENDERING */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-6">
            <h2 className="text-[11px] font-black text-emerald-900 uppercase tracking-[0.3em] flex items-center gap-3">
              <div className="w-8 h-[2px] bg-emerald-900"></div>
              Dashboard Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
              <MiniStat icon={Calendar} label="Total Bookings" value={data.stats.total_bookings} color="bg-blue-50 text-blue-600" />
              <MiniStat icon={Users} label="Today's Bookings" value={data.stats.today_bookings} color="bg-emerald-50 text-emerald-600" />
              <MiniStat icon={TrendingUp} label="Today's Revenue" value={`₹${data.stats.today_revenue.toLocaleString()}`} color="bg-amber-50 text-amber-600" isMoney />
              <MiniStat icon={CreditCard} label="This Month" value={`₹${data.stats.monthly_revenue.toLocaleString()}`} color="bg-purple-50 text-purple-600" isMoney />
              <MiniStat icon={Hotel} label="Total Rooms" value={data.stats.total_rooms} color="bg-slate-50 text-slate-600" />
              <MiniStat icon={CheckCircle} label="Available" value={data.stats.available_rooms} color="bg-teal-50 text-teal-600" />
              <MiniStat icon={AlertCircle} label="Occupied" value={data.stats.occupied_rooms} color="bg-orange-50 text-orange-600" />
              <MiniStat icon={XCircleIcon} label="Cancelled" value={data.stats.cancelled_bookings} color="bg-rose-50 text-rose-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="lg:col-span-1 border-none shadow-sm">
                 <CardHeader className="pb-2"><CardTitle className="text-xs font-black uppercase text-slate-400">Booking Chart</CardTitle></CardHeader>
                 <CardContent className="h-48 px-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.chart_data}>
                        <Area type="monotone" dataKey="bookings" stroke="#0f3a20" fill="#0f3a2010" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                 </CardContent>
              </Card>

              <Card className="lg:col-span-1 border-none shadow-sm">
                 <CardHeader className="pb-2"><CardTitle className="text-xs font-black uppercase text-slate-400">Revenue Overview</CardTitle></CardHeader>
                 <CardContent className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.revenue_overview} innerRadius={40} outerRadius={55} paddingAngle={5} dataKey="value">
                          {data.revenue_overview.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                 </CardContent>
              </Card>

              <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
                 <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-black uppercase text-slate-400">Recent Bookings</CardTitle>
                    <Button variant="link" className="text-[10px] uppercase font-bold text-emerald-700 p-0 h-auto">View All</Button>
                 </CardHeader>
                 <CardContent className="p-0">
                    <table className="w-full text-[11px]">
                       <thead className="bg-slate-50 text-slate-400 uppercase font-black">
                          <tr>
                            <th className="text-left px-4 py-2">ID</th>
                            <th className="text-left px-4 py-2">Guest</th>
                            <th className="text-left px-4 py-2">Check-in</th>
                            <th className="text-right px-4 py-2">Status</th>
                          </tr>
                       </thead>
                       <tbody>
                          {data.recent_bookings.map(b => (
                            <tr key={b.booking_id} className="border-t border-slate-50">
                              <td className="px-4 py-2 font-bold text-slate-900">{b.booking_id}</td>
                              <td className="px-4 py-2 text-slate-600">{b.guest_name}</td>
                              <td className="px-4 py-2 text-slate-400">{b.check_in_date}</td>
                              <td className="px-4 py-2 text-right">
                                 <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                   {b.status}
                                 </span>
                              </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'rooms' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#0b336b] text-white p-3 rounded-t-xl -mx-8 -mt-8 mb-8 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 px-4">
              Booking & Room Management
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
             />

             {/* Room Management */}
             <ManagementBox 
               title="Room Management" 
               items={[
                 { label: 'Room Types', icon: Package },
                 { label: `All Rooms (${data.stats.total_rooms})`, icon: Hotel },
                 { label: `Available Rooms (${data.stats.available_rooms})`, icon: CheckCircle },
                 { label: `Booked Rooms (${data.stats.occupied_rooms})`, icon: Calendar },
                 { label: `Maintenance Rooms (${data.stats.maintenance_rooms})`, icon: AlertCircle },
               ]}
               footer="MANAGE ROOMS"
             />

             {/* Room Availability Form - Interactive */}
             <Card className="border-none shadow-sm flex flex-col h-full bg-white group hover:shadow-md transition-all">
                <CardHeader className="pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-black uppercase text-[#0b336b]">Room Search</CardTitle>
                  <Calendar size={14} className="text-emerald-500" />
                </CardHeader>
                <CardContent className="space-y-4 flex-grow px-6">
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Accommodation Type</label>
                      <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none appearance-none">
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
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-500 transition-colors">
                            <Calendar size={14} />
                          </div>
                          <input 
                            type="date" 
                            defaultValue={new Date().toISOString().split('T')[0]} 
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Departure Date</label>
                        <div className="relative group/input">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/input:text-emerald-500 transition-colors">
                            <Calendar size={14} />
                          </div>
                          <input 
                            type="date" 
                            defaultValue={new Date(Date.now() + 86400000).toISOString().split('T')[0]} 
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" 
                          />
                        </div>
                      </div>
                   </div>
                </CardContent>
                <div className="p-4 pt-0">
                  <Button className="w-full bg-[#0b336b] hover:bg-black text-white text-[10px] font-black uppercase h-11 rounded-xl shadow-lg shadow-blue-900/10 active:scale-95 transition-all">
                    Search Availability
                  </Button>
                </div>
             </Card>

             {/* Room Status Live */}
             <Card className="border-none shadow-sm flex flex-col h-full">
                <CardHeader className="pb-4"><CardTitle className="text-xs font-black uppercase text-[#0b336b] text-center">Room Status (Live)</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-2 gap-2 flex-grow overflow-y-auto max-h-[350px] custom-scrollbar pr-2">
                   {data.rooms_grid.map((r: any) => (
                      <StatusBox key={r.number} label={r.number} info={r.category} status={r.status === 'booked' ? 'occupied' : r.status} />
                   ))}
                </CardContent>
                <div className="p-4">
                  <Button className="w-full bg-[#0b336b] hover:bg-black text-white text-[10px] font-black uppercase h-10 tracking-widest">VIEW ALL ROOMS</Button>
                </div>
             </Card>

             {/* Reports & Analytics */}
             <ManagementBox 
               title="Reports & Analytics" 
               items={[
                 { label: 'Booking Report', icon: FileText },
                 { label: 'Revenue Report', icon: TrendingUp },
                 { label: 'Occupancy Report', icon: PieIcon },
                 { label: 'Payment Report', icon: CreditCard },
                 { label: 'Cancellation Report', icon: AlertCircle },
                 { label: 'Guest Report', icon: Users },
               ]}
               footer="VIEW REPORTS"
             />
          </div>
        </div>
      )}

      {activeSubTab === 'finance' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-[#0b336b] text-white p-3 rounded-t-xl -mx-8 -mt-8 mb-8 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider px-4">
              Payments, Accounts & Transactions
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
             {/* Payment Overview */}
             <Card className="lg:col-span-3 border-none shadow-sm flex flex-col">
                <CardHeader className="pb-4"><CardTitle className="text-sm font-black text-[#0b336b]">Payment Overview</CardTitle></CardHeader>
                <CardContent className="space-y-6 flex-grow">
                   <PaymentStat icon={Calendar} label="Today's Collections" value={`₹ ${data.stats.today_revenue.toLocaleString()}`} color="text-emerald-600" />
                   <PaymentStat icon={Calendar} label="This Month Collections" value={`₹ ${data.stats.monthly_revenue.toLocaleString()}`} color="text-blue-600" />
                   <PaymentStat icon={Calendar} label="Total Collections (All Time)" value={`₹ ${data.stats.total_revenue.toLocaleString()}`} color="text-emerald-700" />
                </CardContent>
             </Card>

             {/* Recent Transactions */}
             <Card className="lg:col-span-6 border-none shadow-sm overflow-hidden flex flex-col">
                <CardHeader className="pb-4"><CardTitle className="text-sm font-black text-[#0b336b]">Recent Transactions</CardTitle></CardHeader>
                <CardContent className="p-0 flex-grow">
                   <div className="overflow-x-auto">
                     <table className="w-full text-[11px]">
                       <thead className="bg-slate-50 text-slate-400 uppercase font-bold border-b border-slate-100">
                          <tr>
                            <th className="text-left px-4 py-3">Transaction ID</th>
                            <th className="text-left px-4 py-3">Booking ID</th>
                            <th className="text-left px-4 py-3">Guest Name</th>
                            <th className="text-right px-4 py-3">Amount</th>
                            <th className="text-center px-4 py-3">Method</th>
                            <th className="text-center px-4 py-3">Date</th>
                            <th className="text-right px-4 py-3">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-50">
                          {data.recent_bookings.map((t: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-slate-400 font-medium">TXN{t.booking_id}</td>
                              <td className="px-4 py-3 font-bold text-slate-600">{t.booking_id}</td>
                              <td className="px-4 py-3 font-bold text-slate-900">{t.guest_name}</td>
                              <td className="px-4 py-3 text-right font-bold text-emerald-900">₹ {parseFloat(t.total_amount).toLocaleString()}</td>
                              <td className="px-4 py-3 text-center"><span className="text-[9px] uppercase font-bold text-slate-500">{t.method || 'UPI'}</span></td>
                              <td className="px-4 py-3 text-center text-slate-500 whitespace-nowrap">{new Date(t.check_in_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                              <td className="px-4 py-3 text-right">
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase">{t.status}</span>
                              </td>
                            </tr>
                          ))}
                       </tbody>
                     </table>
                   </div>
                </CardContent>
                <div className="p-4 flex justify-center">
                  <Button className="bg-[#0b336b] hover:bg-black text-white text-[10px] font-black uppercase h-9 px-10 rounded">VIEW ALL TRANSACTIONS</Button>
                </div>
             </Card>

             {/* Accounts Summary */}
             <Card className="lg:col-span-3 border-none shadow-sm flex flex-col">
                <CardHeader className="pb-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-black text-[#0b336b]">Accounts Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-full gap-6">
                   <div className="flex-grow space-y-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Revenue</p>
                        <p className="text-lg font-black text-emerald-700">₹ {data.stats.total_revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Expenses (Est.)</p>
                        <p className="text-lg font-black text-rose-600">₹ {(data.stats.total_revenue * 0.35).toLocaleString()}</p>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Net Profit</p>
                          <p className="text-lg font-black text-emerald-900">₹ {(data.stats.total_revenue * 0.65).toLocaleString()}</p>
                        </div>
                        <div className="relative w-16 h-16">
                           <ResponsiveContainer width={64} height={64}>
                              <PieChart>
                                <Pie data={[{v:65},{v:35}]} innerRadius={0} outerRadius={32} dataKey="v">
                                  <Cell fill="#1a5d2a" />
                                  <Cell fill="#94a3b8" />
                                </Pie>
                              </PieChart>
                           </ResponsiveContainer>
                           <CreditCard size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
                        </div>
                      </div>
                   </div>
                   
                   {/* Payment Methods Chart */}
                   <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs font-black text-[#0b336b] mb-4 text-center">Payment Methods</p>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 relative">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie data={[{v:55},{v:25},{v:15},{v:5}]} innerRadius={30} outerRadius={45} dataKey="v" paddingAngle={2}>
                                <Cell fill="#0b336b" />
                                <Cell fill="#fca311" />
                                <Cell fill="#1a5d2a" />
                                <Cell fill="#5bba6f" />
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
                           <LegendItem color="bg-[#0b336b]" label="UPI" percent="55%" />
                           <LegendItem color="bg-[#fca311]" label="Card" percent="25%" />
                           <LegendItem color="bg-[#1a5d2a]" label="Net Banking" percent="15%" />
                           <LegendItem color="bg-[#5bba6f]" label="Cash" percent="5%" />
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
          <h2 className="text-[11px] font-black text-emerald-900 uppercase tracking-[0.3em] flex items-center gap-3">
            <div className="w-8 h-[2px] bg-emerald-900"></div>
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


const ManagementBox = ({ title, items, footer }: any) => (
  <Card className="border-none shadow-sm flex flex-col h-full bg-white">
    <CardHeader className="pb-4"><CardTitle className="text-xs font-black uppercase text-[#0b336b] text-center">{title}</CardTitle></CardHeader>
    <CardContent className="p-0 flex-grow">
       {items.map((it: any, i: number) => (
         <div key={i} className={`flex items-center gap-3 p-3 px-6 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group ${it.active ? 'bg-emerald-50/50' : ''}`}>
            <div className={`p-1.5 rounded-lg ${it.active ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'}`}>
               {it.icon ? <it.icon size={14} /> : <div className="w-3.5 h-3.5 flex items-center justify-center font-black text-[10px]">●</div>}
            </div>
            <span className={`text-[11px] font-bold ${it.active ? 'text-emerald-900' : it.color || 'text-slate-600'}`}>{it.label}</span>
         </div>
       ))}
    </CardContent>
    <div className="p-4">
       <Button className="w-full bg-[#0b336b] hover:bg-black text-white text-[9px] font-black uppercase h-9 rounded">{footer}</Button>
    </div>
  </Card>
);

const StatusBox = ({ label, info, status }: any) => (
  <div className={`p-3 rounded-xl border border-slate-100 text-center transition-all cursor-pointer shadow-sm flex flex-col items-center justify-center gap-1 ${
    status === 'available' ? 'bg-emerald-50 text-emerald-900' :
    status === 'occupied' ? 'bg-rose-50 text-rose-900' :
    'bg-amber-50 text-amber-900'
  }`}>
    <div className="text-sm font-black">{label}</div>
    <div className="text-[8px] font-bold uppercase opacity-60 leading-tight">{info}</div>
    <div className="text-[10px] font-black uppercase tracking-tighter mt-1">{status}</div>
  </div>
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
  <div className="flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors">
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`}></div>
      <span className="text-[10px] font-bold text-slate-600">{label}</span>
    </div>
    <span className="text-[10px] font-black text-slate-400">{percent}</span>
  </div>
);

const MiniStat = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col justify-between shadow-sm">
    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mb-2`}>
      <Icon size={14} />
    </div>
    <div className="space-y-1">
      <h4 className="text-lg font-black text-slate-800 tracking-tight leading-none">{value}</h4>
      <p className="text-[10px] font-black uppercase text-slate-400 whitespace-nowrap overflow-hidden text-ellipsis">{label}</p>
    </div>
  </div>
);

const SettingsGroup = ({ title, icon: Icon, links, action, onActionClick }: any) => (
  <Card className="border-none shadow-sm h-fit">
    <CardHeader className="pb-1 py-1"><CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
       <Icon size={12} className="text-emerald-700" /> {title}
    </CardTitle></CardHeader>
    <CardContent className="pb-3 px-3">
       <div className="space-y-1.5 pt-2">
          {links.map((link: string, i: number) => (
            <div key={i} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded group">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-emerald-500 transition-colors"></div>
               <span className="text-[11px] font-bold text-slate-600">{link}</span>
            </div>
          ))}
       </div>
       <Button onClick={onActionClick} className="w-full mt-4 bg-emerald-900 hover:bg-black text-white text-[9px] font-black uppercase h-8 py-0 rounded-lg">
          {action}
       </Button>
    </CardContent>
  </Card>
);


const XCircleIcon = ({ size, className }: any) => <AlertCircle size={size} className={`${className} rotate-45`} />;
