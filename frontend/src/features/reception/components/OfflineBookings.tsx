import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { PlusCircle } from 'lucide-react';

export const OfflineBookings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-playfair font-bold text-catalogue-green mb-1">Offline Bookings</h1>
          <p className="text-slate-500">Walk-in registrations and manual entries.</p>
        </div>
        <Button className="bg-catalogue-gold text-white font-bold uppercase tracking-widest px-8 flex gap-2 items-center">
          <PlusCircle size={18} />
          <span>New Walk-in</span>
        </Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 tracking-widest border-b border-slate-100">
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Room No</th>
                  <th className="px-6 py-4">Stay duration</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[1, 2, 3].map((_, i) => (
                  <tr key={i} className="hover:bg-brand-cream/10 transition-colors">
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-slate-800">Walk-in Guest {i + 1}</p>
                      <Badge className="mt-1 bg-slate-100 text-slate-600 rounded-none text-[8px] uppercase font-bold">Manual Entry</Badge>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-catalogue-green">30{i}</td>
                    <td className="px-6 py-5 text-sm text-slate-600">1 Night</td>
                    <td className="px-6 py-5 text-sm font-bold text-catalogue-green">₹2,500</td>
                    <td className="px-6 py-5">
                      <Badge className="bg-emerald-50 text-emerald-600 rounded-none px-3 font-bold text-[10px] uppercase tracking-wider">Checked-In</Badge>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Button variant="outline" className="border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-4">View Bill</Button>
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
