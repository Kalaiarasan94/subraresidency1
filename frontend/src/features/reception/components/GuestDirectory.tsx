import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Search, User, Phone, Mail, Calendar, ExternalLink } from 'lucide-react';
import { API_BASE_URL } from '../../../lib/api';

export const GuestDirectory = () => {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
    g.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

                <button className="w-full mt-8 py-4 border-2 border-slate-50 rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
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
    </div>
  );
};
