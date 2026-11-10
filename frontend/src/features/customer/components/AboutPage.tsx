import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, QrCode, Info, Car, ShieldCheck, Check, Sparkles, Building2, Wind, Wifi, Coffee, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent } from '../../../components/ui/card';
import { fadeInUp, fadeInLeft, fadeInRight } from './animations';
import { ATTRACTIONS_DATA, TEMPLE_DETAILS_DATA } from './data';
import { logo, locationMapImg, hotelBuildingImg, diningImg, hallImg } from './assets';
import { OrnateDivider } from './OrnateDivider';
import { SectionWrapper, DecorativeLayout } from './Layout';
import { API_BASE_URL } from '../../../lib/api';

export const AboutPage = ({ onSelectTemple }: { onSelectTemple: (temple: any) => void }) => {
  const [selectedLocation, setSelectedLocation] = useState('Kumbakonam Railway Station');
  const [temples, setTemples] = useState<any[]>([]);
  const [templeSectionDesc, setTempleSectionDesc] = useState(
    "Kumbakonam is surrounded by some of Tamil Nadu's most revered temples, sacred tanks and spiritual landmarks. Guests staying at Subra Residency can easily plan temple visits from the property, as many important temples are located within a short travel distance. Discover the rich spiritual heritage of the region through these iconic destinations."
  );

  useEffect(() => {
    document.title = "About Us | Subra Residency Kumbakonam";
    window.scrollTo(0, 0);

    const fetchTemples = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/attractions/list`);
        const json = await response.json();
        if (json.status === 'success' && Array.isArray(json.attractions)) {
          setTemples(json.attractions);
        } else {
          setTemples(TEMPLE_DETAILS_DATA);
        }
      } catch (err) {
        console.error(err);
        setTemples(TEMPLE_DETAILS_DATA);
      }
    };

    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings`);
        const json = await response.json();
        if (json && json.temple_section_desc) {
          setTempleSectionDesc(json.temple_section_desc);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchTemples();
    fetchSettings();
  }, []);

  const findDistance = (name: string) => {
    if (name === 'Kumbakonam Railway Station') return '300 meters';
    if (name === 'Kumbakonam Bus Stand') return '700 meters';
    const attr = ATTRACTIONS_DATA.find(a => a.title === name);
    return attr?.dist || '';
  };

  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-20">
        {/* Header Introduction */}
        <div className="text-center mb-16 space-y-4 max-w-4xl mx-auto">
          <Badge className="bg-catalogue-gold/15 text-catalogue-green border border-catalogue-gold/30 font-bold uppercase tracking-[0.3em] px-4 py-1 text-[10px]">
            Hospitality Heritage
          </Badge>
          <h1 className="font-playfair text-4xl md:text-6xl text-catalogue-green font-black uppercase tracking-tight">
            About Subra Residency
          </h1>
          <p className="font-playfair text-xl md:text-2xl text-catalogue-gold italic font-bold">
            &quot;Home, Away from Home&quot; in the Sacred Temple City of Kumbakonam
          </p>
          <div className="flex justify-center pt-2">
            <OrnateDivider className="w-32" />
          </div>
          <p className="font-playfair text-base md:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed font-semibold">
            Situated at 45, L.B.S Road, just 300 meters from Kumbakonam Railway Station, Subra Residency welcomes temple pilgrims, family holidaymakers, and business travelers with warm Tamil hospitality, spotlessly clean accommodations, and modern amenities.
          </p>
        </div>

        {/* Hotel Overview & Photographic Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-24">
          <div className="lg:col-span-6 space-y-6 text-xs md:text-sm text-slate-700 leading-relaxed">
            <div className="space-y-3">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-catalogue-green uppercase">
                A Tranquil Haven for Pilgrims & Families
              </h2>
              <div className="w-20 h-1 bg-catalogue-gold" />
            </div>

            <p>
              Kumbakonam, known as the &quot;City of Temples&quot; and the heart of the Cauvery delta, attracts millions of devotees throughout the year. Established with a vision to provide serene, safe, and hygienic accommodations, <strong>Subra Residency</strong> has been designed from the ground up to cater to the spiritual traveler&apos;s every requirement.
            </p>

            <p>
              Whether you are embarking on the sacred <strong>Navagraha Pilgrimage Circuit</strong>, witnessing the divine architectural marvels of the Great Living Chola Temples, or visiting for a traditional family event, our property offers peaceful rest with air-conditioned comfort, high-speed Wi-Fi, and 24-hour hot water.
            </p>

            <div className="p-4 bg-card-ivory rounded-2xl border border-catalogue-gold/30 space-y-2">
              <h4 className="font-bold text-catalogue-green uppercase text-xs">
                Our Signature 24-Hour Stay Privilege
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Unlike traditional hotels that enforce strict rigid morning checkouts regardless of when you arrived, direct online guests at Subra Residency enjoy our <strong>24-hour checkout calculation</strong> from their actual check-in time, making temple darshan schedules completely stress-free.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-catalogue-gold/20 aspect-[4/5]">
                <img src={hotelBuildingImg} alt="Subra Residency Property Exterior" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 text-center shadow-xs">
                <p className="font-bold text-catalogue-green text-xs">Prime Property</p>
                <p className="text-[10px] text-slate-500">45, L.B.S Road, Kumbakonam</p>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-catalogue-gold/20 aspect-[4/5]">
                <img src={hallImg} alt="Lobby & Reception Hall" className="w-full h-full object-cover" />
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-100 text-center shadow-xs">
                <p className="font-bold text-catalogue-green text-xs">Reception & Lounge</p>
                <p className="text-[10px] text-slate-500">24/7 Front Desk Assistance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accommodation Facilities & Services Grid */}
        <div className="bg-card-ivory/70 rounded-3xl border border-catalogue-gold/25 p-8 md:p-14 mb-24 ornate-border shadow-xl">
          <div className="text-center mb-12 space-y-3">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-catalogue-green uppercase">
              Hospitality Facilities & Amenities
            </h2>
            <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto">
              Everything you need for a restful, spiritual, and comfortable stay in Kumbakonam
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-catalogue-gold/15 text-catalogue-gold flex items-center justify-center">
                <Wind size={20} />
              </div>
              <h3 className="font-playfair font-bold text-base text-catalogue-green">Full Air Conditioning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Individually controlled, energy-efficient air conditioning in every room for pleasant indoor climate.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-catalogue-gold/15 text-catalogue-gold flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <h3 className="font-playfair font-bold text-base text-catalogue-green">Elevator / Lift Access</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Modern passenger elevator servicing all accommodation floors, ensuring ease of access for senior citizen pilgrims.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-catalogue-gold/15 text-catalogue-gold flex items-center justify-center">
                <Clock size={20} />
              </div>
              <h3 className="font-playfair font-bold text-base text-catalogue-green">24/7 Power Backup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Heavy-duty silent diesel generator ensures uninterrupted lighting, fans, and elevators round the clock.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-catalogue-gold/15 text-catalogue-gold flex items-center justify-center">
                <Wifi size={20} />
              </div>
              <h3 className="font-playfair font-bold text-base text-catalogue-green">High-Speed Wi-Fi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complimentary optical fiber internet connection across all guest rooms and public reception lounges.
              </p>
            </div>
          </div>
        </div>

        {/* Accommodation Categories Summary */}
        <div className="mb-24 space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-catalogue-green uppercase">
              Our Room Categories
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Thoughtfully configured room types to match single travelers, couples, and extended families
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="rounded-3xl border border-slate-200 bg-white shadow-md p-6 space-y-4">
              <Badge className="bg-slate-100 text-slate-700 font-bold uppercase text-[9px]">Deluxe Room</Badge>
              <h3 className="font-playfair text-xl font-bold text-catalogue-green">Deluxe Room</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Intimate and elegantly furnished room with king bed, attached bathroom with 24-hr geyser, and LED TV.
              </p>
              <div className="text-sm font-black text-catalogue-gold font-sans">
                ₹1,600 <span className="text-[10px] text-slate-400 font-normal">/ 24 hrs</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Ideal for: 2 Adults</p>
            </Card>

            <Card className="rounded-3xl border border-catalogue-gold bg-white shadow-lg p-6 space-y-4 ring-1 ring-catalogue-gold/20">
              <Badge className="bg-catalogue-gold text-white font-bold uppercase text-[9px]">Super Deluxe</Badge>
              <h3 className="font-playfair text-xl font-bold text-catalogue-green">Executive 1-BHK Suite</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generous family suite with separate living area, private open-air balcony, and superior furnishings.
              </p>
              <div className="text-sm font-black text-catalogue-gold font-sans">
                ₹2,600 <span className="text-[10px] text-slate-400 font-normal">/ 24 hrs</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Ideal for: 3 Adults / Family with Kids</p>
            </Card>

            <Card className="rounded-3xl border border-slate-200 bg-white shadow-md p-6 space-y-4">
              <Badge className="bg-slate-100 text-slate-700 font-bold uppercase text-[9px]">Suite Apartment</Badge>
              <h3 className="font-playfair text-xl font-bold text-catalogue-green">Executive 2-BHK Apartment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Expansive two-bedroom apartment layout with dedicated master suites, spacious hall, and dual air conditioning.
              </p>
              <div className="text-sm font-black text-catalogue-gold font-sans">
                ₹3,600 <span className="text-[10px] text-slate-400 font-normal">/ 24 hrs</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Ideal for: 4 Adults / Joint Families</p>
            </Card>
          </div>

          <div className="text-center pt-2">
            <Link to="/pricing">
              <Button className="bg-catalogue-green hover:bg-catalogue-gold text-white font-bold uppercase tracking-widest text-xs px-8 py-5 rounded-none shadow-md">
                View Full Pricing & Tariffs &rarr;
              </Button>
            </Link>
          </div>
        </div>

        {/* Existing Interactive Transport & Temple Trail Section */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black max-w-3xl mx-auto leading-tight">
            PRIME LOCATION & TRAVEL PROXIMITIES
          </h2>
          <p className="font-playfair text-lg md:text-xl text-catalogue-gold italic font-bold">
            Stay in the heart of Kumbakonam – close to temples and transport.
          </p>
          <OrnateDivider className="my-6" />
        </div>

        {/* Map Visualization */}
        <motion.div variants={fadeInUp} className="relative aspect-[3/2] w-full max-w-5xl mx-auto bg-card-ivory rounded-none border border-catalogue-gold/20 flex flex-col items-center justify-center mb-20 overflow-hidden shadow-2xl ornate-shape ornate-border">
          <div className="relative w-full h-full p-2 md:p-3">
            <img src={locationMapImg} alt="Location Map" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* 3 Columns: Transport Points / Live Map / Spiritual Trail */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.4fr_0.8fr] gap-8 items-start border-t border-catalogue-gold/20 pt-16 mb-24 bg-card-ivory p-6 md:p-8 ornate-shape ornate-border shadow-xl">
          {/* Transport Points */}
          <motion.div variants={fadeInLeft} className="space-y-10">
            <div className="flex items-center gap-3 text-catalogue-green border-b border-catalogue-gold/20 pb-5">
              <QrCode size={24} className="text-catalogue-gold" />
              <h3 className="font-playfair text-2xl font-bold uppercase tracking-widest leading-none">Transport <br/>Points</h3>
            </div>
            <table className="w-full text-left font-playfair">
              <thead>
                <tr className="text-[10px] text-catalogue-gold font-bold uppercase tracking-[0.2em] border-b border-catalogue-gold/20">
                  <th className="pb-4">Place</th>
                  <th className="pb-4">Distance</th>
                  <th className="pb-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="text-catalogue-green font-bold">
                <tr className="border-b border-catalogue-gold/10 group/row">
                  <td className="py-8 text-base">Railway Station</td>
                  <td className="text-xs font-semibold tracking-wide">300M</td>
                  <td className="text-center">
                    <button 
                      onClick={() => setSelectedLocation('Kumbakonam Railway Station')}
                      className={cn(
                        "px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 border rounded-full flex items-center gap-2 mx-auto",
                        selectedLocation === 'Kumbakonam Railway Station' 
                          ? "bg-catalogue-gold text-white border-catalogue-gold shadow-md" 
                          : "bg-transparent text-catalogue-gold border-catalogue-gold/40 hover:bg-catalogue-gold/10 hover:border-catalogue-gold"
                      )}
                    >
                      <MapPin size={12} className={selectedLocation === 'Kumbakonam Railway Station' ? "text-white" : "text-catalogue-gold"} />
                      VIEW
                    </button>
                  </td>
                </tr>
                <tr className="group/row">
                  <td className="py-8 text-base">Bus Stand</td>
                  <td className="text-xs font-semibold tracking-wide">700M</td>
                  <td className="text-center">
                    <button 
                      onClick={() => setSelectedLocation('Kumbakonam Bus Stand')}
                      className={cn(
                        "px-4 py-2 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 border rounded-full flex items-center gap-2 mx-auto",
                        selectedLocation === 'Kumbakonam Bus Stand' 
                          ? "bg-catalogue-gold text-white border-catalogue-gold shadow-md" 
                          : "bg-transparent text-catalogue-gold border-catalogue-gold/40 hover:bg-catalogue-gold/10 hover:border-catalogue-gold"
                      )}
                    >
                      <MapPin size={12} className={selectedLocation === 'Kumbakonam Bus Stand' ? "text-white" : "text-catalogue-gold"} />
                      VIEW
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>

          {/* Map View Column */}
          <motion.div variants={fadeInUp} className="space-y-10 lg:mt-0">
            <div className="flex items-center gap-3 text-catalogue-green border-b border-catalogue-gold/20 pb-5">
              <MapPin size={24} className="text-catalogue-gold" />
              <h3 className="font-playfair text-2xl font-bold uppercase tracking-widest leading-none">Map <br/>View</h3>
            </div>
            <div className="aspect-square w-full bg-white border border-catalogue-gold/20 shadow-2xl relative overflow-hidden group ornate-border">
              <iframe
                title="Location Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=Subra+Residency+Kumbakonam+to+${selectedLocation}&output=embed`}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-catalogue-green/95 backdrop-blur-sm p-5 border-t border-catalogue-gold/30 text-white shadow-2xl">
                 <div className="flex justify-between items-center mb-3">
                   <div className="space-y-0.5">
                     <p className="text-[9px] uppercase font-bold text-catalogue-gold tracking-[0.2em]">Current Destination</p>
                     <p className="font-playfair text-lg font-bold leading-tight">{selectedLocation}</p>
                   </div>
                   <div className="text-right space-y-0.5">
                     <p className="text-[9px] uppercase font-bold text-catalogue-gold tracking-[0.2em]">Distance</p>
                     <p className="font-playfair text-lg font-bold text-white">{findDistance(selectedLocation)}</p>
                   </div>
                 </div>
                 <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-[9px] font-bold text-catalogue-gold tracking-widest uppercase">
                    <Info size={12} className="text-catalogue-gold" />
                    <span>Route from Subra Residency</span>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Spiritual Trail */}
          <motion.div variants={fadeInRight} className="space-y-10">
            <div className="flex items-center gap-3 text-catalogue-green border-b border-catalogue-gold/20 pb-5">
              <MapPin size={24} className="text-catalogue-gold" />
              <h3 className="font-playfair text-2xl font-bold uppercase tracking-widest leading-none">Spiritual <br/>Trail</h3>
            </div>
            <div className="grid grid-cols-1 gap-0">
               <div className="flex text-[10px] text-catalogue-gold font-bold uppercase tracking-[0.2em] border-b border-catalogue-gold/20 pb-4 mb-2">
                 <div className="flex-1">Place</div>
                 <div className="w-20">Dist.</div>
                 <div className="w-20 text-center">Action</div>
               </div>
               <div className="max-h-[550px] overflow-y-auto pr-3 custom-scrollbar space-y-1">
                {ATTRACTIONS_DATA.map((attr, i) => (
                  <div key={i} className="flex items-center py-6 border-b border-catalogue-gold/10 text-catalogue-green font-bold hover:bg-catalogue-gold/5 transition-colors px-1">
                    <div className="flex-1 text-[13px] font-playfair tracking-wide pr-3 leading-tight">{attr.title}</div>
                    <div className="w-20 text-[10px] font-semibold tracking-wider text-catalogue-green/70">{attr.dist.toUpperCase()}</div>
                    <div className="w-20 text-center">
                      <button 
                        onClick={() => setSelectedLocation(attr.title)}
                        className={cn(
                          "px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold transition-all duration-300 border rounded-full flex items-center gap-1.5 mx-auto",
                          selectedLocation === attr.title 
                            ? "bg-catalogue-gold text-white border-catalogue-gold shadow-sm" 
                            : "bg-transparent text-catalogue-gold border-catalogue-gold/40 hover:bg-catalogue-gold/10 hover:border-catalogue-gold"
                        )}
                      >
                        <MapPin size={10} className={selectedLocation === attr.title ? "text-white" : "text-catalogue-gold"} />
                        VIEW
                      </button>
                    </div>
                  </div>
                ))}
               </div>
            </div>
          </motion.div>
        </div>

        {/* Temple Details Near Subra Residency */}
        <div className="space-y-16 py-12 border-t border-catalogue-gold/20">
          <div className="text-center space-y-4">
            <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight">
              TEMPLE DETAILS NEAR SUBRA RESIDENCY
            </h2>
            <p className="font-playfair text-xl text-catalogue-gold italic font-bold">
              Explore the Sacred Trail Around Kumbakonam
            </p>
            <p className="font-playfair text-base md:text-lg text-catalogue-green max-w-4xl mx-auto leading-relaxed font-semibold">
              {templeSectionDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {temples.map((temple, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp} 
                whileHover={{ y: -6, scale: 1.01 }} 
                onClick={() => onSelectTemple(temple)}
                className="animated-card bg-card-ivory p-8 border border-catalogue-gold/10 flex flex-col h-full ornate-shape ornate-border shadow-lg group cursor-pointer"
              >
                <div className="space-y-6 flex-grow">
                   <h4 className="font-playfair text-2xl font-black text-catalogue-green leading-tight group-hover:text-catalogue-gold transition-colors">{temple.name}</h4>
                   
                   <div className="space-y-3">
                     <div className="flex items-center gap-3 text-sm">
                       <MapPin size={16} className="text-catalogue-gold shrink-0" />
                       <span className="text-catalogue-green font-bold">{temple.dist}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm">
                       <Car size={16} className="text-catalogue-gold shrink-0" />
                       <span className="text-catalogue-green/80 font-semibold">Mode: {temple.mode}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm">
                       <Clock size={16} className="text-catalogue-gold shrink-0" />
                       <span className="text-catalogue-green/80 font-semibold">Timing: {temple.timing}</span>
                     </div>
                   </div>

                   <div className="pt-4 border-t border-catalogue-gold/10">
                     <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest mb-1">Special For</p>
                     <p className="text-sm text-catalogue-green font-bold italic leading-relaxed">{temple.specialFor}</p>
                   </div>

                   <p className="text-sm text-catalogue-green/70 leading-relaxed font-medium line-clamp-3">
                     {temple.desc}
                   </p>

                   <div className="mt-4 pt-4 border-t border-catalogue-gold/5 flex justify-end">
                      <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform">Click to View Map & Info →</p>
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
