import { useState, useEffect, useRef } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  ChevronLeft, ChevronRight, Clock, 
  Search, RefreshCw, Filter,
  CheckCircle, AlertCircle, Hammer
} from 'lucide-react';
import { fetchRoomAvailability, updateRoomAvailability } from '../../../lib/api';

export const RoomCalendar = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate 31 days from startDate
  const days = Array.from({ length: 31 }, (_, i) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    return d;
  });

  useEffect(() => {
    loadData();
  }, [startDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Rooms
      const rResp = await fetch('http://localhost:8001/api/index.php/rooms/list');
      const roomsData = await rResp.json();
      setRooms(roomsData);

      // 2. Fetch Availability for the range
      const end = new Date(startDate);
      end.setDate(startDate.getDate() + 30);
      
      const availData = await fetchRoomAvailability(
        0, // 0 handles all rooms
        startDate.toISOString().split('T')[0],
        end.toISOString().split('T')[0]
      );
      setAvailability(availData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (roomId: number, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const match = availability.find(a => Number(a.room_id) === Number(roomId) && a.date === dateStr);
    return match ? match.status.toLowerCase() : 'available';
  };

  const handleStatusChange = async (roomId: number, date: Date, newStatus: string) => {
    const dateStr = date.toISOString().split('T')[0];
    const res = await updateRoomAvailability({ room_id: roomId, date: dateStr, status: newStatus });
    if (res && res.success) {
      // Local update
      setAvailability(prev => {
        const existing = prev.findIndex(a => Number(a.room_id) === Number(roomId) && a.date === dateStr);
        if (existing > -1) {
          const updated = [...prev];
          updated[existing] = { ...updated[existing], status: newStatus };
          return updated;
        } else {
          return [...prev, { room_id: roomId, date: dateStr, status: newStatus }];
        }
      });
    }
  };

  const shiftDate = (days: number) => {
    const next = new Date(startDate);
    next.setDate(startDate.getDate() + days);
    setStartDate(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Header Bar */}
      <div className="bg-[#0b336b] text-white p-4 rounded-xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-2 rounded-lg">
            <Clock size={20} className="text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-black uppercase tracking-widest">Live Inventory Timeline</h2>
            <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.2em]">Real-time Room Status & Availability</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/10 rounded-lg p-1 border border-white/10">
            <Button variant="ghost" size="sm" onClick={() => shiftDate(-7)} className="text-white hover:bg-white/10 h-8 px-2"><ChevronLeft size={16}/></Button>
            <div className="px-4 flex items-center text-[10px] font-black uppercase tracking-widest border-x border-white/10">
              {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
              {days[30].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <Button variant="ghost" size="sm" onClick={() => shiftDate(7)} className="text-white hover:bg-white/10 h-8 px-2"><ChevronRight size={16}/></Button>
          </div>
          <Button onClick={loadData} variant="ghost" size="sm" className="text-white hover:bg-white/10 h-10 w-10 p-0 rounded-lg border border-white/10">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Filter rooms..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-64 shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-all">
            <Filter size={14} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider">All Categories</span>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white p-2 px-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[9px] font-black uppercase text-slate-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
            <span className="text-[9px] font-black uppercase text-slate-400">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8_8px_rgba(245,158,11,0.5)]"></div>
            <span className="text-[9px] font-black uppercase text-slate-400">Maintenance</span>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <Card className="border-none shadow-xl overflow-hidden rounded-2xl bg-white flex flex-col">
        <div className="overflow-x-auto custom-scrollbar" ref={scrollRef}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="sticky left-0 z-30 bg-slate-50 p-4 min-w-[200px] text-left border-b border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Rooms & Suites</span>
                </th>
                {days.map((day, i) => (
                  <th key={i} className={`p-3 border-b border-r border-slate-100 min-w-[60px] ${day.getDay() === 0 || day.getDay() === 6 ? 'bg-amber-50/30' : ''}`}>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[8px] font-black uppercase text-slate-400">{day.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <span className={`text-xs font-black p-1 px-2 rounded-lg ${
                        day.toDateString() === new Date().toDateString() ? 'bg-[#0b336b] text-white' : 'text-slate-800'
                      }`}>
                        {day.getDate()}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="p-6 border-b border-r border-slate-100 bg-slate-50/30"></td>
                  {Array(31).fill(0).map((_, j) => (
                    <td key={j} className="p-6 border-b border-r border-slate-100"></td>
                  ))}
                </tr>
              )) : rooms.map((room) => (
                <tr key={room.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-50 p-4 border-b border-r border-slate-100 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600">
                        {room.room_number || room.id}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 leading-tight">{room.title || room.room_name}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{room.category_name}</span>
                      </div>
                    </div>
                  </td>
                  {days.map((day, i) => {
                    const status = getStatus(room.id, day);
                    return (
                      <td key={i} className={`p-2 border-b border-r border-slate-100 min-w-[60px] relative`}>
                        <div 
                          onClick={() => {
                            const next = status === 'available' ? 'booked' : status === 'booked' ? 'maintenance' : 'available';
                            handleStatusChange(room.id, day, next);
                          }}
                          className={`w-full h-10 rounded-lg cursor-pointer transition-all flex items-center justify-center group/cell hover:scale-105 active:scale-95 ${
                          status === 'available' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' :
                          status === 'booked' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' :
                          'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        }`}>
                           {status === 'available' && <CheckCircle size={14} className="opacity-0 group-hover/cell:opacity-100 transition-opacity" />}
                           {status === 'booked' && <AlertCircle size={14} />}
                           {status === 'maintenance' && <Hammer size={14} />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest px-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Click cell to toggle status</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Grey columns indicate weekends</span>
        </div>
        <div>Last Updated: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
};
