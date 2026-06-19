import { BedDouble, FileText, TrendingUp, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { pieData, revenueData } from '../data';
import { AdminStat } from './AdminStat';

export const AnalyticsView = () => (
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
      <AdminStat title="Total Revenue" value="â‚¹12.84L" change="+12.5%" icon={TrendingUp} />
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
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
);

