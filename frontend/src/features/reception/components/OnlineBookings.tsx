import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Search, Globe, ChevronRight } from 'lucide-react';

export const OnlineBookings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Website Reservations</h1>
          <p className="text-xs text-gray-500">Incoming online bookings awaiting check-in or room allocation</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input 
              type="text" 
              placeholder="Search by ID or Guest..." 
              className="pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 w-60 bg-white"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Guest Information</th>
                <th className="px-5 py-3">Stay Dates</th>
                <th className="px-5 py-3">Room Category</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <tr key={i} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3 font-mono font-bold text-gray-900">
                    HBK202610{200 + i}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-900">Online Guest {i + 1}</p>
                    <p className="text-[11px] text-gray-400">+91 98000 1234{i}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    15 Oct - 17 Oct (2N)
                  </td>
                  <td className="px-5 py-3 font-medium text-emerald-800">
                    Heritage Suite
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-semibold rounded-full">
                      Awaiting Check-in
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button 
                      onClick={() => window.location.href = '/reception'}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-md shadow-xs transition-colors"
                    >
                      Express Check-in
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
