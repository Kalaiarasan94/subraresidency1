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
import { bgVideoDesktop, bgVideoMobile } from './assets';
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

/* Looping background video – shown on every page that uses DecorativeLayout (pass bgVideo={null} to turn off) (warm tone + blur baked into the files).
   Phones get the vertical file, larger screens the wide one; reduced-motion users keep the still image. */
const BackgroundVideo = ({ desktop, mobile }: { desktop: string; mobile: string }) => {
  const [src, setSrc] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const mq = window.matchMedia('(max-width: 767px)');
    const pick = () => { setReady(false); setSrc(mq.matches ? mobile : desktop); };
    pick();
    mq.addEventListener('change', pick);
    return () => mq.removeEventListener('change', pick);
  }, [desktop, mobile]);

  if (!src) return null;
  return (
    <video
      key={src}
      src={src}
      className={cn("site-bg-video fixed inset-0 w-full h-full pointer-events-none z-0", ready && "is-ready")}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      onCanPlay={() => setReady(true)}
    />
  );
};

export const DecorativeLayout = ({
  children,
  bgVideo = { desktop: bgVideoDesktop, mobile: bgVideoMobile },
}: { children: React.ReactNode; bgVideo?: { desktop: string; mobile: string } | null }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className="min-h-screen relative bg-brand-cream"
    >
      {/* Background photo – warm tone, blur and haze are pre-baked into the image file */}
      <div
        className="site-bg-photo fixed inset-0 pointer-events-none z-0"
        style={{ backgroundImage: `url(${bgImg})` }}
      />
      {bgVideo && <BackgroundVideo desktop={bgVideo.desktop} mobile={bgVideo.mobile} />}
      <motion.div
        className="site-bg-wash fixed inset-0 pointer-events-none z-0"
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
      <div className="relative z-20 decor-safe">
        {children}
      </div>
    </motion.div>
  );
};



