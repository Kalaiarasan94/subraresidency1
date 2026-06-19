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
import { AvailabilityBar } from './AvailabilityBar';
import { OrnateDivider } from './OrnateDivider';
import { SectionWrapper, DecorativeLayout } from './Layout';
import { HeroSky } from './HeroSky';
export const AboutPage = ({ onSelectTemple }: { onSelectTemple: (temple: any) => void }) => {
  const [selectedLocation, setSelectedLocation] = useState('Kumbakonam Railway Station');

  const findDistance = (name: string) => {
    if (name === 'Kumbakonam Railway Station') return '300 meters';
    if (name === 'Kumbakonam Bus Stand') return '700 meters';
    const attr = ATTRACTIONS_DATA.find(a => a.title === name);
    return attr?.dist || '';
  };

  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-20">
        <div className="text-center mb-16 space-y-6">
          <h1 className="font-playfair text-4xl md:text-6xl text-catalogue-green font-black max-w-3xl mx-auto leading-tight">WHY CHOOSE SUBRA?</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.4fr_0.8fr] gap-8 items-start border-t border-catalogue-gold/20 pt-16 mb-32 bg-card-ivory p-6 md:p-8 ornate-shape ornate-border shadow-xl">
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
              ></iframe>
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
        <div className="space-y-16 py-20 border-t border-catalogue-gold/20">
          <div className="text-center space-y-6">
            <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight">TEMPLE DETAILS NEAR SUBRA RESIDENCY</h2>
            <p className="font-playfair text-xl text-catalogue-gold italic font-bold">Explore the Sacred Trail Around Kumbakonam</p>
            <p className="font-playfair text-lg text-catalogue-green max-w-4xl mx-auto leading-relaxed font-semibold">
              Kumbakonam is surrounded by some of Tamil Nadu's most revered temples, sacred tanks and spiritual landmarks. Guests staying at Subra Residency can easily plan temple visits from the property, as many important temples are located within a short travel distance. Discover the rich spiritual heritage of the region through these iconic destinations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEMPLE_DETAILS_DATA.map((temple, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp} 
                whileHover={{ y: -10, scale: 1.015 }} 
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

          {/* Suggested Temple Visit Plans */}
          <div className="mt-16 bg-catalogue-green p-12 text-white shadow-2xl ornate-shape ornate-border border border-catalogue-gold/30">
             <div className="space-y-8 max-w-4xl mx-auto">
               <div className="text-center space-y-4">
                 <h3 className="font-playfair text-4xl font-bold uppercase tracking-widest text-catalogue-gold">Suggested Temple Visit Plans</h3>
                 <div className="w-24 h-1 bg-catalogue-gold mx-auto" />
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                 <div className="space-y-4">
                   <h4 className="text-catalogue-gold font-bold uppercase tracking-widest text-lg border-b border-catalogue-gold/30 pb-2">Short Temple Visit</h4>
                   <p className="text-white/90 leading-relaxed font-semibold italic">Mahamaham Tank, Kasi Viswanathar Temple, Nageswaran Temple, Sarangapani Temple, Arulmigu Adi Kumbeswarar Temple.</p>
                 </div>
                 <div className="space-y-4">
                   <h4 className="text-catalogue-gold font-bold uppercase tracking-widest text-lg border-b border-catalogue-gold/30 pb-2">Extended Spiritual Trail</h4>
                   <p className="text-white/90 leading-relaxed font-semibold italic">Chakrapani Temple, Airavatesvara Temple, Oppiliappan Temple, Sri Swarnapureeswarar Temple, Swamimalai Murugan Temple, Thiruvidaimarudur Mahalinga Swamy Temple.</p>
                 </div>
               </div>

               <p className="text-center text-catalogue-gold font-playfair text-lg italic pt-12 border-t border-catalogue-gold/20">
                 From sacred tanks to ancient temples and timeless traditions, Kumbakonam offers a spiritual journey filled with devotion, heritage and peace. Subra Residency helps guests stay close to this sacred experience with comfort and convenience.
               </p>
             </div>
          </div>
        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};



