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
export const HeroSky = () => (
  <motion.div
    className="absolute inset-0 pointer-events-none overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.2, ease: "easeOut" }}
  >
    {/* Clouds */}
    <div className="hero-cloud absolute top-20 left-[10%] opacity-20 blur-xl w-64 h-32 bg-white rounded-full" />
    <div className="hero-cloud hero-cloud-slow absolute top-40 right-[15%] opacity-15 blur-2xl w-96 h-40 bg-white rounded-full" />
    <div className="hero-cloud hero-cloud-soft absolute top-10 left-[40%] opacity-10 blur-3xl w-80 h-48 bg-white rounded-full" />
    
    {/* Birds */}
    <svg className="bird-drift absolute top-32 right-[20%] w-32 h-20 text-catalogue-green/20" viewBox="0 0 100 100">
      <path d="M10 50 Q 25 30 40 50 Q 55 30 70 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 70 Q 35 50 50 70 Q 65 50 80 70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform="scale(0.8) translate(10, 10)" />
      <path d="M5 30 Q 15 15 25 30 Q 35 15 45 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform="scale(0.6) translate(-20, -10)" />
    </svg>
    <svg className="bird-drift bird-drift-slow absolute top-60 right-[10%] w-24 h-16 text-catalogue-green/10" viewBox="0 0 100 100" transform="scale(-1, 1)">
      <path d="M10 50 Q 25 30 40 50 Q 55 30 70 50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 70 Q 35 50 50 70 Q 65 50 80 70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" transform="scale(0.8) translate(10, 10)" />
    </svg>
  </motion.div>
);



