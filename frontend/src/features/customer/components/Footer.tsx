import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { logo } from './assets';

export const Footer = () => (
  <footer className="bg-catalogue-green text-catalogue-cream/90 pt-16 pb-8 border-t border-catalogue-gold/40 relative z-20 font-sans">
    <div className="max-w-7xl mx-auto px-6">
      
      {/* 4-Column Main Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-catalogue-gold/20">
        
        {/* Column 1: Subra Residency */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Subra Residency" className="h-14 w-auto brightness-0 invert" />
            <div className="flex flex-col">
              <span className="font-playfair text-xl font-black tracking-widest text-white leading-none">SUBRA</span>
              <span className="font-playfair text-[9px] font-bold tracking-[0.25em] text-catalogue-gold uppercase mt-1">Residency Kumbakonam</span>
            </div>
          </div>
          <p className="font-playfair metal-gold-bright italic text-sm font-semibold metal-flat">
            &quot;Home, Away from Home&quot;
          </p>
          <p className="text-xs text-catalogue-cream/75 leading-relaxed">
            A peaceful, air-conditioned hospitality destination in the sacred temple city of Kumbakonam. Providing hygienic, family-friendly accommodations just 300 meters from the Railway Station.
          </p>
          <div className="flex items-start gap-2 text-xs text-catalogue-gold pt-1">
            <MapPin size={15} className="shrink-0 mt-0.5" />
            <span>45, L.B.S Road, Near Railway Station, Kumbakonam - 612001, Tamil Nadu.</span>
          </div>
        </div>

        {/* Column 2: Explore Navigation */}
        <div className="space-y-4 lg:pl-6">
          <h4 className="font-playfair text-base font-bold metal-gold-bright uppercase tracking-widest border-b border-catalogue-gold/20 pb-2 metal-flat">
            Explore
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/" className="hover:text-catalogue-gold transition-colors flex items-center gap-1.5">
                <ChevronRight size={13} className="text-catalogue-gold" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-catalogue-gold transition-colors flex items-center gap-1.5">
                <ChevronRight size={13} className="text-catalogue-gold" />
                <span>About Us</span>
              </Link>
            </li>
            <li>
              <Link to="/rooms" className="hover:text-catalogue-gold transition-colors flex items-center gap-1.5">
                <ChevronRight size={13} className="text-catalogue-gold" />
                <span>Rooms & Accommodation</span>
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-catalogue-gold transition-colors flex items-center gap-1.5">
                <ChevronRight size={13} className="text-catalogue-gold" />
                <span>Room Pricing & Tariffs</span>
              </Link>
            </li>
            <li>
              <Link to="/attractions" className="hover:text-catalogue-gold transition-colors flex items-center gap-1.5">
                <ChevronRight size={13} className="text-catalogue-gold" />
                <span>Temple Trails & Attractions</span>
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-catalogue-gold transition-colors flex items-center gap-1.5">
                <ChevronRight size={13} className="text-catalogue-gold" />
                <span>Contact Us</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal & Regulatory Policies */}
        <div className="space-y-4">
          <h4 className="font-playfair text-base font-bold metal-gold-bright uppercase tracking-widest border-b border-catalogue-gold/20 pb-2 metal-flat">
            Policies & Legal
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/terms" className="hover:text-catalogue-gold transition-colors flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-catalogue-gold" />
                <span>Terms & Conditions</span>
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-catalogue-gold transition-colors flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-catalogue-gold" />
                <span>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link to="/cancellation-refund" className="hover:text-catalogue-gold transition-colors flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-catalogue-gold" />
                <span>Cancellation & Refund Policy</span>
              </Link>
            </li>
          </ul>
          <div className="p-3 rounded-xl bg-white/5 border border-catalogue-gold/15 text-[11px] text-catalogue-cream/70 space-y-1">
            <p className="font-bold metal-gold-bright uppercase text-[10px] tracking-wider metal-flat">
              100% Secure Payments
            </p>
            <p>
              Digital payments processed securely via PCI-DSS certified Razorpay gateway. Card details are never stored.
            </p>
          </div>
        </div>

        {/* Column 4: Contact & Front Desk */}
        <div className="space-y-4">
          <h4 className="font-playfair text-base font-bold metal-gold-bright uppercase tracking-widest border-b border-catalogue-gold/20 pb-2 metal-flat">
            Contact Front Desk
          </h4>
          <div className="space-y-3 text-xs">
            <div>
              <p className="text-[10px] text-catalogue-gold uppercase font-bold tracking-wider mb-1">
                24/7 Telephone Helpline
              </p>
              <a href="tel:+917395809991" className="font-bold text-white hover:text-catalogue-gold block font-sans">
                +91 73958 09991
              </a>
              <a href="tel:+917395809992" className="font-bold text-white hover:text-catalogue-gold block font-sans">
                +91 73958 09992
              </a>
            </div>

            <div>
              <p className="text-[10px] text-catalogue-gold uppercase font-bold tracking-wider mb-1">
                Official Email
              </p>
              <a href="mailto:subraresidencykum@gmail.com" className="text-catalogue-cream hover:text-catalogue-gold block truncate font-sans">
                subraresidencykum@gmail.com
              </a>
              <a href="mailto:subraresidency@gmail.com" className="text-catalogue-cream/70 hover:text-catalogue-gold block truncate font-sans text-[11px]">
                subraresidency@gmail.com
              </a>
            </div>

            <div>
              <p className="text-[10px] text-catalogue-gold uppercase font-bold tracking-wider mb-1">
                Stay Hours
              </p>
              <p className="text-[11px] text-catalogue-cream/80">
                Check-in: 12:00 PM | Check-out: 11:00 AM<br />
                <span className="text-catalogue-gold font-semibold">24-hr stay policy applies for direct bookings</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar: Copyright and Legal Links */}
      <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-catalogue-cream/60">
        <p className="font-playfair text-sm text-catalogue-gold/90 tracking-wider">
          © 2026 Subra Residency. All Rights Reserved.
        </p>

        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <Link to="/terms" className="hover:text-catalogue-gold transition-colors">
            Terms & Conditions
          </Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-catalogue-gold transition-colors">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link to="/cancellation-refund" className="hover:text-catalogue-gold transition-colors">
            Cancellation & Refund
          </Link>
          <span>•</span>
          <Link to="/pricing" className="hover:text-catalogue-gold transition-colors">
            Pricing
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-catalogue-gold transition-colors">
            Contact
          </Link>
        </div>
      </div>

    </div>
  </footer>
);
