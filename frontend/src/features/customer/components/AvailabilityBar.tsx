import { useState, useEffect } from 'react';
import { Search, Calendar, Users, ChevronDown } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { API_BASE_URL } from '../../../lib/api';

export const AvailabilityBar = ({ onSearch }: { onSearch?: (filters: any) => void }) => {
  const today = new Date().toISOString().split('T')[0];
  const [guests, setGuests] = useState('2 Guests');
  const [checkIn, setCheckIn] = useState(today);
  // Check-out is intentionally left blank — the guest must actively choose it, it should never
  // silently default to the same day as check-in.
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState('');
  const [guestOptions, setGuestOptions] = useState<number[]>([]);

  // Fetch room categories to derive dynamic min→max guest count
  useEffect(() => {
    const fetchGuestRange = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/rooms/categories`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const capacities = data.map((room: any) => Number(room.max_guests || room.adults || 2));
          const maxCapacity = Math.max(...capacities);
          const range: number[] = [];
          for (let i = 1; i <= maxCapacity; i++) {
            range.push(i);
          }
          setGuestOptions(range);
        } else {
          setGuestOptions([1, 2, 3]);
        }
      } catch (e) {
        console.warn('Could not load guest range from API:', e);
        setGuestOptions([1, 2, 3]);
      }
    };
    fetchGuestRange();
  }, []);

  const minCheckOut = (() => {
    const base = checkIn || today;
    const d = new Date(base);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  const handleCheckInChange = (value: string) => {
    setCheckIn(value);
    // Drop a check-out date that's no longer valid against the new check-in
    if (checkOut && checkOut <= value) setCheckOut('');
  };

  const handleSearch = () => {
    if (!checkOut) {
      setError('Please select a check-out date.');
      return;
    }
    if (checkOut <= checkIn) {
      setError('Check-out must be after check-in.');
      return;
    }
    setError('');
    if (onSearch) {
      const guestCount = parseInt(guests) || 2;
      onSearch({ guests: guestCount, checkIn, checkOut });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
    <div className="bg-white shadow-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-end border border-catalogue-gold/20 ornate-shape ornate-border">
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Check-in</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-catalogue-gold" size={16} />
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => handleCheckInChange(e.target.value)}
            className="w-full bg-brand-cream/50 border border-catalogue-gold/10 p-3 pl-10 text-sm focus:outline-none focus:border-catalogue-gold transition-colors font-playfair"
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Check-out</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-catalogue-gold" size={16} />
          <input
            type="date"
            value={checkOut}
            min={minCheckOut}
            onChange={(e) => { setCheckOut(e.target.value); setError(''); }}
            className={`w-full bg-brand-cream/50 border p-3 pl-10 text-sm focus:outline-none focus:border-catalogue-gold transition-colors font-playfair ${error ? 'border-red-400' : 'border-catalogue-gold/10'}`}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Guests</label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-catalogue-gold" size={16} />
          <select 
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            className="w-full bg-brand-cream/50 border border-catalogue-gold/10 p-3 pl-10 text-sm focus:outline-none focus:border-catalogue-gold appearance-none font-playfair"
          >
            {guestOptions.map(n => (
              <option key={n} value={n === 1 ? '1 Guest' : `${n} Guests`}>
                {n === 1 ? '1 Guest' : `${n} Guests`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-catalogue-gold pointer-events-none" size={16} />
        </div>
      </div>
      <Button 
        onClick={handleSearch}
        className="bg-catalogue-gold text-white hover:bg-catalogue-green transition-all py-7 text-sm font-bold uppercase tracking-widest rounded-none shadow-lg group"
      >
        <Search className="mr-2 group-hover:scale-110 transition-transform" size={18} />
        Search Availability
      </Button>
    </div>
    {error && (
      <p className="mt-2 text-xs font-bold text-red-500 text-center md:text-right">{error}</p>
    )}
    </div>
  );
};
