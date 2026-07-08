import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { CreditCard, Download, Filter, Check, Clock, Trash2, Search, X } from 'lucide-react';
import { API_BASE_URL, BACKEND_URL } from '../../../lib/api';

const STATUS_OPTIONS = ['all', 'success', 'pending', 'failed'] as const;

export const Settlements = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Filters ---
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<typeof STATUS_OPTIONS[number]>('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const filterPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    };
    if (showFilters) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [showFilters]);

  const methods = useMemo(() => {
    const set = new Set(payments.map(p => (p.payment_method || 'online').toLowerCase()));
    return Array.from(set);
  }, [payments]);

  const activeFilterCount = [
    statusFilter !== 'all',
    methodFilter !== 'all',
    !!search.trim(),
    !!dateFrom,
    !!dateTo,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setStatusFilter('all');
    setMethodFilter('all');
    setSearch('');
    setDateFrom('');
    setDateTo('');
  };

  const filteredPayments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return payments.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (methodFilter !== 'all' && (p.payment_method || 'online').toLowerCase() !== methodFilter) return false;
      if (q) {
        const haystack = `${p.guest_name || ''} ${p.booking_ref || ''} ${p.transaction_id || ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (dateFrom && p.payment_date && new Date(p.payment_date) < new Date(dateFrom)) return false;
      if (dateTo && p.payment_date && new Date(p.payment_date) > new Date(dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [payments, statusFilter, methodFilter, search, dateFrom, dateTo]);

  const fetchPayments = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/management/settlements`);
      const json = await resp.json();
      if (json.status === 'success') setPayments(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleUpdateStatus = async (paymentId: number, newStatus: string) => {
    try {
      const resp = await fetch(`${API_BASE_URL}/management/updatePaymentStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId, status: newStatus })
      });
      const json = await resp.json();
      if (json.status === 'success') {
        fetchPayments(); // Refresh list to get accurate totals & states
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (paymentId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking and delete the payment record?")) return;
    try {
      const resp = await fetch(`${API_BASE_URL}/management/deletePayment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: paymentId })
      });
      const json = await resp.json();
      if (json.status === 'success') {
        fetchPayments(); // Refresh list
      }
    } catch (err) {
      console.error(err);
    }
  };

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
          <div className="relative" ref={filterPanelRef}>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-6 py-4 border rounded-2xl text-[10px] font-black uppercase transition-all shadow-sm ${
                activeFilterCount > 0
                  ? 'bg-emerald-700 border-emerald-700 text-white hover:bg-emerald-800'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter size={14} /> Filter
              {activeFilterCount > 0 && (
                <span className="ml-1 flex items-center justify-center w-4 h-4 rounded-full bg-white text-emerald-700 text-[9px]">{activeFilterCount}</span>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-20 space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Filter Transactions</p>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-[9px] font-bold text-rose-500 uppercase tracking-widest hover:text-rose-600">
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Search</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Guest, booking ref, transaction ID"
                      className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                    {search && (
                      <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</label>
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                          statusFilter === s ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {methods.length > 1 && (
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Method</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setMethodFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                          methodFilter === 'all' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        all
                      </button>
                      {methods.map(m => (
                        <button
                          key={m}
                          onClick={() => setMethodFilter(m)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                            methodFilter === m ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={e => setDateFrom(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                    <span className="text-slate-300 text-xs">–</span>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={e => setDateTo(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
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
        {!loading && activeFilterCount > 0 && (
          <div className="px-8 pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing {filteredPayments.length} of {payments.length} transactions
          </div>
        )}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-6 border-b border-slate-100">Transaction ID</th>
                  <th className="px-6 py-6 border-b border-slate-100">Guest</th>
                  <th className="px-6 py-6 border-b border-slate-100">Booking Ref</th>
                  <th className="px-6 py-6 border-b border-slate-100">Method</th>
                  <th className="px-6 py-6 border-b border-slate-100">Date</th>
                  <th className="px-6 py-6 border-b border-slate-100">Amount</th>
                  <th className="px-6 py-6 border-b border-slate-100">Status</th>
                  <th className="px-6 py-6 border-b border-slate-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading
                  ? Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={8} className="px-6 py-6">
                          <div className="h-4 bg-slate-100 rounded-lg w-full" />
                        </td>
                      </tr>
                    ))
                  : filteredPayments.map((pay, i) => (
                      <tr key={i} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-6 py-6">
                          <p className="text-[11px] font-black text-slate-700 flex items-center gap-2 whitespace-nowrap">
                            <CreditCard size={13} className="text-emerald-500 shrink-0" />
                            {pay.transaction_id || `TRX-${pay.id}`}
                          </p>
                        </td>
                        <td className="px-6 py-6 text-xs font-black text-slate-800 uppercase whitespace-nowrap">
                          {pay.guest_name || '—'}
                        </td>
                        <td className="px-6 py-6 text-xs font-bold text-slate-400 whitespace-nowrap">
                          {pay.booking_ref ? (
                            <button
                              onClick={() => window.open(`${BACKEND_URL}/admin_view_booking.php?booking_id=${pay.booking_ref}`, '_blank')}
                              className="text-emerald-700 hover:text-emerald-950 font-black hover:underline cursor-pointer tracking-wider transition-colors"
                              title="Click to View Premium Invoice"
                            >
                              {pay.booking_ref}
                            </button>
                          ) : '—'}
                        </td>
                        <td className="px-6 py-6">
                          <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                            {pay.payment_method || 'Online'}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-xs font-medium text-slate-400 whitespace-nowrap">
                          {pay.payment_date ? new Date(pay.payment_date).toLocaleDateString('en-IN') : '—'}
                        </td>
                        <td className="px-6 py-6">
                          <p className="text-sm font-black text-emerald-700 whitespace-nowrap">
                            ₹ {parseFloat(pay.amount).toLocaleString('en-IN')}
                          </p>
                        </td>
                        <td className="px-6 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter whitespace-nowrap ${
                            pay.status === 'success'   ? 'bg-emerald-100 text-emerald-700' :
                            pay.status === 'pending'   ? 'bg-amber-100   text-amber-700'   :
                                                         'bg-rose-100    text-rose-700'
                          }`}>
                            {pay.status}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleUpdateStatus(pay.id, 'success')}
                              disabled={pay.status === 'success'}
                              title="Mark as paid"
                              className="w-8 h-8 flex items-center justify-center bg-emerald-700 hover:bg-emerald-800 disabled:opacity-30 disabled:hover:bg-emerald-700 text-white rounded-lg transition-all"
                            >
                              <Check size={14} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(pay.id, 'pending')}
                              disabled={pay.status === 'pending'}
                              title="Mark as pending"
                              className="w-8 h-8 flex items-center justify-center bg-amber-600 hover:bg-amber-700 disabled:opacity-30 disabled:hover:bg-amber-600 text-white rounded-lg transition-all"
                            >
                              <Clock size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(pay.id)}
                              title="Cancel & delete"
                              className="w-8 h-8 flex items-center justify-center bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-all focus:ring-2 focus:ring-rose-200"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                {!loading && filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-8 py-24 text-center text-slate-400 font-black uppercase tracking-widest">
                      {payments.length === 0 ? 'No payment records found' : 'No transactions match these filters'}
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
