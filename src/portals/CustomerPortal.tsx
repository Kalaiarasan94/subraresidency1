import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, ChevronDown, X, CheckCircle2, CreditCard, QrCode, Info, ChevronRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import logo from '../assets/logo.png';
import pillerImg from '../assets/piller.png';
import leafImg from '../assets/leaf.png';
import templeBotImg from '../assets/temple-bot.png';
import bgImg from '../assets/bg.png';
import locationMapImg from '../assets/location map.png';
import hotelBuildingImg from '../assets/hotel-building.png';
import sarangapaniImg from '../assets/sarangapani temple.jpg';
import mahamahamImg from '../assets/Mahamaham Tank.jpg';
import airavatesvaraImg from '../assets/Airavatesvara Temple.jpg';
import uppiliappanImg from '../assets/Uppiliappan Temple.jpg';
import ramaswamyImg from '../assets/Ramaswamy Temple.jpg';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const fadeInUp = {
  initial: { opacity: 0, y: 46, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
};

const fadeInLeft = {
  initial: { opacity: 0, x: -58, scale: 0.98 },
  whileInView: { opacity: 1, x: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
};

const fadeInRight = {
  initial: { opacity: 0, x: 58, scale: 0.98 },
  whileInView: { opacity: 1, x: 0, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.08
    }
  },
  viewport: { once: true }
};

const heroStagger = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.18
    }
  }
};

const heroItem = {
  initial: { opacity: 0, y: 34, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
};

const ROOMS_DATA = [
  {
    id: 'deluxe',
    title: "Deluxe Room",
    price: "₹3,500",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "A comfortable and thoughtfully arranged room for a calm, restful stay. Ideal for up to 2 guests. (Kids can be allowed if any).",
    details: {
      bed: "King Size Bed",
      ac: "Fully Air Conditioned",
      wifi: "High Speed Free Wi-Fi",
      tv: "42 inch Smart TV",
      view: "City View"
    }
  },
  {
    id: 'super-deluxe',
    title: "Super Deluxe Room",
    price: "₹4,500",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1591088398332-8a7761a9e044?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "A spacious 1 BHK-style stay with added living comfort. Suitable for 2 or 3 guests.",
    details: {
      bed: "Queen Size + Single Bed",
      ac: "Fully Air Conditioned",
      wifi: "High Speed Free Wi-Fi",
      tv: "50 inch Smart TV",
      view: "Temple View"
    }
  },
  {
    id: 'executive-family',
    title: "Executive Family Suite Room",
    price: "₹7,500",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f2c5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
    ],
    desc: "A premium family stay with spacious interiors and enhanced comfort. Suitable for 4 to 6 guests.",
    details: {
      bed: "2 King Size Beds",
      ac: "Centrally Air Conditioned",
      wifi: "High Speed Free Wi-Fi",
      tv: "55 inch Smart TV",
      view: "Panoramic View"
    }
  }
];

