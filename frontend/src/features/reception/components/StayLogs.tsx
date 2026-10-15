import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Hotel, LogIn, LogOut, Clock, Phone } from 'lucide-react';
import { API_BASE_URL, BACKEND_URL } from '../../../lib/api';

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  'checked-in':   { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Checked In'   },
  'checked-out':  { bg: 'bg-slate-100',   text: 'text-slate-600',   label: 'Checked Out'  },
  'completed':    { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Completed'     },
  'confirmed':    { bg: 'bg-sky-100',     text: 'text-sky-700',     label: 'Confirmed'     },
  'pending':      { bg: 'bg-amber-100',   text: 'text-amber-700',   label: 'Pending'       },
  'cancelled':    { bg: 'bg-rose-100',    text: 'text-rose-700',    label: 'Cancelled'     },
};

export const StayLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/management/logs`);
        const json = await resp.json();
        if (json.status === 'success') setLogs(json.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const activeCount  = logs.filter(l => l.status === 'checked-in').length;
  const departedCount = logs.filter(l => ['checked-out', 'completed'].includes(l.status)).length;

  const displayed = filter === 'all' ? logs : logs.filter(l => l.status === filter);

  const filters = [
    { key: 'all',          label: 'All Stays' },
    { key: 'checked-in',   label: 'Active'    },
    { key: 'confirmed',    label: 'Confirmed' },
    { key: 'checked-out',  label: 'Departed'  },
    { key: 'cancelled',    label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Stay Logs</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Complete history of all guest stays and occupancy records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-center shadow-xs">
            <p className="text-lg font-semibold text-emerald-700 tabular-nums">{activeCount}</p>
            <p className="text-[11px] font-medium text-gray-500">Active</p>
          </div>
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-center shadow-xs">
            <p className="text-lg font-semibold text-gray-900 tabular-nums">{departedCount}</p>
            <p className="text-[11px] font-medium text-gray-500">Departed</p>
          </div>
          <div className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-center shadow-xs">
            <p className="text-lg font-semibold text-gray-900 tabular-nums">{logs.length}</p>
            <p className="text-[11px] font-medium text-gray-500">Total</p>
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.key
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-20 bg-white border border-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Log rows */}
      {!loading && (
        <div className="space-y-2.5">
          {displayed.map((log, i) => {
            const cfg = statusConfig[log.status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: log.status };
            return (
              <div key={i} className="crm-card bg-white border border-gray-200 rounded-lg p-4 shadow-xs hover:border-gray-300 transition-colors flex flex-wrap items-center justify-between gap-4">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 min-w-[200px]">
                  <div className="w-10 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-gray-700 font-semibold text-sm shrink-0">
                    {log.guest_name?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900 leading-tight">
                      {log.guest_name}
                    </p>
                    <button
                      onClick={() => window.open(`${BACKEND_URL}/admin_view_booking.php?booking_id=${log.booking_id}`, '_blank')}
                      className="text-xs font-medium text-emerald-700 hover:text-emerald-900 hover:underline mt-0.5 text-left block"
                    >
                      {log.booking_id}
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Phone size={13} className="text-gray-400" />
                  {log.guest_phone || '—'}
                </div>

                {/* Stay dates */}
                <div className="flex items-center gap-2 text-xs text-gray-600 tabular-nums">
                  <span className="flex items-center gap-1.5">
                    <LogIn size={13} className="text-blue-500" />
                    {log.check_in_date}
                  </span>
                  <span className="text-gray-300">→</span>
                  <span className="flex items-center gap-1.5">
                    <LogOut size={13} className="text-rose-500" />
                    {log.check_out_date}
                  </span>
                </div>

                {/* Room */}
                <div className="flex items-center gap-1.5 text-xs text-gray-700">
                  <Hotel size={13} className="text-gray-400" />
                  <span>Room:</span>
                  <span className="font-semibold text-gray-900">
                    {log.status === 'confirmed' ? 'Pending' : (log.room_number ?? 'TBD')}
                  </span>
                </div>

                {/* Amount */}
                <p className="font-semibold text-gray-900 text-sm tabular-nums">
                  ₹ {parseFloat(log.total_amount).toLocaleString('en-IN')}
                </p>

                {/* Status */}
                <span className={`px-2.5 py-1 rounded text-[11px] font-medium shrink-0 border ${
                  log.status === 'checked-in' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  log.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  log.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  'bg-gray-50 text-gray-600 border-gray-200'
                }`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}

          {displayed.length === 0 && (
            <div className="crm-card bg-white border border-gray-200 rounded-lg py-16 text-center space-y-3 shadow-xs">
              <Clock className="mx-auto text-gray-300" size={36} />
              <p className="text-gray-500 text-xs font-medium">
                No matching stay records found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
