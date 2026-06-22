import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AboutKumbakonam from '../AboutKumbakonam';
import { AttractionsPage, DecorativeLayout, Home, AboutPage, RoomsPage, ThankYouPage } from './CustomerPortalContent';
import BookingPage from '../../../pages/bookings/BookingPage';

type CustomerRoutesProps = {
  onBookRoom: (room: any) => void;
  onSelectTemple: (temple: any) => void;
  onRoomClick: (room: any) => void;
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
    {children}
  </motion.div>
);

export const CustomerRoutes = ({ onBookRoom, onSelectTemple, onRoomClick }: CustomerRoutesProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home onBookRoom={onBookRoom} onRoomClick={onRoomClick} /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage onSelectTemple={onSelectTemple} /></PageTransition>} />
        <Route path="/about-kumbakonam" element={<PageTransition><DecorativeLayout><AboutKumbakonam /></DecorativeLayout></PageTransition>} />
        <Route path="/rooms" element={<PageTransition><RoomsPage onBookRoom={onBookRoom} onRoomClick={onRoomClick} /></PageTransition>} />
        <Route path="/attractions" element={<PageTransition><AttractionsPage /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ThankYouPage /></PageTransition>} />
        <Route path="/bookings" element={<PageTransition><BookingPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

