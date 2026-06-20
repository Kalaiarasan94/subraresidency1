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
export const SectionWrapper = ({ children, className, id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <section id={id} className={cn("relative py-16 px-6 md:px-12", className)}>
    <motion.div 
      variants={fadeInUp}
      initial="initial"
      whileInView="whileInView"
      viewport={{ once: true, margin: "-100px" }}
      className="max-w-7xl mx-auto relative z-10"
    >
      {children}
    </motion.div>
  </section>
);

export const DecorativeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="min-h-screen relative bg-brand-cream"
      style={{ 
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <motion.div
        className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,249,240,0.9),transparent_34%),linear-gradient(to_bottom,rgba(255,249,240,0.35),rgba(255,249,240,0.72))]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
      {/* Persistent Decorative Elements */}
      
      <motion.div
        className="fixed top-20 left-0 w-32 md:w-72 bottom-0 pointer-events-none z-10 opacity-100 overflow-hidden decor-pillar"
        initial={{ opacity: 0, x: -70 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] } as any}
      >
        <img src={pillerImg} alt="" className="h-full object-cover object-left scale-x-[-1]" />
      </motion.div>

      <motion.div
        className="fixed top-20 right-0 w-32 md:w-64 h-64 md:h-96 pointer-events-none z-10 opacity-100 decor-leaf"
        initial={{ opacity: 0, x: 60, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, delay: 0.1, ease: [0.22, 1, 0.36, 1] } as any}
      >
        <img src={leafImg} alt="" className="w-full h-auto object-contain" />
      </motion.div>
      
      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </motion.div>
  );
};



