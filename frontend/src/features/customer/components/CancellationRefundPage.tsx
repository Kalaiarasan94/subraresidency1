import { useEffect } from 'react';
import { RotateCcw, Clock, CheckCircle2, AlertTriangle, HelpCircle, Phone, Mail, ShieldAlert, CreditCard } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { OrnateDivider } from './OrnateDivider';
import { SectionWrapper, DecorativeLayout } from './Layout';

export const CancellationRefundPage = () => {
  useEffect(() => {
    document.title = "Cancellation & Refund Policy | Subra Residency Kumbakonam";
    window.scrollTo(0, 0);
  }, []);

  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-20">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 max-w-4xl mx-auto">
          <Badge className="bg-catalogue-gold/15 text-catalogue-green border border-catalogue-gold/30 font-bold uppercase tracking-[0.3em] px-4 py-1 text-[10px]">
            Guest Safeguard & Policies
          </Badge>
          <h1 className="font-playfair text-4xl md:text-6xl text-catalogue-green font-black uppercase tracking-tight">
            Cancellation & Refund Policy
          </h1>
          <p className="font-playfair text-lg md:text-xl text-catalogue-gold italic font-bold">
            Transparent, fair, and reliable room cancellation & refund procedures
          </p>
          <div className="flex justify-center pt-2">
            <OrnateDivider className="w-32" />
          </div>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto">
            Last Updated: January 2026 | Clear rules for cancellations, date modifications, and refunds for bookings made at Subra Residency, Kumbakonam.
          </p>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-catalogue-gold/30 shadow-xl p-8 md:p-14 space-y-10 text-slate-700 text-xs md:text-sm leading-relaxed">

          {/* Quick Summary Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-card-ivory/80 rounded-2xl border border-catalogue-gold/25">
            <div className="space-y-1 p-3 bg-white/80 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">48+ Hours Notice</span>
              <p className="font-playfair text-lg font-black text-emerald-800">100% Full Refund</p>
              <p className="text-[11px] text-slate-500">Cancel 48h prior to check-in with zero cancellation fee.</p>
            </div>

            <div className="space-y-1 p-3 bg-white/80 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">48 to 24 Hours</span>
              <p className="font-playfair text-lg font-black text-amber-800">50% Refund</p>
              <p className="text-[11px] text-slate-500">50% of the first night tariff retained as late cancellation charge.</p>
            </div>

            <div className="space-y-1 p-3 bg-white/80 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Under 24 Hours / No-Show</span>
              <p className="font-playfair text-lg font-black text-rose-800">Non-Refundable</p>
              <p className="text-[11px] text-slate-500">First night room fee is retained due to inventory block.</p>
            </div>
          </div>

          {/* Section 1: Detailed Cancellation Timelines */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              1. Cancellation Deadlines & Eligibility
            </h2>
            <p>
              We understand that pilgrimage schedules and travel plans to Kumbakonam can sometimes change unexpectedly. Our cancellation policy is designed to be as accommodating as possible while protecting our hotel room allocations:
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  <span>Free Cancellation Window (48 Hours or More)</span>
                </div>
                <p className="text-xs text-emerald-800">
                  If you cancel your reservation <strong>48 hours or more</strong> before your scheduled check-in time (e.g. 12:00 PM of the check-in date), you are eligible for a <strong>100% full refund</strong> of the room booking amount paid.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                  <Clock size={16} className="text-amber-600" />
                  <span>Mid-Notice Window (Between 48 and 24 Hours)</span>
                </div>
                <p className="text-xs text-amber-800">
                  If you cancel between <strong>48 hours and 24 hours</strong> prior to your scheduled check-in time, a cancellation fee of <strong>50% of the first night&apos;s tariff</strong> is charged. Any balance amount paid is refunded.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 space-y-1">
                <div className="flex items-center gap-2 font-bold text-rose-900 text-xs">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <span>Late Cancellation (Under 24 Hours) & No-Shows</span>
                </div>
                <p className="text-xs text-rose-800">
                  Cancellations initiated less than <strong>24 hours</strong> prior to check-in, or failure to arrive at the hotel without advance cancellation notice (&quot;No-Show&quot;), are <strong>non-refundable</strong> as the room has been held exclusively for you and cannot be re-allocated.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Booking Modifications */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              2. Booking Modifications & Rescheduling
            </h2>
            <p>
              Need to postpone or shift your temple visit dates instead of canceling? We provide free date rescheduling:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Advance Notice:</strong> You may reschedule your booking dates by notifying us at least <strong>48 hours prior</strong> to the original check-in date.</li>
              <li><strong>Availability:</strong> Date modification is subject to room availability for the newly requested dates.</li>
              <li><strong>Tariff Adjustment:</strong> If moving between low-season and peak festival dates (e.g. Mahamaham or temple Brahmotsavam), any applicable tariff difference must be settled. If the new rate is identical, no rescheduling penalty is charged.</li>
            </ul>
          </section>

          {/* Section 3: Refund Process & Timeline */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              3. Refund Processing Procedure & Expected Timeline
            </h2>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <CreditCard size={18} className="text-catalogue-gold" />
                <span>Automatic Refund to Original Source via Razorpay</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                All eligible refunds are initiated through our authorized payment gateway partner, <strong>Razorpay</strong>, directly back to the original payment method used during checkout:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>UPI Payments (GPay, PhonePe, Paytm, BHIM):</strong> Credited directly back to your linked bank account via UPI within <strong>2 to 4 business days</strong>.</li>
                <li><strong>Debit & Credit Cards (Visa, MasterCard, RuPay):</strong> Processed back to your card-issuing bank within <strong>5 to 7 business days</strong>, depending on your bank&apos;s settlement cycle.</li>
                <li><strong>Netbanking:</strong> Credited to your source savings/current account within <strong>5 to 7 business days</strong>.</li>
              </ul>
              <p className="text-[11px] text-slate-500 italic mt-1">
                * Note: Under RBI and banking guidelines, Saturdays, Sundays, and national banking holidays are excluded from business day calculations.
              </p>
            </div>
          </section>

          {/* Section 4: How to Request Cancellation */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              4. How to Request a Cancellation or Refund
            </h2>
            <p>
              To cancel your booking and request an eligible refund, please follow either of these simple steps:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-catalogue-green text-xs">
                  <Mail size={16} className="text-catalogue-gold" />
                  <span>Option A: By Email</span>
                </div>
                <p className="text-xs text-slate-600">
                  Send an email to <a href="mailto:subraresidencykum@gmail.com" className="font-bold text-catalogue-gold underline">subraresidencykum@gmail.com</a> with the subject line <strong>&quot;Booking Cancellation - [Your Booking ID]&quot;</strong>. Mention your registered mobile number and reason for cancellation.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-catalogue-green text-xs">
                  <Phone size={16} className="text-catalogue-gold" />
                  <span>Option B: Direct Front Desk Phone</span>
                </div>
                <p className="text-xs text-slate-600">
                  Call our 24/7 reception desk at <a href="tel:+917395809991" className="font-bold text-slate-900">+91 73958 09991</a> or <a href="tel:+917395809992" className="font-bold text-slate-900">+91 73958 09992</a>. Keep your Booking Reference ID ready for instant verification and cancellation processing.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Force Majeure & Special Events */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              5. Special Circumstances & Force Majeure
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              In the rare event of severe natural calamities (cyclone, heavy flooding), state travel curfews, or unforeseen government restrictions preventing access to Kumbakonam, Subra Residency will offer full rescheduling without penalty or an authorized full credit voucher for future stay within 12 months.
            </p>
          </section>

          {/* Section 6: Contact for Refund Support */}
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green">
              6. Dedicated Refund Support Desk
            </h2>
            <p className="text-xs text-slate-600">
              If your initiated refund does not reflect in your bank account after 7 business days, please get in touch with our billing manager:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1 font-sans">
              <p><strong>Subra Residency – Reservation & Accounts Desk</strong></p>
              <p>45, L.B.S Road, Near Railway Station, Kumbakonam - 612001, Tamil Nadu, India</p>
              <p>Helpline: +91 73958 09991 / +91 73958 09992 (Available 24 Hours)</p>
              <p>Email: <a href="mailto:subraresidencykum@gmail.com" className="text-catalogue-gold font-bold">subraresidencykum@gmail.com</a></p>
            </div>
          </section>

        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};

