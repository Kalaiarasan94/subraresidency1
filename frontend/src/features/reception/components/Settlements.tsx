import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { CreditCard, Download, Filter, Check, Clock, Trash2, Search, X, Printer, FileText } from 'lucide-react';
import { API_BASE_URL, BACKEND_URL } from '../../../lib/api';

const STATUS_OPTIONS = ['all', 'success', 'pending', 'failed'] as const;

interface SettlementsProps {
  onOpenReports?: () => void;
}

export const Settlements: React.FC<SettlementsProps> = ({ onOpenReports }) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Financial Settlements</h2>
          <p className="text-xs text-gray-500 mt-0.5">Transaction ledger and payment records</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={filterPanelRef}>
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors shadow-xs ${
                activeFilterCount > 0
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter size={14} /> Filter
              {activeFilterCount > 0 && (
                <span className="ml-1 flex items-center justify-center w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px]">{activeFilterCount}</span>
              )}
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-800">Filter Transactions</p>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-xs font-medium text-rose-600 hover:text-rose-700">
                      Clear all
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-gray-500">Search</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Guest, booking ref, transaction ID"
                      className="w-full pl-8 pr-7 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {search && (
                      <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-gray-500">Status</label>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                          statusFilter === s ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {methods.length > 1 && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-gray-500">Method</label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setMethodFilter('all')}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                          methodFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                      {methods.map(m => (
                        <button
                          key={m}
                          onClick={() => setMethodFilter(m)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                            methodFilter === m ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-gray-500">Date Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={e => setDateFrom(e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <span className="text-gray-400 text-xs">–</span>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={e => setDateTo(e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => onOpenReports ? onOpenReports() : window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Download PDF or Print Official Report"
          >
            <Printer size={14} className="text-blue-600" />
            <span>Official Report &amp; PDF</span>
          </button>
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Transactions', value: payments.length },
          { label: 'Successful', value: payments.filter(p => p.status === 'success').length },
          { label: 'Pending',    value: payments.filter(p => p.status === 'pending').length },
          { label: 'Revenue',    value: `₹ ${total.toLocaleString('en-IN')}` },
        ].map((s, i) => (
          <div key={i} className="crm-card bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{s.label}</p>
            <p className="text-xl font-semibold text-gray-900 mt-1 tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table Box */}
      <div className="crm-card bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        {!loading && activeFilterCount > 0 && (
          <div className="px-5 pt-3 pb-1 text-xs text-gray-500">
            Showing {filteredPayments.length} of {payments.length} transactions
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Guest</th>
                <th className="px-4 py-3">Booking Ref</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading
                ? Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={8} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded-md w-full" />
                      </td>
                    </tr>
                  ))
                : filteredPayments.map((pay, i) => (
                    <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-4 py-3 font-medium text-gray-800">
                        <span className="flex items-center gap-1.5">
                          <CreditCard size={13} className="text-gray-400 shrink-0" />
                          {pay.transaction_id || `TRX-${pay.id}`}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {pay.guest_name || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {pay.booking_ref ? (
                          <button
                            onClick={() => window.open(`${BACKEND_URL}/admin_view_booking.php?booking_id=${pay.booking_ref}`, '_blank')}
                            className="text-emerald-700 hover:text-emerald-900 font-medium hover:underline cursor-pointer"
                            title="Click to View Invoice"
                          >
                            {pay.booking_ref}
                          </button>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-medium text-gray-600">
                          {pay.payment_method || 'Online'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 tabular-nums">
                        {pay.payment_date ? new Date(pay.payment_date).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900 tabular-nums">
                        <div>₹ {parseFloat(pay.amount).toLocaleString('en-IN')}</div>
                        {(parseFloat(pay.platform_fee) > 0 || (pay.total_amount && parseFloat(pay.total_amount) > parseFloat(pay.amount))) && (
                          <div className="text-[10px] text-gray-500 font-normal">
                            Inv: ₹{parseFloat(pay.total_amount || pay.gross_amount).toLocaleString('en-IN')}
                            {parseFloat(pay.platform_fee) > 0 && <span className="text-rose-600"> (Fee: -₹{parseFloat(pay.platform_fee).toLocaleString('en-IN')})</span>}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          pay.status === 'success'   ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          pay.status === 'pending'   ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                       'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleUpdateStatus(pay.id, 'success')}
                            disabled={pay.status === 'success'}
                            title="Mark as paid"
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 disabled:opacity-30 text-gray-600 rounded-md transition-colors"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(pay.id, 'pending')}
                            disabled={pay.status === 'pending'}
                            title="Mark as pending"
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 disabled:opacity-30 text-gray-600 rounded-md transition-colors"
                          >
                            <Clock size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(pay.id)}
                            title="Cancel & delete"
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-gray-600 rounded-md transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

              {!loading && filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400 font-medium">
                    {payments.length === 0 ? 'No payment records found' : 'No transactions match these filters'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
