import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CustomerNavigation } from './components/CustomerNavigation';
import { CustomerRoutes } from './components/CustomerRoutes';
import { Footer, ROOMS_DATA, RoomBookingFlow, TempleModal } from './components/CustomerPortalContent';

export const CustomerPortal = () => {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [selectedTemple, setSelectedTemple] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleBookRoom = (room: any) => {
    setSelectedRoom(room);
    setIsBookingOpen(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="font-playfair selection:bg-catalogue-gold selection:text-white overflow-x-hidden">
      <CustomerNavigation
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="pt-20">
        <CustomerRoutes onBookRoom={handleBookRoom} onSelectTemple={setSelectedTemple} />
      </main>

      <RoomBookingFlow 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        room={selectedRoom || ROOMS_DATA[0]} 
      />

      <AnimatePresence>
        {selectedTemple && (
          <TempleModal temple={selectedTemple} onClose={() => setSelectedTemple(null)} />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

