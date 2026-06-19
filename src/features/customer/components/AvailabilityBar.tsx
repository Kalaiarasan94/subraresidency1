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
export const AvailabilityBar = () => (
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



