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
export const RoomsPage = ({ onBookRoom }: { onBookRoom: (room: any) => void }) => {
  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-20">
        <div className="text-center mb-8 space-y-4">
          <p className="font-bold text-catalogue-gold uppercase tracking-[0.4em] text-xs">Our Accommodations</p>
          <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight">Luxurious Sanctuaries</h2>
        </div>

        <div className="mb-16">
          <AvailabilityBar />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-stretch">
          {ROOMS_DATA.map((room) => (
            <motion.div key={room.id} variants={fadeInUp} whileHover={{ y: -10, scale: 1.015 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="h-full">
            <Card className="animated-card group bg-card-ivory shadow-xl hover:shadow-2xl transition-all overflow-hidden rounded-none flex flex-col h-full ornate-shape ornate-border border border-catalogue-gold/20">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={room.image} alt={room.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <CardHeader className="text-center flex-grow">
                <CardTitle className="font-playfair text-3xl text-catalogue-green">{room.title}</CardTitle>
                <OrnateDivider className="my-4" />
                <CardDescription className="text-catalogue-green/70 font-semibold leading-relaxed px-4">{room.desc}</CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8 pt-4">
                <p className="text-2xl font-bold text-catalogue-gold mb-6">{room.price}</p>
                <Button 
                  onClick={() => onBookRoom(room)}
                  className="lux-button bg-catalogue-green text-white font-bold uppercase tracking-widest px-8 py-6 rounded-none hover:bg-catalogue-gold transition-colors"
                >
                  Book Room
                </Button>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};



