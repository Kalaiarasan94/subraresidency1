import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Calendar, 
  ClipboardList, 
  CreditCard, 
  TrendingUp, 
  BedDouble, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

export const AdminDashboard = ({ stats, setActiveTab }: { stats: any[], setActiveTab: (tab: string) => void }) => {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-playfair font-bold text-catalogue-green mb-1">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                  <stat.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
            <CardTitle className="font-playfair text-xl font-bold text-catalogue-green">Recent Bookings</CardTitle>
            <Button variant="ghost" onClick={() => setActiveTab('bookings')} className="text-catalogue-gold font-bold uppercase tracking-widest text-xs">View All</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Arrival</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">HBK20250624{100 + i}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">Guest Name {i + 1}</td>
                      <td className="px-6 py-4 text-sm text-slate-500 font-medium">24 June 2025</td>
                      <td className="px-6 py-4 text-sm font-bold text-catalogue-green">₹3,500</td>
                      <td className="px-6 py-4">
                        <Badge className="bg-emerald-100 text-emerald-700 rounded-none border-none px-3 font-bold text-[10px] uppercase tracking-wider">Confirmed</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Room Status Live */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
            <CardTitle className="font-playfair text-xl font-bold text-catalogue-green">Room Status (Live)</CardTitle>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div><span className="text-[10px] font-bold text-slate-400 uppercase">Available</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-rose-500 rounded-full"></div><span className="text-[10px] font-bold text-slate-400 uppercase">Occupied</span></div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
              {Array.from({ length: 24 }).map((_, i) => {
                const isOccupied = [2, 5, 8, 12, 15, 19, 21].includes(i);
                const isMaintenance = [4, 18].includes(i);
                return (
                  <div 
                    key={i} 
                    className={`aspect-square flex flex-col items-center justify-center border transition-all cursor-pointer group ${
                      isOccupied ? 'bg-rose-50 border-rose-200 text-rose-700' : 
                      isMaintenance ? 'bg-orange-50 border-orange-200 text-orange-700' : 
                      'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <span className="text-xs font-bold">{101 + i}</span>
                    <div className={`w-1 h-1 rounded-full mt-1 ${isOccupied ? 'bg-rose-400' : isMaintenance ? 'bg-orange-400' : 'bg-emerald-400'}`}></div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
