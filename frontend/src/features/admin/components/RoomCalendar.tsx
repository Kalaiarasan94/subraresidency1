import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { ChevronLeft, ChevronRight, Clock, ShieldCheck, Hammer, BookmarkCheck } from 'lucide-react';

export const RoomCalendar = () => {
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(now);
  const [selectedDate, setSelectedDate] = useState<Date | null>(now);
  const [roomStatuses, setRoomStatuses] = useState<any[]>([]);

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
    if (selectedDate) {
      setRoomStatuses(generateMockStatuses(selectedDate));
    }
  }, [selectedDate]);

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
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Room {room.id}</p>
                         <h5 className="font-bold text-slate-800">{room.name}</h5>
                         {room.status === 'Booked' && room.guest && <p className="text-[10px] font-medium text-slate-500 mt-1 italic">Guest: {room.guest}</p>}
                      </div>
                   </div>
                   <div className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter ${
                      room.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                      room.status === 'Maintenance' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                   }`}>
                      {room.status}
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
};
