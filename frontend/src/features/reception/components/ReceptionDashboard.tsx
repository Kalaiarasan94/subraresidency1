import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  ClipboardList, 
  QrCode, 
  PlusCircle, 
  Printer, 
  Mail, 
  MoreVertical 
} from 'lucide-react';

export const ReceptionDashboard = ({ stats, ArrowRight, QuickActionButton }: any) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <Card key={idx} className="border-none shadow-sm bg-white border border-slate-100">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className={`p-3 ${stat.bg} ${stat.color} rounded-2xl mb-4`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-bold font-playfair text-slate-800 tracking-tighter">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings (Online) */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between py-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-catalogue-green text-white rounded-lg">
                  <ClipboardList size={20} />
                </div>
                <div>
                  <CardTitle className="font-playfair text-xl font-bold text-catalogue-green">Online Arrivals</CardTitle>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Awaiting Check-in</p>
                </div>
              </div>
              <Button variant="outline" className="border-catalogue-gold text-catalogue-gold hover:bg-catalogue-gold hover:text-white rounded-none uppercase font-bold text-[10px] px-6">View All</Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-100">
                      <th className="px-6 py-4">Booking</th>
                      <th className="px-6 py-4">Guest Info</th>
                      <th className="px-6 py-4">Stay</th>
                      <th className="px-6 py-4">Room Type</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {[1, 2, 3].map((_, i) => (
                      <tr key={i} className="hover:bg-brand-cream/20 transition-colors">
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-catalogue-green">HBK20250624{100 + i}</span>
                          <Badge className="block mt-1 bg-blue-50 text-blue-600 rounded-none w-fit text-[8px] uppercase tracking-tighter">Website</Badge>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <p className="text-sm font-bold text-slate-800">John Doe {i + 1}</p>
                          <p className="text-[10px] text-slate-500">+91 98765 43210</p>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="text-xs font-medium">24 Jun</span>
                            <ArrowRight size={12} className="text-slate-300" />
                            <span className="text-xs font-medium">25 Jun</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-bold text-slate-600">Deluxe Room</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Button className="bg-catalogue-green hover:bg-catalogue-gold text-white text-[10px] font-bold uppercase tracking-widest rounded-none shadow-sm px-6">Check-In</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Room Status Live */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm">
              <CardHeader className="border-b border-slate-50 pb-6">
                <CardTitle className="font-playfair text-xl font-bold text-catalogue-green">Room Status (Live)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const isOccupied = [2, 5, 8, 11].includes(i);
                    return (
                      <div 
                        key={i} 
                        className={`aspect-square flex flex-col items-center justify-center border transition-all cursor-pointer group ${
                          isOccupied ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-sm'
                        }`}
                      >
                        <span className="text-xs font-bold">{201 + i}</span>
                        <div className={`w-1 h-1 rounded-full mt-1 ${isOccupied ? 'bg-rose-400' : 'bg-emerald-400'}`}></div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="ghost" className="w-full mt-6 text-slate-400 font-bold uppercase tracking-widest text-[10px]">View Detailed Map</Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-catalogue-green text-white">
              <CardHeader className="border-b border-white/10 pb-6">
                <CardTitle className="font-playfair text-xl font-bold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-2 gap-4">
                <QuickActionButton icon={QrCode} label="Scan QR" />
                <QuickActionButton icon={PlusCircle} label="New Walk-in" />
                <QuickActionButton icon={Printer} label="Last Receipt" />
                <QuickActionButton icon={Mail} label="Contact Guest" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Offline Booking List */}
        <div className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="font-playfair text-lg font-bold text-catalogue-green uppercase tracking-wide">Offline Bookings</CardTitle>
              <Badge className="bg-catalogue-gold text-white rounded-none uppercase text-[8px] font-bold">Today</Badge>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 border border-slate-100 hover:border-catalogue-gold/30 hover:bg-brand-cream/10 transition-all group">
                  <div className="w-12 h-12 bg-slate-50 flex flex-col items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-catalogue-gold group-hover:text-white transition-colors">
                    <span className="text-[10px] font-bold uppercase leading-none">Min</span>
                    <span className="text-lg font-bold leading-none">{15 + i*15}</span>
                  </div>
                  <div className="flex-grow">
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-tighter">Mark Wilson {i + 1}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Room: 30{i} | ₹2,500</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-none text-[8px] uppercase">Paid</Badge>
                    <button className="text-slate-300 hover:text-catalogue-gold transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </div>
              ))}
              <Button className="w-full bg-white border border-catalogue-green text-catalogue-green hover:bg-catalogue-green hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest rounded-none py-6 mt-4">
                Register New Offline Guest
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
