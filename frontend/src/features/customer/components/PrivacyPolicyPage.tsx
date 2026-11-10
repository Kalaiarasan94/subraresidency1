import { useEffect } from 'react';
import { Shield, Lock, CreditCard, Eye, Server, UserCheck, Mail, MapPin, Phone } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { OrnateDivider } from './OrnateDivider';
import { SectionWrapper, DecorativeLayout } from './Layout';

export const PrivacyPolicyPage = () => {
  useEffect(() => {
    document.title = "Privacy Policy | Subra Residency Kumbakonam";
    window.scrollTo(0, 0);
  }, []);

  return (
    <DecorativeLayout>
      <SectionWrapper className="pt-20">
        {/* Header */}
        <div className="text-center mb-16 space-y-4 max-w-4xl mx-auto">
          <Badge className="bg-catalogue-gold/15 text-catalogue-green border border-catalogue-gold/30 font-bold uppercase tracking-[0.3em] px-4 py-1 text-[10px]">
            Data Protection & Privacy
          </Badge>
          <h1 className="font-playfair text-4xl md:text-6xl text-catalogue-green font-black uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="font-playfair text-lg md:text-xl text-catalogue-gold italic font-bold">
            How Subra Residency protects and respects your personal information
          </p>
          <div className="flex justify-center pt-2">
            <OrnateDivider className="w-32" />
          </div>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto">
            Last Updated: January 2026 | Effective Date: January 1, 2026 | Compliant with the Information Technology Act, 2000 & Digital Personal Data Protection Act, 2023.
          </p>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-catalogue-gold/30 shadow-xl p-8 md:p-14 space-y-10 text-slate-700 text-xs md:text-sm leading-relaxed">
          
          {/* Commitment Highlight */}
          <div className="p-5 bg-card-ivory/80 rounded-2xl border border-catalogue-gold/20 space-y-2">
            <div className="flex items-center gap-2 text-catalogue-green font-bold text-sm">
              <Shield size={18} className="text-catalogue-gold" />
              <span>Our Privacy Pledge to Our Guests</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              At <strong>Subra Residency</strong>, we deeply respect your personal privacy. We collect only the data necessary to process your hotel room reservation, deliver a pleasant hospitality experience in Kumbakonam, and comply with statutory law enforcement directives. We never sell, rent, or trade your personal information to third-party marketing companies.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              1. Information We Collect
            </h2>
            <p>
              When you browse our website, initiate a room reservation, or complete physical check-in at Subra Residency, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Personal Identifiers:</strong> Guest full name, email address, mobile phone number, residential address, and country of origin.</li>
              <li><strong>Reservation Details:</strong> Chosen room category, check-in date, check-out date, number of adult/child occupants, arrival time notes, and special requests.</li>
              <li><strong>Government Identification:</strong> Photo identification details (Passport number, Aadhaar number, Voter ID, or Driving Licence) collected strictly at reception as mandated by local tourism and police regulations.</li>
              <li><strong>Transaction Records:</strong> Razorpay order ID, payment amount, payment date, payment status, and transaction reference numbers.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              2. Purpose of Collecting Guest Data
            </h2>
            <p>
              We collect and utilize your personal information for lawful hospitality purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>To confirm, manage, and process your online hotel room booking and generate digital reservation vouchers.</li>
              <li>To communicate with you regarding booking confirmations, check-in instructions, tax invoices, and customer support.</li>
              <li>To fulfill statutory guest registration requirements (Form C for foreign visitors and local police registers for domestic travelers).</li>
              <li>To ensure safety and security within the hotel premises during your stay.</li>
              <li>To process cancellations, adjustments, and refunds in accordance with our policies.</li>
            </ul>
          </section>

          {/* Section 3 - Razorpay Payment Gateway Transparency */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              3. Payment Processing via Razorpay (Zero Card Storage Policy)
            </h2>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <CreditCard size={18} className="text-catalogue-gold" />
                <span>PCI-DSS Level 1 Compliant Payment Processing</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                All digital payments on our website are processed directly through <strong>Razorpay Software Private Limited (&quot;Razorpay&quot;)</strong>, India’s leading certified payment gateway:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li><strong>No Card Storage:</strong> Subra Residency does <strong>NOT</strong> collect, view, process, or store your credit card numbers, debit card numbers, CVV security codes, card expiry dates, or netbanking passwords on any of our internal servers or databases.</li>
                <li><strong>Direct Tokenization:</strong> Sensitive financial details entered during checkout are submitted directly to Razorpay through 256-bit encrypted SSL/TLS channels adhering to the highest Payment Card Industry Data Security Standards (PCI-DSS Level 1).</li>
                <li><strong>Payment Tokens:</strong> We only receive confirmation status, transaction identifiers, and order amount details from Razorpay to confirm your reservation and reconcile accounts.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              4. Data Security & Storage Measures
            </h2>
            <p>
              We maintain robust administrative, technical, and physical safeguards to prevent unauthorized access, alteration, or disclosure of your information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>All web traffic is transmitted via secure HTTPS protocol with modern TLS cryptographic encryption.</li>
              <li>Our production database systems utilize firewall protection, encrypted credentials, and strict access controls limited to authorized hotel management staff.</li>
              <li>Physical guest registers maintained at reception are secured in authorized hotel counters.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              5. Data Retention Period
            </h2>
            <p>
              We retain customer personal data only for as long as necessary to fulfill the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>Guest registration logs and financial tax invoices are retained for the statutory period mandated by Indian tax and local hotel regulatory authorities (typically 7 to 8 financial years).</li>
              <li>Contact enquiry submissions are retained for up to 12 months for customer service follow-ups and are subsequently purged.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              6. Third-Party Service Providers
            </h2>
            <p>
              We share your data strictly with trusted operational partners under confidentiality obligations:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Payment Gateway:</strong> Razorpay Software Private Limited for authorizing UPI, card, and netbanking transactions.</li>
              <li><strong>Transactional Email / SMS:</strong> Reliable email/SMS infrastructure partners solely for dispatching your booking confirmations and OTPs.</li>
              <li><strong>Government & Law Enforcement:</strong> Strictly when compelled by an official court order, police notice, or statutory duty under Indian law.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              7. Cookies & Website Analytics
            </h2>
            <p>
              Our website uses basic functional session cookies to remember your selected dates, room choices, and ensure a seamless browsing experience. We do not use intrusive tracking cookies, third-party advertising cookies, or cross-site tracking tools. You may disable cookies in your browser settings at any time without losing the ability to view room tariffs.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green border-b border-slate-100 pb-2">
              8. Customer Privacy Rights
            </h2>
            <p>
              Under Indian data protection frameworks, you have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Request a copy of the personal information we hold about you.</li>
              <li>Request rectification of inaccurate contact details.</li>
              <li>Request erasure of your data, subject to statutory retention obligations under Indian hotel and taxation laws.</li>
              <li>Withdraw your consent for non-essential promotional communications.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 pt-4 border-t border-slate-200">
            <h2 className="font-playfair text-xl font-bold text-catalogue-green">
              9. Privacy Officer & Grievance Redressal
            </h2>
            <p className="text-xs text-slate-600">
              For any questions, requests, or grievances concerning this Privacy Policy or your personal data handling, please contact our designated Grievance Officer:
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1 font-sans">
              <p><strong>Grievance Officer:</strong> Management, Subra Residency</p>
              <p><strong>Hotel Address:</strong> 45, L.B.S Road, Near Railway Station, Kumbakonam - 612001, Tamil Nadu, India</p>
              <p><strong>Phone:</strong> +91 73958 09991 / +91 73958 09992</p>
              <p><strong>Email:</strong> <a href="mailto:subraresidencykum@gmail.com" className="text-catalogue-gold font-bold">subraresidencykum@gmail.com</a></p>
            </div>
          </section>

        </div>
      </SectionWrapper>
    </DecorativeLayout>
  );
};

