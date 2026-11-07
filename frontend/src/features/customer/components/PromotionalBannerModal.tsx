import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, BACKEND_URL } from '../../../lib/api';

export const PromotionalBannerModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [banner, setBanner] = useState<{
    imageUrl: string;
    linkUrl: string;
    delay: number;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    // If closed in this browser session, don't show again
    if (sessionStorage.getItem('subra_banner_closed') === 'true') {
      return;
    }

    let timer: any = null;

    const fetchBanner = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings`);
        if (!response.ok) return;
        const data = await response.json();

        if (data && data.popup_banner_enabled === 'true' && data.popup_banner_image) {
          // Delay in seconds (default 33 seconds as requested by client)
          const delaySec = parseInt(data.popup_banner_delay || '33', 10) || 33;

          setBanner({
            imageUrl: data.popup_banner_image,
            linkUrl: data.popup_banner_link || '',
            delay: delaySec
          });

          // Trigger popup after specified seconds
          timer = setTimeout(() => {
            setIsOpen(true);
          }, delaySec * 1000);
        }
      } catch (err) {
        console.error('Failed to load promotional banner settings', err);
      }
    };

    fetchBanner();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('subra_banner_closed', 'true');
  };

  const handleAction = () => {
    handleClose();
    if (banner?.linkUrl) {
      if (banner.linkUrl.startsWith('http://') || banner.linkUrl.startsWith('https://')) {
        window.open(banner.linkUrl, '_blank', 'noopener,noreferrer');
      } else {
        navigate(banner.linkUrl);
      }
    } else {
      navigate('/rooms');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!banner) return null;

  const fullImageUrl = banner.imageUrl.startsWith('http') 
    ? banner.imageUrl 
    : `${BACKEND_URL.replace(/\/+$/, '')}/${banner.imageUrl.replace(/^\/+/, '')}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={handleClose}
        >
          {/* Modal Container matching luxury popup design */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 25 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative max-w-2xl sm:max-w-3xl w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border border-catalogue-gold/30 bg-slate-950 text-white group"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top-Right Circular Close Button (X) styled exactly like the reference design */}
            <button
              onClick={handleClose}
              aria-label="Close notification"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-slate-950 shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-black/40"
            >
              <X size={18} className="stroke-[2.5]" />
            </button>

            {/* Banner Image Display */}
            <div 
              className="relative w-full cursor-pointer overflow-hidden bg-slate-900 flex items-center justify-center"
              onClick={handleAction}
            >
              <img
                src={fullImageUrl}
                alt="Promotional Offer"
                className="w-full max-h-[75vh] object-contain sm:object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />

              {/* Bottom luxury action banner */}
              <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-catalogue-gold/20 flex items-center justify-center text-catalogue-gold">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-catalogue-gold">Special In-App Notice</p>
                    <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-playfair">Subra Residency Exclusive Offer</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-catalogue-gold hover:bg-catalogue-gold/90 text-slate-950 font-bold uppercase tracking-widest text-[11px] shadow-lg flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Explore Offer</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

