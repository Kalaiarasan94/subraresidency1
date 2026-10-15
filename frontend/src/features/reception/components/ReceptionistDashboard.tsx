import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { 
  Users, LogIn, LogOut, 
  Hotel, Search, 
  Smartphone, PlusCircle, 
  X, Filter, ChevronDown
} from 'lucide-react';
import { ResponsiveContainer, PieChart as RePie, Pie, Cell, Tooltip } from 'recharts';
import { API_BASE_URL } from '../../../lib/api';

const StatCard = ({ label, value, icon: Icon, trend, onClick }: any) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-4.5 rounded-lg border border-gray-200 shadow-xs flex flex-col justify-between hover:border-gray-300 hover:shadow-sm transition-all ${onClick ? 'cursor-pointer select-none active:bg-gray-50' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="w-9 h-9 rounded-md border border-gray-100 bg-gray-50 text-gray-600 flex items-center justify-center">
          <Icon size={17} />
        </div>
        {trend && (
          <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
        <p className="text-xl font-semibold text-gray-900 font-mono tabular-nums">{value}</p>
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, description, onClick }: any) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-3.5 p-4 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50/70 transition-all w-full text-left shadow-xs cursor-pointer"
    >
      <div className="w-9 h-9 rounded-md border border-gray-200 bg-gray-50 text-gray-700 flex items-center justify-center shrink-0">
        <Icon size={17} />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-900">{label}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
      </div>
    </button>
  );
};

