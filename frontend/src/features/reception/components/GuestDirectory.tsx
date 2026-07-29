import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Search, User, Phone, Mail, Calendar, ExternalLink, X } from 'lucide-react';
import { API_BASE_URL } from '../../../lib/api';

export const GuestDirectory = () => {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);
  const [guestBookings, setGuestBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/management/guests`);
        const json = await resp.json();
        if (json.status === 'success') {
          setGuests(json.data);
        }
      } catch (err) {} finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, []);

  const filtered = guests.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.phone.includes(searchTerm) ||
    (g.email && g.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (g.room_numbers && g.room_numbers.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewProfile = async (guest: any) => {
    setSelectedGuest(guest);
    setLoadingBookings(true);
    try {
      const params = new URLSearchParams();
      if (guest.email) params.append('email', guest.email);
      if (guest.phone) params.append('phone', guest.phone);
      const resp = await fetch(`${API_BASE_URL}/management/guest-bookings?${params.toString()}`);
      const json = await resp.json();
      if (json.status === 'success') {
        setGuestBookings(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleVacate = async (bookingId: string) => {
    if (!window.confirm(`Are you sure you want to mark booking ${bookingId} as vacated (check-out)? This will free up the room inventory.`)) {
      return;
    }
    try {
      const resp = await fetch(`${API_BASE_URL}/management/vacate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId })
      });
      const json = await resp.json();
      if (json.status === 'success') {
        alert('Booking marked as vacated successfully.');
        if (selectedGuest) {
          handleViewProfile(selectedGuest);
        }
        const resp2 = await fetch(`${API_BASE_URL}/management/guests`);
        const json2 = await resp2.json();
        if (json2.status === 'success') {
          setGuests(json2.data);
        }
      } else {
        alert(json.message || 'Failed to mark room as vacated.');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while marking the booking as vacated.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Guest Directory</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Verified Guest Profiles & History</p>
         </div>
         <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, phone or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-slate-700 focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
            />
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
           Array(6).fill(0).map((_, i) => (
             <div key={i} className="h-48 bg-slate-100 rounded-3xl animate-pulse"></div>
           ))
        ) : filtered.map((guest, i) => (
          <Card key={i} className="border-none shadow-xl rounded-[2rem] overflow-hidden bg-white hover:scale-[1.02] transition-all group">
             <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <User size={28} />
                   </div>
                   <div>
                      <h3 className="font-black text-slate-800 uppercase tracking-tight">{guest.name}</h3>
                      <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{guest.total_stays} Stays Total</p>
                   </div>
                </div>

                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                      <Phone size={14} className="text-slate-300" />
                      {guest.phone}
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                      <Mail size={14} className="text-slate-300" />
                      {guest.email || '—'}
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                      <Calendar size={14} className="text-slate-300" />
                      Last Visit: {guest.last_visit}
                   </div>
                   <div className="flex items-center gap-3 text-xs font-black text-emerald-700 mt-1">
                      Total Spent: ₹ {parseFloat(guest.total_spent || 0).toLocaleString('en-IN')}
                   </div>
                </div>

                <button 
                  onClick={() => handleViewProfile(guest)}
                  className="w-full mt-8 py-4 border-2 border-slate-50 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                   View Full Profile <ExternalLink size={12} />
                </button>
             </CardContent>
          </Card>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
         <div className="py-24 text-center">
            <p className="text-slate-400 font-black uppercase tracking-widest">No matching guests found in the directory</p>
         </div>
      )}

      {/* View Profile Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Guest Profile Detail</h3>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Detailed stay history & active reservations</p>
              </div>
              <button onClick={() => setSelectedGuest(null)} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-650 transition-colors">
                <X size={16} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-8 space-y-6 max-h-[500px] overflow-y-auto custom-scrollbar">
              {/* Guest Overview Card */}
              <div className="flex flex-col sm:flex-row gap-5 p-6 bg-slate-50 border border-slate-100 rounded-[1.5rem]">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 shrink-0">
                  <User size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">{selectedGuest.name}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-500 mt-2">
                    <span className="flex items-center gap-2"><Phone size={13} className="text-slate-400" /> {selectedGuest.phone}</span>
                    <span className="flex items-center gap-2"><Mail size={13} className="text-slate-400" /> {selectedGuest.email || '—'}</span>
                  </div>
                  <div className="flex gap-4 text-[10px] font-black text-emerald-700 uppercase tracking-wider pt-2">
                     <span>Stays: {selectedGuest.total_stays}</span>
                     <span>Spent: ₹ {parseFloat(selectedGuest.total_spent || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Stay History List */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stay History / Bookings</h5>
                
                {loadingBookings ? (
                  <div className="py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Loading bookings...</div>
                ) : (
                  <div className="space-y-3">
                    {guestBookings.map((bk: any, i: number) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors gap-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-emerald-700 tracking-wide">{bk.booking_id}</span>
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                              bk.status === 'checked-in' || bk.status === 'stay-in' ? 'bg-emerald-50 border-emerald-150 text-emerald-800' :
                              bk.status === 'confirmed' ? 'bg-indigo-50 border-indigo-200 text-indigo-800' :
                              bk.status === 'checked-out' ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-rose-50 border-rose-250 text-rose-800'
                            }`}>
                              {bk.status === 'checked-in' || bk.status === 'stay-in' ? 'Stay-in' : bk.status}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 uppercase">Room: {bk.room_numbers || 'N/A'}</p>
                          <p className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
                            Stay: {bk.check_in_date} to {bk.check_out_date}
                          </p>
                        </div>
                        <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-4 sm:gap-2">
                          <div className="text-right">
                            <span className="text-[8.5px] font-black text-slate-450 uppercase tracking-wider block">Investment</span>
                            <span className="text-sm font-black text-slate-800 font-sans block">₹ {parseFloat(bk.total_amount).toLocaleString('en-IN')}</span>
                          </div>
                          
                          {(bk.status === 'checked-in' || bk.status === 'stay-in') && (
                            <button 
                              onClick={() => handleVacate(bk.booking_id)}
                              className="px-4 py-2 bg-rose-50 text-rose-650 hover:bg-rose-100 border border-rose-150 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shrink-0"
                            >
                              Vacate Room
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {guestBookings.length === 0 && (
                      <div className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No stay history found for this guest</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
