import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { ClipboardList, Search } from 'lucide-react';

export const OnlineBookings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-catalogue-green mb-1">Online Bookings</h1>
          <p className="text-slate-500">Manage reservations coming from the website.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-none text-sm focus:outline-none focus:border-catalogue-green"
            />
          </div>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Booking ID</th>
                  <th className="px-6 py-4">Guest Info</th>
                  <th className="px-6 py-4">Stay Dates</th>
                  <th className="px-6 py-4">Room Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <tr key={i} className="hover:bg-brand-cream/10 transition-colors">
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-catalogue-green">HBK20250624{200 + i}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-800">Guest Name {i + 1}</p>
                      <p className="text-[10px] text-slate-500">+91 90000 0000{i}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">25 Jun - 27 Jun</td>
                    <td className="px-6 py-5 text-sm text-slate-600 font-medium">Executive Suite</td>
                    <td className="px-6 py-5">
                      <Badge className="bg-blue-50 text-blue-600 rounded-none px-3 font-bold text-[10px] uppercase tracking-wider">Awaiting Check-in</Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Button className="bg-catalogue-green text-white text-[10px] font-bold uppercase tracking-widest rounded-none px-4">Check-In</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
