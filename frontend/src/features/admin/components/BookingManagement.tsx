import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { 
  Search, Globe, UserCheck, 
  Settings, Download, Printer, FileText
} from 'lucide-react';
import { fetchAdminBookings, cancelBooking, BACKEND_URL } from '../../../lib/api';
import { generateHotelReportPdf } from '../../../lib/pdfReportGenerator';

export const BookingManagement = () => {
  const [filterSource, setFilterSource] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const mapStatus = (s: string) => {
    if (!s) return 'Pending';
    const lower = s.toLowerCase();
    if (lower === 'pending') return 'Pending';
    if (lower === 'confirmed') return 'Confirmed';
    if (lower === 'checked-in' || lower === 'stay-in') return 'Stay-in';
    if (lower === 'checked-out') return 'Checked-out';
    if (lower === 'cancelled') return 'Cancelled';
    return s;
  };

  const mapSource = (s: string) => {
    if (!s) return 'Online';
    const lower = s.toLowerCase();
    if (lower === 'website' || lower === 'online') return 'Online';
    if (lower === 'walk-in' || lower === 'walkin' || lower === 'reception' || lower === 'manual') return 'Walk-in';
    return 'Walk-in';
  };

  useEffect(() => {
    setLoading(true);
    fetchAdminBookings(100, 0).then((res: any) => {
      setLoading(false);
      if (res && res.status === 'success') {
        setBookings(res.bookings.map((b: any) => ({ 
          id: b.booking_id, 
          guest: b.guest_name, 
          room: b.status === 'confirmed' ? 'Pending' : (b.rooms ? b.rooms.map((r: any) => r.room_number).join(', ') : ''), 
          date: b.check_in_date + ' - ' + b.check_out_date, 
          amount: '₹' + (b.paid_amount || b.total_amount), 
          source: mapSource(b.booking_source || b.source || 'Online'), 
          status: mapStatus(b.status) 
        })));
      }
    }).catch(() => setLoading(false));
  }, []);

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${bookingId}? This will release the room reservation dates.`)) {
      return;
    }
    
    try {
      const res = await cancelBooking(bookingId);
      if (res && res.status === 'success') {
        alert('Booking cancelled and room dates released successfully!');
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
      } else {
        alert(res?.message || 'Failed to cancel booking.');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred while cancelling the booking.');
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSource = filterSource === 'All' || b.source === filterSource;
    if (!matchesSource) return false;
    
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (b.guest && b.guest.toLowerCase().includes(term)) ||
      (b.id && b.id.toLowerCase().includes(term)) ||
      (b.room && b.room.toLowerCase().includes(term))
    );
  });

  const handleDownloadBookingsPdf = () => {
    const formattedData = filteredBookings.map(b => ({
      ...b,
      roomDisplay: b.room || 'Unassigned',
      amountDisplay: b.amount || '₹0'
    }));

    generateHotelReportPdf({
      title: 'HOTEL RESERVATIONS & BOOKING INVENTORY AUDIT REGISTER',
      period: `Filter: ${filterSource} Bookings`,
      summaryCards: [
        { label: 'Total Bookings', value: `${filteredBookings.length} Records` },
        { label: 'Website Stays', value: `${bookings.filter(b => b.source === 'Online').length}` },
        { label: 'Walk-in Stays', value: `${bookings.filter(b => b.source === 'Walk-in').length}` }
      ],
      columns: [
        { header: '#', dataKey: '_index', alignment: 'center', width: 10 },
        { header: 'Booking ID', dataKey: 'id', alignment: 'left', width: 34 },
        { header: 'Guest Name', dataKey: 'guest', alignment: 'left', width: 45 },
        { header: 'Room Allocation', dataKey: 'roomDisplay', alignment: 'center', width: 28 },
        { header: 'Stay Duration', dataKey: 'date', alignment: 'center', width: 38 },
        { header: 'Channel', dataKey: 'source', alignment: 'center', width: 24 },
        { header: 'Total (₹)', dataKey: 'amountDisplay', alignment: 'right', width: 26 },
        { header: 'Status', dataKey: 'status', alignment: 'center', width: 24 }
      ],
      data: formattedData,
      filename: `Subra_Booking_Register_${new Date().toISOString().split('T')[0]}.pdf`
    });
  };

  return (
    <div className="space-y-6">
      {/* Box Header ("nox") */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h1 className="text-xl font-medium text-gray-800 tracking-tight">Booking inventory</h1>
            <p className="text-xs text-gray-400 mt-0.5">Manage reservations across website and front desk channels</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              className="border border-gray-300 text-gray-700 font-medium text-xs px-3 py-1.5 rounded-md hover:bg-gray-50 flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Printer size={14} className="text-blue-600" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadBookingsPdf}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>

            <Button 
              variant="outline" 
              onClick={() => window.open(`${BACKEND_URL}/admin_export_invoices.php`, '_blank')}
              className="border border-gray-300 text-gray-700 font-medium text-xs px-3 py-1.5 h-auto rounded-md hover:bg-gray-50 flex items-center gap-1.5 shadow-xs"
            >
              <Download size={14} className="text-gray-500" /> Export invoices
            </Button>
          </div>
        </div>

        {/* Source Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {[
             { label: 'Website bookings', source: 'Online', icon: Globe },
             { label: 'Walk-in sessions', source: 'Walk-in', icon: UserCheck },
             { label: 'Total bookings', source: 'All', icon: Settings },
           ].map((stat, i) => {
             const isSelected = filterSource === stat.source;
             return (
               <div 
                 key={i} 
                 className={`border rounded-lg p-4 cursor-pointer transition-all flex items-center justify-between ${
                   isSelected 
                     ? 'border-[#a7f3d0] bg-[#f0fdf4] text-[#059669] shadow-xs' 
                     : 'border-gray-200 bg-white hover:border-gray-300 shadow-xs'
                 }`} 
                 onClick={() => setFilterSource(stat.source)}
               >
                 <div className="space-y-1">
                    <p className={`text-xs font-medium ${isSelected ? 'text-[#059669]' : 'text-gray-500'}`}>{stat.label}</p>
                    <p className="text-2xl font-semibold font-mono tracking-tight text-gray-900">
                       {stat.source === 'All' ? bookings.length : bookings.filter(b => b.source === stat.source).length}
                    </p>
                 </div>
                 <div className={`p-2.5 border rounded-lg ${
                   isSelected 
                     ? 'border-[#a7f3d0] bg-[#ecfdf5] text-[#059669]' 
                     : 'border-gray-200 bg-gray-50 text-gray-500'
                 }`}>
                    <stat.icon size={18} />
                 </div>
               </div>
             );
           })}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
           <div className="inline-flex rounded-md border border-gray-300 bg-white p-0.5 shadow-xs text-xs font-medium text-gray-600">
              {['All', 'Online', 'Walk-in'].map(s => (
                 <button 
                   key={s} 
                   onClick={() => setFilterSource(s)}
                   className={`px-3.5 py-1.5 rounded transition-colors ${
                     filterSource === s ? 'bg-gray-100 text-gray-900 font-medium' : 'hover:bg-gray-50 text-gray-600'
                   }`}
                 >
                   {s} {s === 'All' ? 'sources' : ''}
                 </button>
              ))}
           </div>
           
           <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 shadow-xs focus:outline-none focus:border-blue-500" 
                 placeholder="Search guests, IDs, or rooms..." 
               />
           </div>
        </div>

        {/* Table Section */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs">
          {loading && (
            <div className="p-8 text-center text-gray-400 text-xs font-medium">Loading bookings...</div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50/80 text-[11px] font-semibold text-gray-500 border-b border-gray-200">
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Guest details</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Stay window</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((bk) => (
                  <tr key={bk.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                       <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {bk.source === 'Online' ? <Globe size={11} className="text-blue-500" /> : <UserCheck size={11} className="text-emerald-500" />}
                          {bk.source}
                       </span>
                    </td>
                    <td className="px-4 py-3">
                       <div>
                          <p className="font-medium text-gray-800">{bk.guest}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">{bk.id}</p>
                       </div>
                    </td>
                    <td className="px-4 py-3">
                       <span className="font-mono text-gray-700">{bk.room || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                       <span className="text-gray-600 font-mono text-[11px]">{bk.date}</span>
                    </td>
                    <td className="px-4 py-3">
                       <span className="font-semibold text-gray-900 font-mono">{bk.amount}</span>
                    </td>
                    <td className="px-4 py-3">
                       <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                         bk.status === 'Stay-in' ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]' :
                         bk.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                         bk.status === 'Checked-out' ? 'bg-gray-100 border-gray-200 text-gray-700' : 
                         bk.status === 'Cancelled' ? 'bg-rose-50 border-rose-200 text-rose-600 line-through' :
                         'bg-amber-50 border-amber-200 text-amber-700'
                       }`}>
                         {bk.status}
                       </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => window.open(`${BACKEND_URL}/admin_view_booking.php?booking_id=${bk.id}`, '_blank')} 
                          className="px-2.5 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-50 shadow-xs transition-colors"
                        >
                          View
                        </button>
                        {bk.status.toLowerCase() !== 'cancelled' && (
                          <button 
                            onClick={() => handleCancel(bk.id)} 
                            className="px-2.5 py-1 bg-white border border-rose-200 text-rose-600 rounded-md text-xs font-medium hover:bg-rose-50 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredBookings.length === 0 && !loading && (
            <div className="py-16 text-center space-y-2">
               <p className="text-xs font-medium text-gray-400">No active bookings found for {filterSource} source.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
