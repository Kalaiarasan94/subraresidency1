import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, 
  Download, ArrowUpRight,
  Filter, RefreshCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { API_BASE_URL } from '../../../lib/api';

export const AdminAnalyticsView = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

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

  if (loading) return <div>Loading reports...</div>;

  const COLORS = ['#0f3a20', '#cda052', '#3b82f6', '#ef4444'];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Performance & Reports</h1>
          <p className="text-sm text-slate-500 font-medium">Detailed breakdown of residency revenue and occupancy.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="border-slate-200 font-bold text-xs uppercase tracking-widest px-6 h-12 rounded-xl">
             <Download size={16} className="mr-2" /> Export PDF
           </Button>
           <Button onClick={fetchData} className="bg-emerald-900 text-white font-bold text-xs uppercase tracking-widest px-6 h-12 rounded-xl">
             <RefreshCcw size={16} className="mr-2" /> Refresh Data
           </Button>
        </div>
      </div>

      {/* REVENUE GROWTH CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="border-none shadow-sm bg-emerald-900 text-white overflow-hidden relative">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
            <CardContent className="p-8">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Total Estimated Revenue</p>
               <h3 className="text-4xl font-black mb-4">₹45.8L</h3>
               <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <TrendingUp size={16} /> <span>+22.4% from last month</span>
               </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm">
            <CardContent className="p-8">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Occupancy Rate</p>
               <h3 className="text-4xl font-black text-slate-800 mb-4">84.2%</h3>
               <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <ArrowUpRight size={16} /> <span>High season peak</span>
               </div>
            </CardContent>
         </Card>
         <Card className="border-none shadow-sm">
            <CardContent className="p-8">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Avg. Nightly Rate</p>
               <h3 className="text-4xl font-black text-slate-800 mb-4">₹4,250</h3>
               <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <TrendingDown size={16} /> <span>-2.1% price correction</span>
               </div>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle className="text-sm font-black uppercase text-slate-800">Revenue Generation Trend</CardTitle>
               <div className="flex gap-2">
                  <span className="text-[10px] font-black uppercase text-slate-400 px-3 py-1 bg-slate-50 rounded-full">Monthly</span>
               </div>
            </CardHeader>
            <CardContent className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.chart_data}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                     <Tooltip />
                     <Area type="monotone" dataKey="bookings" stroke="#0f3a20" fill="#0f3a2010" strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         <Card className="border-none shadow-sm">
            <CardHeader>
               <CardTitle className="text-sm font-black uppercase text-slate-800">Occupancy by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Deluxe', value: 85 },
                    { name: 'Suite', value: 92 },
                    { name: 'Family', value: 74 },
                    { name: 'Standard', value: 68 }
                  ]}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} />
                     <YAxis axisLine={false} tickLine={false} />
                     <Bar dataKey="value" fill="#cda052" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <Card className="border-none shadow-sm">
            <CardHeader><CardTitle className="text-sm font-black uppercase text-slate-800">Payment Channels</CardTitle></CardHeader>
            <CardContent className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie data={[{n:'UPI', v:65}, {n:'Card', v:25}, {n:'Cash', v:10}]} dataKey="v" nameKey="n" innerRadius={60} outerRadius={80}>
                        {COLORS.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </CardContent>
         </Card>

         <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
             <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-black uppercase text-slate-800">Top Revenue Contributors</CardTitle>
                <Filter size={18} className="text-slate-300" />
             </CardHeader>
             <CardContent className="p-0">
                <table className="w-full text-sm">
                   <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                      <tr>
                         <th className="text-left px-6 py-4">Source</th>
                         <th className="text-left px-6 py-4">Bookings</th>
                         <th className="text-right px-6 py-4">Contribution</th>
                         <th className="text-right px-6 py-4">Growth</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {[
                        { s: 'Direct Website', b: 420, c: '₹22,40,000', g: '+18.5%' },
                        { s: 'Booking.com', b: 185, c: '₹9,80,000', g: '+4.2%' },
                        { s: 'Walk-in', b: 92, c: '₹5,30,000', g: '-1.5%' },
                        { s: 'MakeMyTrip', b: 64, c: '₹3,10,000', g: '+12.0%' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-bold text-slate-800">{row.s}</td>
                           <td className="px-6 py-4 text-slate-500 font-medium">{row.b} stays</td>
                           <td className="px-6 py-4 text-right font-black text-emerald-900">{row.c}</td>
                           <td className="px-6 py-4 text-right">
                              <span className={`text-[10px] font-black ${row.g.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>{row.g}</span>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </CardContent>
         </Card>
      </div>
    </div>
  );
};
