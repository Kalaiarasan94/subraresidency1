import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { 
  Search, User, Phone, Mail, Calendar, ExternalLink, X, 
  Printer, Download, ChevronLeft, ChevronRight, FileText, Filter
} from 'lucide-react';
import { API_BASE_URL } from '../../../lib/api';
import { generateHotelReportPdf } from '../../../lib/pdfReportGenerator';

export const GuestDirectory = () => {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null);
  const [guestBookings, setGuestBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Date / Month Filtering state
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const today = new Date().toISOString().split('T')[0];

  const [filterMode, setFilterMode] = useState<'all' | 'month' | 'date'>('all');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchGuests = async () => {
    setLoading(true);
    try {
      let queryUrl = `${API_BASE_URL}/management/guests`;
      if (filterMode === 'month') {
        const lastDay = new Date(selectedYear, parseInt(selectedMonth, 10), 0).getDate();
        const start = `${selectedYear}-${selectedMonth}-01`;
        const end = `${selectedYear}-${selectedMonth}-${String(lastDay).padStart(2, '0')}`;
        queryUrl += `?start_date=${start}&end_date=${end}`;
      } else if (filterMode === 'date') {
        queryUrl += `?start_date=${selectedDate}&end_date=${selectedDate}`;
      }

      const resp = await fetch(queryUrl);
      const json = await resp.json();
      if (json.status === 'success') {
        setGuests(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [filterMode, selectedYear, selectedMonth, selectedDate]);

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

  const periodLabel = useMemo(() => {
    if (filterMode === 'month') {
      return `${monthNames[parseInt(selectedMonth, 10) - 1]} ${selectedYear} (Monthly)`;
    } else if (filterMode === 'date') {
      return `${selectedDate} (Single Day)`;
    } else {
      return 'All Registered Profiles';
    }
  }, [filterMode, selectedYear, selectedMonth, selectedDate]);

  const handleDownloadGuestPdf = () => {
    const totalSpentSum = filtered.reduce((acc, g) => acc + parseFloat(g.total_spent || 0), 0);
    const totalStaysSum = filtered.reduce((acc, g) => acc + parseInt(g.total_stays || 0, 10), 0);

    const formattedData = filtered.map(g => ({
      ...g,
      email: g.email || '—',
      room_numbers: g.room_numbers || '—',
      last_visit: g.last_visit || '—',
      totalSpentFormatted: `₹${parseFloat(g.total_spent || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
    }));

    generateHotelReportPdf({
      title: 'GUEST DIRECTORY & IN-HOUSE REGISTRY REPORT',
      period: periodLabel,
      summaryCards: [
        { label: 'Total Guests', value: `${filtered.length} Profiles` },
        { label: 'Total Stays', value: `${totalStaysSum} Stays` },
        { label: 'Total Spent', value: `₹${totalSpentSum.toLocaleString('en-IN')}` }
      ],
      columns: [
        { header: '#', dataKey: '_index', alignment: 'center', width: 10 },
        { header: 'Guest Name', dataKey: 'name', alignment: 'left', width: 45 },
        { header: 'Contact Mobile', dataKey: 'phone', alignment: 'left', width: 30 },
        { header: 'Email ID', dataKey: 'email', alignment: 'left', width: 45 },
        { header: 'Rooms', dataKey: 'room_numbers', alignment: 'center', width: 22 },
        { header: 'Last Stay', dataKey: 'last_visit', alignment: 'center', width: 25 },
        { header: 'Stays', dataKey: 'total_stays', alignment: 'center', width: 18 },
        { header: 'Total Spent (₹)', dataKey: 'totalSpentFormatted', alignment: 'right', width: 30 }
      ],
      data: formattedData,
      filename: `Subra_Guest_Directory_${filterMode === 'month' ? `${selectedYear}_${selectedMonth}` : (filterMode === 'date' ? selectedDate : 'All')}.pdf`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Deck & Report Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-xs space-y-4 no-print">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Guest Directory &amp; Registry</h2>
            <p className="text-xs text-gray-500 mt-0.5">Filter by stay date or month to generate official guest registry reports</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer size={14} className="text-blue-600" />
              <span>Print Directory</span>
            </button>

            <button
              onClick={handleDownloadGuestPdf}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span>Download PDF Report</span>
            </button>
          </div>
        </div>

        {/* Date / Month Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1 items-center border-t border-gray-100">
          <div className="md:col-span-4 flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
            <button
              onClick={() => setFilterMode('all')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center transition-colors cursor-pointer ${
                filterMode === 'all' ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Guests
            </button>
            <button
              onClick={() => setFilterMode('month')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center transition-colors cursor-pointer ${
                filterMode === 'month' ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              By Month
            </button>
            <button
              onClick={() => setFilterMode('date')}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md text-center transition-colors cursor-pointer ${
                filterMode === 'date' ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              By Specific Date
            </button>
          </div>

          <div className="md:col-span-5 flex items-center gap-2">
            {filterMode === 'month' && (
              <div className="flex items-center gap-2 w-full">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 flex-1 focus:ring-1 focus:ring-emerald-500"
                >
                  {monthNames.map((name, idx) => (
                    <option key={idx} value={String(idx + 1).padStart(2, '0')}>
                      {name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-2.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 w-24 focus:ring-1 focus:ring-emerald-500"
                >
                  {[2024, 2025, 2026, 2027].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            )}

            {filterMode === 'date' && (
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Stay Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-800 flex-1 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            )}

            {filterMode === 'all' && (
              <span className="text-xs text-gray-500 font-medium">
                Consolidated directory across all bookings &amp; historical stays.
              </span>
            )}
          </div>

          <div className="md:col-span-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search name, phone, room..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg py-1.5 pl-9 pr-3 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors shadow-xs"
              />
            </div>
          </div>
        </div>

        {/* Current Filter Pill */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
          <span>Active Period: <strong className="text-gray-900">{periodLabel}</strong></span>
          <span>Found <strong className="text-gray-900 font-mono">{filtered.length}</strong> guest records</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-44 bg-white border border-gray-200 rounded-lg animate-pulse" />
          ))
        ) : filtered.map((guest, i) => (
          <div key={i} className="crm-card bg-white border border-gray-200 rounded-lg p-5 shadow-xs hover:border-gray-300 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-center justify-center font-medium shrink-0">
                  <User size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm text-gray-900 truncate">{guest.name}</h3>
                  <p className="text-[11px] font-medium text-emerald-700">{guest.total_stays} total stays</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-gray-400 shrink-0" />
                  <span className="truncate">{guest.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-gray-400 shrink-0" />
                  <span className="truncate">{guest.email || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-gray-400 shrink-0" />
                  <span>Last visit: {guest.last_visit || '—'}</span>
                </div>
                <div className="pt-1 text-xs font-medium text-gray-900">
                  Total spent: <span className="font-semibold tabular-nums text-emerald-700">₹ {parseFloat(guest.total_spent || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleViewProfile(guest)}
              className="mt-4 w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-xs font-medium text-gray-700 transition-colors flex items-center justify-center gap-1.5"
            >
              View profile <ExternalLink size={12} />
            </button>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="crm-card bg-white border border-gray-200 rounded-lg py-16 text-center shadow-xs">
          <p className="text-sm text-gray-500 font-medium">No matching guests found in the directory</p>
        </div>
      )}

      {/* View Profile Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full overflow-hidden border border-gray-200 flex flex-col">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Guest Profile Details</h3>
                <p className="text-xs text-gray-500 mt-0.5">Stay history and active reservations</p>
              </div>
              <button 
                onClick={() => setSelectedGuest(null)} 
                className="p-1.5 hover:bg-gray-100 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-5 space-y-5 max-h-[500px] overflow-y-auto">
              {/* Guest Overview Card */}
              <div className="flex items-start gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-emerald-700 shrink-0">
                  <User size={22} />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900">{selectedGuest.name}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                    <span className="flex items-center gap-1.5"><Phone size={12} className="text-gray-400" /> {selectedGuest.phone}</span>
                    <span className="flex items-center gap-1.5"><Mail size={12} className="text-gray-400" /> {selectedGuest.email || '—'}</span>
                  </div>
                  <div className="flex gap-4 text-xs font-medium text-emerald-700 pt-1">
                    <span>Stays: {selectedGuest.total_stays}</span>
                    <span>Spent: ₹ {parseFloat(selectedGuest.total_spent || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Stay History List */}
              <div className="space-y-3">
                <h5 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Stay History</h5>
                
                {loadingBookings ? (
                  <div className="py-8 text-center text-xs text-gray-400">Loading bookings...</div>
                ) : (
                  <div className="space-y-2">
                    {guestBookings.map((bk: any, i: number) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-900">{bk.booking_id}</span>
                            <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                              bk.status === 'checked-in' || bk.status === 'stay-in' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                              bk.status === 'confirmed' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                              bk.status === 'checked-out' ? 'bg-gray-100 border-gray-200 text-gray-600' : 'bg-rose-50 border-rose-200 text-rose-700'
                            }`}>
                              {bk.status === 'checked-in' || bk.status === 'stay-in' ? 'Stay-in' : bk.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">Room: {bk.room_numbers || 'N/A'}</p>
                          <p className="text-[11px] text-gray-400 tabular-nums">
                            {bk.check_in_date} to {bk.check_out_date}
                          </p>
                        </div>
                        <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-3 sm:gap-1.5">
                          <div className="text-right">
                            <span className="text-xs font-semibold text-gray-900 tabular-nums">₹ {parseFloat(bk.total_amount).toLocaleString('en-IN')}</span>
                          </div>
                          
                          {(bk.status === 'checked-in' || bk.status === 'stay-in') && (
                            <button 
                              onClick={() => handleVacate(bk.booking_id)}
                              className="px-2.5 py-1 bg-white text-rose-700 hover:bg-rose-50 border border-rose-200 rounded text-xs font-medium transition-colors shrink-0"
                            >
                              Vacate Room
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {guestBookings.length === 0 && (
                      <div className="py-8 text-center text-gray-400 text-xs">No stay history found for this guest</div>
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
