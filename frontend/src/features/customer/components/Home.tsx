import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, BedDouble, Maximize2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, heroStagger, heroItem } from './animations';
import { ROOMS_DATA, diningImg, hallImg, hotelBuildingImg } from './CustomerPortalContent';
import { AvailabilityBar } from './AvailabilityBar';
import { OrnateDivider } from './OrnateDivider';
import { SectionWrapper, DecorativeLayout } from './Layout';
import { HeroSky } from './HeroSky';
import { fetchRoomCategories, API_BASE_URL, BACKEND_URL } from '../../../lib/api';

export const Home = ({ 
  onBookRoom, 
  onRoomClick, 
  searchFilters, 
  setSearchFilters 
}: { 
  onBookRoom: (room: any) => void; 
  onRoomClick: (room: any) => void;
  searchFilters: any;
  setSearchFilters: (filters: any) => void;
}) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<any[]>(ROOMS_DATA);

  useEffect(() => {
    document.title = "Subra Residency | Hotel in Kumbakonam near Railway Station";
    const loadRooms = async () => {
      const data = await fetchRoomCategories();
      if (data && Array.isArray(data) && data.length > 0) {
        setRooms(data.slice(0, 3));
      }
    };
    loadRooms();
  }, []);

  // Helper to format price without double rupee
  const formatPrice = (price: any) => {
    if (!price) return '₹1,600';
    const stringPrice = String(price);
    return stringPrice.includes('₹') ? stringPrice : `₹${Number(stringPrice).toLocaleString('en-IN')}`;
  };

  return (
    <DecorativeLayout>
      <div className="space-y-0">
        {/* Hero Section */}
        <section className="relative min-h-[86vh] flex flex-col items-center justify-start overflow-hidden pt-16 md:pt-20 pb-10">
          <HeroSky />

          <motion.div variants={heroStagger} initial="initial" animate="animate" className="relative z-10 space-y-4 md:space-y-5 max-w-5xl px-6 text-center">
            <motion.h1 variants={heroItem} className="font-playfair text-4xl md:text-6xl metal-emerald font-black tracking-tight leading-none">WELCOME</motion.h1>
            <motion.p variants={heroItem} className="font-playfair text-xl md:text-3xl metal-emerald italic tracking-widest uppercase">TO A STAY THAT FEELS LIKE</motion.p>
            <motion.p variants={heroItem} className="font-playfair text-2xl md:text-4xl metal-emerald font-bold">Home, Away from Home</motion.p>
            <motion.div variants={heroItem} className="space-y-2 pt-4">
              <h2 className="font-playfair text-2xl md:text-4xl metal-emerald font-bold">வரவேற்கிறோம்</h2>
              <p className="font-playfair text-xl md:text-2xl metal-emerald font-semibold italic">இது வீடு போன்ற உணர்வைத் தரும் ஓர் இடம்.</p>
            </motion.div>
            <motion.div variants={heroItem} className="pt-8">
              <AvailabilityBar onSearch={(filters) => {
                setSearchFilters(filters);
                navigate('/rooms');
              }} />
            </motion.div>
          </motion.div>
        </section>

        {/* Accommodations Preview */}
        <SectionWrapper id="rooms" className="pt-12 md:pt-16 pb-16 md:pb-24">
          <div className="text-center mb-16 space-y-4">
            <p className="font-bold metal-gold uppercase tracking-[0.4em] text-[10px] metal-flat">Official Selection</p>
            <h2 className="font-playfair text-3xl md:text-5xl metal-emerald font-black uppercase tracking-tight">Our Sanctuaries</h2>
            <div className="flex justify-center pt-2">
               <OrnateDivider className="w-40" />
            </div>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {rooms.map((room, index) => (
              <motion.div key={`${room.id}-${index}`} variants={fadeInUp} className="h-full">
                <Card 
                  className="group lux-card overflow-hidden flex flex-col h-full cursor-pointer"
                  onClick={() => onRoomClick(room)}
                >
                  <div className="lux-card-media aspect-[16/10]">
                    <img 
                      src={room.image || room.featured_image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80'} 
                      alt={room.title || room.room_name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                       <Badge className="bg-[#062824]/75 backdrop-blur-md text-[#F1D98E] font-semibold uppercase tracking-[0.25em] text-[8px] px-3 py-1.5 rounded-md border border-[#F1D98E]/30 shadow-none">Premium Selection</Badge>
                    </div>

                    <div className="absolute bottom-4 left-4">
                       <div className="lux-price-plate">
                          <h3 className="text-xl font-sans font-bold metal-gold-bright tracking-wider tabular-nums">
                             {formatPrice(room.price || room.base_price)}
                          </h3>
                          <span className="text-[9px] font-semibold text-white/75 uppercase tracking-[0.2em]">/ night</span>
                       </div>
                    </div>
                  </div>

                  <CardContent className="px-6 pt-6 pb-7 flex-grow flex flex-col">
                    <div className="mb-4">
                      <h4 className="text-xl font-black font-playfair metal-emerald metal-hover-gold uppercase tracking-tight mb-1 truncate">{room.title || room.room_name}</h4>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                         <MapPin size={10} className="text-catalogue-gold" />
                         {room.category || 'Luxury Suite'} • Kumbakonam
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-5 py-4 border-y border-catalogue-gold/20">
                      <div className="flex flex-col items-center gap-1">
                        <Users className="text-catalogue-gold" size={14} />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter tabular-nums">{room.adults || room.max_adults || '2'} Guests</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 border-x border-catalogue-gold/20 px-1">
                        <BedDouble className="text-catalogue-gold" size={14} />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter truncate w-full text-center">King Bed</span>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <Maximize2 className="text-catalogue-gold" size={14} />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter tabular-nums">{room.size || room.room_size || '350'} ft²</span>
                      </div>
                    </div>

                    <p className="text-slate-400 font-medium text-[11px] leading-relaxed mb-6 flex-grow line-clamp-2 italic">
                      {room.description || room.short_description || "A masterfully crafted sanctuary featuring hand-picked decor and localized architectural nuances."}
                    </p>

                    <Button 
                      onClick={(e) => { e.stopPropagation(); onBookRoom(room); }}
                      className="lux-button w-full bg-catalogue-green text-white hover:bg-catalogue-gold font-bold uppercase tracking-[0.25em] py-5 rounded-lg shadow-none border border-catalogue-green hover:border-catalogue-gold transition-all text-[10px]"
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Link to="/rooms">
              <Button variant="ghost" className="text-catalogue-green font-bold uppercase tracking-[0.3em] text-xs hover:text-catalogue-gold transition-colors flex items-center gap-2 mx-auto">
                Discover All Sanctuaries <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </SectionWrapper>

        {/* Info & Building Section */}
        <SectionWrapper className="pt-0 pb-16 md:pb-24">
          <div className="lux-panel grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center p-6 md:p-10 lg:p-12">
            <motion.div variants={fadeInLeft} className="space-y-8">
              <h2 className="font-playfair text-3xl md:text-5xl metal-emerald font-black uppercase tracking-tight leading-tight">YOUR STAY BEGINS HERE</h2>
              <p className="font-playfair text-xl text-catalogue-green/80 italic">A peaceful address in the heart of Kumbakonam. A warm welcome for families travellers and pilgrims.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="space-y-2">
                  <p className="font-bold metal-gold uppercase tracking-widest text-xs metal-flat">Contact Info</p>
                  <p className="text-catalogue-green font-black tabular-nums font-sans">7395809991 | 7395809992</p>
                </div>
                <div className="space-y-2">
                  <p className="font-bold metal-gold uppercase tracking-widest text-xs metal-flat">Location</p>
                  <p className="text-catalogue-green font-bold italic underline decoration-catalogue-gold/30">L.B.S Road, Near Railway Station</p>
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeInRight} className="rounded-[10px] overflow-hidden shadow-xl border border-catalogue-gold/30">
              <img src={hotelBuildingImg} alt="Subra Residency" className="w-full h-auto" />
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Dining & Events */}
        <SectionWrapper className="pt-0 pb-16 md:pb-24">
          <div className="text-center mb-12 md:mb-16 space-y-4">
            <p className="font-bold metal-gold uppercase tracking-[0.4em] text-[10px] metal-flat">Comfort & Celebration</p>
            <h2 className="font-playfair text-3xl md:text-5xl metal-emerald font-black uppercase tracking-tight">Facilities</h2>
            <OrnateDivider className="mt-6" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={fadeInLeft} className="lux-card space-y-6 group p-6">
              <div className="aspect-video overflow-hidden rounded-[10px]">
                <img src={diningImg} alt="Dining" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="font-playfair text-3xl metal-emerald font-black uppercase italic">Dining Hall</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm mx-auto">Capacity: <span className="font-bold text-catalogue-green tabular-nums font-sans">60</span> persons. Suitable for family functions and gatherings.</p>
                <Badge variant="outline" className="border-catalogue-gold text-catalogue-gold font-bold px-4 py-1 uppercase tracking-widest text-[9px] tabular-nums font-sans">4th Floor</Badge>
              </div>
            </motion.div>
            <motion.div variants={fadeInRight} className="lux-card space-y-6 group p-6">
              <div className="aspect-video overflow-hidden rounded-[10px]">
                <img src={hallImg} alt="Banquet" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="text-center space-y-3">
                <h3 className="font-playfair text-3xl metal-emerald font-black uppercase italic">Banquet Hall</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-sm mx-auto">Capacity: <span className="font-bold text-catalogue-green tabular-nums font-sans">100</span> persons. Suitable for corporate and special occasions.</p>
                <Badge variant="outline" className="border-catalogue-gold text-catalogue-gold font-bold px-4 py-1 uppercase tracking-widest text-[9px] tabular-nums font-sans">5th Floor</Badge>
              </div>
            </motion.div>
          </div>
        </SectionWrapper>
      </div>
    </DecorativeLayout>
  );
};
