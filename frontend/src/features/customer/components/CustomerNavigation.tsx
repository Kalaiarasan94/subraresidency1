import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';
import logo from '../../../assets/logo.png';

type CustomerNavigationProps = {
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  onMobileMenuClose: () => void;
};

const navigationLinks = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About Us" },
  { path: "/rooms", label: "Rooms" },
  { path: "/pricing", label: "Room Pricing" },
  { path: "/attractions", label: "Attractions" },
  { path: "/contact", label: "Contact Us" }
];

const policyLinks = [
  { path: "/terms", label: "Terms & Conditions" },
  { path: "/privacy", label: "Privacy Policy" },
  { path: "/cancellation-refund", label: "Cancellation & Refund" }
];

export const CustomerNavigation = ({ isMobileMenuOpen, onMobileMenuToggle, onMobileMenuClose }: CustomerNavigationProps) => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] } as any}
      className="fixed top-0 left-0 right-0 z-50 bg-ivoryMist/95 backdrop-blur-md shadow-md border-b border-catalogue-gold/20 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={onMobileMenuClose}>
          <img src={logo} alt="Subra Residency" className="h-10 md:h-12 w-auto" />
          <div className="flex flex-col">
            <span className="font-playfair text-xl md:text-2xl font-black tracking-widest text-catalogue-green leading-none">SUBRA</span>
            <span className="font-playfair text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-catalogue-gold uppercase leading-none mt-1">Residency Kumbakonam</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 relative py-1",
                location.pathname === link.path ? "text-catalogue-gold" : "text-catalogue-green hover:text-catalogue-gold"
              )}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-0 right-0 h-[2px] bg-catalogue-gold"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                />
              )}
            </Link>
          ))}
          <Link to="/rooms">
            <Button
              className="lux-button bg-catalogue-gold text-white hover:bg-catalogue-green transition-all font-bold uppercase tracking-widest text-[10px] px-7 py-5 rounded-none shadow-lg"
            >
              Book Now
            </Button>
          </Link>
        </div>

        <button
          className="lg:hidden text-catalogue-green p-1"
          onClick={onMobileMenuToggle}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-catalogue-gold/15 overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col p-6 space-y-3 font-sans">
              <span className="text-[10px] uppercase font-bold text-catalogue-gold tracking-[0.3em]">Menu</span>
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onMobileMenuClose}
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider py-2 border-b border-catalogue-gold/10 flex items-center justify-between",
                    location.pathname === link.path ? "text-catalogue-gold" : "text-catalogue-green"
                  )}
                >
                  <span>{link.label}</span>
                  <ChevronRight size={14} className="text-catalogue-gold/60" />
                </Link>
              ))}

              <div className="pt-3 space-y-2">
                <span className="text-[10px] uppercase font-bold text-catalogue-gold tracking-[0.3em]">Legal & Policies</span>
                {policyLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={onMobileMenuClose}
                    className="text-[11px] font-semibold text-slate-600 hover:text-catalogue-gold flex items-center gap-2 py-1"
                  >
                    <ShieldCheck size={13} className="text-catalogue-gold" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-4">
                <Link to="/rooms" onClick={onMobileMenuClose}>
                  <Button className="w-full bg-catalogue-gold hover:bg-catalogue-green text-white font-bold uppercase tracking-widest rounded-none py-6 text-xs shadow-md">
                    Book Room Now
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
