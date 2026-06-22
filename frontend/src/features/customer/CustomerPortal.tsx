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

  const handleBookRoom = (room: any) => {
    setDetailedRoom(null);
    // Navigate to the full-page booking flow passing room and current searchFilters state
    navigate('/bookings', { state: { room, searchFilters } });
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
            onBook={() => handleBookRoom(detailedRoom)}
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

