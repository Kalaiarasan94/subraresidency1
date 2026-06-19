import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
  { path: "/about-kumbakonam", label: "About Kumbakonam" },
  { path: "/rooms", label: "Rooms" },
  { path: "/attractions", label: "Attractions" },
  { path: "/contact", label: "Contact" }
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
            <span className="font-playfair text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-catalogue-gold uppercase leading-none mt-1">Residency â€¢ Kumbakonam</span>
          </div>
        </Link>
        
        <div className="hidden md:flex items-center gap-10">
          {navigationLinks.map((link) => (
            <Link 
              key={link.path}
              to={link.path} 
              className={cn(
                "text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 relative py-1",
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
              className="lux-button bg-catalogue-gold text-white hover:bg-catalogue-green transition-all font-bold uppercase tracking-widest text-[10px] px-8 py-6 rounded-none shadow-lg"
            >
              Book Now
            </Button>
          </Link>
        </div>

        <button 
          className="md:hidden text-catalogue-green"
          onClick={onMobileMenuToggle}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-catalogue-gold/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navigationLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path} 
                  onClick={onMobileMenuClose}
                  className={cn(
                    "text-sm font-bold uppercase tracking-widest py-2 border-b border-catalogue-gold/5",
                    location.pathname === link.path ? "text-catalogue-gold" : "text-catalogue-green"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/rooms" onClick={onMobileMenuClose}>
                <Button className="w-full bg-catalogue-gold text-white font-bold uppercase tracking-widest rounded-none py-6 mt-4">
                  Book Now
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

