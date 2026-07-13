// react hooks imported below (useState, useEffect)
import {
  ShieldCheck, ArrowLeft, Star, MapPin,
  Info, CheckCircle2, User, Bed, Ruler, Calendar, AlertTriangle
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useState, useEffect } from 'react';
import { fetchRoomAvailability, API_BASE_URL } from '../../../lib/api';

interface Props {
  room: any;
  onBack: () => void;
  onBook: (dates: { checkIn: string; checkOut: string; room_id?: number; room_number?: string }) => void;
  searchFilters?: any;
}

const toISODate = (d: Date) => d.toISOString().slice(0, 10);

// Helper: prevent double-₹ and format consistently
const formatPrice = (val: any): string => {
  if (!val) return '₹3,500';
  const s = String(val);
  return s.includes('₹') ? s : `₹${Number(s).toLocaleString('en-IN')}`;
};

export const RoomDetailPage: React.FC<Props> = ({ room, onBack, onBook, searchFilters }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [availability, setAvailability] = useState<any>({});
  const [subRooms, setSubRooms] = useState<any[]>([]);
  const [selectedSubRoomId, setSelectedSubRoomId] = useState<number | null>(null);
  const [loadingSubRooms, setLoadingSubRooms] = useState(true);

  const today = toISODate(new Date());
  const tomorrow = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toISODate(d);
  })();

  // Dates are editable right here, whether or not the guest already searched from the top bar —
  // seeded from searchFilters when available, otherwise today/tomorrow.
  const [localCheckIn, setLocalCheckIn] = useState(searchFilters?.checkIn || today);
  const [localCheckOut, setLocalCheckOut] = useState(searchFilters?.checkOut || tomorrow);

  const minCheckOut = (() => {
    const d = new Date(localCheckIn || today);
    d.setDate(d.getDate() + 1);
    return toISODate(d);
  })();

  const handleCheckInChange = (value: string) => {
    setLocalCheckIn(value);
    if (localCheckOut && localCheckOut <= value) {
      const d = new Date(value);
      d.setDate(d.getDate() + 1);
      setLocalCheckOut(toISODate(d));
    }
  };

  const handleDayClick = (dateStr: string) => {
    const clickedDate = new Date(dateStr);
    const todayDate = new Date(today);
    if (clickedDate < todayDate) {
      alert("Cannot select a past date.");
      return;
    }

    // Simple range selector logic
    if (localCheckIn && (!localCheckOut || dateStr > localCheckIn)) {
      // If check-out is already set, or we click a date after check-in, set it as check-out.
      // But if we clicked check-in again, or clicked to reset the check-in
      if (dateStr === localCheckIn) {
        return;
      }
      setLocalCheckOut(dateStr);
    } else {
      setLocalCheckIn(dateStr);
      const d = new Date(dateStr);
      d.setDate(d.getDate() + 1);
      setLocalCheckOut(toISODate(d));
    }
  };

  // Calendar window starts from the guest's selected check-in date (falls back to today)
  const calendarStart = (() => {
    const d = localCheckIn ? new Date(localCheckIn) : new Date();
    return isNaN(d.getTime()) ? new Date() : d;
  })();

  // Nights = difference between selected check-in/check-out (minimum 1)
  const nights = (() => {
    if (!localCheckIn || !localCheckOut) return 1;
    const inD = new Date(localCheckIn);
    const outD = new Date(localCheckOut);
    const diff = Math.round((outD.getTime() - inD.getTime()) / 86400000);
    return diff > 0 ? diff : 1;
  })();

  // Fetch window covers at least 14 days, or the full stay if longer, so validation below is accurate
  const calendarDays = Math.max(14, nights + 1);

  // Fetch sub-rooms for the category
  useEffect(() => {
    const fetchSubRooms = async () => {
      if (!room || !room.id) return;
      setLoadingSubRooms(true);
      try {
        const response = await fetch(`${API_BASE_URL}/rooms/subRooms?category_id=${room.id}`);
        const json = await response.json();
        if (json.status === 'success' && Array.isArray(json.rooms)) {
          setSubRooms(json.rooms);
          if (json.rooms.length > 0) {
            setSelectedSubRoomId(json.rooms[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch sub-rooms', err);
      } finally {
        setLoadingSubRooms(false);
      }
    };
    fetchSubRooms();
  }, [room.id]);

  useEffect(() => {
    const load = async () => {
      const targetId = selectedSubRoomId || room.id;
      if (!targetId) return;
      const start = new Date(calendarStart);
      const end = new Date(calendarStart);
      end.setDate(end.getDate() + calendarDays - 1);
      const startStr = toISODate(start);
      const endStr = toISODate(end);
      const data = await fetchRoomAvailability(targetId, startStr, endStr);
      const map: any = {};
      if (Array.isArray(data)) {
        data.forEach((d: any) => { map[d.date] = d.status; });
      }
      setAvailability(map);
    };
    load();
  }, [room, selectedSubRoomId, localCheckIn, calendarDays]);

  // Block reservation if any night of the selected stay is already Booked/Maintenance
  const blockedDates: string[] = (() => {
    if (!localCheckIn || !localCheckOut) return [];
    const blocked: string[] = [];
    const d = new Date(localCheckIn);
    const end = new Date(localCheckOut);
    while (d < end) {
      const key = toISODate(d);
      const status = availability[key];
      if (status === 'Booked' || status === 'Maintenance') blocked.push(key);
      d.setDate(d.getDate() + 1);
    }
    return blocked;
  })();
  const isStayBlocked = blockedDates.length > 0;

  // --- Dynamic data mapping from Admin DB ---
  const title = room.title || room.room_name || 'Luxury Sanctuary';
  const price = formatPrice(room.price || room.base_price);
  // parseFloat (not a digit-stripping regex) so "2700.00" reads as 2700, not 270000
  const numericRate = Math.round(parseFloat(String(room.base_price || room.price_24h || room.price || '3500')) || 3500);

  const roomFeeTotal = numericRate * nights;
  const cleaningFee = 500;
  const serviceFee = 850;
  const grandTotal = roomFeeTotal + cleaningFee + serviceFee;

  const handleReserve = () => {
    if (isStayBlocked) return;
    const selectedRoomNumber = subRooms.find(r => Number(r.id) === Number(selectedSubRoomId))?.room_number || '';
    onBook({ 
      checkIn: localCheckIn, 
      checkOut: localCheckOut,
      room_id: selectedSubRoomId || undefined,
      room_number: selectedRoomNumber || undefined
    });
  };

  // Images
  const mainImage = room.featured_image || room.image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80';
  const rawGallery = room.images || (room.galleries ? room.galleries : []);
  const galleryImages = rawGallery.length > 0 ? rawGallery : [mainImage];

  // Specs
  const adults = room.adults || room.max_adults || 2;
  const kids = room.children || room.max_children || 0;
  const bedType = room.bed_type || room.details?.bed || 'King Size Premium';
  const size = room.size || room.room_size || '450';
  const floor = room.floor || room.floor_number || '3';

  // Amenities
  let amenities: any[] = [];
  try {
    amenities = Array.isArray(room.amenities)
      ? room.amenities
      : typeof room.amenities === 'string'
        ? JSON.parse(room.amenities)
        : [];
  } catch { amenities = []; }

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Sticky top bar (own nav since header/footer are hidden) */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-catalogue-green hover:text-catalogue-gold transition-all group font-bold uppercase tracking-widest text-[11px]"
          >
            <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-catalogue-green group-hover:text-white transition-colors">
              <ArrowLeft size={16} />
            </div>
            Back
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right mr-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selected Room</p>
              <p className="text-sm font-bold text-catalogue-green uppercase">{title}</p>
            </div>
            <Button
              onClick={handleReserve}
              disabled={isStayBlocked}
              className="bg-catalogue-green text-white hover:bg-catalogue-gold font-bold uppercase tracking-widest text-[11px] px-8 py-6 rounded-xl shadow-lg disabled:opacity-40 disabled:hover:bg-catalogue-green"
            >
              Reserve Now
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Title */}
        <div className="mb-10 space-y-4">
          <div className="flex items-center gap-3">
            <Badge className="bg-catalogue-gold text-white border-none px-3 py-1 text-[9px] font-bold uppercase tracking-widest">Official</Badge>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
              <Star size={12} className="text-catalogue-gold fill-catalogue-gold" />
              <span className="text-slate-900 font-bold">4.9 Rare Find</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-playfair font-black text-catalogue-green uppercase tracking-tighter leading-none">{title}</h1>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span className="flex items-center gap-2"><MapPin size={14} className="text-catalogue-gold" /> Kumbakonam, Tamil Nadu</span>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16 h-[550px] min-h-0">
          <div className="md:col-span-2 h-full min-h-0 rounded-2xl overflow-hidden group border border-slate-100 shadow-sm relative">
            <img src={galleryImages[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Main" />
            <div className="absolute inset-0 bg-black/5" />
          </div>
          <div className="grid grid-rows-2 h-full min-h-0 gap-4">
            <div className="min-h-0 rounded-2xl overflow-hidden group border border-slate-100 shadow-sm">
              <img src={galleryImages[1] || galleryImages[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Detail 1" />
            </div>
            <div className="min-h-0 rounded-2xl overflow-hidden group border border-slate-100 shadow-sm">
              <img src={galleryImages[2] || galleryImages[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Detail 2" />
            </div>
          </div>
          <div className="grid grid-rows-2 h-full min-h-0 gap-4">
            <div className="min-h-0 rounded-2xl overflow-hidden group border border-slate-100 shadow-sm">
              <img src={galleryImages[3] || galleryImages[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Detail 3" />
            </div>
            <div className="min-h-0 rounded-2xl overflow-hidden group border border-slate-100 shadow-sm relative">
              <img src={galleryImages[4] || galleryImages[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Detail 4" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-bold text-xs uppercase tracking-widest">Show All</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left – details */}
          <div className="lg:col-span-2 space-y-16">
            {/* Quick specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-slate-100">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-catalogue-gold"><User size={20} /></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacity</p>
                <p className="text-sm font-bold text-catalogue-green font-sans tabular-nums">{adults} Guests + {kids} Kids</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-catalogue-gold"><Bed size={20} /></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bedding</p>
                <p className="text-sm font-bold text-catalogue-green truncate">{bedType}</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-catalogue-gold"><Ruler size={20} /></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room Size</p>
                <p className="text-sm font-bold text-catalogue-green font-sans tabular-nums">{size} SQFT</p>
              </div>
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-catalogue-gold"><MapPin size={20} /></div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Floor</p>
                <p className="text-sm font-bold text-catalogue-green font-sans tabular-nums">{floor} Floor</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-black font-playfair text-catalogue-green uppercase">About This Room</h2>
                <div className="flex-grow h-[1px] bg-slate-100" />
              </div>
              <div className="prose prose-slate max-w-none">
                <p className="text-lg text-slate-600 leading-relaxed font-medium whitespace-pre-wrap first-letter:text-5xl first-letter:font-black first-letter:text-catalogue-gold first-letter:mr-3 first-letter:float-left">
                  {room.full_description || room.description || room.desc || 'Designed for the modern traveler while preserving the spiritual essence of Kumbakonam, our rooms offer a peaceful respite featuring hand-picked furniture and climate control.'}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-8">
              <h3 className="text-[10px] font-bold text-catalogue-gold uppercase tracking-[0.4em]">Amenities & Comforts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                {amenities.length > 0 ? amenities.map((amenity: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 py-4 border-b border-slate-50 group hover:border-catalogue-gold/30 transition-colors">
                    <CheckCircle2 size={18} className="text-catalogue-gold opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wider">{typeof amenity === 'string' ? amenity : amenity.name}</span>
                  </div>
                )) : (
                  <div className="col-span-full p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Standard Essentials Provided</p>
                  </div>
                )}
              </div>
            </div>

            {/* House Rules */}
            {room.house_rules && (
              <div className="bg-catalogue-green/[0.02] p-10 rounded-3xl border border-catalogue-green/5 space-y-6">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={24} className="text-catalogue-gold" />
                  <h3 className="text-lg font-bold text-catalogue-green uppercase tracking-widest">House Rules</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">{room.house_rules}</p>
                <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check-in After</p>
                    <p className="text-sm font-bold text-slate-800 font-sans tabular-nums">12:00 PM</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Check-out By</p>
                    <p className="text-sm font-bold text-slate-800 font-sans tabular-nums">11:00 AM</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right – booking pane */}
          <div className="relative">
            <div className="sticky top-32 space-y-6">
              <Card className="rounded-[2.5rem] shadow-2xl border-none overflow-hidden bg-white ring-1 ring-slate-100">
                <CardContent className="p-10 space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest mb-1">Nightly Rate</p>
                      <h4 className="text-3xl font-black text-catalogue-green font-sans tabular-nums">{price}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                      <p className="text-sm font-bold text-slate-800 font-sans">4.9 ★</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="grid grid-cols-2 gap-3 pb-4 mb-4 border-b border-slate-200">
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Check-In</p>
                        <div className="relative">
                          <Calendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-catalogue-gold pointer-events-none" />
                          <input
                            type="date"
                            value={localCheckIn}
                            min={today}
                            onChange={(e) => handleCheckInChange(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-7 pr-1 text-[11px] font-bold text-slate-800 font-sans focus:outline-none focus:ring-2 focus:ring-catalogue-gold/30"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Check-Out</p>
                        <div className="relative">
                          <Calendar size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-catalogue-gold pointer-events-none" />
                          <input
                            type="date"
                            value={localCheckOut}
                            min={minCheckOut}
                            onChange={(e) => setLocalCheckOut(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-7 pr-1 text-[11px] font-bold text-slate-800 font-sans focus:outline-none focus:ring-2 focus:ring-catalogue-gold/30"
                          />
                        </div>
                      </div>
                    </div>
                     <div className="space-y-1">
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Guests</p>
                      <p className="text-xs font-bold text-slate-800 font-sans tabular-nums">{adults} Guests + {kids} Kids</p>
                    </div>

                    <div className="mt-4">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">Availability (14 days from check-in)</p>

                      {/* 14-day grid: two rows of 7 */}
                      <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 14 }).map((_, i) => {
                          const d = new Date(calendarStart);
                          d.setDate(d.getDate() + i);
                          const key = d.toISOString().slice(0, 10);
                          const status = (availability && availability[key]) || 'Available';

                          const bgClass = status === 'Available'
                            ? 'bg-emerald-50 border-emerald-250/30'
                            : status === 'Maintenance'
                              ? 'bg-amber-50 border-amber-250/30'
                              : 'bg-rose-50 border-rose-250/30';

                          const textClass = status === 'Available'
                            ? 'text-emerald-700'
                            : status === 'Maintenance'
                              ? 'text-amber-700'
                              : 'text-rose-700';

                          const weekday = d.toLocaleString('en-IN', { weekday: 'short' });
                          const day = d.getDate();
                          const month = d.toLocaleString('en-IN', { month: 'short' });
                          const isSelected = key >= localCheckIn && key <= localCheckOut;
                          const isCheckIn = key === localCheckIn;
                          const isCheckOut = key === localCheckOut;

                          return (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleDayClick(key)}
                              title={`${weekday} ${day} ${month} — ${status}`}
                              className={`p-2 rounded-lg border ${bgClass} shadow-sm flex flex-col items-center justify-center text-center gap-1 transition-all duration-200 active:scale-95 ${
                                isSelected
                                  ? 'ring-2 ring-catalogue-gold bg-catalogue-gold/15 border-catalogue-gold'
                                  : 'hover:border-catalogue-gold/50'
                              }`}
                            >
                              <div className={`text-[10px] font-bold ${textClass}`}>{weekday}</div>
                              <div className={`text-base font-black ${textClass}`}>{day}</div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                  status === 'Available' ? 'bg-emerald-500' : status === 'Maintenance' ? 'bg-amber-500' : 'bg-rose-500'
                                }`} />
                                {isCheckIn && <span className="text-[8px] font-black text-catalogue-gold uppercase">In</span>}
                                {isCheckOut && <span className="text-[8px] font-black text-catalogue-gold uppercase">Out</span>}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-emerald-500" />
                          <span className="font-bold">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-amber-500" />
                          <span className="font-bold">Maintenance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded bg-rose-500" />
                          <span className="font-bold">Booked</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {isStayBlocked && (
                    <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-xl p-4">
                      <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-rose-700 leading-relaxed">
                        This room isn't available for every night of your selected stay. Please choose different dates.
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleReserve}
                    disabled={isStayBlocked}
                    className="w-full bg-catalogue-green hover:bg-catalogue-gold text-white font-bold uppercase tracking-[0.3em] py-10 rounded-2xl shadow-xl transition-all active:scale-95 text-xs disabled:opacity-40 disabled:hover:bg-catalogue-green disabled:cursor-not-allowed"
                  >
                    {isStayBlocked ? 'Unavailable For These Dates' : 'Begin Reservation'}
                  </Button>

                  <div className="space-y-4 pt-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    <div className="flex justify-between">
                      <span>Room Fee {nights > 1 ? `(${nights} nights)` : ''}</span>
                      <span className="text-slate-800 font-bold font-sans tabular-nums">₹{roomFeeTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cleaning</span>
                      <span className="text-slate-800 font-bold font-sans tabular-nums">₹{cleaningFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between pb-4 border-b border-slate-100">
                      <span>Service</span>
                      <span className="text-slate-800 font-bold font-sans tabular-nums">₹{serviceFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-sm font-bold text-catalogue-green">Total</span>
                      <span className="text-lg font-black text-catalogue-green font-sans tabular-nums">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-slate-900 p-8 rounded-[2rem] text-white space-y-4 shadow-xl">
                <div className="flex items-center gap-3 text-catalogue-gold">
                  <Info size={18} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Booking Insight</p>
                </div>
                <p className="text-xs font-medium text-slate-400 leading-relaxed">This room is in high demand for Kumbakonam pilgrims. Secure your dates now to lock in guaranteed rates.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
