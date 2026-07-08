import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { 
  CheckCircle2, Download, CreditCard, ArrowLeft, Calendar, 
  Users, Phone, Mail, MapPin, Globe, QrCode, Check, Loader2, Building
} from 'lucide-react';
import { fetchBookingById, createBooking, createPaymentOrder, verifyPayment } from '../../lib/api';
import html2canvas from 'html2canvas';
import QRCode from 'qrcode';

export default function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as any;
  
  const room = state?.room || {};
  const initialFilters = state?.searchFilters || {};
  
  const [bookingId, setBookingId] = useState(state?.bookingId || '');
  const [bookingFull, setBookingFull] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  
  // Form states pre-filled from search criteria
  const [bookingDetails, setBookingDetails] = useState({
    name: state?.guest?.name || '',
    phone: state?.guest?.phone || '',
    email: state?.guest?.email || '',
    checkIn: initialFilters?.checkIn || state?.checkIn || new Date().toISOString().split('T')[0],
    checkOut: initialFilters?.checkOut || state?.checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    guests: initialFilters?.guests || state?.guests || '2 Guests',
    country: state?.guest?.country || 'India',
    address: state?.guest?.address || '',
    specialRequests: state?.guest?.specialRequests || ''
  });

  const receiptRef = useRef<HTMLDivElement>(null);

  // Fetch full details if booking ID is present (e.g. page reload or redirect)
  useEffect(() => {
    const id = bookingId || state?.bookingIdFromQuery;
    if (id) {
      setIsSubmitting(true);
      fetchBookingById(id).then((res) => {
        setIsSubmitting(false);
        if (res && res.status === 'success') {
          setBookingFull(res.booking);
          setBookingId(id);
        }
      }).catch(() => setIsSubmitting(false));
    }
  }, [bookingId, state]);

  // Generate local base64 QR Code to prevent CORS errors during canvas rendering
  useEffect(() => {
    const id = bookingId || state?.bookingIdFromQuery;
    if (id) {
      QRCode.toDataURL(`${window.location.origin}/checkin-confirm/${id}`, { width: 300, margin: 2 })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR:', err));
    }
  }, [bookingId, state]);

  // Plain hex/rgba colors to prevent html2canvas crashing on oklab/oklch Tailwind variables
  const hexColors = {
    green: '#0f3a20',
    gold: '#cda052',
    white: '#ffffff',
    slate400: '#94a3b8',
    slate500: '#64748b',
    slate600: '#475569',
    slate700: '#334155',
    slate800: '#1e293b',
    slate900: '#0f172a',
    emerald50: '#ecfdf5',
    emerald100: '#d1fae5',
    emerald600: '#059669',
    emerald700: '#047857',
    emerald800: '#065f46',
    slate50: 'rgba(248, 250, 252, 0.8)',
    borderLight: '#f1f5f9',
    borderDark: '#e2e8f0',
    goldLight: 'rgba(205, 160, 82, 0.05)',
    greenLight: 'rgba(15, 58, 32, 0.05)',
    goldBorder: 'rgba(205, 160, 82, 0.3)',
    goldBorderSoft: 'rgba(205, 160, 82, 0.2)',
    emeraldBorder: 'rgba(16, 185, 129, 0.3)',
    emeraldBg: 'rgba(236, 253, 245, 0.5)'
  };

  // Calculate duration of stay (nights)
  const calculateNights = (inDate: string, outDate: string) => {
    if (!inDate || !outDate) return 1;
    const d1 = new Date(inDate);
    const d2 = new Date(outDate);
    const diffTime = d2.getTime() - d1.getTime();
    if (isNaN(diffTime)) return 1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights(bookingDetails.checkIn, bookingDetails.checkOut);
  
  // Calculate pricing breakdown
  const nightlyRate = parseInt(String(room.price || room.price_24h || room.base_price || '3500').replace(/[^0-9]/g, ''), 10) || 3500;
  const subtotal = nightlyRate * nights;
  // Extra taxes/fees: cleaning 500, service 850 (matches room details page)
  const cleaningFee = 500;
  const serviceFee = 850;
  const totalAmount = subtotal + cleaningFee + serviceFee;

  const handleStartPayment = async () => {
    if (!bookingDetails.name || !bookingDetails.phone || !bookingDetails.email || !bookingDetails.address) {
      alert('Please fill in all the required guest details.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Create a pending booking on the server
      const bookingResp = await createBooking({
        name: bookingDetails.name,
        phone: bookingDetails.phone,
        email: bookingDetails.email,
        checkIn: bookingDetails.checkIn,
        checkOut: bookingDetails.checkOut,
        guests: bookingDetails.guests,
        country: bookingDetails.country,
        address: bookingDetails.address,
        specialRequests: bookingDetails.specialRequests,
        category_id: room.id,
        amount: totalAmount
      });

      if (!bookingResp || bookingResp.status !== 'success') {
        alert('Failed to initialize booking details on the server.');
        setIsSubmitting(false);
        return;
      }

      const bid = bookingResp.booking_id;

      // 2. Request a Razorpay order from the backend
      let orderResp = null;
      try {
        orderResp = await createPaymentOrder({ booking_id: bid, amount: totalAmount });
      } catch (err) {
        console.error("Razorpay order creation error:", err);
      }

      if (!orderResp || orderResp.status !== 'success') {
        alert(orderResp?.message || 'Unable to start the payment. Please try again in a moment or contact reception.');
        setIsSubmitting(false);
        return;
      }

      const order = orderResp.order;
      const keyId = orderResp.key_id;

      // 3. Load Razorpay script dynamically
      const loadRzpScript = () => new Promise((resolve, reject) => {
        if ((window as any).Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => reject(false);
        document.body.appendChild(script);
      });

      await loadRzpScript();

      // 4. Open Razorpay secure checkout
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Subra Residency',
        description: `${room.title || 'Room Booking'} (${nights} Nights)`,
        order_id: order.id,
        prefill: {
          name: bookingDetails.name,
          email: bookingDetails.email,
          contact: bookingDetails.phone
        },
        theme: {
          color: '#0f3a20' // brand green
        },
        handler: async function (response: any) {
          try {
            // 5. Verify the payment on the server
            const verifyResp = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              booking_id: bid
            });

            if (verifyResp && verifyResp.status === 'success') {
              setBookingId(bid);
              // Fetch completed booking details to show receipt
              const finalBooking = await fetchBookingById(bid);
              if (finalBooking && finalBooking.status === 'success') {
                setBookingFull(finalBooking.booking);
              }
            } else {
              const errorMsg = verifyResp?.message || 'Payment verification failed. Please contact reception.';
              alert(errorMsg);
            }
          } catch (err) {
            console.error(err);
            alert('Verification process encountered an error. Please contact support.');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert('Secure checkout failed to load.');
    }
  };

  // Capture voucher element as image and trigger download
  const handleDownloadVoucher = async () => {
    if (!receiptRef.current) return;
    setIsSubmitting(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#FFFFFF',
        logging: false
      });
      const link = document.createElement('a');
      link.download = `SubraResidency_Voucher_${bookingId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating voucher image:', error);
      alert('Could not download image. Please try printing or screenshotting instead.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper formatting values
  const formatCurrency = (val: any) => {
    const num = Number(val) || 0;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const isConfirmed = bookingId && (bookingFull || state?.bookingId);
  const activeBooking = bookingFull || state;
  const activeRoom = room.title ? room : (bookingFull?.rooms?.[0] || {});

  return (
    <div className="min-h-screen bg-brand-cream/40 py-12 px-4 md:px-8 selection:bg-catalogue-gold selection:text-white font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header & Branding */}
        <div className="flex flex-col items-center text-center mb-12 space-y-4">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-xs font-black text-catalogue-green uppercase tracking-widest hover:text-catalogue-gold transition-colors self-start mb-4"
          >
            <ArrowLeft size={16} /> Return to Home
          </button>
          
          <h1 className="font-playfair text-4xl md:text-5xl font-black text-catalogue-green tracking-wide">
            SUBRA RESIDENCY
          </h1>
          <p className="font-playfair italic text-catalogue-gold text-lg">Hotel Reservation & Check-in Portal</p>
          
          {/* Visual Stepper */}
          <div className="flex items-center justify-center gap-4 pt-6 w-full max-w-md">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isConfirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-catalogue-green text-white'}`}>
                {isConfirmed ? <Check size={14} /> : '1'}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Details</span>
            </div>
            <div className={`h-[2px] flex-grow ${isConfirmed ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isConfirmed ? 'bg-emerald-100 text-emerald-700' : isSubmitting ? 'bg-catalogue-gold text-white animate-pulse' : 'bg-slate-200 text-slate-500'}`}>
                {isConfirmed ? <Check size={14} /> : '2'}
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Payment</span>
            </div>
            <div className={`h-[2px] flex-grow ${isConfirmed ? 'bg-emerald-500' : 'bg-slate-200'}`} />
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isConfirmed ? 'bg-catalogue-gold text-white shadow-md' : 'bg-slate-200 text-slate-500'}`}>
                3
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-black">Confirm</span>
            </div>
          </div>
        </div>

        {/* Step 3 & 4: Guest Form & Payment */}
        {!isConfirmed ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Guest Form (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="rounded-3xl border border-catalogue-gold/20 shadow-xl overflow-hidden bg-white">
                <div className="bg-catalogue-green px-8 py-6 text-white">
                  <h3 className="text-xl font-bold uppercase tracking-wider font-playfair">Guest Information</h3>
                  <p className="text-white/70 text-xs mt-1">Please enter correct details as per government issued photo ID.</p>
                </div>
                
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Full Name *</label>
                      <input 
                        value={bookingDetails.name} 
                        onChange={(e) => setBookingDetails({...bookingDetails, name: e.target.value})} 
                        placeholder="e.g. John Doe" 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-catalogue-gold focus:ring-1 focus:ring-catalogue-gold transition-all font-medium" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="email"
                          value={bookingDetails.email} 
                          onChange={(e) => setBookingDetails({...bookingDetails, email: e.target.value})} 
                          placeholder="john.doe@email.com" 
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-10 text-sm focus:outline-none focus:border-catalogue-gold focus:ring-1 focus:ring-catalogue-gold transition-all font-medium" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">WhatsApp Mobile Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="tel"
                          value={bookingDetails.phone} 
                          onChange={(e) => setBookingDetails({...bookingDetails, phone: e.target.value})} 
                          placeholder="e.g. 9876543210" 
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-10 text-sm focus:outline-none focus:border-catalogue-gold focus:ring-1 focus:ring-catalogue-gold transition-all font-medium" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Country *</label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          value={bookingDetails.country} 
                          onChange={(e) => setBookingDetails({...bookingDetails, country: e.target.value})} 
                          placeholder="India" 
                          required
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 pl-10 text-sm focus:outline-none focus:border-catalogue-gold focus:ring-1 focus:ring-catalogue-gold transition-all font-medium" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Billing/Postal Address *</label>
                      <textarea 
                        value={bookingDetails.address} 
                        onChange={(e) => setBookingDetails({...bookingDetails, address: e.target.value})} 
                        placeholder="123, Temple View Street, Kumbakonam, Tamil Nadu" 
                        rows={3}
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-catalogue-gold focus:ring-1 focus:ring-catalogue-gold transition-all font-medium" 
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest block">Special Requests (Optional)</label>
                      <textarea 
                        value={bookingDetails.specialRequests} 
                        onChange={(e) => setBookingDetails({...bookingDetails, specialRequests: e.target.value})} 
                        placeholder="e.g. Ground floor room preferred, early check-in requested, etc." 
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm focus:outline-none focus:border-catalogue-gold focus:ring-1 focus:ring-catalogue-gold transition-all font-medium" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Secure Payment Gateway Selector */}
              <Card className="rounded-3xl border border-catalogue-gold/20 shadow-xl overflow-hidden bg-white">
                <div className="px-8 py-6 border-b border-slate-100">
                  <h4 className="text-md font-bold uppercase tracking-wider text-catalogue-green font-playfair">Select Payment Method</h4>
                </div>
                
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-catalogue-green bg-catalogue-green/5 rounded-2xl p-5 flex items-center gap-4 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-catalogue-green/10 flex items-center justify-center text-catalogue-green">
                        <CreditCard size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black uppercase text-catalogue-green tracking-wider">Razorpay Gateway</p>
                        <p className="text-[10px] text-slate-500">UPI, Cards, Net Banking & Wallets</p>
                      </div>
                    </div>
                    
                    <div className="border border-slate-100 opacity-40 rounded-2xl p-5 flex items-center gap-4 cursor-not-allowed">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Building size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold uppercase text-slate-500">Bank Transfer / Pay at Hotel</p>
                        <p className="text-[10px] text-slate-400">Requires manual offline verification</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-50 rounded-xl text-center text-xs font-semibold text-slate-500 leading-relaxed">
                     ⚠️ Clicking checkout will launch the Razorpay secure popup to securely finalize the transaction.
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary Sidebar (Span 1) */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                <Card className="rounded-3xl border border-catalogue-gold/20 shadow-xl overflow-hidden bg-white">
                  <div className="bg-catalogue-gold/15 px-6 py-5 text-catalogue-green border-b border-catalogue-gold/10">
                    <h3 className="text-sm font-black uppercase tracking-widest font-playfair">Reservation Summary</h3>
                  </div>

                  <CardContent className="p-6 space-y-6">
                    {/* Room Preview */}
                    <div className="flex gap-4 items-center">
                      <img 
                        src={room.image || room.featured_image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80'} 
                        alt={room.title} 
                        className="w-20 h-16 object-cover rounded-lg border border-catalogue-gold/20"
                      />
                      <div className="text-left">
                        <h4 className="text-sm font-black text-catalogue-green uppercase truncate max-w-[160px]">{room.title || 'Room Details'}</h4>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{room.category || 'Luxury stay'}</span>
                        <p className="text-xs font-black text-catalogue-gold tracking-widest mt-1 font-sans">{formatCurrency(nightlyRate)} <span className="text-[10px] font-normal text-slate-400">/ NT</span></p>
                      </div>
                    </div>

                    {/* Stay Dates */}
                    <div className="grid grid-cols-2 gap-2 py-4 border-y border-slate-100 text-xs">
                      <div className="text-left">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Check-In</span>
                        <span className="font-bold text-slate-700">{bookingDetails.checkIn}</span>
                      </div>
                      <div className="text-left border-l border-slate-100 pl-3">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Check-Out</span>
                        <span className="font-bold text-slate-700">{bookingDetails.checkOut}</span>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs text-slate-500 font-bold uppercase tracking-wider">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1.5"><Calendar size={12} className="text-catalogue-gold" /> Stay Duration</span>
                        <span className="text-slate-800 font-black font-sans">{nights} Night{nights > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1.5"><Users size={12} className="text-catalogue-gold" /> Guest Occupancy</span>
                        <span className="text-slate-800 font-black font-sans">{bookingDetails.guests}</span>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="space-y-3 pt-4 border-t border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <div className="flex justify-between">
                        <span>Nightly Stay Fee ({nights} NTS)</span>
                        <span className="text-slate-800 font-black font-sans">{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cleaning Fee</span>
                        <span className="text-slate-800 font-black font-sans">{formatCurrency(cleaningFee)}</span>
                      </div>
                      <div className="flex justify-between pb-4 border-b border-slate-100">
                        <span>Service & Gst</span>
                        <span className="text-slate-800 font-black font-sans">{formatCurrency(serviceFee)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-sm font-black text-catalogue-green">Total Amount</span>
                        <span className="text-lg font-black text-catalogue-green font-sans">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleStartPayment}
                      disabled={isSubmitting}
                      className="w-full bg-catalogue-green hover:bg-catalogue-gold text-white font-black uppercase tracking-[0.25em] py-7 text-xs rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" /> Processing...
                        </span>
                      ) : (
                        `Pay ${formatCurrency(totalAmount)} & Confirm`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          
          /* Step 5: Booking Confirmation & Invoice Screen */
          <div className="space-y-8 animate-fade-in">
            
            {/* Top Bar Actions */}
            <div className="bg-white border border-catalogue-gold/20 rounded-2xl p-5 shadow-lg max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction Successful</p>
                <h4 className="text-md font-bold text-catalogue-green uppercase">Booking ID: {bookingId}</h4>
              </div>
              <div className="flex gap-4">
                <Button 
                  onClick={handleDownloadVoucher}
                  disabled={isSubmitting}
                  className="bg-catalogue-gold hover:bg-catalogue-green text-white font-bold uppercase tracking-widest text-[11px] px-6 py-5 rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 size={14} className="animate-spin mr-2" />
                  ) : (
                    <Download size={14} className="mr-2" />
                  )}
                  Download Voucher (PNG)
                </Button>
                <Button 
                  onClick={() => navigate('/')} 
                  variant="outline" 
                  className="border-slate-200 text-slate-700 hover:bg-slate-50 font-bold uppercase tracking-widest text-[11px] px-6 py-5 rounded-xl"
                >
                  Back to Portal
                </Button>
              </div>
            </div>

            {/* Downloadable / Printable Voucher Card Wrapper */}
            <div className="flex justify-center">
              <div 
                ref={receiptRef} 
                className="w-full max-w-4xl rounded-[2.5rem] shadow-2xl p-8 md:p-12 space-y-12 relative overflow-hidden"
                style={{ backgroundColor: hexColors.white, border: '8px double ' + hexColors.gold }}
              >
                
                {/* Background watermarks or designs */}
                <div data-html2canvas-ignore="true" className="absolute top-0 right-0 w-48 h-48 rounded-full filter blur-2xl pointer-events-none" style={{ backgroundColor: hexColors.goldLight }} />
                <div data-html2canvas-ignore="true" className="absolute bottom-0 left-0 w-64 h-64 rounded-full filter blur-3xl pointer-events-none" style={{ backgroundColor: hexColors.greenLight }} />

                {/* Banner & Header */}
                <div className="flex flex-col md:flex-row justify-between items-center pb-8 gap-6" style={{ borderBottom: '1px solid ' + hexColors.goldBorderSoft }}>
                  <div className="text-center md:text-left space-y-2">
                    <h2 className="font-playfair text-3xl font-black tracking-widest" style={{ color: hexColors.green }}>SUBRA RESIDENCY</h2>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: hexColors.slate400 }}>Stay Away from Home • Kumbakonam</p>
                    <p className="text-[11px] font-semibold leading-relaxed font-sans max-w-xs" style={{ color: hexColors.slate500 }}>
                      L.B.S Road, Near Railway Station, Kumbakonam, Tamil Nadu<br />
                      Ph: +91 73958 09991 | 73958 09992
                    </p>
                  </div>
                  <div className="text-center md:text-right space-y-2">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto md:ml-auto shadow-md" style={{ backgroundColor: hexColors.emerald50 }}>
                      <CheckCircle2 size={32} className="text-emerald-600" style={{ color: hexColors.emerald600 }} />
                    </div>
                    <span className="inline-block text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm" style={{ backgroundColor: hexColors.emerald100, color: hexColors.emerald800 }}>
                      Booking Confirmed
                    </span>
                    <p className="text-xs font-bold font-sans mt-1" style={{ color: hexColors.slate400 }}>Invoice Date: {activeBooking?.check_in_date || new Date().toISOString().split('T')[0]}</p>
                  </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  
                  {/* Column 1 & 2: Details and Invoice (Span 2) */}
                  <div className="md:col-span-2 space-y-8">
                    
                    {/* Invoice To section */}
                    <div className="text-left space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: hexColors.gold }}>Invoice Recipient</h4>
                      <p className="font-playfair text-xl font-black" style={{ color: hexColors.green }}>{activeBooking?.guest_name || bookingDetails.name}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-xs font-semibold font-sans" style={{ color: hexColors.slate500 }}>
                        <p className="flex items-center gap-2"><Mail size={12} /> {activeBooking?.guest_email || bookingDetails.email}</p>
                        <p className="flex items-center gap-2"><Phone size={12} /> {activeBooking?.guest_phone || bookingDetails.phone}</p>
                        <p className="flex items-center gap-2"><Globe size={12} /> {activeBooking?.country || bookingDetails.country}</p>
                        <p className="flex items-center gap-2"><MapPin size={12} /> {activeBooking?.address || bookingDetails.address}</p>
                      </div>
                    </div>

                    {/* Booking metadata */}
                    <div className="rounded-2xl p-6 grid grid-cols-2 gap-y-4 gap-x-6 text-xs text-left" style={{ backgroundColor: hexColors.slate50, border: '1px solid ' + hexColors.borderLight }}>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest block mb-0.5" style={{ color: hexColors.slate400 }}>Booking Identifier</span>
                        <span className="font-black font-sans" style={{ color: hexColors.green }}>{bookingId}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest block mb-0.5" style={{ color: hexColors.slate400 }}>Assigned Sanctuary</span>
                        <span className="font-black uppercase font-sans" style={{ color: hexColors.green }}>
                          {activeRoom.room_name || activeRoom.title || room.title || 'Luxury Room'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest block mb-0.5" style={{ color: hexColors.slate400 }}>Check-In Arrival</span>
                        <span className="font-bold font-sans" style={{ color: hexColors.slate700 }}>{activeBooking?.check_in_date || bookingDetails.checkIn}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest block mb-0.5" style={{ color: hexColors.slate400 }}>Check-Out Departure</span>
                        <span className="font-bold font-sans" style={{ color: hexColors.slate700 }}>{activeBooking?.check_out_date || bookingDetails.checkOut}</span>
                      </div>
                    </div>

                    {/* Invoice items table */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-left" style={{ color: hexColors.gold }}>Invoice Statement</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs font-semibold font-sans" style={{ color: hexColors.slate600 }}>
                          <thead>
                            <tr className="text-slate-400 font-bold uppercase tracking-wider text-[10px]" style={{ borderBottom: '1px solid ' + hexColors.borderDark, color: hexColors.slate400 }}>
                              <th className="pb-3 text-left">Description</th>
                              <th className="pb-3 text-center">Qty</th>
                              <th className="pb-3 text-right">Price</th>
                              <th className="pb-3 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{ borderBottom: '1px solid ' + hexColors.borderLight }}>
                              <td className="py-4 text-left">
                                <span className="font-bold uppercase" style={{ color: hexColors.slate800 }}>{activeRoom.room_name || activeRoom.title || room.title || 'Luxury Room'}</span><br />
                                <span className="text-[10px]" style={{ color: hexColors.slate400 }}>Accomodation staying for {nights} Night(s)</span>
                              </td>
                              <td className="py-4 text-center font-bold font-sans" style={{ color: hexColors.slate800 }}>1</td>
                              <td className="py-4 text-right font-bold font-sans" style={{ color: hexColors.slate800 }}>{formatCurrency(nightlyRate)}</td>
                              <td className="py-4 text-right font-bold font-sans" style={{ color: hexColors.slate800 }}>{formatCurrency(subtotal)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid ' + hexColors.borderLight }}>
                              <td className="py-3 text-left font-medium" style={{ color: hexColors.slate800 }}>Cleaning & Setup Service</td>
                              <td className="py-3 text-center" style={{ color: hexColors.slate600 }}>1</td>
                              <td className="py-3 text-right" style={{ color: hexColors.slate600 }}>{formatCurrency(cleaningFee)}</td>
                              <td className="py-3 text-right" style={{ color: hexColors.slate600 }}>{formatCurrency(cleaningFee)}</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid ' + hexColors.borderDark }}>
                              <td className="py-3 text-left font-medium" style={{ color: hexColors.slate800 }}>Hotel Service & Gst</td>
                              <td className="py-3 text-center" style={{ color: hexColors.slate600 }}>1</td>
                              <td className="py-3 text-right" style={{ color: hexColors.slate600 }}>{formatCurrency(serviceFee)}</td>
                              <td className="py-3 text-right" style={{ color: hexColors.slate600 }}>{formatCurrency(serviceFee)}</td>
                            </tr>
                            <tr>
                              <td colSpan={2} />
                              <td className="py-4 text-right font-bold uppercase text-[10px]" style={{ color: hexColors.slate400 }}>Grand Total</td>
                              <td className="py-4 text-right font-black text-sm font-sans" style={{ color: hexColors.green }}>
                                {formatCurrency(activeBooking?.paid_amount || activeBooking?.total_amount || totalAmount)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Check-in QR Code Card (Span 1) */}
                  <div className="md:col-span-1 space-y-6 flex flex-col justify-between pt-8 md:pt-0 md:pl-8" style={{ borderTop: '1px solid ' + hexColors.goldBorderSoft, borderLeft: '1px solid ' + hexColors.goldBorderSoft }}>
                    
                    <div className="space-y-6 text-center">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: hexColors.gold }}>Reception QR</h4>
                      
                      <div className="p-4 shadow-md inline-block rounded-2xl relative overflow-hidden group" style={{ backgroundColor: hexColors.white, border: '1px solid ' + hexColors.goldBorderSoft }}>
                        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: hexColors.gold }} />
                        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2" style={{ borderColor: hexColors.gold }} />
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2" style={{ borderColor: hexColors.gold }} />
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: hexColors.gold }} />
                        
                        <div className="w-40 h-40 mx-auto rounded-lg flex items-center justify-center overflow-hidden">
                          {qrDataUrl ? (
                            <img 
                              src={qrDataUrl} 
                              alt={`QR Code for booking ${bookingId}`} 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <QrCode size={100} style={{ color: hexColors.slate400 }} />
                          )}
                        </div>
                      </div>
                      
                      <p className="text-[10px] font-semibold leading-relaxed font-sans max-w-[180px] mx-auto uppercase tracking-wide" style={{ color: hexColors.slate500 }}>
                        Please present this QR code at hotel front desk for an instant check-in.
                      </p>
                    </div>

                    {/* Paid Stamp */}
                    <div className="p-4 rounded-xl text-center rotate-[-3deg] shadow-sm select-none" style={{ border: '2px dashed ' + hexColors.emeraldBorder, backgroundColor: hexColors.emeraldBg }}>
                      <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: hexColors.emerald600 }}>Secure Payment Status</p>
                      <h4 className="text-lg font-black tracking-widest uppercase font-playfair flex items-center justify-center gap-1.5" style={{ color: hexColors.emerald700 }}>
                        <CheckCircle2 size={16} /> PAID
                      </h4>
                      {activeBooking?.transaction_id && (
                        <p className="text-[8px] uppercase font-sans tracking-wide mt-1 truncate" style={{ color: hexColors.slate400 }}>Txn ID: {activeBooking.transaction_id}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="pt-6 text-[10px] font-bold uppercase tracking-wider text-center flex flex-col sm:flex-row justify-between gap-4 font-sans" style={{ borderTop: '1px solid ' + hexColors.borderLight, color: hexColors.slate400 }}>
                  <span>Authorized Subra Residency Digital Invoice</span>
                  <span>System Timestamp: {activeBooking?.created_at || new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
