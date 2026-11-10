import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, Loader2, Building, HelpCircle, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { OrnateDivider } from './OrnateDivider';
import { SectionWrapper, DecorativeLayout } from './Layout';
import { submitContactForm } from '../../../lib/api';

export const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Room Reservation / Stay Enquiry',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    document.title = "Contact Us & Location | Subra Residency Kumbakonam";
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validation
    if (!formData.name.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your full name.' });
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setStatusMessage({ type: 'error', text: 'Please provide a valid email address.' });
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setStatusMessage({ type: 'error', text: 'Please provide a valid 10-digit mobile number.' });
      return;
    }
    if (!formData.message.trim() || formData.message.length < 5) {
      setStatusMessage({ type: 'error', text: 'Please write a brief message or question.' });
      return;
    }

    setLoading(true);
    try {
      const res = await submitContactForm(formData);
      if (res && res.status === 'success') {
        setStatusMessage({ 
          type: 'success', 
          text: res.message || 'Thank you! Your enquiry has been received. Our reception team will reach out to you promptly.' 
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Room Reservation / Stay Enquiry',
          message: ''
        });
      } else {
        throw new Error(res?.message || 'Failed to submit message');
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ 
        type: 'error', 
        text: err.message || 'Unable to submit your message. Please reach us directly at +91 73958 09991.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-20">
        {/* Page Title Header */}
        <div className="text-center mb-16 space-y-4 max-w-4xl mx-auto">
          <Badge className="bg-catalogue-gold/15 text-catalogue-green border border-catalogue-gold/30 font-bold uppercase tracking-[0.3em] px-4 py-1 text-[10px]">
            Guest Assistance & Location
          </Badge>
          <h1 className="font-playfair text-4xl md:text-6xl text-catalogue-green font-black uppercase tracking-tight">
            Contact Subra Residency
          </h1>
          <p className="font-playfair text-lg md:text-xl text-catalogue-gold italic font-bold">
            We are here to assist your pilgrimage and holiday stay in Kumbakonam
          </p>
          <div className="flex justify-center pt-2">
            <OrnateDivider className="w-32" />
          </div>
          <p className="text-xs md:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Reach out to our round-the-clock front desk team for room bookings, group pilgrim reservations, temple travel assistance, or general queries.
          </p>
        </div>

        {/* 4 Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1: Address */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-md p-6 flex flex-col justify-between hover:border-catalogue-gold/40 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-catalogue-gold/15 text-catalogue-green flex items-center justify-center">
                <MapPin size={22} className="text-catalogue-gold" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-catalogue-green uppercase">Hotel Address</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                <strong>Subra Residency</strong><br />
                45, L.B.S Road, Near Railway Station,<br />
                Kumbakonam - 612001,<br />
                Tamil Nadu, India.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] text-catalogue-gold font-bold">
              300m from Kumbakonam Rly Stn
            </div>
          </Card>

          {/* Card 2: Phone */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-md p-6 flex flex-col justify-between hover:border-catalogue-gold/40 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-catalogue-gold/15 text-catalogue-green flex items-center justify-center">
                <Phone size={22} className="text-catalogue-gold" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-catalogue-green uppercase">Direct Helpline</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Reception Counter:<br />
                <a href="tel:+917395809991" className="font-bold text-slate-900 hover:text-catalogue-gold block mt-0.5">
                  +91 73958 09991
                </a>
                <a href="tel:+917395809992" className="font-bold text-slate-900 hover:text-catalogue-gold block">
                  +91 73958 09992
                </a>
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] text-catalogue-gold font-bold">
              Instant Phone Reservations
            </div>
          </Card>

          {/* Card 3: Email */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-md p-6 flex flex-col justify-between hover:border-catalogue-gold/40 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-catalogue-gold/15 text-catalogue-green flex items-center justify-center">
                <Mail size={22} className="text-catalogue-gold" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-catalogue-green uppercase">Official Email</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Reservations & Inquiries:<br />
                <a href="mailto:subraresidencykum@gmail.com" className="font-bold text-slate-900 hover:text-catalogue-gold block truncate mt-0.5">
                  subraresidencykum@gmail.com
                </a>
                <a href="mailto:subraresidency@gmail.com" className="font-semibold text-slate-600 hover:text-catalogue-gold block truncate">
                  subraresidency@gmail.com
                </a>
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] text-catalogue-gold font-bold">
              Online Support & Invoicing
            </div>
          </Card>

          {/* Card 4: Hours */}
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-md p-6 flex flex-col justify-between hover:border-catalogue-gold/40 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-catalogue-gold/15 text-catalogue-green flex items-center justify-center">
                <Clock size={22} className="text-catalogue-gold" />
              </div>
              <h3 className="font-playfair text-lg font-bold text-catalogue-green uppercase">Front Desk Hours</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                <strong>24 Hours / 7 Days a Week</strong><br />
                Check-In: 12:00 PM<br />
                Check-Out: 11:00 AM<br />
                <span className="text-[11px] text-catalogue-gold font-semibold">24-hr stay from check-in for direct guests</span>
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-[11px] text-catalogue-gold font-bold">
              Round-the-clock Attendance
            </div>
          </Card>
        </div>

        {/* Main Content Grid: Contact Form + Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20 items-start">
          {/* Contact Enquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-catalogue-gold/30 shadow-xl p-8 md:p-10 space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-5">
              <h2 className="font-playfair text-2xl md:text-3xl font-bold text-catalogue-green uppercase">
                Send an Online Enquiry
              </h2>
              <p className="text-xs text-slate-500">
                Have a question regarding room availability, group tariffs, or spiritual tour recommendations? Drop us a note.
              </p>
            </div>

            {statusMessage && (
              <div className={`p-4 rounded-xl flex items-start gap-3 text-xs font-semibold ${
                statusMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {statusMessage.type === 'success' ? (
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-catalogue-gold text-slate-900 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 9876543210"
                    className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-catalogue-gold text-slate-900 transition-colors font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-catalogue-gold text-slate-900 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Enquiry Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-catalogue-gold text-slate-900 transition-colors cursor-pointer"
                  >
                    <option value="Room Reservation / Stay Enquiry">Room Reservation / Stay Enquiry</option>
                    <option value="Group / Family Booking Tariff">Group / Family Booking Tariff</option>
                    <option value="Navagraha Pilgrimage Assistance">Navagraha Pilgrimage Assistance</option>
                    <option value="Payment / Invoice Inquiry">Payment / Invoice Inquiry</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Message / Requirements *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us your planned travel dates, number of guests, or any specific questions..."
                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-catalogue-gold text-slate-900 transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-catalogue-green hover:bg-catalogue-gold text-white font-black uppercase tracking-[0.2em] py-6 rounded-xl transition-all shadow-lg text-xs flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending Your Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Contact Request</span>
                    </>
                  )}
                </Button>
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-1">
                🔒 Your contact details are kept strictly confidential under our Privacy Policy.
              </p>
            </form>
          </div>

          {/* Map & Landmark Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-catalogue-gold/30 shadow-xl overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-playfair text-lg font-bold text-catalogue-green uppercase">
                  Location Map
                </h3>
                <p className="text-xs text-slate-500">
                  Prime central location on L.B.S Road, Kumbakonam
                </p>
              </div>

              {/* Google Maps Embed */}
              <div className="w-full h-80 relative bg-slate-100">
                <iframe
                  title="Subra Residency Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.487720914275!2d79.3813!3d10.9575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a553258ffaaaaab%3A0x123456789abcdef!2sSubra%20Residency%2C%20L.B.S%20Road%2C%20Kumbakonam!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>

              <div className="p-6 space-y-3 bg-card-ivory/60 border-t border-slate-100 text-xs">
                <h4 className="font-bold text-catalogue-green uppercase tracking-wider text-[11px]">
                  Key Travel Proximities:
                </h4>
                <ul className="space-y-1.5 text-slate-700">
                  <li className="flex justify-between">
                    <span>Kumbakonam Railway Station:</span>
                    <strong className="text-catalogue-gold font-sans font-bold">300 Meters (Walking)</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Kumbakonam Central Bus Stand:</span>
                    <strong className="text-slate-800 font-sans font-bold">700 Meters (2 Mins)</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Adi Kumbeswarar Temple:</span>
                    <strong className="text-slate-800 font-sans font-bold">1.8 KM (5 Mins)</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Sarangapani & Chakrapani Temples:</span>
                    <strong className="text-slate-800 font-sans font-bold">1.5 KM (5 Mins)</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Mahamaham Sacred Tank:</span>
                    <strong className="text-slate-800 font-sans font-bold">1.2 KM (4 Mins)</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Uppiliappan Temple:</span>
                    <strong className="text-slate-800 font-sans font-bold">5.8 KM (12 Mins)</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};