const ATTRACTIONS_DATA = [
  {
    title: "Mahamaham Tank",
    dist: "700 meters",
    preferred: "Walk / auto",
    image: mahamahamImg
  },
  {
    title: "Kasi Viswanathar Temple",
    dist: "700 meters",
    preferred: "Walk / auto",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Nageswaran Temple",
    dist: "1.2 kilometers",
    preferred: "Auto preferred",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Sarangapani Temple",
    dist: "1.8 kilometers",
    preferred: "Auto",
    image: sarangapaniImg
  },
  {
    title: "Arulmigu Adi Kumbeswarar Temple",
    dist: "2.3 kilometers",
    preferred: "Auto / cab",
    image: ramaswamyImg // Using ramaswamy as a proxy if not specific
  },
  { title: "Chakrapani Temple", dist: "2.8 kilometers", preferred: "Auto", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" },
  { title: "Airavatesvara Temple", dist: "4.5 kilometers", preferred: "Auto / cab", image: airavatesvaraImg },
  { title: "Sri Oppiliappan Temple", dist: "6.6 kilometers", preferred: "Cab / auto", image: uppiliappanImg },
  { title: "Sri Swarnapureeswarar Temple", dist: "6.6 kilometers", preferred: "Cab recommended", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" },
  { title: "Swamimalai Murugan Temple", dist: "7.9 kilometers", preferred: "Cab recommended", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" },
  { title: "Mahalinga Swamy Temple", dist: "10 kilometers", preferred: "Cab recommended", image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80" }
];

const AvailabilityBar = () => (
  <div className="w-full max-w-5xl mx-auto bg-white shadow-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 items-end border border-catalogue-gold/20 ornate-shape ornate-border">
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Check-in</label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-catalogue-gold" size={16} />
        <input type="date" className="w-full bg-brand-cream/50 border border-catalogue-gold/10 p-3 pl-10 text-sm focus:outline-none focus:border-catalogue-gold transition-colors font-playfair" />
      </div>
    </div>
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Check-out</label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-catalogue-gold" size={16} />
        <input type="date" className="w-full bg-brand-cream/50 border border-catalogue-gold/10 p-3 pl-10 text-sm focus:outline-none focus:border-catalogue-gold transition-colors font-playfair" />
      </div>
    </div>
    <div className="space-y-2">
      <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Guests</label>
      <div className="relative">
        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-catalogue-gold" size={16} />
        <select className="w-full bg-brand-cream/50 border border-catalogue-gold/10 p-3 pl-10 text-sm focus:outline-none focus:border-catalogue-gold transition-colors appearance-none font-playfair">
          <option>2 Guests</option>
          <option>1 Guest</option>
          <option>3 Guests</option>
          <option>4+ Guests</option>
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-catalogue-gold pointer-events-none" size={16} />
      </div>
    </div>
    <Button className="bg-catalogue-gold text-white hover:bg-catalogue-green transition-all py-7 text-sm font-bold uppercase tracking-widest rounded-none shadow-lg group">
      <Search className="mr-2 group-hover:scale-110 transition-transform" size={18} />
      Search Availability
    </Button>
  </div>
);

const OrnateDivider = ({ className }: { className?: string }) => (
  <div className={cn("subra-divider", className)} aria-hidden="true">
    <span />
  </div>
);

const RoomBookingFlow = ({ isOpen, onClose, room }: { isOpen: boolean, onClose: () => void, room: any }) => {
  const [step, setStep] = useState<'details' | 'form' | 'payment' | 'confirm'>('details');
  const [bookingDetails, setBookingDetails] = useState({ 
    name: '', 
    phone: '', 
    email: '',
    checkIn: '',
    checkOut: '',
    guests: '2 Guests'
  });
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setActiveImage(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 'details') setStep('form');
    else if (step === 'form') setStep('payment');
    else if (step === 'payment') setStep('confirm');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-charcoal/90 backdrop-blur-md overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand-cream w-full max-w-6xl min-h-[700px] rounded-none shadow-2xl relative flex flex-col lg:flex-row overflow-hidden border border-catalogue-gold/20"
      >
        <button onClick={onClose} className="absolute top-6 right-6 z-50 bg-white/80 p-2 rounded-full text-brand-charcoal hover:bg-white transition-colors">
          <X size={24} />
        </button>

        {/* Left Side: Room Media & Gallery */}
        <div className="lg:w-3/5 bg-catalogue-green relative flex flex-col">
          <div className="flex-grow relative">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={room?.images ? room.images[activeImage] : room?.image} 
                alt={room?.title} 
                className="w-full h-full object-cover" 
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-catalogue-green via-transparent to-transparent" />
            
            <div className="absolute bottom-12 left-12 right-12 text-white space-y-4">
              <Badge className="bg-catalogue-gold text-white rounded-none px-4 py-1 uppercase tracking-widest border-none font-playfair">Luxury Stay</Badge>
              <h2 className="font-playfair text-6xl font-bold leading-tight drop-shadow-lg">{room?.title}</h2>
              <p className="text-2xl font-bold text-catalogue-gold tracking-widest drop-shadow-md">{room?.price} <span className="text-sm font-normal text-white/70">/ Night</span></p>
            </div>
          </div>
          
          {/* Thumbnail Gallery */}
          {room?.images && (
            <div className="p-6 bg-catalogue-green/50 backdrop-blur-md flex gap-4 overflow-x-auto">
              {room.images.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "w-24 h-16 flex-shrink-0 border-2 transition-all overflow-hidden",
                    activeImage === idx ? "border-catalogue-gold scale-105" : "border-white/20 opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Interactive Flow */}
        <div className="lg:w-2/5 p-12 flex flex-col justify-center bg-white/95">
          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="font-playfair text-4xl font-bold text-catalogue-green border-b border-catalogue-gold/20 pb-4 uppercase tracking-wider">Specifications</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="flex items-center gap-4 text-catalogue-green group">
                      <div className="p-3 bg-catalogue-gold/10 group-hover:bg-catalogue-gold transition-colors text-catalogue-gold group-hover:text-white">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest">Occupancy</p>
                        <p className="text-sm font-bold">{room?.id === 'deluxe' ? '2 Adults' : room?.id === 'super-deluxe' ? '2-3 Adults' : '4-6 Adults'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-catalogue-green group">
                      <div className="p-3 bg-catalogue-gold/10 group-hover:bg-catalogue-gold transition-colors text-catalogue-gold group-hover:text-white">
                        <Star size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest">Bed Type</p>
                        <p className="text-sm font-bold">{room?.details?.bed}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-catalogue-green group">
                      <div className="p-3 bg-catalogue-gold/10 group-hover:bg-catalogue-gold transition-colors text-catalogue-gold group-hover:text-white">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest">Comfort</p>
                        <p className="text-sm font-bold">{room?.details?.ac}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-catalogue-green group">
                      <div className="p-3 bg-catalogue-gold/10 group-hover:bg-catalogue-gold transition-colors text-catalogue-gold group-hover:text-white">
                        <Info size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest">Entertainment</p>
                        <p className="text-sm font-bold">{room?.details?.tv}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-brand-cream/50 border border-catalogue-gold/20 italic text-catalogue-green/70 text-sm leading-relaxed">
                  {room?.desc}
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full bg-catalogue-green text-white py-8 text-lg font-bold uppercase tracking-widest rounded-none hover:bg-catalogue-gold transition-all shadow-xl"
                >
                  Proceed to Booking <ChevronRight className="ml-2" />
                </Button>
              </motion.div>
            )}

            {step === 'form' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h3 className="font-playfair text-3xl font-bold text-catalogue-green border-b border-catalogue-gold/20 pb-4">Stay Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] uppercase font-bold text-catalogue-gold">Check-in</label>
                    <input 
                      type="date" 
                      value={bookingDetails.checkIn}
                      onChange={(e) => setBookingDetails({...bookingDetails, checkIn: e.target.value})}
                      className="w-full bg-brand-cream/30 border border-catalogue-gold/20 p-3 text-sm focus:outline-none focus:border-catalogue-gold" 
                    />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[10px] uppercase font-bold text-catalogue-gold">Check-out</label>
                    <input 
                      type="date" 
                      value={bookingDetails.checkOut}
                      onChange={(e) => setBookingDetails({...bookingDetails, checkOut: e.target.value})}
                      className="w-full bg-brand-cream/30 border border-catalogue-gold/20 p-3 text-sm focus:outline-none focus:border-catalogue-gold" 
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <label className="text-[10px] uppercase font-bold text-catalogue-gold">Guest Information</label>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={bookingDetails.name}
                    onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})}
                    className="w-full bg-brand-cream/30 border border-catalogue-gold/20 p-4 font-playfair focus:outline-none focus:border-catalogue-gold" 
                  />
                  <input 
                    type="tel" 
                    placeholder="WhatsApp Number" 
                    value={bookingDetails.phone}
                    onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})}
                    className="w-full bg-brand-cream/30 border border-catalogue-gold/20 p-4 font-playfair focus:outline-none focus:border-catalogue-gold" 
                  />
                  <select 
                    value={bookingDetails.guests}
                    onChange={(e) => setBookingDetails({...bookingDetails, guests: e.target.value})}
                    className="w-full bg-brand-cream/30 border border-catalogue-gold/20 p-4 font-playfair focus:outline-none focus:border-catalogue-gold"
                  >
                    <option>1 Guest</option>
                    <option>2 Guests</option>
                    <option>3 Guests</option>
                    <option>4+ Guests</option>
                  </select>
                </div>
                <Button 
                  onClick={handleNext}
                  className="w-full bg-catalogue-green text-white py-8 text-lg font-bold uppercase tracking-widest rounded-none hover:bg-catalogue-gold transition-all"
                >
                  Continue to Payment
                </Button>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8 text-center"
              >
                <h3 className="font-playfair text-3xl font-bold text-catalogue-green border-b border-catalogue-gold/20 pb-4 uppercase tracking-widest">Payment</h3>
                <div className="bg-catalogue-green p-6 text-white text-left space-y-3 mb-6">
                  <div className="flex justify-between border-b border-white/20 pb-2">
                    <span className="text-xs uppercase opacity-70">Room</span>
                    <span className="font-bold">{room?.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-2">
                    <span className="text-xs uppercase opacity-70">Dates</span>
                    <span className="font-bold">{bookingDetails.checkIn} to {bookingDetails.checkOut}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs uppercase opacity-70">Guests</span>
                    <span className="font-bold">{bookingDetails.guests}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-catalogue-gold p-6 space-y-4 cursor-pointer hover:bg-catalogue-gold/10 transition-colors bg-brand-cream/20">
                    <QrCode size={40} className="mx-auto text-catalogue-gold" />
                    <p className="text-[10px] font-bold uppercase text-catalogue-green tracking-widest">Scan & Pay</p>
                  </div>
                  <div className="border border-catalogue-gold/20 p-6 space-y-4 cursor-not-allowed opacity-40">
                    <CreditCard size={40} className="mx-auto text-catalogue-green" />
                    <p className="text-[10px] font-bold uppercase text-catalogue-green tracking-widest">Card Payment</p>
                  </div>
                </div>
                
                <div className="p-6 bg-catalogue-gold/10 border border-dashed border-catalogue-gold">
                  <p className="text-catalogue-green font-bold text-2xl mb-2">{room?.price}</p>
                  <p className="text-[10px] text-catalogue-green/60 uppercase tracking-widest font-bold">Total Amount Payable</p>
                </div>
                
                <Button 
                  onClick={handleNext}
                  className="w-full bg-catalogue-green text-white py-8 text-lg font-bold uppercase tracking-widest rounded-none hover:bg-catalogue-gold transition-all"
                >
                  Pay & Confirm Booking
                </Button>
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-catalogue-gold rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <CheckCircle2 size={40} className="text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-playfair text-3xl font-bold text-catalogue-green uppercase tracking-tighter">Reservation Secured</h3>
                  <p className="text-catalogue-green/60 text-xs italic">Thank you for choosing Subra Residency</p>
                </div>
                
                <div className="bg-white p-6 border-2 border-catalogue-gold/20 shadow-2xl inline-block relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-catalogue-gold" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-catalogue-gold" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-catalogue-gold" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-catalogue-gold" />
                  <QrCode size={140} className="text-catalogue-green mx-auto" />
                  <p className="mt-4 text-[10px] font-bold text-catalogue-gold uppercase tracking-[0.2em]">Booking ID: SUBRA-73958</p>
                </div>

                <div className="bg-catalogue-green p-6 text-white text-xs space-y-3 text-left shadow-lg">
                  <div className="flex justify-between border-b border-white/10 pb-2 uppercase tracking-widest">
                    <span className="opacity-60">Guest</span>
                    <span className="font-bold">{bookingDetails.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2 uppercase tracking-widest">
                    <span className="opacity-60">Stay</span>
                    <span className="font-bold">{bookingDetails.checkIn} - {bookingDetails.checkOut}</span>
                  </div>
                  <div className="pt-2 text-[10px] text-catalogue-gold font-bold italic flex items-center gap-3">
                    <Phone size={14} className="animate-pulse" /> 
                    <span>Confirmation & Invoice sent to {bookingDetails.phone}</span>
                  </div>
                </div>

                <Button 
                  onClick={onClose}
                  className="w-full border-2 border-catalogue-green text-catalogue-green py-6 text-sm font-bold uppercase tracking-widest rounded-none hover:bg-catalogue-green hover:text-white transition-all"
                >
                  Return to Portal
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

const SectionWrapper = ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={cn("relative py-24 px-6 md:px-12", className)}>
    <motion.div 
      variants={fadeInUp}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true, margin: "-100px" }}
      className="max-w-7xl mx-auto relative z-10"
    >
      {children}
    </motion.div>
  </section>
);

const DecorativeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="min-h-screen relative"
      style={{ 
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <motion.div
        className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,249,240,0.9),transparent_34%),linear-gradient(to_bottom,rgba(255,249,240,0.35),rgba(255,249,240,0.72))]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      {/* Persistent Decorative Elements */}
      
      <motion.div
        className="fixed top-20 left-0 w-32 md:w-72 bottom-0 pointer-events-none z-10 opacity-100 overflow-hidden decor-pillar"
        initial={{ opacity: 0, x: -70 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={pillerImg} alt="" className="h-full object-cover object-left scale-x-[-1]" />
      </motion.div>

      <motion.div
        className="fixed top-20 right-0 w-32 md:w-64 h-64 md:h-96 pointer-events-none z-10 opacity-100 decor-leaf"
        initial={{ opacity: 0, x: 60, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={leafImg} alt="" className="w-full h-auto object-contain" />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </motion.div>
  );
};

const HeroSky = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
  >
    {/* Clouds */}
    <div className="hero-cloud absolute top-20 left-[10%] opacity-20 blur-xl w-64 h-32 bg-white rounded-full" />
    <div className="hero-cloud hero-cloud-slow absolute top-40 right-[15%] opacity-15 blur-2xl w-96 h-40 bg-white rounded-full" />
    <div className="hero-cloud hero-cloud-soft absolute top-10 left-[40%] opacity-10 blur-3xl w-80 h-48 bg-white rounded-full" />
    
    {/* Birds */}
    <svg className="bird-drift absolute top-32 right-[20%] w-32 h-20 text-catalogue-green/20" viewBox="0 0 100 100">
      <path d="M10 50 Q 25 30 40 50 Q 55 30 70 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 70 Q 35 50 50 70 Q 65 50 80 70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform="scale(0.8) translate(10, 10)" />
      <path d="M5 30 Q 15 15 25 30 Q 35 15 45 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform="scale(0.6) translate(-20, -10)" />
    </svg>
    <svg className="bird-drift bird-drift-slow absolute top-60 right-[10%] w-24 h-16 text-catalogue-green/10" viewBox="0 0 100 100" transform="scale(-1, 1)">
      <path d="M10 50 Q 25 30 40 50 Q 55 30 70 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 70 Q 35 50 50 70 Q 65 50 80 70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform="scale(0.8) translate(10, 10)" />
    </svg>
  </motion.div>
);

const Home = ({ onBookRoom }: { onBookRoom: (room: any) => void }) => {
  return (
    <DecorativeLayout>
      <div className="space-y-0">
        {/* Hero */}
      <section className="relative min-h-[86vh] flex flex-col items-center justify-start overflow-hidden pt-24 md:pt-28 pb-10">
        <HeroSky />
        
        <motion.div
          variants={heroStagger}
          initial="initial"
          animate="animate"
          className="relative z-10 space-y-4 md:space-y-5 max-w-5xl px-6 text-center"
        >
          <motion.h1 variants={heroItem} className="font-playfair text-5xl md:text-8xl text-catalogue-green font-black tracking-tight leading-none drop-shadow-sm">
            WELCOME
          </motion.h1>
          <motion.p variants={heroItem} className="font-playfair text-xl md:text-3xl text-catalogue-green italic tracking-widest uppercase drop-shadow-sm">
            TO A STAY THAT FEELS LIKE
          </motion.p>
          <motion.p variants={heroItem} className="font-playfair text-4xl md:text-6xl text-catalogue-green font-bold drop-shadow-sm">
            Home, Away from Home
          </motion.p>
          <motion.div variants={heroItem} className="space-y-2 pt-4">
            <h2 className="font-playfair text-4xl md:text-6xl text-catalogue-green font-bold drop-shadow-sm">வரவேற்கிறோம்</h2>
            <p className="font-playfair text-xl md:text-2xl text-catalogue-green/80 font-semibold drop-shadow-sm">இது வீடு போன்ற உணர்வைத் தரும் ஓர் இடம்.</p>
          </motion.div>
          <motion.div variants={heroItem} className="pt-4">
            <Link to="/rooms">
              <Button className="lux-button bg-catalogue-green text-white px-12 py-8 text-xl font-bold uppercase tracking-widest rounded-none hover:bg-catalogue-gold transition-colors">
                Explore Our Rooms
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={heroItem} className="pt-6">
            <AvailabilityBar />
          </motion.div>
        </motion.div>
      </section>

      {/* Hotel Building Section */}
      <SectionWrapper className="bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInLeft} className="space-y-8">
            <h2 className="font-playfair text-4xl md:text-6xl text-catalogue-green font-bold leading-tight">
              YOUR STAY BEGINS HERE
            </h2>
            <p className="font-playfair text-xl text-catalogue-green/80 italic">
              A peaceful address in the heart of Kumbakonam. A warm welcome for families, travellers, pilgrims and celebrations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <p className="font-bold text-catalogue-gold uppercase tracking-widest text-xs">Contact Info</p>
                <p className="text-catalogue-green font-bold">7395809991 | 7395809992</p>
                <p className="text-catalogue-green text-sm">subraresidencykum@gmail.com</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-catalogue-gold uppercase tracking-widest text-xs">Location</p>
                <p className="text-catalogue-green font-bold italic">Close to temples, travel points, and the spirit of Kumbakonam.</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInRight} className="rounded-sm overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-catalogue-gold/20">
            <img src={hotelBuildingImg} alt="Subra Residency" className="w-full h-auto" />
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Accommodations Preview */}
      <SectionWrapper id="rooms">
        <div className="text-center mb-16 space-y-4">
          <p className="font-bold text-catalogue-gold uppercase tracking-[0.4em] text-xs">Room Categories</p>
          <h2 className="font-playfair text-5xl md:text-7xl text-catalogue-green">Luxurious Sanctuaries</h2>
        </div>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch"
        >
          {ROOMS_DATA.map((room) => (
            <motion.div key={room.id} variants={fadeInUp} whileHover={{ y: -10, scale: 1.015 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="h-full">
              <Card className="animated-card group bg-card-ivory shadow-xl hover:shadow-2xl transition-all overflow-hidden rounded-none flex flex-col h-full ornate-shape ornate-border border border-catalogue-gold/20">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={room.image} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <CardHeader className="text-center flex-grow">
                  <CardTitle className="font-playfair text-3xl text-catalogue-green">{room.title}</CardTitle>
                  <OrnateDivider className="my-4" />
                  <CardDescription className="text-catalogue-green/70 font-semibold leading-relaxed px-4">{room.desc}</CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-8 pt-4">
                  <p className="text-2xl font-bold text-catalogue-gold mb-6">{room.price}</p>
                  <Button 
                    onClick={() => onBookRoom(room)}
                    className="lux-button bg-catalogue-green text-white font-bold uppercase tracking-widest rounded-none px-8 py-6 hover:bg-catalogue-gold transition-colors"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </SectionWrapper>

      {/* Dining & Events (Page 3) */}
      <SectionWrapper className="bg-catalogue-green/5">
        <div className="text-center mb-16 space-y-4">
          <p className="font-bold text-catalogue-gold uppercase tracking-[0.4em] text-xs">Comfortable Stays • Elegant Dining</p>
          <h2 className="font-playfair text-5xl md:text-7xl text-catalogue-green uppercase">Dining & Events</h2>
          <OrnateDivider className="mt-6" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div variants={fadeInLeft} whileHover={{ y: -8, scale: 1.01 }} className="animated-card space-y-8 group bg-card-ivory p-8 ornate-shape ornate-border shadow-xl">
            <div className="aspect-video overflow-hidden border border-catalogue-gold/20">
              <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80" alt="Dining Hall" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="text-center space-y-4">
              <h3 className="font-playfair text-4xl text-catalogue-green font-bold">Dining Hall</h3>
              <p className="text-catalogue-green/70 font-semibold leading-relaxed max-w-md mx-auto">
                Located on the 4th floor. Capacity: 60 persons. Suitable for family functions, birthday parties and other gatherings.
              </p>
              <Badge variant="outline" className="border-catalogue-gold text-catalogue-gold font-bold px-4 py-1 uppercase tracking-widest">4th Floor</Badge>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInRight} whileHover={{ y: -8, scale: 1.01 }} className="animated-card space-y-8 group bg-card-ivory p-8 ornate-shape ornate-border shadow-xl">
            <div className="aspect-video overflow-hidden border border-catalogue-gold/20">
              <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80" alt="Banquet Hall" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="text-center space-y-4">
              <h3 className="font-playfair text-4xl text-catalogue-green font-bold">Banquet Hall</h3>
              <p className="text-catalogue-green/70 font-semibold leading-relaxed max-w-md mx-auto">
                Located on the 5th floor. Capacity: 80 to 100 persons. Suitable for corporate events, family functions, birthday parties and special occasions.
              </p>
              <Badge variant="outline" className="border-catalogue-gold text-catalogue-gold font-bold px-4 py-1 uppercase tracking-widest">5th Floor</Badge>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 bg-catalogue-green p-4 text-center">
          <p className="text-catalogue-gold font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
            Floors 1-3: Guest Rooms | 4th Floor: Dining Hall | 5th Floor: Banquet Hall
          </p>
        </div>
      </SectionWrapper>

      {/* Google Map Section */}
      <SectionWrapper className="py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
          <div className="bg-white/90 backdrop-blur-sm p-12 shadow-2xl ornate-shape border border-catalogue-gold/20 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="font-bold text-catalogue-gold uppercase tracking-[0.4em] text-xs">Our Location</p>
                <h3 className="font-playfair text-5xl md:text-6xl text-catalogue-green font-black leading-tight">Find Us in the Heart of Kumbakonam</h3>
                <OrnateDivider className="mt-6 ml-0" />
              </div>
              
              <p className="text-catalogue-green/80 text-xl font-medium italic leading-relaxed">
                Experience the perfect blend of spiritual proximity and modern comfort, located just steps away from the sacred landmarks of the Temple Town.
              </p>

              <div className="space-y-8 pt-6">
                 <div className="flex items-start gap-6 group">
                   <div className="bg-white p-4 shadow-lg ornate-shape border border-catalogue-gold/20 group-hover:bg-catalogue-gold group-hover:text-white transition-all">
                     <MapPin size={24} />
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest">Address</p>
                     <p className="text-catalogue-green font-bold text-lg">45, L.B.S Road, Near Railway Station</p>
                     <p className="text-catalogue-green/60 text-sm">Kumbakonam, Tamil Nadu - 612001</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-6 group">
                   <div className="bg-white p-4 shadow-lg ornate-shape border border-catalogue-gold/20 group-hover:bg-catalogue-gold group-hover:text-white transition-all">
                     <Calendar size={24} />
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest">Availability</p>
                     <p className="text-catalogue-green font-bold text-lg">Open 24/7 for Direct Bookings</p>
                     <p className="text-catalogue-green/60 text-sm">Heartfelt hospitality, day and night</p>
                   </div>
                 </div>
              </div>
            </div>

            <Button className="lux-button bg-catalogue-green text-white px-10 py-8 text-sm font-bold uppercase tracking-widest rounded-none shadow-xl hover:bg-catalogue-gold transition-all w-full">
              Get Directions
            </Button>
          </div>

          <div className="h-[600px] lg:h-auto relative p-4 bg-white shadow-2xl ornate-shape border border-catalogue-gold/10 min-h-[500px]">
            <div className="absolute inset-4 overflow-hidden ornate-shape">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.423985068694!2d79.3702161141164!3d10.957685958742848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a55134764953e5b%3A0x7d0e4178553f6a6b!2sSubra%20Residency!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin" 
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000" 
                allowFullScreen={true} 
                loading="lazy" 
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
      </div>
    </DecorativeLayout>
  );
};

const AboutPage = () => {
  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-40">
        <div className="text-center mb-16 space-y-6">
          <h1 className="font-playfair text-5xl md:text-8xl text-catalogue-green font-black max-w-3xl mx-auto leading-tight">WHY CHOOSE SUBRA?</h1>
          <p className="font-playfair text-xl md:text-2xl text-catalogue-gold italic font-bold">Stay in the heart of Kumbakonam – close to temples and transport.</p>
          <OrnateDivider className="my-8" />
          <p className="font-playfair text-lg md:text-xl text-catalogue-green max-w-3xl mx-auto leading-relaxed font-semibold">
            Located near Kumbakonam Railway Station and Bus Stand, Subra Residency offers easy access to important temples, spiritual landmarks, and key travel points within a short distance.
          </p>
        </div>

        {/* Map Visualization - Using location map image */}
        <motion.div variants={fadeInUp} whileHover={{ y: -8, scale: 1.01 }} className="animated-card relative aspect-[3/2] w-full max-w-5xl mx-auto bg-card-ivory rounded-none border border-catalogue-gold/20 flex flex-col items-center justify-center mb-20 overflow-hidden shadow-2xl ornate-shape ornate-border">
          <div className="relative w-full h-full p-2 md:p-3">
            <img src={locationMapImg} alt="Location Map" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start border-t border-catalogue-gold/20 pt-16 mb-32 bg-card-ivory p-8 md:p-12 ornate-shape ornate-border shadow-xl">
          {/* Transport Points */}
          <motion.div variants={fadeInLeft} className="space-y-8">
            <div className="flex items-center gap-4 text-catalogue-green border-b border-catalogue-gold/20 pb-4">
              <QrCode size={32} className="text-catalogue-gold" />
              <h3 className="font-playfair text-3xl font-bold uppercase tracking-widest leading-none">Transport Points</h3>
            </div>
            <table className="w-full text-left font-playfair">
              <thead>
                <tr className="text-[10px] text-catalogue-gold font-bold uppercase tracking-[0.2em] border-b border-catalogue-gold/20">
                  <th className="pb-4">Place</th>
                  <th className="pb-4">Distance</th>
                  <th className="pb-4">Preferred</th>
                  <th className="pb-4">Time</th>
                </tr>
              </thead>
              <tbody className="text-catalogue-green font-bold">
                <tr className="border-b border-catalogue-gold/10">
                  <td className="py-6">Kumbakonam Railway Station</td>
                  <td>300 meters</td>
                  <td>Walk</td>
                  <td className="italic text-catalogue-gold text-sm font-bold">Approx. 3-5 min</td>
                </tr>
                <tr>
                  <td className="py-6">Kumbakonam Bus Stand</td>
                  <td>700 meters</td>
                  <td>Walk / Auto</td>
                  <td className="italic text-catalogue-gold text-sm font-bold">Approx. 8 min walk</td>
                </tr>
              </tbody>
            </table>
          </motion.div>

          {/* Spiritual Trail */}
          <motion.div variants={fadeInRight} className="space-y-8">
            <div className="flex items-center gap-4 text-catalogue-green border-b border-catalogue-gold/20 pb-4">
              <MapPin size={32} className="text-catalogue-gold" />
              <h3 className="font-playfair text-3xl font-bold uppercase tracking-widest leading-none">Spiritual Trail</h3>
            </div>
            <div className="grid grid-cols-1 gap-0">
               <div className="flex text-[10px] text-catalogue-gold font-bold uppercase tracking-[0.2em] border-b border-catalogue-gold/20 pb-4">
                 <div className="flex-1">Place</div>
                 <div className="w-24">Distance</div>
                 <div className="w-32">Preferred</div>
               </div>
               <div className="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {ATTRACTIONS_DATA.map((attr, i) => (
                  <div key={i} className="flex items-center py-4 border-b border-catalogue-gold/10 text-catalogue-green font-bold">
                    <div className="flex-1 text-sm">{attr.title}</div>
                    <div className="w-24 text-[11px] uppercase">{attr.dist}</div>
                    <div className="w-32 text-[11px] uppercase italic text-catalogue-gold font-bold">{attr.preferred}</div>
                  </div>
                ))}
               </div>
            </div>
          </motion.div>
        </div>

        {/* Why Kumbakonam Section (Image 4) */}
        <div className="space-y-16 py-20 border-t border-catalogue-gold/20">
          <div className="text-center space-y-6">
            <h2 className="font-playfair text-5xl md:text-7xl text-catalogue-green font-black">WHY KUMBAKONAM IS CALLED<br />THE TEMPLE TOWN</h2>
            <p className="font-playfair text-xl text-catalogue-gold italic font-bold">A sacred city where devotion, heritage and living tradition meet.</p>
            <p className="font-playfair text-lg text-catalogue-green/80 max-w-4xl mx-auto leading-relaxed font-semibold">
              Kumbakonam is lovingly known as the Temple Town because its streets, sacred tanks and neighborhoods are woven with centuries-old temples, living rituals and timeless South Indian heritage. With remarkable Shaivite and Vaishnavite shrines standing close to one another, the town offers a rare spiritual atmosphere where architecture, devotion and culture continue to thrive every day.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { title: "Mahamaham Tank", time: "6:00 AM – 10:00 AM and 4:30 PM – 7:00 PM", desc: "Sacred tank famed for the Mahamaham festival and holy Theerthavari rituals." },
              { title: "Kasi Viswanathar Temple", time: "7:00 AM – 12:00 PM and 4:00 PM – 8:00 PM", desc: "Revered Shiva temple near Mahamaham Tank, tied to Kumbakonam's sacred identity." },
              { title: "Nageswaran Temple", time: "6:00 AM – 12:00 PM and 4:00 PM – 8:30 PM", desc: "Ancient Shiva temple admired for Chola-era architecture and peaceful darshan." },
              { title: "Sarangapani Temple", time: "6:00 AM – 12:30 PM and 4:00 PM – 9:00 PM", desc: "Important Divya Desam Vishnu temple known for its grand chariot-style sanctum." },
              { title: "Arulmigu Adi Kumbeswarar Temple", time: "5:30 AM – 12:00 PM and 4:00 PM – 8:30 PM", desc: "Major Shiva temple linked to the origin legend of Kumbakonam and Mahamaham." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -8, scale: 1.02 }} className="animated-card bg-card-ivory p-6 border border-catalogue-gold/10 space-y-4 shadow-md ornate-shape ornate-border">
                <h4 className="font-playfair text-xl font-bold text-catalogue-green">{item.title}</h4>
                <p className="text-xs text-catalogue-green/70 leading-relaxed italic">{item.desc}</p>
                <div className="pt-4 border-t border-catalogue-gold/20">
                  <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest">Best Darshan</p>
                  <p className="text-[11px] font-bold text-catalogue-green mt-1">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* More Sacred Landmarks (Image 5) */}
        <div className="space-y-16 py-20 border-t border-catalogue-gold/20">
          <div className="text-center space-y-6">
            <h2 className="font-playfair text-5xl md:text-7xl text-catalogue-green font-black">MORE SACRED LANDMARKS<br />AROUND KUMBAKONAM</h2>
            <p className="font-playfair text-xl text-catalogue-gold italic font-bold">A graceful continuation of the spiritual trail beyond the town centre.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Chakrapani Temple", time: "6:00 AM – 12:00 PM and 4:00 PM – 8:30 PM", desc: "Historic Vishnu temple dedicated to Sudarshana Chakra, revered for its unique iconography and peaceful temple atmosphere." },
              { title: "Airavatesvara Temple, Darasuram", time: "6:00 AM – 12:00 PM and 4:00 PM – 8:00 PM", desc: "UNESCO-recognised Chola masterpiece admired for exquisite stone carvings, sculpted mandapams and timeless Dravidian architecture." },
              { title: "Arulmigu Sri Oppiliappan Temple", time: "6:00 AM – 1:00 PM and 4:00 PM – 9:00 PM", desc: "Sacred Divya Desam devoted to Lord Vishnu, especially known for prasadam prepared without salt and deep Vaishnavite tradition." },
              { title: "Sri Swarnapureeswarar Temple", time: "6:00 AM – 12:00 PM and 4:30 PM – 8:30 PM", desc: "Revered Shiva temple valued for its serene ambience, spiritual significance and enduring local worship traditions." },
              { title: "Swamimalai Murugan Temple", time: "6:00 AM – 12:00 PM and 4:00 PM – 8:30 PM", desc: "One of the six sacred abodes of Lord Murugan, celebrated for the legend of Murugan teaching the Pranava mantra." },
              { title: "Thiruvidaimarudur Mahalinga Swamy Temple", time: "5:30 AM – 12:30 PM and 4:00 PM – 9:00 PM", desc: "A major Shiva sthalam known for its grand scale, powerful sanctity and majestic temple corridors." }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -8, scale: 1.015 }} className="animated-card group relative overflow-hidden bg-card-ivory p-8 border border-catalogue-gold/10 hover:border-catalogue-gold/40 transition-all shadow-lg ornate-shape ornate-border">
                <div className="space-y-6">
                  <h4 className="font-playfair text-2xl font-bold text-catalogue-green">{item.title}</h4>
                  <p className="text-sm text-catalogue-green/80 leading-relaxed font-semibold">{item.desc}</p>
                  <div className="pt-6 border-t border-catalogue-gold/20">
                    <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest">Best Darshan</p>
                    <p className="text-xs font-bold text-catalogue-green mt-2">{item.time}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};

