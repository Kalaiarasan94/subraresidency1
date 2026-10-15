import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { PlusCircle, Search } from 'lucide-react';

export const OfflineBookings = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Walk-in Registrations</h1>
          <p className="text-xs text-gray-500">Physical frontdesk reservations and manual guest folios</p>
        </div>
        <button 
          onClick={() => window.location.href = '/reception'}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
        >
          <PlusCircle size={15} />
          <span>New Walk-in Folio</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-5 py-3">Guest</th>
                <th className="px-5 py-3">Room No</th>
                <th className="px-5 py-3">Stay Duration</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {[1, 2, 3].map((_, i) => (
                <tr key={i} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-semibold text-gray-900">Walk-in Guest {i + 1}</p>
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
                      Front Desk
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono font-bold text-gray-900">
                    30{i}
                  </td>
                  <td className="px-5 py-3 text-gray-600">
                    1 Night
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-900">
                    ₹2,500
                  </td>
                  <td className="px-5 py-3">
                    <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded-full">
                      Checked-In
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium text-xs rounded-md transition-colors">
                      View Bill
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
