import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Hotel, LogIn, LogOut, Clock, Phone } from 'lucide-react';

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
        const resp = await fetch('http://localhost:8001/api/index.php/management/logs');
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Stay Logs</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Complete history of all guest stays
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
            <p className="text-xl font-black text-emerald-700">{activeCount}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</p>
          </div>
          <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
            <p className="text-xl font-black text-slate-700">{departedCount}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Departed</p>
          </div>
          <div className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-center shadow-sm">
            <p className="text-xl font-black text-slate-700">{logs.length}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-3">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === f.key
                ? 'bg-[#061c12] text-white shadow-lg'
                : 'bg-white border border-slate-100 text-slate-500 hover:border-emerald-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Skeleton */}
      {loading && (
        <div className="space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Log rows */}
      {!loading && (
        <div className="space-y-4">
          {displayed.map((log, i) => {
            const cfg = statusConfig[log.status] ?? { bg: 'bg-slate-100', text: 'text-slate-500', label: log.status };
            return (
              <Card key={i} className="border-none shadow-lg rounded-[2rem] bg-white hover:shadow-xl transition-all">
                <CardContent className="p-8 flex flex-wrap items-center justify-between gap-6">

                  {/* Avatar + Name */}
                  <div className="flex items-center gap-5 min-w-[180px]">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white font-black text-lg uppercase shrink-0 shadow-md">
                      {log.guest_name?.charAt(0) ?? '?'}
                    </div>
                    <div>
                      <p className="font-black text-slate-800 uppercase tracking-tight leading-tight">
                        {log.guest_name}
                      </p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
                        {log.booking_id}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Phone size={13} className="text-slate-300" />
                    {log.guest_phone || '—'}
                  </div>

                  {/* Stay dates */}
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-2">
                      <LogIn size={13} className="text-blue-400" />
                      {log.check_in_date}
                    </span>
                    <span className="text-slate-200 font-black">→</span>
                    <span className="flex items-center gap-2">
                      <LogOut size={13} className="text-rose-400" />
                      {log.check_out_date}
                    </span>
                  </div>

                  {/* Room */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Hotel size={13} className="text-slate-300" />
                    Room&nbsp;
                    <span className="font-black text-slate-800">
                      {log.room_number ?? 'TBD'}
                    </span>
                  </div>

                  {/* Amount */}
                  <p className="font-black text-emerald-700 text-sm tabular-nums">
                    ₹&nbsp;{parseFloat(log.total_amount).toLocaleString('en-IN')}
                  </p>

                  {/* Status */}
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 ${cfg.bg} ${cfg.text}`}>
                    {cfg.label}
                  </span>
                </CardContent>
              </Card>
            );
          })}

          {displayed.length === 0 && (
            <div className="py-24 text-center space-y-4">
              <Clock className="mx-auto text-slate-200" size={48} />
              <p className="text-slate-400 font-black uppercase tracking-widest">
                No matching stay records found
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
