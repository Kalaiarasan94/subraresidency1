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
export const Home = ({ onBookRoom }: { onBookRoom: (room: any) => void }) => {
  return (
    <DecorativeLayout>
      <div className="space-y-0">
        {/* Hero */}
      <section className="relative min-h-[86vh] flex flex-col items-center justify-start overflow-hidden pt-16 md:pt-20 pb-10">
        <HeroSky />
        
        <motion.div
          variants={heroStagger}
          initial="initial"
          animate="animate"
          className="relative z-10 space-y-4 md:space-y-5 max-w-5xl px-6 text-center"
        >
          <motion.h1 variants={heroItem} className="font-playfair text-4xl md:text-6xl text-catalogue-green font-black tracking-tight leading-none drop-shadow-sm">
            WELCOME
          </motion.h1>
          <motion.p variants={heroItem} className="font-playfair text-xl md:text-3xl text-catalogue-green italic tracking-widest uppercase drop-shadow-sm">
            TO A STAY THAT FEELS LIKE
          </motion.p>
          <motion.p variants={heroItem} className="font-playfair text-2xl md:text-4xl text-catalogue-green font-bold drop-shadow-sm">
            Home, Away from Home
          </motion.p>
          <motion.div variants={heroItem} className="space-y-2 pt-4">
            <h2 className="font-playfair text-2xl md:text-4xl text-catalogue-green font-bold drop-shadow-sm">வரவேற்கிறோம்</h2>
            <p className="font-playfair text-xl md:text-2xl text-catalogue-green/80 font-semibold drop-shadow-sm">இது வீடு போன்ற உணர்வைத் தரும் ஓர் இடம்.</p>
          </motion.div>
          <motion.div variants={heroItem} className="pt-4">
            <Link to="/rooms">
              <Button className="lux-button bg-catalogue-green text-white px-12 py-8 text-xl font-bold uppercase tracking-widest rounded-none hover:bg-catalogue-gold transition-colors">
                Explore Our Rooms
              </Button>
            </Link>
          </motion.div>
          
          <motion.div variants={heroItem} className="pt-6">
            <AvailabilityBar />
          </motion.div>
        </motion.div>
      </section>

      {/* Hotel Building Section */}
      <SectionWrapper className="bg-white/50 backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeInLeft} className="space-y-8">
            <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight leading-tight">
              YOUR STAY BEGINS HERE
            </h2>
            <p className="font-playfair text-xl text-catalogue-green/80 italic">
              A peaceful address in the heart of Kumbakonam. A warm welcome for families, travellers, pilgrims and celebrations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <p className="font-bold text-catalogue-gold uppercase tracking-widest text-xs">Contact Info</p>
                <p className="text-catalogue-green font-bold">7395809991 | 7395809992</p>
                <p className="text-catalogue-green text-sm">subraresidencykum@gmail.com</p>
              </div>
              <div className="space-y-2">
                <p className="font-bold text-catalogue-gold uppercase tracking-widest text-xs">Location</p>
                <p className="text-catalogue-green font-bold italic">Close to temples, travel points, and the spirit of Kumbakonam.</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInRight} className="rounded-sm overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-catalogue-gold/20">
            <img src={hotelBuildingImg} alt="Subra Residency" className="w-full h-auto" />
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Accommodations Preview */}
      <SectionWrapper id="rooms">
        <div className="text-center mb-16 space-y-4">
          <p className="font-bold text-catalogue-gold uppercase tracking-[0.4em] text-xs">Room Categories</p>
          <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight">Luxurious Sanctuaries</h2>
        </div>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 items-stretch"
        >
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
                    className="lux-button bg-catalogue-green text-white font-bold uppercase tracking-widest rounded-none px-8 py-6 hover:bg-catalogue-gold transition-colors"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </SectionWrapper>

      {/* Dining & Events (Page 3) */}
      <SectionWrapper className="bg-catalogue-green/5">
        <div className="text-center mb-16 space-y-4">
          <p className="font-bold text-catalogue-gold uppercase tracking-[0.4em] text-xs">Comfortable Stays • Elegant Dining</p>
          <h2 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight">Dining & Events</h2>
          <OrnateDivider className="mt-6" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div variants={fadeInLeft} whileHover={{ y: -8, scale: 1.01 }} className="animated-card space-y-8 group bg-card-ivory p-8 ornate-shape ornate-border shadow-xl">
            <div className="aspect-video overflow-hidden border border-catalogue-gold/20">
              <img src={diningImg} alt="Dining Hall" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="text-center space-y-4">
              <h3 className="font-playfair text-4xl text-catalogue-green font-bold">Dining Hall</h3>
              <p className="text-catalogue-green/70 font-semibold leading-relaxed max-w-md mx-auto">
                Located on the 4th floor. Capacity: 60 persons. Suitable for family functions, birthday parties and other gatherings.
              </p>
              <Badge variant="outline" className="border-catalogue-gold text-catalogue-gold font-bold px-4 py-1 uppercase tracking-widest">4th Floor</Badge>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInRight} whileHover={{ y: -8, scale: 1.01 }} className="animated-card space-y-8 group bg-card-ivory p-8 ornate-shape ornate-border shadow-xl">
            <div className="aspect-video overflow-hidden border border-catalogue-gold/20">
              <img src={hallImg} alt="Banquet Hall" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="text-center space-y-4">
              <h3 className="font-playfair text-4xl text-catalogue-green font-bold">Banquet Hall</h3>
              <p className="text-catalogue-green/70 font-semibold leading-relaxed max-w-md mx-auto">
                Located on the 5th floor. Capacity: 80 to 100 persons. Suitable for corporate events, family functions, birthday parties and special occasions.
              </p>
              <Badge variant="outline" className="border-catalogue-gold text-catalogue-gold font-bold px-4 py-1 uppercase tracking-widest">5th Floor</Badge>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 bg-catalogue-green p-4 text-center">
          <p className="text-catalogue-gold font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
            Floors 1-3: Guest Rooms | 4th Floor: Dining Hall | 5th Floor: Banquet Hall
          </p>
        </div>
      </SectionWrapper>

      {/* Google Map Section */}
      <SectionWrapper className="py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
          <div className="bg-white/90 backdrop-blur-sm p-12 shadow-2xl ornate-shape border border-catalogue-gold/20 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="font-bold text-catalogue-gold uppercase tracking-[0.4em] text-xs">Our Location</p>
                <h3 className="font-playfair text-3xl md:text-5xl text-catalogue-green font-black uppercase tracking-tight leading-tight">Find Us in the Heart of Kumbakonam</h3>
                <OrnateDivider className="mt-6 ml-0" />
              </div>
              
              <p className="text-catalogue-green/80 text-xl font-medium italic leading-relaxed">
                Experience the perfect blend of spiritual proximity and modern comfort, located just steps away from the sacred landmarks of the Temple Town.
              </p>

              <div className="space-y-8 pt-6">
                 <div className="flex items-start gap-6 group">
                   <div className="bg-white p-4 shadow-lg ornate-shape border border-catalogue-gold/20 group-hover:bg-catalogue-gold group-hover:text-white transition-all">
                     <MapPin size={24} />
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest">Address</p>
                     <p className="text-catalogue-green font-bold text-lg">45, L.B.S Road, Near Railway Station</p>
                     <p className="text-catalogue-green/60 text-sm">Kumbakonam, Tamil Nadu - 612001</p>
                   </div>
                 </div>

                 <div className="flex items-start gap-6 group">
                   <div className="bg-white p-4 shadow-lg ornate-shape border border-catalogue-gold/20 group-hover:bg-catalogue-gold group-hover:text-white transition-all">
                     <Calendar size={24} />
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-catalogue-gold uppercase tracking-widest">Availability</p>
                     <p className="text-catalogue-green font-bold text-lg">Open 24/7 for Direct Bookings</p>
                     <p className="text-catalogue-green/60 text-sm">Heartfelt hospitality, day and night</p>
                   </div>
                 </div>
              </div>
            </div>

            <Button className="lux-button bg-catalogue-green text-white px-10 py-8 text-sm font-bold uppercase tracking-widest rounded-none shadow-xl hover:bg-catalogue-gold transition-all w-full">
              Get Directions
            </Button>
          </div>

          <div className="h-[600px] lg:h-auto relative p-4 bg-white shadow-2xl ornate-shape border border-catalogue-gold/10 min-h-[500px]">
            <div className="absolute inset-4 overflow-hidden ornate-shape">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.423985068694!2d79.3702161141164!3d10.957685958742848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a55134764953e5b%3A0x7d0e4178553f6a6b!2sSubra%20Residency!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin" 
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-1000" 
                allowFullScreen={true} 
                loading="lazy" 
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
      </div>
    </DecorativeLayout>
  );
};



