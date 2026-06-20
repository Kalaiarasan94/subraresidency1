import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ChevronLeft, ChevronRight, Clock, ShieldCheck, Hammer, BookmarkCheck } from 'lucide-react';
import { fetchRoomAvailability, updateRoomAvailability, fetchBookingForRoomDate } from '../../../lib/api';

export const RoomCalendar = () => {
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(now);
  const [selectedDate, setSelectedDate] = useState<Date | null>(now);
  const [roomStatuses, setRoomStatuses] = useState<any[]>([]);
  const [roomsList, setRoomsList] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  // Mock data for demo purposes
  const generateMockStatuses = (date: Date) => {
    const statuses = [
      { id: 101, name: 'Royal Suite', status: 'Booked', guest: 'John Doe' },
      { id: 102, name: 'Heritage Room', status: 'Available' },
      { id: 103, name: 'Executive Suite', status: 'Maintenance' },
      { id: 104, name: 'Garden Room', status: 'Booked', guest: 'Jane Smith' },
      { id: 105, name: 'Legacy Room', status: 'Available' },
      { id: 201, name: 'Temple View', status: 'Available' },
      { id: 202, name: 'Classic Room', status: 'Maintenance' },
    ];
    // Randomize slightly based on date
    return statuses.map(s => ({
        ...s,
        status: (date.getDate() + s.id) % 3 === 0 ? 'Booked' : (date.getDate() + s.id) % 5 === 0 ? 'Maintenance' : 'Available'
    }));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // load rooms list
        const resp = await fetch('http://localhost:8001/api/index.php/rooms/list');
        if (resp.ok) {
          const data = await resp.json();
          setRoomsList(data);
          if (!selectedRoom && data.length > 0) setSelectedRoom(data[0].id);
        }
      } catch (e) {
        console.error('Failed to fetch rooms list', e);
      }

      if (selectedDate && selectedRoom) {
        const dateStr = selectedDate.toISOString().slice(0,10);
        const avail = await fetchRoomAvailability(selectedRoom, dateStr, dateStr);
        // Map roomsList to statuses for the selected date
        const mapped = (roomsList.length > 0) ? roomsList.map((r: any) => {
          const match = (avail || []).find((a: any) => Number(a.room_id) === Number(r.id) && a.date === dateStr);
          return {
            id: r.id,
            name: r.room_name || r.title || `Room ${r.id}`,
            status: match ? match.status : (r.status || 'Available'),
            guest: match && match.guest ? match.guest : null
          };
        }) : [];
        setRoomStatuses(mapped);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedRoom]);

  const dataForRoomStatusesFromAvail = (roomId: number, date: Date, availRows: any[]) => {
    const dateStr = date.toISOString().slice(0,10);
    return roomsList.map((r: any) => {
      const match = (availRows || []).find((a: any) => Number(a.room_id) === Number(r.id) && a.date === dateStr);
      return {
        id: r.id,
        name: r.room_name || r.title || `Room ${r.id}`,
        status: match ? match.status : (r.status || 'Available'),
        guest: match && match.guest ? match.guest : null
      };
    });
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
      <div className="lg:col-span-1 space-y-6">
        <Card className="border-slate-200 shadow-sm overflow-hidden bg-white rounded-2xl">
          <div className="p-6 bg-emerald-900 text-white flex justify-between items-center">
            <h3 className="font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
            <div className="flex gap-2">
              <Button onClick={prevMonth} variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-emerald-800"><ChevronLeft size={16}/></Button>
              <Button onClick={nextMonth} variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-emerald-800"><ChevronRight size={16}/></Button>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 text-center mb-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[10px] font-bold text-slate-400">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array(firstDayOfMonth(currentDate)).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
              {Array(daysInMonth(currentDate)).fill(null).map((_, i) => {
                const day = i + 1;
                const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const isToday = now.toDateString() === dateObj.toDateString();
                const isSelected = selectedDate?.toDateString() === dateObj.toDateString();
                const isPast = dateObj < new Date(now.getFullYear(), now.getMonth(), now.getDate());
                
                return (
                  <button 
                    key={day} 
                    onClick={() => !isPast && handleDateClick(day)}
                    disabled={isPast}
                    className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      isSelected ? 'bg-emerald-600 text-white shadow-md' : 
                      isToday ? 'bg-emerald-100 text-emerald-900' : 
                      isPast ? 'text-slate-200 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white rounded-2xl">
          <CardContent className="p-6 space-y-4">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Legend</h4>
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-emerald-500" />
                   <span className="text-sm font-bold text-slate-600">Available</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-amber-500" />
                   <span className="text-sm font-bold text-slate-600">Maintenance</span>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full bg-rose-500" />
                   <span className="text-sm font-bold text-slate-600">Booked / Occupied</span>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-xl font-bold text-slate-800">
             Inventory Status for {selectedDate?.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
           </h3>
           <div>
             <select className="p-2 border rounded-md text-sm" value={selectedRoom ?? ''} onChange={(e) => setSelectedRoom(Number(e.target.value))}>
               <option value="">Select Room</option>
               {roomsList.map(r => <option key={r.id} value={r.id}>{r.room_name || r.title || r.id}</option>)}
             </select>
           </div>
           <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest bg-emerald-50 p-2 rounded-lg text-emerald-700">
              <Clock size={12} /> Live Sync
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {roomStatuses.map((room) => (
             <Card key={room.id} className="border-slate-100 shadow-sm hover:shadow-md transition-all rounded-xl bg-white group overflow-hidden">
                <CardContent className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${
                        room.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                        room.status === 'Maintenance' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {room.status === 'Available' ? <ShieldCheck size={20} /> :
                         room.status === 'Maintenance' ? <Hammer size={20} /> : <BookmarkCheck size={20} />}
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{String(room.name).toUpperCase()}</p>
                   <h5 className="font-bold text-slate-800">{room.name} {room.room_number ? (' - ' + room.room_number) : ''}</h5>
                         {room.status === 'Booked' && room.guest && <p className="text-[10px] font-medium text-slate-500 mt-1 italic">Guest: {room.guest}</p>}
                      </div>
                   </div>
             <div className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
               room.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
               room.status === 'Maintenance' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
             }`}>
               {room.status}
             </div>
             <div className="ml-3">
               <select value={room.status} onChange={async (e) => {
                  const newStatus = e.target.value;
                  const dateStr = selectedDate?.toISOString().slice(0,10);
                  if (!dateStr) return;
                  const res = await updateRoomAvailability({ room_id: room.id, date: dateStr, status: newStatus });
                  if (res && res.success) {
                    // optimistic update
                    setRoomStatuses(prev => prev.map(p => p.id === room.id ? { ...p, status: newStatus } : p));
                  } else {
                    alert('Failed to update availability');
                  }
               }} className="text-xs font-bold p-1 rounded-md border">
                 <option>Available</option>
                 <option>Booked</option>
                 <option>Maintenance</option>
               </select>
             </div>
            <div className="ml-4">
              <button className="text-sm font-bold underline text-slate-600" onClick={async () => {
                const dateStr = selectedDate?.toISOString().slice(0,10);
                if (!dateStr) return;
                const info = await fetchBookingForRoomDate(room.id, dateStr);
                setModalData({ room, date: dateStr, info });
                setModalOpen(true);
              }}>Details</button>
            </div>
                </CardContent>
             </Card>
           ))}
        </div>
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Room Details</h3>
                <button className="text-slate-500" onClick={() => { setModalOpen(false); setModalData(null); }}>Close</button>
              </div>
              <div>
                <p className="text-sm font-bold">Room: {modalData?.room?.name} {modalData?.room?.room_number ? (' - ' + modalData.room.room_number) : ''}</p>
                <p className="text-sm text-slate-500">Date: {modalData?.date}</p>
                <div className="mt-4">
                  {modalData?.info?.booking ? (
                    <div className="space-y-2">
                      <p className="font-bold">Booked Online</p>
                      <p>Booking ID: {modalData.info.booking.booking_id}</p>
                      <p>Guest: {modalData.info.booking.guest_name}</p>
                      <p>Email: {modalData.info.booking.guest_email}</p>
                      <p>Phone: {modalData.info.booking.guest_phone}</p>
                      <p>Check-in: {modalData.info.booking.check_in_date}</p>
                      <p>Check-out: {modalData.info.booking.check_out_date}</p>
                    </div>
                  ) : modalData?.info?.availability ? (
                    <div>
                      <p className="font-bold">Manual Availability</p>
                      <p>Status: {modalData.info.availability.status}</p>
                      <p>Note: {modalData.info.availability.note}</p>
                    </div>
                  ) : (
                    <p className="text-slate-500">This room is free for this date.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
