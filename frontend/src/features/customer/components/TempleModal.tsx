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
export const TempleModal = ({ temple, onClose }: { temple: any, onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!temple) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
    >
      <div 
        className="absolute inset-0 bg-brand-charcoal/80"
        onClick={onClose}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-brand-cream w-full max-w-6xl max-h-[85vh] overflow-hidden relative shadow-2xl ornate-shape ornate-border border border-catalogue-gold/30 flex flex-col md:flex-row shadow-[0_0_80px_rgba(0,0,0,0.5)]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-catalogue-gold text-white rounded-full hover:bg-catalogue-green transition-colors shadow-lg"
        >
          <X size={24} />
        </button>

        {/* Left Side: Map & Travel Info */}
        <div className="w-full md:w-5/12 h-[300px] md:h-auto relative p-4 bg-white border-b md:border-b-0 md:border-r border-catalogue-gold/10">
           <div className="absolute inset-4 overflow-hidden ornate-shape border border-catalogue-gold/10">
              <iframe
                title="Temple Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps?q=Subra+Residency+Kumbakonam+to+${temple.name}&output=embed`}
                className="w-full h-full border-0"
              ></iframe>
           </div>
           <div className="absolute bottom-10 left-10 right-10 bg-catalogue-green/90 backdrop-blur-sm p-4 border border-catalogue-gold/30 text-white shadow-xl ornate-shape">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <MapPin className="text-catalogue-gold" size={20} />
                   <div>
                      <p className="text-[10px] uppercase font-bold text-catalogue-gold tracking-widest leading-none mb-1">Route from Hotel</p>
                      <p className="font-playfair text-base font-bold">To {temple.name}</p>
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-catalogue-gold tracking-widest">Distance</p>
                    <p className="text-sm font-bold">{temple.dist}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-catalogue-gold tracking-widest">Mode</p>
                    <p className="text-sm font-bold">{temple.mode}</p>
                  </div>
                </div>
              </div>
           </div>
        </div>

        {/* Right Side: Image & Details */}
        <div className="w-full md:w-7/12 p-8 md:p-12 space-y-8 overflow-y-auto no-scrollbar">
           <div className="space-y-6">
              <div className="w-full aspect-video overflow-hidden border border-catalogue-gold/20 shadow-md">
                 <img src={temple.image} alt={temple.name} className="w-full h-full object-cover" />
              </div>
              <div className="border-b border-catalogue-gold/20 pb-4">
                <h2 className="font-playfair text-3xl md:text-4xl font-black text-catalogue-green uppercase tracking-tight leading-tight">
                  {temple.name}
                </h2>
              </div>
           </div>

           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-[0.2em]">Suggested Darshan Time</p>
                   <p className="text-catalogue-green font-bold flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-catalogue-gold shrink-0" />
                      {temple.timing}
                   </p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-[0.2em]">Dress Code</p>
                   <p className="text-catalogue-green font-bold flex items-center gap-2 text-sm italic">
                      <Shirt size={14} className="text-catalogue-gold shrink-0" />
                      {temple.dressCode}
                   </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest">Special For</p>
                  <p className="text-base text-catalogue-green font-bold italic leading-relaxed">{temple.specialFor}</p>
                </div>

                <p className="text-catalogue-green/90 leading-relaxed font-medium text-lg italic border-l-4 border-catalogue-gold pl-6">
                  {temple.desc}
                </p>
                
                <div className="space-y-6 pt-2">
                   <div className="bg-catalogue-green/5 p-6 border border-catalogue-gold/20 ornate-shape">
                      <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest mb-2">Guest Note</p>
                      <p className="text-sm text-catalogue-green font-semibold italic leading-relaxed">{temple.guestNote}</p>
                   </div>
                </div>
              </div>
           </div>

           <div className="pt-8">
              <Button 
                onClick={onClose}
                className="lux-button w-full bg-catalogue-green text-white py-8 text-sm font-bold uppercase tracking-widest rounded-none hover:bg-catalogue-gold transition-all"
              >
                Close Temple Details
              </Button>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};



