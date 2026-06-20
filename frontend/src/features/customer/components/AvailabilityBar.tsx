import { useState } from 'react';
import { Search, Calendar, Users, ChevronDown } from 'lucide-react';
import { Button } from '../../../components/ui/button';
export const AvailabilityBar = ({ onSearch }: { onSearch?: (filters: any) => void }) => {
  const today = new Date().toISOString().split('T')[0];
  const [guests, setGuests] = useState('2 Guests');
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(today);

  const handleSearch = () => {
    if (onSearch) {
      const guestCount = parseInt(guests) || 2;
      onSearch({ guests: guestCount, checkIn, checkOut });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-end border border-catalogue-gold/20 ornate-shape ornate-border">
      <div className="space-y-2">
        <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Check-in</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-catalogue-gold" size={16} />
          <input 
            type="date" 
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
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
            min={checkIn || today}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full bg-brand-cream/50 border border-catalogue-gold/10 p-3 pl-10 text-sm focus:outline-none focus:border-catalogue-gold transition-colors font-playfair" 
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
            <option value="1 Guest">1 Guest</option>
            <option value="2 Guests">2 Guests</option>
            <option value="3 Guests">3 Guests</option>
            <option value="4 Guests">4+ Guests</option>
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
  );
};