const RoomsPage = ({ onBookRoom }: { onBookRoom: (room: any) => void }) => {
  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-40">
        <div className="text-center mb-8 space-y-4">
          <p className="font-bold text-catalogue-gold uppercase tracking-[0.4em] text-xs">Our Accommodations</p>
          <h2 className="font-playfair text-5xl md:text-7xl text-catalogue-green">Luxurious Sanctuaries</h2>
        </div>

        <div className="mb-16">
          <AvailabilityBar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
          {ROOMS_DATA.map((room) => (
            <motion.div key={room.id} variants={fadeInUp} whileHover={{ y: -10, scale: 1.015 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="h-full">
            <Card className="animated-card group bg-card-ivory shadow-xl hover:shadow-2xl transition-all overflow-hidden rounded-none flex flex-col h-full ornate-shape ornate-border border border-catalogue-gold/20">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={room.image} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <CardHeader className="text-center flex-grow">
                <CardTitle className="font-playfair text-3xl text-catalogue-green">{room.title}</CardTitle>
                <OrnateDivider className="my-4" />
                <CardDescription className="text-catalogue-green/70 font-semibold leading-relaxed px-4">{room.desc}</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8 pt-4">
                <p className="text-2xl font-bold text-catalogue-gold mb-6">{room.price}</p>
                <Button 
                  onClick={() => onBookRoom(room)}
                  className="lux-button bg-catalogue-green text-white font-bold uppercase tracking-widest px-8 py-6 rounded-none hover:bg-catalogue-gold transition-colors"
                >
                  Book Room
                </Button>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};

const AttractionsPage = () => {
  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-40">
        <div className="text-center mb-16 space-y-4">
          <p className="font-bold text-catalogue-gold uppercase tracking-[0.4em] text-xs">Spiritual Trail</p>
          <h2 className="font-playfair text-5xl md:text-7xl text-catalogue-green">Temple Highlights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ATTRACTIONS_DATA.map((attr, i) => (
            <motion.div key={i} variants={fadeInUp} whileHover={{ y: -10, scale: 1.015 }} className="animated-card bg-card-ivory overflow-hidden ornate-shape ornate-border shadow-lg group">
              <div className="aspect-video overflow-hidden border-b border-catalogue-gold/20">
                <img src={attr.image} alt={attr.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-8 space-y-6">
                <h4 className="font-playfair text-2xl font-bold text-catalogue-green">{attr.title}</h4>
                <div className="flex justify-between items-center text-sm font-bold border-t border-catalogue-gold/10 pt-4">
                  <span className="text-catalogue-gold uppercase tracking-widest">{attr.dist}</span>
                  <span className="text-catalogue-green italic">{attr.preferred}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};

const ThankYouPage = () => {
  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-40">
        <div className="text-center mb-16 space-y-8">
          <img src={logo} alt="Logo" className="h-20 mx-auto mb-6" />
          <h1 className="font-playfair text-6xl md:text-9xl text-catalogue-green font-black tracking-tighter">THANK YOU</h1>
          <p className="font-playfair text-xl md:text-3xl text-catalogue-gold italic font-bold">For choosing Subra Residency</p>
          <p className="font-playfair text-lg text-catalogue-green max-w-2xl mx-auto leading-relaxed font-semibold">
            Thank you for considering Subra Residency for your stay in Kumbakonam. We are honoured to be a part of your journey and look forward to welcoming you with comfort, care and heartfelt hospitality.
          </p>
        </div>

        {/* Image Grid matching catalogue */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 max-w-5xl mx-auto">
          <div className="space-y-4">
            <div className="aspect-square bg-white p-2 border border-catalogue-gold/20"><img src={sarangapaniImg} alt="" className="w-full h-full object-cover" /></div>
            <div className="aspect-square bg-white p-2 border border-catalogue-gold/20"><img src={mahamahamImg} alt="" className="w-full h-full object-cover" /></div>
          </div>
          <div className="col-span-2 aspect-[4/5] md:aspect-auto bg-white p-2 border border-catalogue-gold/20 relative">
            <img src={hotelBuildingImg} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-[12px] border-white/50 pointer-events-none" />
          </div>
          <div className="space-y-4">
            <div className="aspect-square bg-white p-2 border border-catalogue-gold/20"><img src={airavatesvaraImg} alt="" className="w-full h-full object-cover" /></div>
            <div className="aspect-square bg-white p-2 border border-catalogue-gold/20"><img src={uppiliappanImg} alt="" className="w-full h-full object-cover" /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-b border-catalogue-gold/30 py-16">
          <div className="text-center space-y-4">
            <MapPin size={32} className="mx-auto text-catalogue-gold" />
            <h4 className="font-playfair text-xl font-black text-catalogue-green uppercase tracking-widest">Location</h4>
            <p className="text-catalogue-green font-bold text-sm leading-relaxed">45, L.B.S Road,<br />Near Railway Station,<br />Kumbakonam - 612001,<br />Tamil Nadu, India.</p>
          </div>
          <div className="text-center space-y-4 border-x border-catalogue-gold/20 px-8">
            <QrCode size={32} className="mx-auto text-catalogue-gold" />
            <h4 className="font-playfair text-xl font-black text-catalogue-green uppercase tracking-widest">Contact Details</h4>
            <p className="text-catalogue-green font-bold text-sm">Phone: 7395809991 / 7395809992</p>
            <p className="text-catalogue-green font-bold text-sm break-all">Email: subraresidencykum@gmail.com</p>
          </div>
          <div className="text-center space-y-4">
            <Calendar size={32} className="mx-auto text-catalogue-gold" />
            <h4 className="font-playfair text-xl font-black text-catalogue-green uppercase tracking-widest">Stay Information</h4>
            <div className="text-catalogue-green font-bold text-sm space-y-1">
              <p>Check-in: 12:00 PM</p>
              <p>Check-out: 11:00 AM</p>
              <p className="text-catalogue-gold pt-2 italic">For Direct Bookings:<br />24 hours from check-in</p>
            </div>
          </div>
        </div>

        <div className="text-center pt-20 pb-10 space-y-4">
          <p className="font-playfair text-2xl text-catalogue-green font-bold">நன்றி வணக்கம்</p>
          <p className="font-playfair text-xl text-catalogue-gold italic font-bold">We look forward to welcoming you again.</p>
        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};

const Footer = () => (
  <footer className="bg-catalogue-green py-16 text-center border-t border-catalogue-gold/40 relative z-20">
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 border-b border-catalogue-gold/10 pb-12">
        <div className="flex flex-col items-center gap-4">
          <img src={logo} alt="Logo" className="h-20 brightness-0 invert" />
          <p className="font-playfair text-catalogue-gold italic text-lg">Home, Away from Home</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-catalogue-cream/80">
        <div className="space-y-4">
          <MapPin size={24} className="mx-auto text-catalogue-gold" />
          <h4 className="font-playfair text-xl font-bold text-white uppercase tracking-widest">Location</h4>
          <p className="text-sm leading-relaxed">45, L.B.S Road, Near Railway Station,<br />Kumbakonam - 612001, Tamil Nadu, India.</p>
        </div>
        <div className="space-y-4 border-x border-catalogue-gold/10 px-8">
          <QrCode size={24} className="mx-auto text-catalogue-gold" />
          <h4 className="font-playfair text-xl font-bold text-white uppercase tracking-widest">Contact Info</h4>
          <p className="text-sm font-bold">7395809991 | 7395809992</p>
          <p className="text-xs italic">subraresidencykum@gmail.com</p>
        </div>
        <div className="space-y-4">
          <Calendar size={24} className="mx-auto text-catalogue-gold" />
          <h4 className="font-playfair text-xl font-bold text-white uppercase tracking-widest">Stay Info</h4>
          <div className="text-sm space-y-1">
            <p>Check-in: 12:00 PM</p>
            <p>Check-out: 11:00 AM</p>
            <p className="text-catalogue-gold text-xs mt-2 italic font-bold">24 hours from check-in for direct bookings</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-12">
        <p className="font-playfair text-xl md:text-5xl text-catalogue-gold font-bold tracking-[0.1em] uppercase">
          STAY BLESSED. STAY COMFORTABLE. STAY WITH SUBRA.
        </p>
        <p className="text-[10px] text-catalogue-gold/40 uppercase tracking-[0.5em]">
          © {new Date().getFullYear()} Subra Residency • Kumbakonam
        </p>
      </div>
    </div>
  </footer>
);

export const CustomerPortal = () => {
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
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
      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-ivoryMist/95 backdrop-blur-md shadow-md border-b border-catalogue-gold/20 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Subra Residency" className="h-10 md:h-12 w-auto" />
            <div className="flex flex-col">
              <span className="font-playfair text-xl md:text-2xl font-black tracking-widest text-catalogue-green leading-none">SUBRA</span>
              <span className="font-playfair text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-catalogue-gold uppercase leading-none mt-1">Residency • Kumbakonam</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-xs font-bold uppercase tracking-[0.2em] text-catalogue-green hover:text-catalogue-gold transition-colors">Home</Link>
            <Link to="/about" className="text-xs font-bold uppercase tracking-[0.2em] text-catalogue-green hover:text-catalogue-gold transition-colors">About Us</Link>
            <Link to="/rooms" className="text-xs font-bold uppercase tracking-[0.2em] text-catalogue-green hover:text-catalogue-gold transition-colors">Rooms</Link>
            <Link to="/attractions" className="text-xs font-bold uppercase tracking-[0.2em] text-catalogue-green hover:text-catalogue-gold transition-colors">Attractions</Link>
            <Link to="/contact" className="text-xs font-bold uppercase tracking-[0.2em] text-catalogue-green hover:text-catalogue-gold transition-colors">Contact</Link>
            <Link to="/rooms">
              <Button 
                className="lux-button bg-catalogue-gold text-white hover:bg-catalogue-green transition-all font-bold uppercase tracking-widest text-[10px] px-8 py-6 rounded-none shadow-lg"
              >
                Book Now
              </Button>
            </Link>
          </div>

          <button className="md:hidden text-catalogue-green">
            <Search size={24} />
          </button>
        </div>
      </motion.nav>

      <main>
        <Routes>
          <Route path="/" element={<Home onBookRoom={handleBookRoom} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/rooms" element={<RoomsPage onBookRoom={handleBookRoom} />} />
          <Route path="/attractions" element={<AttractionsPage />} />
          <Route path="/contact" element={<ThankYouPage />} />
        </Routes>
      </main>

      <RoomBookingFlow 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        room={selectedRoom || ROOMS_DATA[0]} 
      />

      <Footer />
    </div>
  );
};
