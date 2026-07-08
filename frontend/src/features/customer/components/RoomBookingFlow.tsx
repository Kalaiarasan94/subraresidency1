import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, ShieldCheck, ChevronDown, X, CheckCircle2, CreditCard, QrCode, Info, ChevronRight, Phone, Clock, Droplets, Shirt, Footprints, Car } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, heroStagger, heroItem } from './animations';
import { ROOMS_DATA, ATTRACTIONS_DATA, HIDDEN_TRAILS_DATA, RECOMMENDED_TRAILS_DATA, TEMPLE_DETAILS_DATA } from './data';
import { logo, pillerImg, leafImg, templeBotImg, bgImg, locationMapImg, hotelBuildingImg, diningImg, hallImg, sarangapaniImg, mahamahamImg, airavatesvaraImg, uppiliappanImg, ramaswamyImg } from './assets';
import { createBooking, createPaymentOrder, verifyPayment } from '../../../lib/api';
import { useNavigate } from 'react-router-dom';

export const RoomBookingFlow = ({ isOpen, onClose, room }: { isOpen: boolean, onClose: () => void, room: any }) => {
  const [step, setStep] = useState<'details' | 'form' | 'payment' | 'confirm'>('details');
  const [realBookingId, setRealBookingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({ 
    name: '', 
    phone: '', 
    email: '',
    checkIn: '',
    checkOut: '',
    guests: '2 Guests'
  });
  const [activeImage, setActiveImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setActiveImage(0);
      setRealBookingId('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = async () => {
    if (step === 'details') setStep('form');
    else if (step === 'form') setStep('payment');
    else if (step === 'payment') {
    // 1) create booking as pending (server marks payment_status pending)
    setIsSubmitting(true);
    const bookingResp = await createBooking({
      ...bookingDetails,
      category_id: room.id,
      amount: room.price_24h || 3500
    });
    if (!bookingResp || bookingResp.status !== 'success') {
      setIsSubmitting(false);
      alert('Failed to create booking. Please try again.');
      return;
    }

  const bookingId = bookingResp.booking_id;

  // 2) determine amount (in rupees) and request Razorpay order from backend
  const amountValue = Number(room?.price_24h || room?.price || 3500);
  let orderResp = null;
  try {
    orderResp = await createPaymentOrder({ booking_id: bookingId, amount: amountValue });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
  }

  if (!orderResp || orderResp.status !== 'success') {
    console.warn('Razorpay order creation failed, proceeding with simulated payment fallback.');
    // Simulated checkout flow
    const verifyResp = await verifyPayment({
      razorpay_payment_id: 'pay_sim_' + Math.random().toString(36).substring(2, 11).toUpperCase(),
      razorpay_order_id: 'order_sim_' + Math.random().toString(36).substring(2, 11).toUpperCase(),
      razorpay_signature: 'simulated_signature',
      booking_id: bookingId
    });
    setIsSubmitting(false);
    if (verifyResp && verifyResp.status === 'success') {
      setRealBookingId(bookingId);
      navigate('/bookings', { state: { bookingId, room, guest: bookingDetails, amount: amountValue, checkIn: bookingDetails.checkIn, checkOut: bookingDetails.checkOut } });
    } else {
      alert(verifyResp?.message || 'Payment simulation failed.');
    }
    return;
  }

    const order = orderResp.order;
    const keyId = orderResp.key_id;

    // 3) load Razorpay script and open checkout
    const loadRzp = () => new Promise((res, rej) => {
      if ((window as any).Razorpay) return res(true);
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => res(true);
      s.onerror = () => rej(false);
      document.body.appendChild(s);
    });

    try {
      await loadRzp();
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Subra Residency',
        description: room?.title,
        order_id: order.id,
        handler: async function (response: any) {
          // verify payment on server
          const verifyResp = await verifyPayment({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            booking_id: bookingId
          });
          setIsSubmitting(false);
          if (verifyResp && verifyResp.status === 'success') {
            setRealBookingId(bookingId);
            // redirect to dedicated booking page with state
            navigate('/bookings', { state: { bookingId, room, guest: bookingDetails, amount: amountValue, checkIn: bookingDetails.checkIn, checkOut: bookingDetails.checkOut } });
          } else {
            const errorMsg = verifyResp?.message || 'Payment verification failed. Please contact support.';
            alert(errorMsg);
          }
        },
        prefill: {
          name: bookingDetails.name,
          email: bookingDetails.email,
          contact: bookingDetails.phone
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e) {
      setIsSubmitting(false);
      alert('Payment failed to start. Please try again.');
    }
    }
    else if (step === 'confirm') setStep('confirm');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-charcoal/90 backdrop-blur-md overflow-y-auto">
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
                      disabled={isSubmitting}
                      className="w-full bg-catalogue-green text-white py-8 text-lg font-bold uppercase tracking-widest rounded-none hover:bg-catalogue-gold transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? 'Processing...' : 'Pay & Confirm Booking'}
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
                  {/* Ideally render a QR code component for `realBookingId` */}
                  <div className="mx-auto mb-3">
                    {/* placeholder box for QR image; generate server-side or use a client lib to render from booking id */}
                    <div className="w-40 h-40 bg-slate-100 flex items-center justify-center">{realBookingId ? <span className="text-xs font-bold">QR</span> : null}</div>
                  </div>
                  <p className="mt-4 text-[10px] font-bold text-catalogue-gold uppercase tracking-[0.2em]">Booking ID: {realBookingId || '—'}</p>
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



