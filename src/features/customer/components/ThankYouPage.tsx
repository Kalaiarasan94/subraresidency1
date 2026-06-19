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
export const ThankYouPage = () => {
  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-20">
        <div className="text-center mb-16 space-y-8">
          <img src={logo} alt="Logo" className="h-20 mx-auto mb-6" />
          <h1 className="font-playfair text-4xl md:text-7xl text-catalogue-green font-black tracking-tighter">THANK YOU</h1>
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

        <div className="text-center pt-10 pb-10 space-y-4">
          <p className="font-playfair text-2xl text-catalogue-green font-bold">நன்றி வணக்கம்</p>
          <p className="font-playfair text-xl text-catalogue-gold italic font-bold">We look forward to welcoming you again.</p>
        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};



