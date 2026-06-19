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
export const AttractionsPage = () => {
  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-20">
        <div className="text-center mb-16 space-y-4">
          <p className="font-bold text-catalogue-gold uppercase tracking-[0.4em] text-xs">Spiritual Trail</p>
          <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight">Temple Highlights</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
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

        {/* New Section: Hidden Spiritual Trails */}
        <div className="space-y-16 py-20 border-t border-catalogue-gold/20">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight">Hidden Spiritual Trails<br />Around Kumbakonam</h2>
            <p className="font-playfair text-xl text-catalogue-gold italic font-bold">"Discover the lesser-known spiritual side of Kumbakonam through rare temples, sacred traditions, village legends, unique deities and peaceful pilgrimage experiences beyond the regular tourist route. Curated specially for guests of Subra Residency, these hidden spiritual trails offer deeper cultural and devotional experiences."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HIDDEN_TRAILS_DATA.map((attr, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -10, scale: 1.015 }} className="animated-card bg-card-ivory overflow-hidden ornate-shape ornate-border shadow-lg group flex flex-col h-full">
                <div className="aspect-video overflow-hidden border-b border-catalogue-gold/20">
                  <img src={attr.image} alt={attr.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8 space-y-6 flex-grow flex flex-col">
                  <div className="space-y-2">
                    <h4 className="font-playfair text-2xl font-bold text-catalogue-green leading-tight">{attr.title}</h4>
                    <p className="text-xs font-bold text-catalogue-gold uppercase tracking-widest">{attr.dist} from Residency</p>
                  </div>
                  
                  <div className="space-y-4 flex-grow">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest">Speciality</p>
                      <p className="text-sm text-catalogue-green/80 font-semibold leading-relaxed">{attr.speciality}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest">Prayer Focus</p>
                      <p className="text-sm text-catalogue-green font-bold italic">{attr.prayer}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recommended Spiritual Trails */}
        <div className="space-y-16 py-20 border-t border-catalogue-gold/20">
          <div className="text-center space-y-4">
            <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight">Recommended Spiritual Trails</h2>
            <p className="font-playfair text-lg text-catalogue-gold italic font-semibold">Hand-picked itineraries for a meaningful pilgrimage</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {RECOMMENDED_TRAILS_DATA.map((trail, i) => (
              <motion.div key={i} variants={fadeInUp} whileHover={{ y: -5, scale: 1.01 }} className="animated-card bg-card-ivory p-8 border border-catalogue-gold/20 shadow-xl ornate-shape ornate-border group">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-catalogue-gold/10 text-catalogue-gold group-hover:bg-catalogue-gold group-hover:text-white transition-colors">
                      <MapPin size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-playfair text-2xl font-bold text-catalogue-green">{trail.title}</h4>
                      <p className="text-xs font-bold text-catalogue-gold uppercase tracking-widest">Best For: {trail.bestFor}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-white/50 border-l-4 border-catalogue-gold ornate-shape">
                    <p className="text-sm text-catalogue-green font-bold leading-loose tracking-wide">
                      {trail.route}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Temple Travel Tips */}
        <div className="space-y-16 py-20 border-t border-catalogue-gold/20">
          <div className="text-center">
            <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight">Temple Travel Tips</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { icon: <Clock size={24} />, text: "Start early to avoid heat and crowds." },
              { icon: <Droplets size={24} />, text: "Carry drinking water." },
              { icon: <Shirt size={24} />, text: "Wear modest traditional attire." },
              { icon: <Footprints size={24} />, text: "Remove footwear before entering temples." },
              { icon: <CheckCircle2 size={24} />, text: "Confirm temple timings before travel." },
              { icon: <Car size={24} />, text: "Use local cabs for village temples." },
              { icon: <Info size={24} />, text: "Respect local customs and temple guidelines." }
            ].map((tip, i) => (
              <motion.div key={i} variants={fadeInUp} className="bg-white p-6 text-center space-y-4 border border-catalogue-gold/10 shadow-sm ornate-shape flex flex-col items-center justify-center">
                <div className="text-catalogue-gold">
                  {tip.icon}
                </div>
                <p className="text-[10px] font-bold text-catalogue-green uppercase tracking-wider leading-relaxed">
                  {tip.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 p-12 bg-catalogue-green text-white text-center space-y-8 ornate-shape ornate-border border-4 border-catalogue-gold/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-catalogue-gold/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-catalogue-gold/5 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight">Need Help Planning Your Temple Journey?</h2>
            <p className="font-playfair text-xl text-white/80 italic max-w-3xl mx-auto">"Our team can help you with temple information, route suggestions, local transportation and darshan planning during your stay at Subra Residency."</p>
            <div className="pt-6">
              <Button className="lux-button bg-catalogue-gold text-white px-12 py-8 text-xl font-bold uppercase tracking-widest rounded-none hover:bg-white hover:text-catalogue-green transition-all shadow-2xl">
                Contact Reception
              </Button>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};



