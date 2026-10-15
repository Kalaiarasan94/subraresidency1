import React, { useEffect, useState } from 'react';
import { 
  X, Printer, Download, CheckCircle2, Clock, Building, 
  MapPin, Phone, Mail, Globe, Shield, FileText, Loader2
} from 'lucide-react';
import { API_BASE_URL } from '../../lib/api';
import logoImg from '../../assets/logo.png';

interface TaxInvoiceModalProps {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TaxInvoiceModal: React.FC<TaxInvoiceModalProps> = ({ bookingId, isOpen, onClose }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !bookingId) return;

    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/admin/bookings/view?booking_id=${encodeURIComponent(bookingId)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success' && data.booking) {
          setBooking(data.booking);
        } else {
          setError(data.message || 'Unable to load invoice record.');
        }
      })
      .catch(() => {
        setError('Network error connecting to booking service.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, bookingId]);

  if (!isOpen) return null;

  const handlePrint = () => {
    // Open the official standalone printable invoice or window.print
    const backendUrl = API_BASE_URL.replace('/api/index.php', '');
    window.open(`${backendUrl}/admin_view_booking.php?booking_id=${bookingId}&print=1`, '_blank');
  };

  const numberToWordsINR = (amount: number): string => {
    const num = Math.round(Number(amount));
    if (isNaN(num) || num === 0) return 'Zero Rupees Only';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const convertTwoDigits = (n: number) => {
      if (n < 20) return ones[n];
      const t = Math.floor(n / 10);
      const o = n % 10;
      return tens[t] + (o ? ' ' + ones[o] : '');
    };

    const convertThreeDigits = (n: number) => {
      const h = Math.floor(n / 100);
      const r = n % 100;
      let res = '';
      if (h) res += ones[h] + ' Hundred';
      if (r) res += (res ? ' ' : '') + convertTwoDigits(r);
      return res;
    };

    let n = num;
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const remainder = n;

    const parts = [];
    if (crore) parts.push(convertThreeDigits(crore) + ' Crore');
    if (lakh) parts.push(convertThreeDigits(lakh) + ' Lakh');
    if (thousand) parts.push(convertThreeDigits(thousand) + ' Thousand');
    if (remainder) parts.push(convertThreeDigits(remainder));

    return 'Indian Rupees ' + parts.join(' ') + ' Only';
  };

  const total = parseFloat(booking?.total_amount || 0);
  const cin = booking ? new Date(booking.check_in_date) : new Date();
  const cout = booking ? new Date(booking.check_out_date) : new Date();
  const diffDays = Math.max(1, Math.ceil(Math.abs(cout.getTime() - cin.getTime()) / (1000 * 60 * 60 * 24)));

  const extraCharge = parseFloat(booking?.extra_guest_charge || 0);
  const taxableTotal = Math.round((total / 1.12) * 100) / 100;
  const totalGst = Math.round((total - taxableTotal) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst - cgst) * 100) / 100;

  const extraTaxable = extraCharge > 0 ? Math.round((extraCharge / 1.12) * 100) / 100 : 0;
  const roomTaxable = Math.max(0, taxableTotal - extraTaxable);
  const roomRatePerNight = Math.round((roomTaxable / diffDays) * 100) / 100;

  const isPaid = (booking?.payment_status && booking.payment_status.toLowerCase() === 'success');
  const roomName = (booking?.rooms && booking.rooms[0]?.room_name) || 'Executive Room';
  const roomNumbers = (booking?.rooms && booking.rooms.length > 0)
    ? booking.rooms.map((r: any) => r.room_number).filter(Boolean).join(', ')
    : 'Assigned on arrival';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        
        {/* Modal Action Header */}
        <div className="px-6 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
              Official GST Tax Invoice
            </span>
            <span className="text-xs font-bold text-gray-700">Folio: {bookingId}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#0a3622] hover:bg-[#135235] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer size={13} />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 size={32} className="animate-spin text-emerald-600" />
              <p className="text-sm font-medium">Loading Tax Invoice Folio...</p>
            </div>
          ) : error || !booking ? (
            <div className="py-16 text-center text-rose-600 space-y-2">
              <p className="font-semibold text-sm">{error || 'Booking not found.'}</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6 text-gray-800 text-xs">
              
              {/* Hotel & Invoice Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b-2 border-amber-100">
                <div className="flex items-start gap-4">
                  <img 
                    src={logoImg} 
                    alt="Subra Residency" 
                    className="w-16 h-16 object-contain rounded-xl border border-gray-200 p-1.5 shadow-xs bg-white shrink-0" 
                  />
                  <div>
                    <h1 className="font-serif text-2xl font-black text-[#0a3622] tracking-wide">
                      SUBRA RESIDENCY
                    </h1>
                    <p className="text-[10px] font-extrabold uppercase text-[#b38728] tracking-widest mt-0.5">
                      RAGUPATHI ANANDHALAKSHMI &bull; PROPRIETORSHIP
                    </p>
                    <p className="text-[11px] text-gray-600 leading-relaxed mt-1 max-w-sm">
                      NO.45-1/1187B2, Lal Bahadur Sastry Road, Thanjavur, Tamil Nadu - 612001<br />
                      Phone: +91 73958 09991 | 73958 09992 &bull; Email: subraresidency@gmail.com
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded text-[11px] font-bold text-gray-800">
                      <span>GSTIN:</span>
                      <span className="font-mono text-[#0a3622] font-black">33AQQPA7394F2ZN</span>
                      <span className="text-gray-400 mx-1">&bull;</span>
                      <span className="text-gray-600">State: Tamil Nadu (33)</span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <div className="text-lg font-black text-[#0a3622] tracking-wider uppercase">
                    TAX INVOICE
                  </div>
                  <div className="text-[9.5px] font-bold uppercase text-gray-400 tracking-widest">
                    Original for Recipient
                  </div>
                  <div className="mt-2.5 p-2 bg-gray-50 border border-gray-200 rounded-lg sm:text-right inline-block">
                    <div className="text-[9px] font-bold uppercase text-gray-400">Invoice No.</div>
                    <div className="font-mono text-xs font-bold text-gray-900">SR/2026/INV-{booking.id || booking.booking_id}</div>
                    <div className="text-[10px] text-gray-500 font-medium mt-0.5">
                      Date: {new Date(booking.created_at || Date.now()).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-Column Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Guest Details */}
                <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-[#b38728] tracking-wider pb-1.5 border-b border-amber-100 flex justify-between">
                    <span>Billed To (Guest Details)</span>
                    <span className="text-gray-400 font-normal">POS: TN (33)</span>
                  </div>
                  <div className="font-bold text-sm text-[#0a3622]">{booking.guest_name || 'Walk-in Guest'}</div>
                  <div className="grid grid-cols-1 gap-1 text-[11px] text-gray-600">
                    <div><span className="text-gray-400">Mobile:</span> <span className="font-semibold text-gray-800">{booking.guest_phone || '—'}</span></div>
                    <div><span className="text-gray-400">Email:</span> <span className="font-semibold text-gray-800">{booking.guest_email || '—'}</span></div>
                    <div><span className="text-gray-400">Address:</span> <span className="font-semibold text-gray-800">{booking.address || 'Thanjavur, Tamil Nadu'}</span></div>
                    <div><span className="text-gray-400">Country:</span> <span className="font-semibold text-gray-800">{booking.country || 'India'}</span></div>
                  </div>
                </div>

                {/* Stay Details */}
                <div className="p-4 bg-gray-50/70 border border-gray-200 rounded-xl space-y-2">
                  <div className="text-[10px] font-extrabold uppercase text-[#b38728] tracking-wider pb-1.5 border-b border-amber-100 flex justify-between">
                    <span>Reservation Details</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-sky-100 text-sky-800">
                      {booking.booking_source || 'Online'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                    <div>
                      <span className="text-gray-400 block text-[9.5px]">Booking ID</span>
                      <span className="font-mono font-bold text-[#0a3622]">{booking.booking_id}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9.5px]">Room Assigned</span>
                      <span className="font-bold text-gray-900">{roomNumbers}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9.5px]">Check-In</span>
                      <span className="font-semibold text-gray-800">{booking.check_in_date}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9.5px]">Check-Out</span>
                      <span className="font-semibold text-gray-800">{booking.check_out_date}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9.5px]">Room Type</span>
                      <span className="font-semibold text-gray-800 truncate">{roomName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[9.5px]">Duration</span>
                      <span className="font-semibold text-gray-800">{diffDays} Night(s)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Services Table */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100/80 text-[10px] font-bold uppercase text-gray-600 tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">#</th>
                      <th className="py-2.5 px-3">Description of Supply</th>
                      <th className="py-2.5 px-3 text-center">SAC Code</th>
                      <th className="py-2.5 px-3 text-center">Qty / Nights</th>
                      <th className="py-2.5 px-3 text-right">Taxable Rate (₹)</th>
                      <th className="py-2.5 px-3 text-right">Taxable Value (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    <tr>
                      <td className="py-3 px-3 text-center text-gray-400">1</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#0a3622]">{roomName} Room Accommodations</div>
                        <div className="text-[10px] text-gray-500">Room(s): {roomNumbers} &bull; {diffDays} Night(s) Stay</div>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-gray-600 text-[11px]">996311</td>
                      <td className="py-3 px-3 text-center font-semibold">{diffDays}</td>
                      <td className="py-3 px-3 text-right font-semibold">₹{roomRatePerNight.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right font-bold text-gray-900">₹{roomTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                    {extraCharge > 0 && (
                      <tr>
                        <td className="py-3 px-3 text-center text-gray-400">2</td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-[#0a3622]">Extra Guest / Additional Occupancy</div>
                          <div className="text-[10px] text-gray-500">Adults: {booking.extra_adults || 0}, Children: {booking.extra_children || 0}</div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-gray-600 text-[11px]">996311</td>
                        <td className="py-3 px-3 text-center font-semibold">1</td>
                        <td className="py-3 px-3 text-right font-semibold">₹{extraTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-3 text-right font-bold text-gray-900">₹{extraTaxable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Total Calculation & Stamp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-2">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                    <span className="text-[9.5px] font-extrabold uppercase text-gray-400 block">Total Amount in Words</span>
                    <span className="font-semibold text-xs text-[#0a3622] italic">{numberToWordsINR(total)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black tracking-widest uppercase border ${
                      isPaid 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}>
                      {isPaid ? '✓ PAID & SETTLED' : '⏳ PAYMENT PENDING'}
                    </span>
                    {booking.transaction_id && (
                      <span className="text-[10.5px] font-mono text-gray-500">
                        Ref: {booking.transaction_id}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tax Breakdown */}
                <div className="p-3.5 bg-gray-50/80 border border-gray-200 rounded-xl space-y-1.5">
                  <div className="flex justify-between text-[11px] text-gray-600">
                    <span>Taxable Amount:</span>
                    <span className="font-bold text-gray-900">₹{taxableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[10.5px] text-gray-500 pl-2">
                    <span>Central GST (CGST @ 6%):</span>
                    <span>₹{cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[10.5px] text-gray-500 pl-2">
                    <span>State GST (SGST @ 6%):</span>
                    <span>₹{sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-700 font-semibold pt-1 border-t border-dashed border-gray-200">
                    <span>Total GST (12%):</span>
                    <span>₹{totalGst.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#0a3622] pt-2 border-t-2 border-amber-200">
                    <span>Grand Total:</span>
                    <span className="font-mono text-base">₹{Math.round(total).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Terms & Signatory */}
              <div className="pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="text-[10px] text-gray-500 space-y-1">
                  <span className="font-bold text-gray-700 uppercase tracking-wide block">Terms & Compliance:</span>
                  <p>1. GST applied under SAC 996311 as per Govt. of India Hospitality Rates.</p>
                  <p>2. Check-out time is strictly 11:00 AM. Late departure subject to tariff.</p>
                  <p>3. Subject to Thanjavur Jurisdiction.</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-gray-800">For SUBRA RESIDENCY</div>
                  <div className="font-serif italic text-amber-800 text-sm py-1">Ragupathi Anandhalakshmi</div>
                  <div className="text-[9px] uppercase tracking-wider text-gray-400 font-bold border-t border-gray-200 pt-1 inline-block min-w-[140px]">
                    Authorized Signatory
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
