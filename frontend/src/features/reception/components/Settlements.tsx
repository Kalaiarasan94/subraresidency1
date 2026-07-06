import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { CreditCard, Download, Filter } from 'lucide-react';

export const Settlements = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const resp = await fetch('http://localhost:8001/api/index.php/management/settlements');
        const json = await resp.json();
        if (json.status === 'success') setPayments(json.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const total = payments
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Financial Settlements</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Transaction Ledger & Revenue Flow</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-6 py-4 bg-[#061c12] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Transactions', value: payments.length },
          { label: 'Successful', value: payments.filter(p => p.status === 'success').length },
          { label: 'Pending',    value: payments.filter(p => p.status === 'pending').length },
          { label: 'Revenue',    value: `₹ ${total.toLocaleString('en-IN')}` },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className="text-2xl font-black text-slate-800 mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-6 border-b border-slate-100">Transaction ID</th>
                  <th className="px-8 py-6 border-b border-slate-100">Guest</th>
                  <th className="px-8 py-6 border-b border-slate-100">Booking Ref</th>
                  <th className="px-8 py-6 border-b border-slate-100">Method</th>
                  <th className="px-8 py-6 border-b border-slate-100">Date</th>
                  <th className="px-8 py-6 border-b border-slate-100">Amount</th>
                  <th className="px-8 py-6 border-b border-slate-100 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading
                  ? Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={7} className="px-8 py-6">
                          <div className="h-4 bg-slate-100 rounded-lg w-full" />
                        </td>
                      </tr>
                    ))
                  : payments.map((pay, i) => (
                      <tr key={i} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-8 py-6">
                          <p className="text-[11px] font-black text-slate-700 flex items-center gap-2">
                            <CreditCard size={13} className="text-emerald-500" />
                            {pay.transaction_id || `TRX-${pay.id}`}
                          </p>
                        </td>
                        <td className="px-8 py-6 text-xs font-black text-slate-800 uppercase">
                          {pay.guest_name || '—'}
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-400">
                          {pay.booking_ref || '—'}
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                            {pay.payment_method || 'Online'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-xs font-medium text-slate-400">
                          {pay.payment_date ? new Date(pay.payment_date).toLocaleDateString('en-IN') : '—'}
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-emerald-700">
                            ₹ {parseFloat(pay.amount).toLocaleString('en-IN')}
                          </p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                            pay.status === 'success'   ? 'bg-emerald-100 text-emerald-700' :
                            pay.status === 'pending'   ? 'bg-amber-100   text-amber-700'   :
                                                         'bg-rose-100    text-rose-700'
                          }`}>
                            {pay.status}
                          </span>
                        </td>
                      </tr>
                    ))}

                {!loading && payments.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-8 py-24 text-center text-slate-400 font-black uppercase tracking-widest">
                      No payment records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
