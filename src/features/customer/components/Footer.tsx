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
export const Footer = () => (
  <footer className="bg-catalogue-green py-10 text-center border-t border-catalogue-gold/40 relative z-20">
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
        <p className="font-playfair text-xl md:text-3xl text-catalogue-gold font-bold tracking-[0.1em] uppercase">
          STAY BLESSED. STAY COMFORTABLE. STAY WITH SUBRA.
        </p>
        <p className="text-[10px] text-catalogue-gold/40 uppercase tracking-[0.5em]">
          © {new Date().getFullYear()} Subra Residency • Kumbakonam
        </p>
      </div>
    </div>
  </footer>
);



