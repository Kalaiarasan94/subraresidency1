import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  Search, Filter, Globe, UserCheck, 
  Settings, MoreVertical, Download, PlusSquare
} from 'lucide-react';

export const BookingManagement = () => {
  const [filterSource, setFilterSource] = useState('All');
  const [bookings, setBookings] = useState<any[]>([]);

  // Mock data for source visualization demo
  const mockBookings = [
    { id: 'BK001', guest: 'Rajesh Kumar', room: 'Royal Suite (101)', date: 'Jun 20 - Jun 22', amount: '₹11,000', source: 'Online', status: 'Confirmed' },
    { id: 'BK002', guest: 'Anitha S', room: 'Heritage Room (104)', date: 'Jun 21 - Jun 23', amount: '₹15,200', source: 'Walk-in', status: 'Stay-in' },
    { id: 'BK003', guest: 'David Miller', room: 'Executive Suite (205)', date: 'Jun 20 - Jun 25', amount: '₹22,500', source: 'Manual', status: 'Confirmed' },
    { id: 'BK004', guest: 'Michael Chen', room: 'Garden Room (302)', date: 'Jun 19 - Jun 21', amount: '₹7,600', source: 'Online', status: 'Checked-out' },
  ];

  useEffect(() => {
    // In real app, fetch from API
    setBookings(mockBookings);
  }, []);

  const filteredBookings = filterSource === 'All' 
    ? bookings 
    : bookings.filter(b => b.source === filterSource);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Booking Inventory</h1>
          <p className="text-sm text-slate-500 font-medium">Manage reservations across all channels.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="border-slate-200 text-slate-600 font-bold px-6 py-2.5 h-auto rounded-xl flex items-center gap-2">
             <Download size={16} /> Export Logs
           </Button>
           <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-2.5 h-auto rounded-xl flex items-center gap-2 shadow-sm">
             <PlusSquare size={16} /> New Reservation
           </Button>
        </div>
      </div>

      {/* Source Distribution Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: 'Site Bookings', source: 'Online', icon: Globe, color: 'text-blue-600', bg: 'bg-blue-50' },
           { label: 'Walk-in Sessions', source: 'Walk-in', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Manual Entries', source: 'Manual', icon: Settings, color: 'text-amber-600', bg: 'bg-amber-50' },
         ].map((stat, i) => (
           <Card key={i} className="border-none shadow-sm hover:translate-y-[-2px] transition-all cursor-pointer overflow-hidden" onClick={() => setFilterSource(stat.source)}>
             <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                   <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                      <stat.icon size={20} />
                   </div>
                   {filterSource === stat.source && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                </div>
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</h4>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                   {bookings.filter(b => b.source === stat.source).length} Active
                </p>
             </CardContent>
           </Card>
         ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-white p-2 border border-slate-200 rounded-2xl shadow-sm">
         <div className="flex p-1 bg-slate-50 rounded-xl">
            {['All', 'Online', 'Walk-in', 'Manual'].map(s => (
               <button 
                 key={s} 
                 onClick={() => setFilterSource(s)}
                 className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                   filterSource === s ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 {s} {s === 'All' ? 'Sources' : ''}
               </button>
            ))}
         </div>
         <div className="flex-grow relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input className="w-full bg-transparent border-none outline-none pl-12 text-sm font-medium text-slate-600" placeholder="Search guests, IDs, or rooms..." />
         </div>
         <Button variant="ghost" className="p-3 text-slate-400"><Filter size={18}/></Button>
      </div>

      {/* Table Section */}
      <Card className="border border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-widest border-b border-slate-100">
                  <th className="px-8 py-5">Source</th>
                  <th className="px-8 py-5">Guest Information</th>
                  <th className="px-8 py-5">Room Category</th>
                  <th className="px-8 py-5">Stay Window</th>
                  <th className="px-8 py-5">Investment</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-md ${
                            bk.source === 'Online' ? 'bg-blue-50 text-blue-600' :
                            bk.source === 'Walk-in' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {bk.source === 'Online' ? <Globe size={14} /> : 
                             bk.source === 'Walk-in' ? <UserCheck size={14} /> : <Settings size={14} />}
                          </div>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{bk.source}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <div>
                          <p className="font-bold text-slate-800 text-sm">{bk.guest}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{bk.id}</p>
                       </div>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-xs font-bold text-slate-600">{bk.room}</p>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-xs font-medium text-slate-500">{bk.date}</p>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-sm font-bold text-emerald-700">{bk.amount}</p>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-tighter ${
                         bk.status === 'Stay-in' ? 'bg-emerald-100 text-emerald-700' :
                         bk.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                       }`}>
                         {bk.status}
                       </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
                          <MoreVertical size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBookings.length === 0 && (
            <div className="py-20 text-center space-y-3">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                  <Search size={32} />
               </div>
               <p className="text-sm font-bold text-slate-400">No active bookings found for {filterSource} source.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