export const ReceptionistDashboard = ({ onNavigate }: { onNavigate?: (tab: string) => void }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeparturesModal, setShowDeparturesModal] = useState(false);
  const [showArrivalsModal, setShowArrivalsModal] = useState(false);
  const [showCheckinsModal, setShowCheckinsModal] = useState(false);
  const [showAvailableRoomsModal, setShowAvailableRoomsModal] = useState(false);
  const [showOccupiedRoomsModal, setShowOccupiedRoomsModal] = useState(false);

  // View All Bookings state
  const [showAllBookings, setShowAllBookings] = useState(false);
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [allBookingsLoading, setAllBookingsLoading] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterRoom, setFilterRoom] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resp = await fetch(`${API_BASE_URL}/dashboard/receptionist`);
        const json = await resp.json();
        if (json.status === 'success') {
          setData(json.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const fetchAllBookings = useCallback(async () => {
    setAllBookingsLoading(true);
    try {
      const params = new URLSearchParams({ all: '1', limit: '200' });
      if (filterDate) params.set('date', filterDate);
      if (filterRoom) params.set('room', filterRoom);
      if (filterStatus) params.set('status', filterStatus);
      const resp = await fetch(`${API_BASE_URL}/admin/bookings/list?${params}`);
      const json = await resp.json();
      if (json.status === 'success') setAllBookings(json.bookings || []);
    } catch (err) {
      console.error('Failed to fetch all bookings', err);
    } finally {
      setAllBookingsLoading(false);
    }
  }, [filterDate, filterRoom, filterStatus]);

  useEffect(() => {
    if (showAllBookings) fetchAllBookings();
  }, [showAllBookings, fetchAllBookings]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
       <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const stats = data?.stats || { arrivals: 0, departures: 0, checked_in: 0, available: 0, occupied: 0 };
  const roomData = data?.room_distribution || [];
  const recentBookings = data?.recent_bookings || [];
  const departuresList = data?.departures_list || [];
  const arrivalsList = data?.arrivals_list || [];
  const checkedInList = data?.checked_in_list || [];
  const availableRoomsList = data?.available_rooms_list || [];
  const occupiedRoomsList = data?.occupied_rooms_list || [];

  const getHospitalityColor = (name: string) => {
    switch (name.toLowerCase()) {
      case 'available': return '#10b981';
      case 'occupied': return '#2563eb';
      case 'cleaning': return '#f59e0b';
      case 'maintenance': return '#64748b';
      default: return '#94a3b8';
    }
  };

  const chartData = roomData.map((item: any) => ({
    ...item,
    color: getHospitalityColor(item.name)
  }));

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Today's Arrivals" value={stats.arrivals} icon={LogIn} trend={stats.today_created_bookings > 0 ? `+${stats.today_created_bookings} New` : undefined} onClick={() => setShowArrivalsModal(true)} />
        <StatCard label="Today's Departures" value={stats.departures} icon={LogOut} onClick={() => setShowDeparturesModal(true)} />
        <StatCard label="Current Check-ins" value={stats.checked_in} icon={Users} onClick={() => setShowCheckinsModal(true)} />
        <StatCard label="Available Rooms" value={stats.available} icon={Hotel} onClick={() => setShowAvailableRoomsModal(true)} />
        <StatCard label="Occupied Rooms" value={stats.occupied} icon={Hotel} onClick={() => setShowOccupiedRoomsModal(true)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings List */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-xs rounded-lg bg-white">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div>
             <h3 className="text-sm font-medium text-gray-800">Recent online bookings</h3>
             <p className="text-xs text-gray-400 mt-0.5">Status of upcoming &amp; pending check-ins</p>
           </div>
           <button 
             onClick={() => setShowAllBookings(true)}
             className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-md shadow-xs transition-colors"
           >
             View all →
           </button>
          </div>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/80 text-[11px] font-semibold text-gray-500 border-b border-gray-200">
                    <th className="px-4 py-2.5">Booking ID</th>
                    <th className="px-4 py-2.5">Guest</th>
                    <th className="px-4 py-2.5">Check-in</th>
                    <th className="px-4 py-2.5">Room No.</th>
                    <th className="px-4 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBookings.map((bk: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium text-blue-600">{bk.booking_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{bk.guest_name}</td>
                      <td className="px-4 py-3 text-gray-500 font-mono text-[11px]">{bk.check_in_date}</td>
                      <td className="px-4 py-3 font-mono text-gray-700">
                        {bk.status === 'confirmed' ? 'Pending' : (bk.room_id || 'N/A')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                          bk.status === 'checked-in' ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]' :
                          bk.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 border-gray-200 text-gray-700'
                        }`}>
                          {bk.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentBookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-gray-400 text-xs font-medium">No recent online bookings found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Room Status Overview Pie Chart */}
        <Card className="border border-gray-200 shadow-xs rounded-lg bg-white flex flex-col">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-800">Room status distribution</h3>
            <p className="text-xs text-gray-400 mt-0.5">Live inventory allocation</p>
          </div>
          <CardContent className="flex-grow flex flex-col p-4">
            <div className="h-[210px] w-full relative min-w-0">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={210}>
                  <RePie>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#ffffff', 
                        borderRadius: '0.375rem', 
                        border: '1px solid #e2e8f0', 
                        color: '#1e293b', 
                        fontSize: '12px'
                      }} 
                    />
                  </RePie>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-xs">Loading chart…</div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-semibold text-gray-900 font-mono">{stats.total_rooms}</span>
                <span className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">Total Rooms</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-3 border-t border-gray-100 pt-3">
              {chartData.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <div className="flex flex-col">
                     <span className="text-xs text-gray-700 font-medium">{item.name}</span>
                     <span className="text-[10px] font-mono text-gray-400">{item.value} Units</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <QuickAction icon={Smartphone} label="Scan QR Check-in" description="Verify guest arrivals via QR code" onClick={() => onNavigate?.('online_checkin')} />
         <QuickAction icon={Search} label="Lookup Reservation" description="Search by ID or Mobile" onClick={() => onNavigate?.('online_checkin')} />
         <QuickAction icon={PlusCircle} label="New Registration" description="Register walk-in guest folio" onClick={() => onNavigate?.('offline_booking')} />
         <QuickAction icon={Users} label="Guest Directory" description="Access guest profiles &amp; stay logs" onClick={() => onNavigate?.('guests')} />
      </div>

      {/* Today's Departures Modal */}
      {showDeparturesModal && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-none border border-black shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">Today's Departures</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5 tracking-wider">Scheduled check-outs for today</p>
              </div>
              <button 
                onClick={() => setShowDeparturesModal(false)}
                className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors rounded-none border border-neutral-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-2">
              {departuresList.length > 0 ? (
                <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
                  {departuresList.map((dep: any, index: number) => (
                    <div key={index} className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 text-black border border-neutral-200 rounded-none">
                          <LogOut size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black uppercase tracking-wide">{dep.guest_name}</p>
                          <p className="text-[9px] text-neutral-500 font-mono uppercase mt-0.5">Booking ID: {dep.booking_id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-black uppercase">
                          Room {dep.room_number || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-neutral-400 text-xs font-bold uppercase tracking-wider">
                  No departures scheduled for today.
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <Button 
                onClick={() => setShowDeparturesModal(false)}
                className="bg-black hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-wider text-white px-5 py-2 rounded-none transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Today's Arrivals Modal */}
      {showArrivalsModal && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-none border border-black shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">Today's Arrivals</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5 tracking-wider">Scheduled check-ins for today</p>
              </div>
              <button 
                onClick={() => setShowArrivalsModal(false)}
                className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors rounded-none border border-neutral-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-2">
              {arrivalsList.length > 0 ? (
                <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
                  {arrivalsList.map((arr: any, index: number) => (
                    <div key={index} className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 text-black border border-neutral-200 rounded-none">
                          <LogIn size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black uppercase tracking-wide">{arr.guest_name}</p>
                          <p className="text-[9px] text-neutral-500 font-mono uppercase mt-0.5">
                            ID: {arr.booking_id}{arr.category_name ? ` · ${arr.category_name}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-black uppercase">
                          Room {arr.room_number || 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-neutral-400 text-xs font-bold uppercase tracking-wider">
                  No arrivals scheduled for today.
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <Button 
                onClick={() => setShowArrivalsModal(false)}
                className="bg-black hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-wider text-white px-5 py-2 rounded-none transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Current Check-ins Modal */}
      {showCheckinsModal && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-none border border-black shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">In-House Guests</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5 tracking-wider">Currently checked-in occupants</p>
              </div>
              <button 
                onClick={() => setShowCheckinsModal(false)}
                className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors rounded-none border border-neutral-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-2">
              {checkedInList.length > 0 ? (
                <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
                  {checkedInList.map((ci: any, index: number) => (
                    <div key={index} className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 text-black border border-neutral-200 rounded-none">
                          <Users size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black uppercase tracking-wide">{ci.guest_name}</p>
                          <p className="text-[9px] text-neutral-500 font-mono uppercase mt-0.5">
                            Booking ID: {ci.booking_id}
                          </p>
                          <p className="text-[9px] text-neutral-500 font-mono mt-0.5">
                            Stay: {ci.check_in_date} → {ci.check_out_date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-black uppercase">
                          Room {ci.room_number || 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-neutral-400 text-xs font-bold uppercase tracking-wider">
                  No checked-in guests currently.
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <Button 
                onClick={() => setShowCheckinsModal(false)}
                className="bg-black hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-wider text-white px-5 py-2 rounded-none transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Available Rooms Modal */}
      {showAvailableRoomsModal && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-none border border-black shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">Available Rooms</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5 tracking-wider">Vacant inventory available for walk-ins</p>
              </div>
              <button 
                onClick={() => setShowAvailableRoomsModal(false)}
                className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors rounded-none border border-neutral-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-2">
              {availableRoomsList.length > 0 ? (
                <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
                  {availableRoomsList.map((av: any, index: number) => (
                    <div key={index} className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 text-black border border-neutral-200 rounded-none">
                          <Hotel size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black uppercase tracking-wide">{av.room_name}</p>
                          <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5 tracking-wider">{av.category_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-black uppercase">
                          Room {av.room_number}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-neutral-400 text-xs font-bold uppercase tracking-wider">
                  No rooms are currently vacant.
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <Button 
                onClick={() => setShowAvailableRoomsModal(false)}
                className="bg-black hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-wider text-white px-5 py-2 rounded-none transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Occupied Rooms Modal */}
      {showOccupiedRoomsModal && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-none border border-black shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div>
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">Occupied Rooms</h3>
                <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5 tracking-wider">Rooms currently occupied by guests</p>
              </div>
              <button 
                onClick={() => setShowOccupiedRoomsModal(false)}
                className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors rounded-none border border-neutral-300"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-2">
              {occupiedRoomsList.length > 0 ? (
                <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white">
                  {occupiedRoomsList.map((oc: any, index: number) => (
                    <div key={index} className="p-3.5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 text-black border border-neutral-200 rounded-none">
                          <Hotel size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-black uppercase tracking-wide">{oc.room_name}</p>
                          <p className="text-[9px] text-neutral-500 font-bold uppercase mt-0.5 tracking-wider">
                            {oc.category_name || 'Standard'} · Guest: {oc.guest_name || 'In-House Guest'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-black uppercase">
                          Room {oc.room_number}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-neutral-400 text-xs font-bold uppercase tracking-wider">
                  No rooms are currently occupied.
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end">
              <Button 
                onClick={() => setShowOccupiedRoomsModal(false)}
                className="bg-black hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-wider text-white px-5 py-2 rounded-none transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ====== VIEW ALL BOOKINGS MODAL ====== */}
      {showAllBookings && (
        <div className="fixed inset-0 bg-black/60 z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-none border border-black shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-200 bg-neutral-50 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-xs font-bold text-black uppercase tracking-widest">All Reservations</h3>
                <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{allBookings.length} records found</p>
              </div>
              <button 
                onClick={() => setShowAllBookings(false)}
                className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors rounded-none border border-neutral-300"
              >
                <X size={16} />
              </button>
            </div>

            {/* Filters Bar */}
            <div className="p-4 border-b border-neutral-200 bg-white flex flex-wrap items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2 bg-neutral-100 border border-neutral-200 rounded-none px-3 py-1.5">
                <Filter size={12} className="text-neutral-500" />
                <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-wider">Filter:</span>
              </div>

              {/* Date Filter */}
              <div className="relative flex items-center bg-white border border-neutral-300 rounded-none">
                <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-wider pl-3 pr-1 whitespace-nowrap">Check-in</span>
                <input 
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  className="text-xs font-mono font-bold text-black bg-transparent px-2 py-1.5 focus:outline-none min-w-[130px]"
                />
                {filterDate && (
                  <button onClick={() => setFilterDate('')} className="pr-2 text-neutral-400 hover:text-black">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Room Filter */}
              <div className="flex items-center bg-white border border-neutral-300 rounded-none">
                <Search size={12} className="ml-3 text-neutral-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Room name or number…"
                  value={filterRoom}
                  onChange={e => setFilterRoom(e.target.value)}
                  className="text-xs font-bold text-black bg-transparent px-3 py-1.5 focus:outline-none w-44 placeholder:text-neutral-400"
                />
                {filterRoom && (
                  <button onClick={() => setFilterRoom('')} className="pr-2 text-neutral-400 hover:text-black">
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative flex items-center bg-white border border-neutral-300 rounded-none">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="text-xs font-bold text-black bg-transparent pl-3 pr-8 py-1.5 focus:outline-none appearance-none min-w-[120px]"
                >
                  <option value="">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked-in">Checked In</option>
                  <option value="checked-out">Checked Out</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown size={12} className="absolute right-2.5 text-neutral-500 pointer-events-none" />
              </div>

              <button
                onClick={fetchAllBookings}
                disabled={allBookingsLoading}
                className="bg-black hover:bg-neutral-800 text-white text-[9px] font-bold uppercase tracking-wider px-4 py-2 rounded-none transition-colors disabled:opacity-50"
              >
                {allBookingsLoading ? 'Searching…' : 'Search'}
              </button>

              {(filterDate || filterRoom || filterStatus) && (
                <button
                  onClick={() => { setFilterDate(''); setFilterRoom(''); setFilterStatus(''); }}
                  className="text-[9px] font-bold text-neutral-500 hover:text-black uppercase tracking-wider transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Bookings Table */}
            <div className="flex-1 overflow-auto">
              {allBookingsLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-none animate-spin" />
                </div>
              ) : (
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="sticky top-0 bg-neutral-100 border-b border-neutral-200">
                    <tr className="text-[9px] font-bold text-neutral-600 uppercase tracking-wider">
                      <th className="px-5 py-3">Booking ID</th>
                      <th className="px-5 py-3">Guest</th>
                      <th className="px-5 py-3">Check-in</th>
                      <th className="px-5 py-3">Check-out</th>
                      <th className="px-5 py-3">Room No.</th>
                      <th className="px-5 py-3">Amount</th>
                      <th className="px-5 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {allBookings.map((bk: any, i: number) => (
                      <tr key={i} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-5 py-3 text-[11px] font-mono font-bold text-black">{bk.booking_id}</td>
                        <td className="px-5 py-3">
                          <p className="text-xs font-bold text-black uppercase">{bk.guest_name}</p>
                          <p className="text-[9px] text-neutral-500 font-mono mt-0.5">{bk.guest_phone || bk.guest_email || '—'}</p>
                        </td>
                        <td className="px-5 py-3 text-xs font-mono text-neutral-600">{bk.check_in_date}</td>
                        <td className="px-5 py-3 text-xs font-mono text-neutral-600">{bk.check_out_date}</td>
                        <td className="px-5 py-3 text-xs font-mono font-bold text-neutral-800">
                          {bk.status === 'confirmed' ? 'Pending' : (bk.rooms?.map((r: any) => r.room_number).join(', ') || bk.room_number || 'N/A')}
                        </td>
                        <td className="px-5 py-3 text-xs font-mono font-bold text-black">₹{Number(bk.total_amount || 0).toLocaleString('en-IN')}</td>
                        <td className="px-5 py-3 text-right">
                          <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded-none border uppercase tracking-wider ${
                            bk.status === 'checked-in'  ? 'bg-black text-white border-black' :
                            bk.status === 'confirmed'   ? 'bg-neutral-800 text-white border-neutral-800' :
                            bk.status === 'checked-out' ? 'bg-neutral-100 border-neutral-300 text-neutral-700' :
                            bk.status === 'cancelled'   ? 'bg-neutral-100 border-neutral-200 text-neutral-400 line-through' :
                                                          'bg-white border-neutral-300 text-neutral-600'
                          }`}>{bk.status}</span>
                        </td>
                      </tr>
                    ))}
                    {allBookings.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-5 py-16 text-center text-neutral-400 text-xs font-bold uppercase tracking-wider">
                          No bookings found matching the filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center flex-shrink-0">
              <span className="text-[9px] font-mono text-neutral-500 uppercase">{allBookings.length} records shown</span>
              <Button
                onClick={() => setShowAllBookings(false)}
                className="bg-black hover:bg-neutral-800 text-[10px] uppercase font-bold tracking-wider text-white px-5 py-2 rounded-none transition-colors"
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

