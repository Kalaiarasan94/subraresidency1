import { useState, useEffect, useRef } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  ChevronLeft, ChevronRight, Clock, 
  Search, RefreshCw, Filter,
  CheckCircle, AlertCircle, Hammer,
  X, User
} from 'lucide-react';
import { fetchRoomAvailability, updateRoomAvailability, API_BASE_URL, fetchBookingById } from '../../../lib/api';

export const RoomCalendar = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState<any | null>(null);
  const [activeBookingDetails, setActiveBookingDetails] = useState<any | null>(null);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [showModal, setShowModal] = useState<'actions' | 'booking' | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
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
      const rResp = await fetch(`${API_BASE_URL}/rooms/list`);
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

  // Derive filtered rooms from search + category filter
  const uniqueCategories: string[] = ['All Categories', ...Array.from(new Set(rooms.map((r: any) => r.category_name as string).filter(Boolean)))];
  const filteredRooms = rooms.filter((room: any) => {
    const matchSearch = !searchTerm.trim() ||
      (room.room_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.title || room.room_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'All Categories' || room.category_name === categoryFilter;
    return matchSearch && matchCategory;
  });

  const getAvailabilityRecord = (roomId: number, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availability.find(a => Number(a.room_id) === Number(roomId) && a.date === dateStr);
  };

  const getStatus = (roomId: number, date: Date) => {
    const record = getAvailabilityRecord(roomId, date);
    return record ? record.status.toLowerCase() : 'available';
  };

  const handleCellClick = async (room: any, date: Date) => {
    const record = getAvailabilityRecord(room.id, date);
    const status = record ? record.status.toLowerCase() : 'available';
    const note = record ? record.note : '';
    
    setSelectedCell({
      roomId: room.id,
      roomNumber: room.room_number || room.id,
      roomName: room.title || room.room_name,
      date,
      status,
      note
    });

    if (note && note.startsWith('booking:')) {
      const bookingId = note.replace('booking:', '');
      setLoadingBooking(true);
      setShowModal('booking');
      try {
        const resp = await fetchBookingById(bookingId);
        if (resp && resp.status === 'success') {
          setActiveBookingDetails(resp.booking);
        } else {
          setActiveBookingDetails({ booking_id: bookingId, error: 'Could not fetch details.' });
        }
      } catch (e) {
        console.error(e);
        setActiveBookingDetails({ booking_id: bookingId, error: 'Error calling server.' });
      } finally {
        setLoadingBooking(false);
      }
    } else {
      setShowModal('actions');
    }
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
      setShowModal(null);
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
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-64 shadow-sm"
            />
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-all text-[10px] font-black uppercase text-slate-600 tracking-wider appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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
              )) : filteredRooms.map((room) => (
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
                          onClick={() => handleCellClick(room, day)}
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
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Click cell to manage availability / view booking details</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-350" /> Grey columns indicate weekends</span>
        </div>
        <div>Last Updated: {new Date().toLocaleTimeString()}</div>
      </div>

      {/* Availability / Booking Detail Popups */}
      {showModal && selectedCell && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xs font-black text-[#0b336b] uppercase tracking-widest">
                  {showModal === 'booking' ? 'Booking Secured' : 'Room Availability'}
                </h3>
                <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-tight">
                  Room {selectedCell.roomNumber} • {selectedCell.roomName}
                </p>
              </div>
              <button 
                onClick={() => setShowModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-lg transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4">
              {showModal === 'booking' ? (
                loadingBooking ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-3">
                    <RefreshCw size={24} className="text-emerald-600 animate-spin" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Details...</span>
                  </div>
                ) : activeBookingDetails?.error ? (
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-xs text-rose-700 font-bold">
                    {activeBookingDetails.error}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Stay Dates */}
                    <div className="flex gap-4 p-3 bg-emerald-50/40 rounded-xl border border-emerald-100/50">
                      <div className="flex-1">
                        <span className="text-[8px] font-black uppercase text-emerald-600 block tracking-wider">CHECK IN</span>
                        <span className="text-xs font-bold text-slate-700">{activeBookingDetails?.check_in_date}</span>
                      </div>
                      <div className="w-px bg-emerald-250/20 self-stretch" />
                      <div className="flex-1">
                        <span className="text-[8px] font-black uppercase text-emerald-600 block tracking-wider">CHECK OUT</span>
                        <span className="text-xs font-bold text-slate-700">{activeBookingDetails?.check_out_date}</span>
                      </div>
                    </div>

                    {/* Guest Information */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-700 border-b border-slate-50 pb-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg">
                          <User size={14} className="text-slate-500" />
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">GUEST PROFILE</span>
                          <span className="text-xs font-bold text-slate-800">{activeBookingDetails?.guest_name}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-slate-700">
                        <div>
                          <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">PHONE</span>
                          <span className="text-xs font-bold text-slate-700">{activeBookingDetails?.guest_phone || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">EMAIL</span>
                          <span className="text-xs font-bold text-slate-750 truncate block">{activeBookingDetails?.guest_email || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Financials & Status */}
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">TOTAL AMOUNT</span>
                        <span className="text-xs font-black text-slate-800">INR {Number(activeBookingDetails?.total_amount).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-black text-slate-400 block uppercase tracking-wider">BILLING STATUS</span>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full inline-block uppercase ${
                          activeBookingDetails?.payment_status === 'success' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {activeBookingDetails?.payment_status || 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Meta details */}
                    <div className="bg-slate-50 p-2.5 rounded-lg flex items-center justify-between text-[8px] font-black uppercase text-slate-400 tracking-wider">
                      <span>Source: {activeBookingDetails?.source || activeBookingDetails?.booking_source || 'Website'}</span>
                      <span>ID: {activeBookingDetails?.booking_id}</span>
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 flex gap-3 text-slate-650 text-[10px] leading-relaxed font-bold">
                    <span>💡</span>
                    <span>
                      Modifying availability status for <strong>{selectedCell.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong>.
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      onClick={() => handleStatusChange(selectedCell.roomId, selectedCell.date, 'available')}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                        selectedCell.status === 'available'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-slate-100 hover:border-slate-200 text-slate-600 font-medium'
                      }`}
                    >
                      <span className="text-xs">Set Room as Available</span>
                      <div className="w-3.5 h-3.5 rounded-full border-4 border-emerald-500 bg-white" />
                    </button>

                    <button
                      onClick={() => handleStatusChange(selectedCell.roomId, selectedCell.date, 'maintenance')}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${
                        selectedCell.status === 'maintenance'
                          ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold'
                          : 'border-slate-100 hover:border-slate-200 text-slate-600 font-medium'
                      }`}
                    >
                      <span className="text-xs">Mark under Maintenance</span>
                      <div className="w-3.5 h-3.5 rounded-full border-4 border-amber-500 bg-white" />
                    </button>
                    
                    <div className="p-3 text-[9px] text-slate-400 text-center italic border-t border-slate-50 mt-1 uppercase font-bold tracking-tight">
                      For reservation entries, schedule in the Booking tab.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button 
                onClick={() => setShowModal(null)}
                className="bg-[#0b336b] hover:bg-black text-[10px] uppercase font-black tracking-widest text-white px-5 py-2 rounded-lg shadow transition-all active:scale-95"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
