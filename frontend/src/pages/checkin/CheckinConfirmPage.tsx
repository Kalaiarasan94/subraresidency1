import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Loader2, Calendar, Hotel, AlertTriangle, XCircle } from 'lucide-react';
import { fetchBookingById, notifyQrScan } from '../../lib/api';

const ALREADY_PROCESSED_STATUSES = ['checked-in', 'checked-out', 'completed'];

export default function CheckinConfirmPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [notFound, setNotFound] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    fetchBookingById(bookingId).then((res) => {
      setLoading(false);
      if (res && res.status === 'success' && res.booking) {
        setBooking(res.booking);
      } else {
        setNotFound(true);
      }
    }).catch(() => {
      setLoading(false);
      setNotFound(true);
    });
  }, [bookingId]);

  const handleConfirm = async () => {
    if (!bookingId) return;
    setConfirming(true);
    const res = await notifyQrScan(bookingId);
    setConfirming(false);
    if (res && res.status === 'success') {
      setConfirmed(true);
    } else {
      alert(res?.message || 'Could not notify reception. Please try again or approach the front desk directly.');
    }
  };

  const alreadyProcessed = booking && ALREADY_PROCESSED_STATUSES.includes(String(booking.status).toLowerCase());
  const roomName = booking?.rooms?.[0]?.room_name || booking?.room_category || 'Reserved Room';

  return (
    <div className="min-h-screen bg-brand-cream/40 flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-sm rounded-[2rem] bg-white shadow-2xl border border-catalogue-gold/20 overflow-hidden">
        <div className="bg-catalogue-green px-6 py-5 text-center">
          <h1 className="font-playfair text-lg font-black text-white tracking-widest uppercase">Subra Residency</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-catalogue-gold mt-1">Guest Self Check-in</p>
        </div>

        <div className="p-8 text-center space-y-6">
          {loading && (
            <div className="py-10 flex flex-col items-center gap-3">
              <Loader2 size={28} className="animate-spin text-catalogue-green" />
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Loading your reservation…</p>
            </div>
          )}

          {!loading && notFound && (
            <div className="py-6 flex flex-col items-center gap-3">
              <XCircle size={40} className="text-rose-500" />
              <p className="text-sm font-black text-slate-800 uppercase">Reservation Not Found</p>
              <p className="text-xs text-slate-400 font-semibold">Please check the QR code or contact the front desk.</p>
            </div>
          )}

          {!loading && !notFound && booking && !confirmed && !alreadyProcessed && (
            <>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-catalogue-gold">Booking Identifier</p>
                <p className="font-playfair text-xl font-black text-catalogue-green">{booking.booking_id}</p>
              </div>

              <div className="space-y-2 text-left bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-sm font-black text-slate-800">{booking.guest_name}</p>
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-2"><Hotel size={12} /> {roomName}</p>
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                  <Calendar size={12} /> {booking.check_in_date} &rarr; {booking.check_out_date}
                </p>
              </div>

              <button
                onClick={handleConfirm}
                disabled={confirming}
                className="w-full bg-catalogue-green hover:bg-catalogue-gold text-white font-black uppercase tracking-[0.2em] py-4 text-xs rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {confirming ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {confirming ? 'Notifying Reception…' : 'Confirm Check-in'}
              </button>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Tapping confirm alerts our front desk that you have arrived. Please proceed there to complete your check-in.
              </p>
            </>
          )}

          {!loading && !notFound && confirmed && (
            <div className="py-6 flex flex-col items-center gap-3">
              <CheckCircle2 size={48} className="text-emerald-600" />
              <p className="text-sm font-black text-slate-800 uppercase">Reception Notified</p>
              <p className="text-xs text-slate-400 font-semibold">Please proceed to the front desk to complete your check-in.</p>
            </div>
          )}

          {!loading && !notFound && alreadyProcessed && !confirmed && (
            <div className="py-6 flex flex-col items-center gap-3">
              <AlertTriangle size={40} className="text-amber-500" />
              <p className="text-sm font-black text-slate-800 uppercase">Already Checked In</p>
              <p className="text-xs text-slate-400 font-semibold">This booking has already been processed at the front desk.</p>
            </div>
          )}

          <Link to="/" className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-catalogue-green transition-colors pt-2">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
