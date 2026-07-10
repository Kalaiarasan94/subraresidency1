import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CustomerNavigation } from './components/CustomerNavigation';
import { CustomerRoutes } from './components/CustomerRoutes';
import { RoomDetailPage } from './components/RoomDetailPage';
import { Footer, ROOMS_DATA, RoomBookingFlow, TempleModal } from './components/CustomerPortalContent';

export const CustomerPortal = () => {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [detailedRoom, setDetailedRoom] = useState<any>(null);
  const [selectedTemple, setSelectedTemple] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [searchFilters, setSearchFilters] = useState<any>({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
    guests: '2 Guests'
  });

  const handleBookRoom = (room: any, dates?: { checkIn: string; checkOut: string; room_id?: number; room_number?: string }) => {
    setDetailedRoom(null);
    // Dates picked directly on the room detail page (if any) override the top-bar search filters
    const effectiveFilters = dates ? { ...searchFilters, ...dates } : searchFilters;
    if (dates) setSearchFilters(effectiveFilters);
    
    const roomWithSelection = dates?.room_id 
      ? { ...room, selected_room_id: dates.room_id, selected_room_number: dates.room_number }
      : room;

    // Navigate to the full-page booking flow passing room and the effective search filters
    navigate('/bookings', { state: { room: roomWithSelection, searchFilters: effectiveFilters } });
  };

  const handleRoomClick = (room: any) => {
    setDetailedRoom(room);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location, detailedRoom]);

  return (
    <div className="font-playfair selection:bg-catalogue-gold selection:text-white overflow-x-hidden min-h-screen flex flex-col">
      {!detailedRoom && (
        <CustomerNavigation
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onMobileMenuClose={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className={!detailedRoom ? "pt-20 flex-grow" : "flex-grow"}>
        {detailedRoom ? (
          <RoomDetailPage 
            room={detailedRoom} 
            onBack={() => setDetailedRoom(null)} 
            onBook={(dates) => handleBookRoom(detailedRoom, dates)}
            searchFilters={searchFilters}
          />
        ) : (
          <CustomerRoutes 
            onBookRoom={handleBookRoom} 
            onSelectTemple={setSelectedTemple} 
            onRoomClick={handleRoomClick} 
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
          />
        )}
      </main>

      <RoomBookingFlow 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        room={selectedRoom || detailedRoom || ROOMS_DATA[0]} 
      />

      <AnimatePresence>
        {selectedTemple && (
          <TempleModal temple={selectedTemple} onClose={() => setSelectedTemple(null)} />
        )}
      </AnimatePresence>

      {!detailedRoom && <Footer />}
    </div>
  );
};

