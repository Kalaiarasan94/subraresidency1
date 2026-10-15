import { useState, useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/button';
import {
  ChevronLeft, ChevronRight,
  Search, RefreshCw,
  X, User, Plus, Tag, ChevronDown,
  Printer, FileText, Download
} from 'lucide-react';
import { fetchRoomAvailability, updateRoomAvailability, API_BASE_URL, fetchBookingById } from '../../../lib/api';
import { generateHotelReportPdf } from '../../../lib/pdfReportGenerator';

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
  const [statusFilter, setStatusFilter] = useState('All');
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate 21 days from startDate for a clean readable timeline
  const days = Array.from({ length: 28 }, (_, i) => {
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
      const rResp = await fetch(`${API_BASE_URL}/rooms/list`);
      const roomsData = await rResp.json();
      setRooms(roomsData);

      const end = new Date(startDate);
      end.setDate(startDate.getDate() + 30);

      const availData = await fetchRoomAvailability(
        0,
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

  const handleCellClick = async (room: any, date: Date) => {
    const record = getAvailabilityRecord(room.id, date);
    const status = record ? record.status.toLowerCase() : 'available';
    const note = record ? record.note : '';

    setSelectedCell({
      roomId: room.id,
      roomNumber: room.room_number || room.id,
      roomName: room.title || room.room_name,
      categoryName: room.category_name || '',
      date,
      status,
      note
    });

    const dateStr = date.toLocaleDateString('en-CA');
    setRangeStart(dateStr);
    setRangeEnd(dateStr);

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

  const handleStatusChangeRange = async (roomId: number, startStr: string, endStr: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      const res = await updateRoomAvailability({
        room_id: roomId,
        date: startStr,
        end_date: endStr,
        status: newStatus
      });
      if (res && res.success) {
        await loadData();
        setShowModal(null);
      } else {
        alert(res?.message || 'Failed to update availability.');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating availability.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const shiftDate = (amount: number) => {
    const next = new Date(startDate);
    next.setDate(startDate.getDate() + amount);
    setStartDate(next);
  };

  const isToday = (d: Date) => {
    const today = new Date();
    return d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();
  };

  return (
    <div className="space-y-6">
      {/* SaaS Card Container (Like reference box "nox") */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium text-gray-800 tracking-tight">Event calendar</h2>
            {loading && (
              <RefreshCw size={14} className="text-gray-400 animate-spin" />
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* - Event label - (Category filter) */}
            <div className="relative">
              <select 
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-normal py-1.5 pl-3 pr-8 shadow-xs hover:bg-gray-50 focus:outline-none appearance-none cursor-pointer"
              >
                {uniqueCategories.map(cat => (
                  <option key={cat} value={cat}>- {cat} -</option>
                ))}
              </select>
              <ChevronDown size={14} className="text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Room Search */}
            <div className="relative">
              <Search size={14} className="text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-normal py-1.5 pl-8 pr-3 shadow-xs focus:outline-none w-36 sm:w-44"
              />
            </div>

            {/* Refresh / Manage labels */}
            <button 
              onClick={loadData}
              className="border border-gray-300 rounded-md bg-white text-gray-700 text-sm font-normal py-1.5 px-3.5 shadow-xs hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Tag size={14} className="text-gray-500" />
              <span>Manage rates</span>
            </button>

            {/* Daily Room Status & Occupancy Report Button */}
            <button 
              onClick={() => {
                const initialDate = selectedCell ? selectedCell.date.toISOString().split('T')[0] : startDate.toISOString().split('T')[0];
                setReportDate(initialDate);
                setShowReportModal(true);
              }}
              className="border border-gray-300 rounded-md bg-white text-gray-800 text-sm font-medium py-1.5 px-3.5 shadow-xs hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Daily Room Occupancy & Status Report"
            >
              <FileText size={15} className="text-emerald-700" />
              <span>Room Report</span>
            </button>

            {/* + Add event / Add booking */}
            <button 
              onClick={() => {
                if (filteredRooms[0]) handleCellClick(filteredRooms[0], new Date());
              }}
              className="border border-gray-300 rounded-md bg-white text-gray-800 text-sm font-medium py-1.5 px-3.5 shadow-xs hover:bg-gray-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={15} className="text-gray-600" />
              <span>Add booking</span>
            </button>
          </div>
        </div>

        {/* Calendar Navigation & Month Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Navigation Controls: < > today */}
          <div className="inline-flex rounded-md border border-gray-300 bg-white p-0.5 shadow-xs">
            <button 
              onClick={() => shiftDate(-7)}
              className="p-1.5 px-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors"
              title="Previous week"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => shiftDate(7)}
              className="p-1.5 px-2 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-900 transition-colors border-l border-gray-200"
              title="Next week"
            >
              <ChevronRight size={16} />
            </button>
            <button 
              onClick={() => setStartDate(new Date())}
              className="px-3 py-1 hover:bg-gray-100 rounded text-xs font-medium text-gray-700 transition-colors border-l border-gray-200"
            >
              today
            </button>
          </div>

          {/* Large Month Year Header */}
          <h3 className="text-2xl font-normal text-gray-800 tracking-tight text-center">
            {startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h3>

          {/* View Mode Selector: month | week | day | list */}
          <div className="inline-flex rounded-md border border-gray-300 bg-white p-0.5 shadow-xs text-xs font-normal text-gray-600 self-start sm:self-auto">
            <button onClick={() => shiftDate(0)} className="px-3 py-1 bg-gray-100 text-gray-900 rounded font-medium">month</button>
            <button onClick={() => shiftDate(7)} className="px-3 py-1 hover:bg-gray-50 rounded">week</button>
            <button onClick={() => shiftDate(1)} className="px-3 py-1 hover:bg-gray-50 rounded">day</button>
            <button onClick={() => {}} className="px-3 py-1 hover:bg-gray-50 rounded">list</button>
          </div>
        </div>

        {/* Timeline Table Grid */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs">
          <div className="overflow-x-auto" ref={scrollRef}>
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200">
                  <th className="sticky left-0 z-30 bg-gray-50 p-3.5 min-w-[190px] border-r border-gray-200 text-xs font-semibold text-gray-600">
                    Room / Unit
                  </th>
                  {days.map((day, i) => {
                    const today = isToday(day);
                    return (
                      <th 
                        key={i} 
                        className={`p-2.5 border-r border-gray-200 min-w-[54px] text-center ${
                          today ? 'bg-[#fffbeb]' : ''
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-medium text-gray-400 uppercase">
                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className={`text-xs font-semibold mt-0.5 ${
                            today ? 'text-amber-800' : 'text-gray-700'
                          }`}>
                            {day.getDate()}
                          </span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="p-4 border-r border-gray-200 bg-gray-50"></td>
                      {days.map((_, j) => (
                        <td key={j} className="p-4 border-r border-gray-200"></td>
                      ))}
                    </tr>
                  ))
                ) : filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="sticky left-0 z-20 bg-white hover:bg-gray-50 p-3.5 border-r border-gray-200 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700 font-mono">
                          {room.room_number || room.id}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium text-gray-800 truncate">
                            {room.title || room.room_name}
                          </span>
                          <span className="text-[10px] text-gray-400 truncate">
                            {room.category_name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {days.map((day, i) => {
                      const record = getAvailabilityRecord(room.id, day);
                      const status = record ? record.status.toLowerCase() : 'available';
                      const today = isToday(day);

                      let cellBg = today ? 'bg-[#fffbeb]/50 hover:bg-amber-100/30' : 'hover:bg-gray-50';
                      let badge = null;

                      if (status === 'booked') {
                        badge = (
                          <div className="w-full py-1 px-1.5 bg-[#ecfdf5] border border-[#a7f3d0] text-[#059669] rounded text-[10px] font-medium truncate text-center">
                            {record?.booking_status === 'confirmed' ? 'Booked' : 'Occupied'}
                          </div>
                        );
                      } else if (status === 'maintenance') {
                        badge = (
                          <div className="w-full py-1 px-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[10px] font-medium truncate text-center">
                            Maint
                          </div>
                        );
                      }

                      return (
                        <td 
                          key={i} 
                          onClick={() => handleCellClick(room, day)}
                          className={`p-1 border-r border-gray-200 cursor-pointer transition-colors align-middle text-center ${cellBg}`}
                        >
                          {badge || (
                            <span className="text-gray-300 text-[10px] select-none hover:text-gray-600">·</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-gray-500">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-white border border-gray-300" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#ecfdf5] border border-[#a7f3d0]" />
              <span>Occupied / Booked</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-50 border border-amber-200" />
              <span>Maintenance</span>
            </div>
          </div>
          <div>Click any cell to manage room rates and guest status</div>
        </div>
      </div>

      {/* Modal - Modern SaaS Dialog */}
      {showModal && selectedCell && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xl max-w-md w-full overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Room {selectedCell.roomNumber} Availability
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedCell.date?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setShowModal(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {showModal === 'booking' ? (
                loadingBooking ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2">
                    <RefreshCw size={20} className="text-gray-400 animate-spin" />
                    <span className="text-xs text-gray-500">Loading details...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                        <User size={14} className="text-gray-500" />
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase block font-medium">Guest Profile</span>
                          <span className="text-sm font-medium text-gray-800">{activeBookingDetails?.guest_name}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="text-[10px] text-gray-400 block font-medium">Phone</span>
                          <span className="font-mono">{activeBookingDetails?.guest_phone || '—'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 block font-medium">Total Paid</span>
                          <span className="font-semibold text-gray-900">₹{Number(activeBookingDetails?.total_amount || 0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600">Start Date</label>
                      <input
                        type="date"
                        value={rangeStart}
                        onChange={(e) => setRangeStart(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-xs font-mono text-gray-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-600">End Date</label>
                      <input
                        type="date"
                        value={rangeEnd}
                        min={rangeStart}
                        onChange={(e) => setRangeEnd(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2 text-xs font-mono text-gray-800 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChangeRange(selectedCell.roomId, rangeStart, rangeEnd, 'Available')}
                      className="p-2.5 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-medium text-left transition-colors flex items-center justify-between"
                    >
                      <span>Mark Available</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </button>
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChangeRange(selectedCell.roomId, rangeStart, rangeEnd, 'Booked')}
                      className="p-2.5 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-medium text-left transition-colors flex items-center justify-between"
                    >
                      <span>Mark Booked / Occupied</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    </button>
                    <button
                      disabled={isUpdatingStatus}
                      onClick={() => handleStatusChangeRange(selectedCell.roomId, rangeStart, rangeEnd, 'Maintenance')}
                      className="p-2.5 rounded-md border border-gray-300 hover:bg-gray-50 text-gray-800 text-xs font-medium text-left transition-colors flex items-center justify-between"
                    >
                      <span>Mark Maintenance</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowModal(null)}
                className="text-xs font-medium border-gray-300 text-gray-700 hover:bg-white rounded-md px-4 py-1.5 h-auto"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Daily Room Status & Occupancy Report Modal */}
      {showReportModal && (() => {
        const roomStatusList = rooms.map((room) => {
          const record = availability.find(
            (a) => Number(a.room_id) === Number(room.id) && a.date === reportDate
          );
          const rawStatus = record ? record.status.toLowerCase() : 'available';
          let statusLabel = 'Available / Clean';
          let statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
          if (rawStatus === 'booked' || rawStatus === 'occupied') {
            statusLabel = 'Occupied';
            statusColor = 'text-blue-700 bg-blue-50 border-blue-200';
          } else if (rawStatus === 'maintenance' || rawStatus === 'blocked') {
            statusLabel = 'Maintenance';
            statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
          }

          const note = record?.note || '';
          const bookingId = note.startsWith('booking:') ? note.replace('booking:', '') : '';

          return {
            roomId: room.id,
            roomNumber: room.room_number || `R-${room.id}`,
            roomTitle: room.title || room.room_name || 'Room',
            category: room.category_name || 'Standard Room',
            floor: room.floor_number ? `Floor ${room.floor_number}` : 'Ground Floor',
            price: room.base_price ? `₹${parseFloat(room.base_price).toLocaleString('en-IN')}` : '₹2,500',
            status: statusLabel,
            statusColor,
            bookingRef: bookingId || '—',
            notes: note || 'Clean & Inspected'
          };
        });

        const totalRoomCount = roomStatusList.length;
        const occupiedCount = roomStatusList.filter((r) => r.status === 'Occupied').length;
        const availableCount = roomStatusList.filter((r) => r.status.includes('Available')).length;
        const maintenanceCount = roomStatusList.filter((r) => r.status === 'Maintenance').length;
        const occupancyPercent = totalRoomCount > 0 ? Math.round((occupiedCount / totalRoomCount) * 100) : 0;

        const handleDownloadRoomCalendarPdf = () => {
          generateHotelReportPdf({
            title: 'DAILY ROOM OCCUPANCY & STATUS AUDIT REPORT',
            period: `Date: ${reportDate}`,
            summaryCards: [
              { label: 'Total Rooms', value: `${totalRoomCount} Units` },
              { label: 'Occupied', value: `${occupiedCount} Rooms` },
              { label: 'Available', value: `${availableCount} Rooms` },
              { label: 'Occupancy Rate', value: `${occupancyPercent}%` }
            ],
            columns: [
              { header: '#', dataKey: '_index', alignment: 'center', width: 10 },
              { header: 'Room No', dataKey: 'roomNumber', alignment: 'center', width: 24 },
              { header: 'Room Category', dataKey: 'category', alignment: 'left', width: 45 },
              { header: 'Floor / Wing', dataKey: 'floor', alignment: 'left', width: 28 },
              { header: 'Current Status', dataKey: 'status', alignment: 'center', width: 32 },
              { header: 'Booking Ref', dataKey: 'bookingRef', alignment: 'center', width: 32 },
              { header: 'Rate / Night', dataKey: 'price', alignment: 'right', width: 26 }
            ],
            data: roomStatusList,
            filename: `Subra_Daily_Room_Report_${reportDate}.pdf`
          });
        };

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between no-print">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Room Status &amp; Occupancy Report</h3>
                    <p className="text-xs text-gray-500">Official daily property inventory and room allocation statement</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-2.5 py-1 text-xs">
                    <span className="text-gray-500 font-medium">Date:</span>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      className="border-none focus:outline-none text-gray-800 font-semibold"
                    />
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Printer size={14} className="text-blue-600" />
                    <span>Print</span>
                  </button>

                  <button
                    onClick={handleDownloadRoomCalendarPdf}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => setShowReportModal(false)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Printable Body Content */}
              <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-white printable-document" id="printable-calendar-report">
                {/* Paper Header (visible on print & screen) */}
                <div className="pb-4 border-b-2 border-emerald-900/30 flex justify-between items-start">
                  <div>
                    <h1 className="font-serif text-xl font-black text-[#0a3622]">SUBRA RESIDENCY</h1>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">RAGUPATHI ANANDHALAKSHMI &bull; PROPRIETORSHIP</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">NO.45-1/1187B2, Lal Bahadur Sastry Road, Kumbakonam &bull; GSTIN: 33AQQPA7394F2ZN</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#0a3622] uppercase">DAILY ROOM OCCUPANCY REPORT</div>
                    <div className="text-xs font-semibold text-emerald-800 mt-0.5">Date: {reportDate}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-1">Generated: {new Date().toLocaleTimeString()}</div>
                  </div>
                </div>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase text-gray-500">Total Rooms</span>
                    <p className="text-lg font-bold text-gray-900 mt-0.5 font-mono">{totalRoomCount}</p>
                  </div>
                  <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase text-blue-700">Occupied Rooms</span>
                    <p className="text-lg font-bold text-blue-900 mt-0.5 font-mono">{occupiedCount}</p>
                  </div>
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase text-emerald-700">Available Clean</span>
                    <p className="text-lg font-bold text-emerald-900 mt-0.5 font-mono">{availableCount}</p>
                  </div>
                  <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3">
                    <span className="text-[10px] font-bold uppercase text-amber-700">Occupancy Rate</span>
                    <p className="text-lg font-bold text-amber-900 mt-0.5 font-mono">{occupancyPercent}%</p>
                  </div>
                </div>

                {/* Room Status Table */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider border-b border-gray-200">
                        <th className="px-3 py-2.5 text-center w-10">#</th>
                        <th className="px-3 py-2.5 text-center w-24">Room No</th>
                        <th className="px-3 py-2.5">Category</th>
                        <th className="px-3 py-2.5 w-28">Floor</th>
                        <th className="px-3 py-2.5 text-center w-32">Status</th>
                        <th className="px-3 py-2.5 text-center w-36">Booking Ref</th>
                        <th className="px-3 py-2.5 text-right w-28">Nightly Tariff</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {roomStatusList.map((rm, idx) => (
                        <tr key={rm.roomId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="px-3 py-2 text-center text-gray-400 font-mono text-[11px]">{idx + 1}</td>
                          <td className="px-3 py-2 text-center font-mono font-bold text-gray-900">{rm.roomNumber}</td>
                          <td className="px-3 py-2 text-gray-800 font-medium">{rm.category}</td>
                          <td className="px-3 py-2 text-gray-600 text-[11px]">{rm.floor}</td>
                          <td className="px-3 py-2 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${rm.statusColor}`}>
                              {rm.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-center font-mono text-gray-700 text-[11px]">{rm.bookingRef}</td>
                          <td className="px-3 py-2 text-right font-mono text-gray-800 font-semibold">{rm.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Signature Block */}
                <div className="pt-6 border-t border-gray-200 grid grid-cols-2 gap-6 text-center text-xs">
                  <div>
                    <div className="h-8 border-b border-gray-300 mx-auto w-1/2 mb-1"></div>
                    <p className="font-bold text-gray-800 text-[11px]">Housekeeping Supervisor</p>
                    <p className="text-[10px] text-gray-400">Cleanliness &amp; Inspection Sign-off</p>
                  </div>
                  <div>
                    <div className="h-8 border-b border-gray-300 mx-auto w-1/2 mb-1"></div>
                    <p className="font-bold text-gray-800 text-[11px]">Front Desk Duty Manager</p>
                    <p className="text-[10px] text-gray-400">Night Audit &amp; Room Allocations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
