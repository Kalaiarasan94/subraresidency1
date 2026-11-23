import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, ShieldCheck, Clock, Users, BedDouble, Maximize2, Sparkles, CreditCard, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { fadeInUp, staggerContainer } from './animations';
import { OrnateDivider } from './OrnateDivider';
import { SectionWrapper, DecorativeLayout } from './Layout';
import { fetchRoomCategories } from '../../../lib/api';
import { ROOMS_DATA } from './data';

interface RoomPricingPageProps {
  onBookRoom: (room: any) => void;
  onRoomClick: (room: any) => void;
}

export const RoomPricingPage = ({ onBookRoom, onRoomClick }: RoomPricingPageProps) => {
  const [categories, setCategories] = useState<any[]>(ROOMS_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Room Tariffs & Transparent Pricing | Subra Residency Kumbakonam";
    window.scrollTo(0, 0);

    const loadData = async () => {
      try {
        const data = await fetchRoomCategories();
        if (data && Array.isArray(data) && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(ROOMS_DATA);
        }
      } catch (err) {
        console.error('Failed to load room categories', err);
        setCategories(ROOMS_DATA);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const formatPrice = (val: any) => {
    if (!val) return '₹1,600';
    if (typeof val === 'string' && val.includes('₹')) return val;
    const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return '₹1,600';
    return `₹${Math.round(num).toLocaleString('en-IN')}`;
  };

  const getNumericRate = (room: any): number => {
    const raw = room.price_24h ?? room.base_price_24h ?? room.base_price ?? room.price;
    if (typeof raw === 'number') return raw;
    const num = parseFloat(String(raw || '1600').replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 1600 : Math.round(num);
  };

  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-20">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 max-w-4xl mx-auto">
          <Badge className="bg-catalogue-gold/15 text-catalogue-green border border-catalogue-gold/30 font-bold uppercase tracking-[0.3em] px-4 py-1 text-[10px]">
            Direct Booking Transparency
          </Badge>
          <h1 className="font-playfair text-4xl md:text-6xl metal-emerald font-black uppercase tracking-tight">
            Room Tariffs & Pricing
          </h1>
          <p className="font-playfair text-lg md:text-xl metal-gold italic font-bold">
            Guaranteed best rates with zero hidden charges and flexible 24-hour stay policy
          </p>
          <div className="flex justify-center pt-2">
            <OrnateDivider className="w-32" />
          </div>
          <p className="text-xs md:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            All prices listed below represent our direct official tariffs. Payments are securely processed via Razorpay with instant digital booking voucher generation.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 md:mb-24"
        >
          {categories.map((room, idx) => {
            const priceStr = formatPrice(room.price || room.price_24h || room.base_price);
            const numRate = getNumericRate(room);
            const isSuite = idx === 2 || String(room.title).toLowerCase().includes('suite');
            const isSuperDeluxe = idx === 1 || String(room.title).toLowerCase().includes('super');

            return (
              <motion.div key={room.id || idx} variants={fadeInUp} className="flex">
                <Card className={`lux-card w-full overflow-hidden flex flex-col justify-between ${isSuperDeluxe ? 'lux-card-featured' : ''}`}>
                  <div>
                    {/* Top Tag */}
                    <div className="lux-card-media aspect-[16/10]">
                      <img 
                        src={room.image || room.featured_image || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80'} 
                        alt={room.title || room.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Badge className={`${isSuperDeluxe ? 'bg-catalogue-gold text-white' : 'bg-white/95 text-catalogue-green'} font-black uppercase tracking-widest text-[9px] px-3 py-1 shadow-sm`}>
                          {room.category_tag || room.tag || (isSuperDeluxe ? 'Most Popular' : isSuite ? 'Spacious Living' : 'Best Value')}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-6 right-6 text-white">
                        <h3 className="metal-gold-bright font-playfair text-xl md:text-2xl font-bold uppercase tracking-wide truncate">
                          {room.title || room.name}
                        </h3>
                        <p className="text-[11px] text-white/80 font-medium">
                          {room.bed_type || (isSuite ? 'Two King Beds' : 'King Bed')} • {room.size || (isSuite ? '550' : isSuperDeluxe ? '420' : '320')} sq.ft
                        </p>
                      </div>
                    </div>

                    <CardContent className="p-6 md:p-8 space-y-6">
                      {/* Price Section */}
                      <div className="border-b border-slate-100 pb-6">
                        <div className="flex items-baseline gap-2">
                          <span className="font-sans font-black text-3xl md:text-4xl text-catalogue-green tabular-nums">
                            {priceStr}
                          </span>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            / 24 Hours
                          </span>
                        </div>
                        <p className="text-[11px] text-catalogue-gold font-bold mt-1">
                          24-Hour Stay Policy for Direct Bookings
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Taxes & fees calculated transparently at checkout
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-2 gap-3 py-1 text-xs text-slate-700">
                        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl">
                          <Users size={14} className="text-catalogue-gold shrink-0" />
                          <span className="font-semibold text-[11px] truncate">{room.max_guests || room.adults || 2} Guests Allowed</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl">
                          <BedDouble size={14} className="text-catalogue-gold shrink-0" />
                          <span className="font-semibold text-[11px] truncate">{room.bed_type || 'King Size'}</span>
                        </div>
                      </div>

                      {/* Features Included */}
                      <div className="space-y-3">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                          Included Facilities
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-700 font-medium">
                          <li className="flex items-center gap-2">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>Air Conditioning (Climate Control)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>High-Definition LED Smart TV</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>Complimentary High-Speed Wi-Fi</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>24-Hour Hot & Cold Water Supply</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>Daily Housekeeping & Linen Change</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>24/7 Power Backup (Generator Support)</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check size={14} className="text-emerald-600 shrink-0" />
                            <span>Pure RO Drinking Water</span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </div>

                  {/* Actions */}
                  <div className="p-6 md:p-8 pt-0 space-y-2">
                    <Button
                      onClick={() => onBookRoom(room)}
                      className={`w-full font-black uppercase tracking-[0.2em] py-6 rounded-xl transition-all text-xs shadow-md ${
                        isSuperDeluxe
                          ? 'bg-catalogue-gold hover:bg-catalogue-green text-white'
                          : 'bg-catalogue-green hover:bg-catalogue-gold text-white'
                      }`}
                    >
                      Book Sanctuary
                    </Button>
                    <button
                      type="button"
                      onClick={() => onRoomClick(room)}
                      className="w-full text-center text-[11px] font-bold text-slate-500 hover:text-catalogue-gold uppercase tracking-wider py-1.5 transition-colors"
                    >
                      View Full Details & Photos &rarr;
                    </button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Detailed Comparison Table */}
        <div className="lux-panel overflow-hidden mb-16 md:mb-24 p-6 md:p-10">
          <div className="text-center mb-8">
            <h2 className="font-playfair text-2xl md:text-3xl font-bold metal-emerald uppercase">
              Complete Category Comparison
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the ideal room for your temple pilgrimage or family holiday
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-100 bg-slate-50/70 text-catalogue-green font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6">Room Feature</th>
                  <th className="p-4 text-center">Deluxe Room</th>
                  <th className="p-4 text-center bg-catalogue-gold/10 text-catalogue-gold font-black">Super Deluxe</th>
                  <th className="p-4 text-center">Executive Suite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-4 pl-6 font-semibold">Standard Tariff (24 Hours)</td>
                  <td className="p-4 text-center font-black text-slate-900 font-sans">₹1,600</td>
                  <td className="p-4 text-center font-black text-catalogue-gold font-sans bg-catalogue-gold/5">₹2,600</td>
                  <td className="p-4 text-center font-black text-slate-900 font-sans">₹3,600</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-semibold">Base Adult Occupancy</td>
                  <td className="p-4 text-center">2 Adults</td>
                  <td className="p-4 text-center bg-catalogue-gold/5 font-bold">3 Adults</td>
                  <td className="p-4 text-center font-bold">4 Adults</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-semibold">Room Layout & Configuration</td>
                  <td className="p-4 text-center">Spacious Bedroom</td>
                  <td className="p-4 text-center bg-catalogue-gold/5 font-semibold">1-BHK Family Suite + Balcony</td>
                  <td className="p-4 text-center font-semibold">2-BHK Executive Apartment</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-semibold">Private Balcony</td>
                  <td className="p-4 text-center text-slate-300">—</td>
                  <td className="p-4 text-center bg-catalogue-gold/5 text-emerald-600 font-bold">✓ Included</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ Included</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-semibold">Living & Seating Area</td>
                  <td className="p-4 text-center">Compact Seating</td>
                  <td className="p-4 text-center bg-catalogue-gold/5">Integrated Living Room</td>
                  <td className="p-4 text-center">Full Living Hall + Sofa Set</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-semibold">Air Conditioning & Geyser</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ Yes</td>
                  <td className="p-4 text-center bg-catalogue-gold/5 text-emerald-600 font-bold">✓ Yes</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ Yes (Dual AC)</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-semibold">Elevator / Lift Access</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ All Floors</td>
                  <td className="p-4 text-center bg-catalogue-gold/5 text-emerald-600 font-bold">✓ All Floors</td>
                  <td className="p-4 text-center text-emerald-600 font-bold">✓ All Floors</td>
                </tr>
                <tr>
                  <td className="p-4 pl-6 font-semibold">Check-In Duration Policy</td>
                  <td className="p-4 text-center" colSpan={3}>
                    <span className="font-bold text-catalogue-green">24 Hours from Check-In Time</span> (Direct Online & Front Desk Bookings)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Policies & Transparency Notice */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 md:mb-24">
          <div className="lux-card p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3 text-catalogue-green">
              <ShieldCheck size={22} className="text-catalogue-gold" />
              <h3 className="metal-emerald font-playfair text-xl font-bold uppercase">Taxes & Fee Disclosures</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed list-disc pl-5">
              <li><strong>GST & Statutory Levies:</strong> Applicable Goods & Services Tax (GST) is computed transparently in accordance with current Indian hotel accommodation tax slabs.</li>
              <li><strong>Cleaning & Sanitization:</strong> A standardized hotel cleaning and deep-sanitization charge of ₹500 is applied per reservation.</li>
              <li><strong>Platform & Service Handling:</strong> A nominal convenience service charge of ₹850 covers digital gateway processing and instant guest assistance.</li>
              <li><strong>Transparent Checkout:</strong> The entire payable sum is shown clearly before you proceed to payment. No sudden additions at reception.</li>
            </ul>
          </div>

          <div className="lux-card p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-3 text-catalogue-green">
              <Clock size={22} className="text-catalogue-gold" />
              <h3 className="metal-emerald font-playfair text-xl font-bold uppercase">Stay & Booking Conditions</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed list-disc pl-5">
              <li><strong>Standard Check-In:</strong> 12:00 PM | <strong>Standard Check-Out:</strong> 11:00 AM.</li>
              <li><strong>24-Hour Privilege:</strong> Direct online bookings enjoy our full 24-hour checkout calculation from your actual check-in time.</li>
              <li><strong>Government Photo ID:</strong> Every adult guest must present an original valid Government Photo ID (Aadhaar, Passport, Voter ID, or Driving Licence) at reception.</li>
              <li><strong>Extra Bed Policy:</strong> Rollaway extra beds are available upon request for additional guests at ₹500/night.</li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6 mb-16">
          <div className="text-center space-y-2">
            <h3 className="font-playfair text-2xl font-bold metal-emerald uppercase">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500">
              Clear answers to common questions about tariffs and reservations
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="lux-card p-5 space-y-1.5">
              <h4 className="font-bold metal-emerald text-sm metal-flat">
                Is upfront payment mandatory to confirm a room?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Yes, paying online through our secure Razorpay gateway guarantees your room reservation and locks in your 24-hour stay benefit. Your booking ID and digital receipt are generated immediately.
              </p>
            </div>

            <div className="lux-card p-5 space-y-1.5">
              <h4 className="font-bold metal-emerald text-sm metal-flat">
                What payment modes does the Razorpay gateway accept?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Razorpay supports all major Indian payment options: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, MasterCard, RuPay), and Netbanking across 50+ Indian banks.
              </p>
            </div>

            <div className="lux-card p-5 space-y-1.5">
              <h4 className="font-bold metal-emerald text-sm metal-flat">
                What is your cancellation policy?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Cancellations made 48 hours or more prior to the scheduled check-in time receive a 100% refund. Please view our dedicated <a href="/cancellation-refund" className="text-catalogue-gold font-bold underline">Cancellation & Refund Policy</a> page for comprehensive terms.
              </p>
            </div>
          </div>
        </div>

        {/* Direct CTA */}
        <div className="lux-panel-dark bg-catalogue-green p-8 md:p-12 text-center text-white space-y-6">
          <h3 className="metal-gold-bright font-playfair text-2xl md:text-4xl font-bold tracking-wide">
            Plan Your Spiritual Journey to Kumbakonam
          </h3>
          <p className="text-xs md:text-sm text-catalogue-cream/90 max-w-xl mx-auto leading-relaxed">
            Reserve your air-conditioned room at Subra Residency just 300 meters from Kumbakonam Railway Station.
          </p>
          <div className="pt-2">
            <Button
              onClick={() => categories.length > 0 && onBookRoom(categories[0])}
              className="bg-catalogue-gold hover:bg-white hover:text-catalogue-green text-white font-black uppercase tracking-[0.25em] text-xs px-10 py-6 rounded-none shadow-xl transition-all"
            >
              Book Room Now
            </Button>
          </div>
        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};

