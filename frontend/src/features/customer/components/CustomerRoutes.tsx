import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import AboutKumbakonam from '../AboutKumbakonam';
import { 
  AttractionsPage, 
  DecorativeLayout, 
  Home, 
  AboutPage, 
  RoomsPage, 
  RoomPricingPage,
  ContactUsPage,
  TermsAndConditionsPage,
  PrivacyPolicyPage,
  CancellationRefundPage,
  ThankYouPage 
} from './CustomerPortalContent';
import BookingPage from '../../../pages/bookings/BookingPage';
import CheckinConfirmPage from '../../../pages/checkin/CheckinConfirmPage';

type CustomerRoutesProps = {
  onBookRoom: (room: any) => void;
  onSelectTemple: (temple: any) => void;
  onRoomClick: (room: any) => void;
  searchFilters: any;
  setSearchFilters: (filters: any) => void;
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.35 }}>
    {children}
  </motion.div>
);

export const CustomerRoutes = ({ onBookRoom, onSelectTemple, onRoomClick, searchFilters, setSearchFilters }: CustomerRoutesProps) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Core Pages */}
        <Route path="/" element={<PageTransition><Home onBookRoom={onBookRoom} onRoomClick={onRoomClick} searchFilters={searchFilters} setSearchFilters={setSearchFilters} /></PageTransition>} />
        <Route path="/about" element={<PageTransition><AboutPage onSelectTemple={onSelectTemple} /></PageTransition>} />
        <Route path="/about-kumbakonam" element={<PageTransition><DecorativeLayout><AboutKumbakonam /></DecorativeLayout></PageTransition>} />
        <Route path="/rooms" element={<PageTransition><RoomsPage onBookRoom={onBookRoom} onRoomClick={onRoomClick} searchFilters={searchFilters} setSearchFilters={setSearchFilters} /></PageTransition>} />
        
        {/* Room Pricing & Tariffs */}
        <Route path="/pricing" element={<PageTransition><RoomPricingPage onBookRoom={onBookRoom} onRoomClick={onRoomClick} /></PageTransition>} />
        <Route path="/room-pricing" element={<Navigate to="/pricing" replace />} />

        {/* Contact Us */}
        <Route path="/contact" element={<PageTransition><ContactUsPage /></PageTransition>} />
        <Route path="/contact-us" element={<Navigate to="/contact" replace />} />

        {/* Legal & Compliance Policies for Razorpay */}
        <Route path="/terms" element={<PageTransition><TermsAndConditionsPage /></PageTransition>} />
        <Route path="/terms-and-conditions" element={<Navigate to="/terms" replace />} />
        
        <Route path="/privacy" element={<PageTransition><PrivacyPolicyPage /></PageTransition>} />
        <Route path="/privacy-policy" element={<Navigate to="/privacy" replace />} />
        
        <Route path="/cancellation-refund" element={<PageTransition><CancellationRefundPage /></PageTransition>} />
        <Route path="/cancellation-and-refund-policy" element={<Navigate to="/cancellation-refund" replace />} />
        <Route path="/refund-policy" element={<Navigate to="/cancellation-refund" replace />} />

        {/* Attractions & Booking Flow */}
        <Route path="/attractions" element={<PageTransition><AttractionsPage /></PageTransition>} />
        <Route path="/thank-you" element={<PageTransition><ThankYouPage /></PageTransition>} />
        <Route path="/bookings" element={<PageTransition><BookingPage /></PageTransition>} />
        <Route path="/checkin-confirm/:bookingId" element={<CheckinConfirmPage />} />
        <Route path="/checkin/confirm/:bookingId" element={<CheckinConfirmPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};
