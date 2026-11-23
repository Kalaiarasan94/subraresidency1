import { useEffect } from 'react';
import { ShieldCheck, FileText, CheckCircle2, Clock, CreditCard, AlertCircle, Phone, Mail, MapPin } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { OrnateDivider } from './OrnateDivider';
import { SectionWrapper, DecorativeLayout } from './Layout';

export const TermsAndConditionsPage = () => {
  useEffect(() => {
    document.title = "Terms & Conditions | Subra Residency Kumbakonam";
    window.scrollTo(0, 0);
  }, []);

  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-20">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 max-w-4xl mx-auto">
          <Badge className="bg-catalogue-gold/15 text-catalogue-green border border-catalogue-gold/30 font-bold uppercase tracking-[0.3em] px-4 py-1 text-[10px]">
            Legal Agreement & Policies
          </Badge>
          <h1 className="font-playfair text-4xl md:text-6xl metal-emerald font-black uppercase tracking-tight">
            Terms & Conditions
          </h1>
          <p className="font-playfair text-lg md:text-xl metal-gold italic font-bold">
            Subra Residency – Official Hotel Reservation & Service Terms
          </p>
          <div className="flex justify-center pt-2">
            <OrnateDivider className="w-32" />
          </div>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto">
            Last Updated: January 2026 | Governing your website usage, digital reservations, and stay at Subra Residency, Kumbakonam.
          </p>
        </div>

        {/* Content Container */}
        <div className="lux-panel max-w-4xl mx-auto p-8 md:p-14 space-y-10 text-slate-700 text-xs md:text-sm leading-relaxed">
          
          {/* Introduction */}
          <div className="p-5 bg-card-ivory/80 rounded-2xl border border-catalogue-gold/20 space-y-2">
            <div className="flex items-center gap-2 text-catalogue-green font-bold text-sm">
              <ShieldCheck size={18} className="text-catalogue-gold" />
              <span>Welcome to Subra Residency</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              These Terms and Conditions (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;Guest&quot;, &quot;Customer&quot;, or &quot;User&quot;) and <strong>Subra Residency</strong> (&quot;Hotel&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), having its registered property at <strong>45, L.B.S Road, Near Railway Station, Kumbakonam - 612001, Tamil Nadu, India</strong>. By accessing our website, creating an online reservation, or checking into our hotel, you expressly agree to abide by these Terms.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold metal-emerald border-b border-slate-100 pb-2">
              1. Website Usage & Eligibility
            </h2>
            <p>
              By accessing and using this website (<span className="text-catalogue-gold font-semibold">subraresidency.com</span>), you represent and warrant that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>You are at least 18 years of age and possess the legal capacity to enter into binding agreements under the Indian Contract Act, 1872.</li>
              <li>All information submitted by you during reservation (including guest name, mobile phone number, email address, and billing details) is true, accurate, and complete.</li>
              <li>You will use this website solely for legitimate personal room reservations and will not make speculative, false, or fraudulent bookings.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold metal-emerald border-b border-slate-100 pb-2">
              2. Room Reservation Policies
            </h2>
            <p>
              Room reservations made through our portal or front desk are subject to room category availability and verified tariff payment:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Room Allocation:</strong> While we guarantee your booked category (Deluxe, Super Deluxe, or Suite), specific physical room numbers are allocated upon arrival based on housekeeping and occupancy readiness.</li>
              <li><strong>Maximum Occupancy:</strong> The permitted guest count for each room category (Deluxe: 2 adults; Super Deluxe: 3 adults; Suite: 4 adults) must be strictly respected. Any unannounced additional guests are subject to extra occupancy fees or room upgrades.</li>
              <li><strong>Minors:</strong> Guests under 18 years must be accompanied by an adult parent or guardian.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold metal-emerald border-b border-slate-100 pb-2">
              3. Booking Confirmation & Digital Voucher
            </h2>
            <p>
              A room booking is considered confirmed only when:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>The required online payment transaction is successfully verified and completed through our payment gateway (Razorpay).</li>
              <li>An official Booking Reference ID (format: <code className="bg-slate-100 px-1 py-0.5 rounded text-catalogue-green font-bold">HBKYYYYMMDDXXXX</code>) is generated and displayed on screen, and an electronic invoice confirmation is dispatched to your provided email address.</li>
              <li>Guests must preserve and present this Booking Reference ID during physical check-in at our front desk.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold metal-emerald border-b border-slate-100 pb-2">
              4. Payment Terms & Currency
            </h2>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <CreditCard size={16} className="text-catalogue-gold" />
                <span>Secure Online Payment Gateway via Razorpay</span>
              </div>
              <p className="text-slate-600">
                All online transactions on our portal are securely processed through <strong>Razorpay Payment Gateway</strong> under strict PCI-DSS Level 1 compliance. We support:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Unified Payments Interface (UPI): Google Pay, PhonePe, Paytm, BHIM, and banking UPI apps.</li>
                <li>Credit & Debit Cards: Visa, MasterCard, RuPay, Maestro.</li>
                <li>Net Banking across all scheduled Indian commercial banks.</li>
              </ul>
              <p className="text-slate-600">
                All pricing is denominated in <strong>Indian Rupees (INR / ₹)</strong>. Full tariff payment is required upfront to lock in the reservation.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold metal-emerald border-b border-slate-100 pb-2">
              5. Check-In & Check-Out Policies (24-Hour Stay Benefit)
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li><strong>Standard Timings:</strong> Standard Check-In time is <strong>12:00 PM</strong> and Standard Check-Out time is <strong>11:00 AM</strong>.</li>
              <li><strong>24-Hour Stay Benefit:</strong> For direct online reservations made through our official website, guests enjoy our flexible 24-hour stay benefit calculated from the time of check-in, subject to prior notice during booking.</li>
              <li><strong>Mandatory Photo Identification:</strong> In compliance with Government of India regulations and Tamil Nadu Police directives, every adult guest checking in must present an original valid Government-issued photo identification proof with address:
                <div className="mt-1 font-semibold text-slate-800">
                  Accepted: Indian Passport, Aadhaar Card, Voter Identity Card, or Driving Licence.<br />
                  <span className="text-rose-600 font-bold">Important:</span> PAN Cards are not accepted as valid proof of address. Foreign nationals must provide an original Passport and valid Indian Visa / e-Visa along with Form C registration.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold metal-emerald border-b border-slate-100 pb-2">
              6. Guest Responsibilities & Hotel Regulations
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Non-Smoking Policy:</strong> All hotel rooms and indoor enclosed corridors are designated non-smoking zones to protect guest safety and hygiene. Designated outdoor smoking areas are available.</li>
              <li><strong>Care of Property:</strong> Guests are expected to maintain our room furnishings and electrical fittings with reasonable care. Any deliberate damage or missing inventory will be billed to the guest at replacement cost.</li>
              <li><strong>Quiet Hours:</strong> As a pilgrim-friendly hotel in sacred Kumbakonam, quiet hours are observed between 10:00 PM and 6:00 AM for the tranquility and peaceful rest of all guests.</li>
              <li><strong>Prohibited Items:</strong> Hazardous substances, illegal drugs, firearms, and flammable materials are strictly prohibited within the hotel premises.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold metal-emerald border-b border-slate-100 pb-2">
              7. Additional Charges & Taxes
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Statutory Goods & Services Tax (GST):</strong> GST is levied in accordance with Government of India tax slabs applicable to hotel accommodation.</li>
              <li><strong>Extra Bed / Occupant:</strong> An extra rollaway bed or mattress for an accompanying guest is provided upon request at ₹500 per night.</li>
              <li><strong>Late Check-Out:</strong> Late check-out beyond the agreed checkout hour is subject to room availability and may incur fractional day charges.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold metal-emerald border-b border-slate-100 pb-2">
              8. Booking Modifications & Rescheduling
            </h2>
            <p>
              Guests seeking to modify stay dates must notify our front desk at least 48 hours prior to the original check-in date by calling +91 73958 09991 or emailing subraresidencykum@gmail.com. Rescheduling is subject to room availability for the requested new dates and any applicable seasonal tariff differential.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold metal-emerald border-b border-slate-100 pb-2">
              9. Cancellation & Refund Rules
            </h2>
            <p>
              All room cancellations and refunds are strictly governed by our dedicated <a href="/cancellation-refund" className="text-catalogue-gold font-bold underline">Cancellation & Refund Policy</a>:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>Free cancellation: 48 hours or more prior to check-in.</li>
              <li>Partial 50% charge: Between 48 hours and 24 hours prior to check-in.</li>
              <li>Non-refundable: Within 24 hours of check-in, or No-Shows.</li>
              <li>Refunds are initiated via Razorpay to the original payment source within 5 to 7 business days.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold metal-emerald border-b border-slate-100 pb-2">
              10. Limitation of Liability & Force Majeure
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Subra Residency shall not be held liable for any loss, theft, or damage to personal valuables, jewelry, or cash left unattended inside guest rooms or common areas. In-room safes and front-desk lockers should be utilized.</li>
              <li>Neither party shall be liable for non-performance or delays caused by acts of God, flood, cyclone, strikes, regional bandhs, government travel advisories, or unforeseen events beyond reasonable human control (Force Majeure).</li>
              <li><strong>Jurisdiction:</strong> Any dispute arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts of Kumbakonam / Thanjavur District, Tamil Nadu, India.</li>
            </ul>
          </section>

          {/* Section 11 */}
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="font-playfair text-xl font-bold metal-emerald">
              11. Official Contact Information
            </h2>
            <p className="text-xs text-slate-600">
              For any legal or reservation clarifications regarding these Terms & Conditions, please contact us:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1 font-sans">
              <p><strong>Subra Residency</strong></p>
              <p>45, L.B.S Road, Near Railway Station, Kumbakonam - 612001, Tamil Nadu, India</p>
              <p>Phone: +91 73958 09991 / +91 73958 09992</p>
              <p>Email: <a href="mailto:subraresidencykum@gmail.com" className="text-catalogue-gold font-bold">subraresidencykum@gmail.com</a></p>
            </div>
          </section>

        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};

