import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BedDouble, Maximize2, MapPin } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { fadeInUp } from './animations';
import { ROOMS_DATA } from './data';
import { OrnateDivider } from './OrnateDivider';
import { SectionWrapper, DecorativeLayout } from './Layout';
import { fetchRoomCategories } from '../../../lib/api';

export const RoomsPage = ({ onBookRoom, onRoomClick }: { onBookRoom: (room: any) => void, onRoomClick: (room: any) => void }) => {
  const [allRooms, setAllRooms] = useState<any[]>(ROOMS_DATA);
  const [displayRooms, setDisplayRooms] = useState<any[]>(ROOMS_DATA);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRoomCategories();
        if (data && Array.isArray(data) && data.length > 0) {
          setAllRooms(data);
          setDisplayRooms(data);
        } else {
          setAllRooms(ROOMS_DATA);
          setDisplayRooms(ROOMS_DATA);
        }
      } catch (err) {
        setAllRooms(ROOMS_DATA);
        setDisplayRooms(ROOMS_DATA);
      }
    };
    loadRooms();
  }, []);

  // Helper to format price without double rupee
  const formatPrice = (price: any) => {
    if (!price) return '₹3,500';
    const stringPrice = String(price);
    return stringPrice.includes('₹') ? stringPrice : `₹${stringPrice}`;
  };

  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-20">
        <div className="text-center mb-12 space-y-4">
          <p className="font-bold text-catalogue-gold uppercase tracking-[0.4em] text-sm">Exclusive Collection</p>
          <h2 className="font-playfair text-4xl md:text-6xl text-catalogue-green font-black uppercase tracking-tight">Our Sanctuaries</h2>
          <div className="flex justify-center pt-2">
            <OrnateDivider className="w-32" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {displayRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayRooms.map((room, index) => (
                <motion.div
                  key={`${room.id}-${index}`}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className="group overflow-hidden border-none shadow-xl bg-white rounded-3xl flex flex-col h-full hover:shadow-catalogue-gold/10 transition-all duration-700 cursor-pointer"
                    onClick={() => onRoomClick(room)}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img 
                        src={room.image || room.featured_image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80'} 
                        alt={room.title || room.room_name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-catalogue-green/60 via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute top-4 left-4 block">
                         <Badge className="bg-white/95 backdrop-blur-md text-catalogue-green font-black uppercase tracking-widest text-[9px] px-3 py-1.5 border-none shadow-sm">Premium</Badge>
                      </div>

                      <div className="absolute bottom-4 left-6 right-6">
                         <h3 className="text-2xl font-sans font-black text-white tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] tabular-nums">
                            {formatPrice(room.price || room.base_price)}
                            <span className="text-[11px] font-bold opacity-90 ml-1 uppercase tracking-widest">/ NT</span>
                         </h3>
                      </div>
                    </div>

                    <CardContent className="p-6 flex-grow flex flex-col">
                      <div className="mb-4">
                        <h4 className="text-lg font-black font-playfair text-catalogue-green uppercase tracking-tight mb-1 group-hover:text-catalogue-gold transition-colors truncate">{room.title || room.room_name}</h4>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                           <MapPin size={10} className="text-catalogue-gold" />
                           {room.category || 'Suite'} • Level {room.floor || '3'}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4 py-4 border-y border-slate-50">
                        <div className="flex flex-col items-center gap-1">
                          <Users className="text-catalogue-gold" size={14} />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter tabular-nums font-sans">{room.adults || '2'} Guests</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 border-x border-slate-50 px-1">
                          <BedDouble className="text-catalogue-gold" size={14} />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter truncate w-full text-center font-sans">King Bed</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <Maximize2 className="text-catalogue-gold" size={14} />
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter tabular-nums font-sans">{room.size || '350'} ft²</span>
                        </div>
                      </div>

                      <p className="text-slate-400 font-medium text-[11px] leading-relaxed mb-6 flex-grow line-clamp-2 italic">
                        {room.description || room.short_description || "A masterfully crafted sanctuary featuring hand-picked decor."}
                      </p>

                      <Button 
                        onClick={(e) => { e.stopPropagation(); onBookRoom(room); }}
                        className="w-full bg-catalogue-green text-white hover:bg-catalogue-gold font-black uppercase tracking-[0.2em] py-5 rounded-xl shadow-lg transition-all text-[10px]"
                      >
                        Reserve Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
               <h3 className="text-2xl font-playfair font-black text-catalogue-green mb-2">No Matching Sanctuaries</h3>
               <p className="text-slate-500">We couldn't find rooms for your specific criteria. Please try adjusting your filters.</p>
            </div>
          )}
        </AnimatePresence>
      </SectionWrapper>
    </DecorativeLayout>
  );
};
