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

  const handleBookRoom = (room: any) => {
    // Navigate to the full-page booking flow instead of opening the modal
    navigate('/bookings', { state: { room } });
  };

  const navigate = useNavigate();

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
          />
        ) : (
          <CustomerRoutes onBookRoom={handleBookRoom} onSelectTemple={setSelectedTemple} onRoomClick={handleRoomClick} />
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

